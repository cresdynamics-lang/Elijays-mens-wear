import { BRAND_NAME } from '../lib/brand';
import { useState, useEffect } from 'react';
import { ChevronLeft, ShoppingBag, MapPin, User, CreditCard, Smartphone, ShieldCheck, Truck, Edit3 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { orderAPI, paymentAPI } from '../services/api';
import { toCartVariantId } from '../utils/ids';
import { buildOrderTrackUrl, buildWhatsAppOrderUrl } from '../lib/storeContact';
import { DELIVERY_ZONES, deliveryFeeFor } from '../lib/deliveryZones';

const isCustomerSession = () => {
  const { isAuthenticated, token, isSeller, user } = useAuthStore.getState();
  return isAuthenticated && token && !isSeller && user?.accountType !== 'pos';
};

const FIELD =
  'w-full bg-white border border-utility-gray/60 px-4 py-3 text-sm text-elijays-ink placeholder:text-elijays-ink/35 outline-none focus:border-elijays-gold/60 transition-all duration-300 rounded-md';

const LABEL = 'text-[10px] font-semibold uppercase tracking-[0.16em] text-elijays-ink/60';

const Checkout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const getCheckoutTotals = useCartStore((state) => state.getCheckoutTotals);
  const prepareForCheckout = useCartStore((state) => state.prepareForCheckout);
  const [cartReady, setCartReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('details');
  const [mpesaConfirmed, setMpesaConfirmed] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');
  const [paymentChoice, setPaymentChoice] = useState('stk');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await prepareForCheckout();
      if (!cancelled) setCartReady(true);
    })();
    return () => { cancelled = true; };
  }, [prepareForCheckout, isAuthenticated]);

  useEffect(() => {
    if (!user) return;
    setFullName((current) => current || user.name || '');
    setEmail((current) => current || user.email || '');
    setPhone((current) => current || user.phone || '');
    const saved = user.default_shipping_address || {};
    setAddress((current) => current || saved.line1 || '');
    setCity((current) => current || saved.city || '');
    setDeliveryZone((current) => current || saved.delivery_zone || '');
  }, [user]);

  if (!cartReady) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center text-elijays-ink/40 text-[10px] uppercase tracking-widest">
        Preparing checkout…
      </div>
    );
  }

  if (items.length === 0) return <Navigate to="/cart" />;

  const customerLoggedIn = isCustomerSession();
  const needsDeliveryLocation = fulfillmentMethod === 'delivery';
  const deliveryFee = needsDeliveryLocation ? deliveryFeeFor(deliveryZone) : 0;
  const totals = getCheckoutTotals(deliveryFee);
  const effectiveEmail = (email || user?.email || '').trim();
  const effectivePhone = (phone || user?.phone || '').trim();
  const deliveryLabel = deliveryFee > 0 ? `KSh ${deliveryFee.toLocaleString()}` : 'Free';

  const contactOk = fullName.trim().length >= 2 && effectivePhone.trim().length >= 9;
  const detailsValid =
    contactOk &&
    (fulfillmentMethod === 'pickup' ||
      (fulfillmentMethod === 'delivery' && deliveryZone && address.trim().length >= 5 && city.trim().length >= 2));

  const paymentValid = paymentChoice === 'card' || (paymentChoice === 'stk' && mpesaConfirmed);
  const canPlaceOrder = detailsValid && paymentValid && !submitting;

  const lineItems = (list) =>
    list
      .filter((it) => String(it.productId).length >= 32)
      .map((it) => ({
        product_id: it.productId,
        variant_id: toCartVariantId(it.variantId),
        quantity: it.quantity,
        size_label: it.sizeLabel || null,
      }));

  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const handleProceedToPay = (e) => {
    e.preventDefault();
    setError('');
    if (!detailsValid) {
      setError('Add your name, phone and choose ship or pickup with the required delivery details.');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!detailsValid) {
      setStep('details');
      setError('Complete your details first.');
      return;
    }
    if (!paymentValid) {
      if (paymentChoice === 'stk' && !mpesaConfirmed) {
        setError('Confirm you will pay via M-Pesa STK push.');
      }
      return;
    }

    setSubmitting(true);
    try {
      const syncedItems = customerLoggedIn ? await prepareForCheckout() : items;
      if (!syncedItems.length) {
        throw new Error('Your bag is empty. Add items before checking out.');
      }

      const shipping_address = {
        first_name: firstName,
        last_name: lastName,
        email: effectiveEmail,
        phone: effectivePhone,
        fulfillment_method: fulfillmentMethod,
        delivery_zone: needsDeliveryLocation ? deliveryZone : 'pickup',
        line1: needsDeliveryLocation ? address.trim() : `Pickup at ${BRAND_NAME} shop`,
        line2: needsDeliveryLocation ? apartment.trim() : '',
        city: needsDeliveryLocation ? (city.trim() || 'Nairobi') : 'Pickup',
        country: country || 'Kenya',
        order_notes: orderNotes.trim() || '',
        payment_choice: paymentChoice,
        ...(mpesaCode.trim() ? { mpesa_code: mpesaCode.trim().toUpperCase() } : {}),
      };

      const payload = {
        shipping_address,
        billing_address: shipping_address,
        payment_method: paymentChoice === 'stk' ? 'mpesa_stk' : 'coop_card',
        items: lineItems(syncedItems),
      };

      const res = customerLoggedIn
        ? await orderAPI.create(payload)
        : await orderAPI.createGuest(payload);

      if (!res.data?.success) throw new Error(res.data?.message || 'Order failed');
      const order = res.data.data;
      sessionStorage.setItem('checkout-email', shipping_address.email);
      useCartStore.getState().clearLocalItems();

      if (paymentChoice === 'stk') {
        try {
          await paymentAPI.stkPush({
            order_id: order.id,
            amount: order.total_amount ?? totals.total,
            phoneNumber: effectivePhone,
            email: effectiveEmail,
          });
        } catch (stkErr) {
          console.warn('STK push not yet live on server:', stkErr?.response?.data?.message || stkErr.message);
        }
      }

      const trackUrl = buildOrderTrackUrl(order.id, shipping_address.email);
      const whatsappUrl = buildWhatsAppOrderUrl({
        order: { ...order, shipping_address, total_amount: order.total_amount ?? totals.total },
        items: syncedItems.map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          size_label: it.sizeLabel || null,
        })),
        trackUrl,
      });

      if (paymentChoice === 'card') {
        // Co-op Bank card checkout — callback lands on /api/mpesa/callback (whitelisted IP)
        window.location.href = `/payment/${order.id}?email=${encodeURIComponent(shipping_address.email)}`;
      } else {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not place order');
      setSubmitting(false);
    }
  };

  const zoneOption = (z) => {
    const active = deliveryZone === z.id;
    return (
      <button
        key={z.id}
        type="button"
        onClick={() => setDeliveryZone(z.id)}
        className={`w-full text-left border px-4 py-3.5 rounded-md transition-all duration-300 ${
          active
            ? 'border-elijays-gold bg-elijays-gold/5 shadow-sm shadow-elijays-gold/10'
            : 'border-utility-gray bg-white hover:border-elijays-gold/40'
        }`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm text-elijays-ink font-medium">{z.zone}</span>
          <span className={`text-sm font-semibold ${active ? 'text-elijays-gold' : 'text-elijays-ink'}`}>
            KSh {z.fee.toLocaleString()}
          </span>
        </span>
        <span className="block text-[10px] text-elijays-ink/45 mt-1 leading-relaxed">{z.areas}</span>
      </button>
    );
  };

  const paymentOption = (value, label, desc, Icon) => {
    const active = paymentChoice === value;
    return (
      <button
        type="button"
        onClick={() => setPaymentChoice(value)}
        className={`w-full text-left border px-4 py-4 rounded-md transition-all duration-300 flex items-start gap-3.5 ${
          active
            ? 'border-elijays-gold bg-elijays-gold/5 shadow-sm shadow-elijays-gold/10'
            : 'border-utility-gray bg-white hover:border-elijays-gold/40'
        }`}
      >
        <Icon size={20} className={active ? 'text-elijays-gold shrink-0 mt-0.5' : 'text-elijays-ink/40 shrink-0 mt-0.5'} />
        <span className="min-w-0">
          <span className={`block text-sm font-semibold ${active ? 'text-elijays-gold' : 'text-elijays-ink'}`}>{label}</span>
          <span className="block text-[11px] text-elijays-ink/45 mt-0.5 leading-relaxed">{desc}</span>
        </span>
      </button>
    );
  };

  const sectionTitle = (icon, title) => (
    <div className="flex items-center space-x-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-elijays-gold/10 text-elijays-gold">
        {icon}
      </span>
      <h2 className="text-base sm:text-lg font-display text-elijays-ink tracking-tight">{title}</h2>
    </div>
  );

  return (
    <Layout>
      <main className="bg-white pb-20 sm:pb-28">
        <div className="container mx-auto px-5 md:px-8 max-w-5xl pt-6 md:pt-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Link to="/cart" className="text-elijays-gold hover:text-elijays-gold-dim transition-colors shrink-0">
                <ChevronLeft size={20} />
              </Link>
              <span className="text-[12px] text-elijays-ink/50">Back to Cart</span>
            </div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-elijays-gold">
              Your Cart ({items.reduce((n, i) => n + i.quantity, 0)})
            </span>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm py-3.5 px-5 text-center rounded-md">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            <form onSubmit={step === 'details' ? handleProceedToPay : handlePlaceOrder} className="lg:col-span-3 space-y-8">
              <div className="flex items-center space-x-4 pb-2">
                {['details', 'payment'].map((s, i) => (
                  <div key={s} className="flex items-center space-x-2.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        step === s || (step === 'payment' && s === 'payment')
                          ? 'bg-elijays-gold text-white'
                          : 'bg-utility-gray/40 text-elijays-ink/40'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        step === s ? 'text-elijays-ink' : 'text-elijays-ink/40'
                      }`}
                    >
                      {s === 'details' ? 'Details' : 'Payment'}
                    </span>
                  </div>
                ))}
              </div>

              {step === 'details' ? (
                <>
                  <section className="space-y-6">
                    {sectionTitle('User', 'Contact Information')}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className={LABEL}>Full Name <span className="text-red-500">*</span></label>
                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={FIELD} placeholder="John Doe" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={LABEL}>Phone Number <span className="text-red-500">*</span></label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={FIELD} placeholder="0700 000 000" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={LABEL}>Email <span className="text-elijays-ink/40 font-normal normal-case">(optional)</span></label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} placeholder="you@example.com" />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    {sectionTitle('Truck', 'Delivery')}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        ['delivery', 'Ship'],
                        ['pickup', 'Pickup'],
                      ].map(([value, label]) => {
                        const active = fulfillmentMethod === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFulfillmentMethod(value)}
                            className={`border px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 rounded-md ${
                              active
                                ? 'bg-elijays-gold text-white border-elijays-gold'
                                : 'border-utility-gray text-elijays-ink/60 hover:border-elijays-gold/50 hover:text-elijays-ink'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {needsDeliveryLocation && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-utility-gray/60 pt-6">
                        <div className="space-y-1.5">
                          <label className={LABEL}>Country/Region <span className="text-red-500">*</span></label>
                          <input value={country} onChange={(e) => setCountry(e.target.value)} className={FIELD} placeholder="Kenya" />
                        </div>
                        <div className="space-y-1.5">
                          <label className={LABEL}>Address <span className="text-red-500">*</span></label>
                          <input value={address} onChange={(e) => setAddress(e.target.value)} className={FIELD} placeholder="Street / building" />
                        </div>
                        <div className="space-y-1.5">
                          <label className={LABEL}>Apartment, suite, etc. <span className="text-elijays-ink/40 font-normal normal-case">(optional)</span></label>
                          <input value={apartment} onChange={(e) => setApartment(e.target.value)} className={FIELD} placeholder="Apt 4B" />
                        </div>
                        <div className="space-y-1.5">
                          <label className={LABEL}>City / Area <span className="text-red-500">*</span></label>
                          <input value={city} onChange={(e) => setCity(e.target.value)} className={FIELD} placeholder="e.g. Kilimani" />
                        </div>
                      </div>
                    )}
                  </section>

                  {needsDeliveryLocation && (
                    <section className="space-y-4">
                      {sectionTitle('MapPin', 'Shipping method')}
                      <div className="space-y-2.5">{DELIVERY_ZONES.map(zoneOption)}</div>
                    </section>
                  )}

                  <section className="space-y-3">
                    {sectionTitle('Edit3', 'Order notes')}
                    <textarea
                      rows={3}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className={`${FIELD} resize-y`}
                      placeholder="Anything we should know before delivery? (optional)"
                    />
                  </section>

                  <button
                    type="submit"
                    className="w-full bg-elijays-gold hover:bg-elijays-gold-dim text-white py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 rounded-md"
                  >
                    <span>Proceed to Pay</span>
                  </button>
                </>
              ) : (
                <>
                  <section className="space-y-5">
                    {sectionTitle('CreditCard', 'Payment Method')}
                    <div className="space-y-2.5">
                      {paymentOption('stk', 'M-Pesa (STK Push)', `We'll send a payment prompt to ${effectivePhone || 'your phone'} via M-Pesa.`, Smartphone)}
                      {paymentOption('card', 'Card Payment (Co-op Bank)', 'Pay securely by card via Co-op Bank. You will be redirected to the secure gateway.', CreditCard)}
                    </div>

                    {paymentChoice === 'stk' && (
                      <div className="border border-utility-gray/60 rounded-md overflow-hidden bg-white">
                        <div className="px-4 py-3.5 bg-elijays-gold/5 border-b border-utility-gray/60">
                          <p className="text-sm text-elijays-ink font-medium">M-Pesa STK Push – Pay to {BRAND_NAME}</p>
                          <p className="text-xs text-elijays-ink/50 mt-1 font-light">A prompt will appear on your phone to confirm payment of KSh {Math.round(totals.total).toLocaleString()}.</p>
                        </div>
                        <div className="p-4 space-y-4">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={mpesaConfirmed}
                              onChange={(e) => setMpesaConfirmed(e.target.checked)}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-[#00A651] cursor-pointer"
                            />
                            <span className="text-xs sm:text-sm text-elijays-ink/60 leading-relaxed group-hover:text-elijays-ink transition-colors">
                              I will pay KSh {Math.round(totals.total).toLocaleString()} via M-Pesa STK push to {effectivePhone || 'my phone'} <span className="text-red-500">*</span>
                            </span>
                          </label>
                          <div className="space-y-1.5">
                            <label className={LABEL}>M-Pesa confirmation code <span className="text-elijays-ink/40 font-normal normal-case">(optional)</span></label>
                            <input
                              type="text"
                              value={mpesaCode}
                              onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                              className={`${FIELD} font-mono`}
                              placeholder="e.g. QHK7X2Y9AB"
                              autoComplete="off"
                            />
                            <p className="text-[11px] text-elijays-ink/40 leading-relaxed font-light">
                              Paste the code from your M-Pesa SMS after paying — helps us confirm faster.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentChoice === 'card' && (
                      <div className="border border-utility-gray/60 rounded-md overflow-hidden bg-white">
                        <div className="px-4 py-3.5 bg-elijays-gold/5 border-b border-utility-gray/60">
                          <p className="text-sm text-elijays-ink font-medium flex items-center gap-2">
                            <ShieldCheck size={16} className="text-elijays-gold" />
                            Secure Card Payment – Co-op Bank
                          </p>
                        </div>
                        <div className="p-4 space-y-3 text-sm text-elijays-ink/60 leading-relaxed">
                          <p>You will be redirected to the Co-op Bank secure card payment gateway to complete your payment.</p>
                          <p className="text-xs text-elijays-ink/40 font-light">
                            Card payments are processed by Co-op Bank (whitelisted IP). Your order is confirmed automatically once payment succeeds.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>

                  <button
                    type="submit"
                    disabled={!canPlaceOrder}
                    className="w-full bg-elijays-gold hover:bg-elijays-gold-dim disabled:bg-utility-gray/40 disabled:text-elijays-ink/30 disabled:cursor-not-allowed text-white py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 rounded-md"
                  >
                    <ShoppingBag size={17} />
                    <span>{submitting ? 'Processing payment…' : paymentChoice === 'stk' ? 'Pay with M-Pesa' : 'Pay Securely by Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('details');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-elijays-ink/50 hover:text-elijays-gold transition-colors"
                  >
                    &larr; Back to details
                  </button>
                </>
              )}
            </form>

            <aside className="lg:col-span-2">
              <div className="bg-white border border-utility-gray/60 rounded-md p-6 sm:p-8 space-y-7 lg:sticky lg:top-28">
                <h2 className="text-base font-display text-elijays-ink tracking-tight border-b border-utility-gray/60 pb-5">Order Summary</h2>

                <div className="space-y-3.5 max-h-72 overflow-auto">
                  {items.map((item) => (
                    <div key={item.cartItemId || `${item.productId}-${item.variantId}-${item.sizeLabel}`} className="flex gap-3 min-w-0">
                      <div className="w-14 h-14 bg-utility-gray/30 overflow-hidden shrink-0 border border-utility-gray/50 rounded-md">
                        <img src={item.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-elijays-ink truncate tracking-wide">{item.name}</p>
                        <p className="text-[10px] text-elijays-ink/50 font-medium mt-0.5">
                          Qty {item.quantity}{item.sizeLabel ? ` · ${item.sizeLabel}` : ''}
                        </p>
                      </div>
                      <p className="text-sm text-elijays-ink shrink-0 font-light">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-utility-gray/60 pt-5">
                  <div className="flex justify-between text-sm text-elijays-ink/70">
                    <span>Subtotal</span>
                    <span>KSh {totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-elijays-ink/70">
                    <span>Delivery</span>
                    <span>{deliveryLabel}</span>
                  </div>
                  {totals.tax > 0 && (
                    <div className="flex justify-between text-sm text-elijays-ink/70">
                      <span>VAT (16%)</span>
                      <span>KSh {totals.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold text-elijays-ink border-t border-utility-gray/60 pt-4">
                    <span>Total</span>
                    <span>KSh {Math.round(totals.total).toLocaleString()}</span>
                  </div>
                </div>

                {!customerLoggedIn && (
                  <p className="text-[10px] text-elijays-ink/40 leading-relaxed font-light text-center border-t border-utility-gray/60 pt-5">
                    Checking out as guest — no account needed.{' '}
                    <Link to="/login?redirect=/checkout" className="text-elijays-gold font-semibold hover:text-elijays-gold-dim">
                      Sign in instead
                    </Link>
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Checkout;