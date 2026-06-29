import { BRAND_NAME } from '../lib/brand';
import { useState, useEffect } from 'react';
import { Truck, ChevronLeft, ShoppingBag } from 'lucide-react';
import MpesaCheckoutSection from '../components/MpesaCheckoutSection';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { orderAPI } from '../services/api';
import { toCartVariantId } from '../utils/ids';
import { buildOrderTrackUrl, buildWhatsAppOrderUrl } from '../lib/storeContact';

const isCustomerSession = () => {
 const { isAuthenticated, token, isSeller, user } = useAuthStore.getState();
 return isAuthenticated && token && !isSeller && user?.accountType !== 'pos';
};

const Checkout = () => {
 const { isAuthenticated, user } = useAuthStore();
 const items = useCartStore((state) => state.items);
 const getCheckoutTotals = useCartStore((state) => state.getCheckoutTotals);
 const prepareForCheckout = useCartStore((state) => state.prepareForCheckout);
 const [cartReady, setCartReady] = useState(false);
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState('');
 const [mpesaConfirmed, setMpesaConfirmed] = useState(false);
 const [mpesaCode, setMpesaCode] = useState('');
 const [paymentChoice, setPaymentChoice] = useState('');
 const [fulfillmentMethod, setFulfillmentMethod] = useState('');
 const [deliveryZone, setDeliveryZone] = useState('');

 const [firstName, setFirstName] = useState('');
 const [lastName, setLastName] = useState('');
 const [email, setEmail] = useState('');
 const [phone, setPhone] = useState('');
 const [address, setAddress] = useState('');

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
 const names = String(user.name || '').trim().split(/\s+/);
 setFirstName((current) => current || names[0] || '');
 setLastName((current) => current || names.slice(1).join(' ') || '');
 setEmail((current) => current || user.email || '');
 setPhone((current) => current || user.phone || '');
 const saved = user.default_shipping_address || {};
 setAddress((current) => current || saved.line1 || '');
 setDeliveryZone((current) => current || saved.delivery_zone || '');
 }, [user]);

 if (!cartReady) {
 return (
 <div className="bg-primary min-h-screen flex items-center justify-center text-secondary/70 text-[10px] uppercase tracking-widest">
 Preparing checkout…
 </div>
 );
 }

 if (items.length === 0) return <Navigate to="/cart" />;

 const totals = getCheckoutTotals();
 const customerLoggedIn = isCustomerSession();
 const effectiveEmail = (email || user?.email || '').trim();
 const effectivePhone = (phone || user?.phone || '').trim();
 const needsDeliveryLocation = fulfillmentMethod === 'delivery';
 const hasDeliveryDetails = fulfillmentMethod === 'pickup'
 || (deliveryZone && address.trim().length >= 5);
 const hasPaymentChoice = paymentChoice === 'pay_on_delivery'
 || (paymentChoice === 'mpesa' && mpesaCode.trim().length >= 6);
 const contactReady = customerLoggedIn
 ? Boolean(effectiveEmail && effectivePhone)
 : Boolean(firstName.trim() && lastName.trim() && effectiveEmail && effectivePhone);
 const canPlaceOrder = contactReady && fulfillmentMethod && hasDeliveryDetails && hasPaymentChoice && !submitting;

 const lineItems = (list) =>
 list
 .filter((it) => String(it.productId).length >= 32)
 .map((it) => ({
 product_id: it.productId,
 variant_id: toCartVariantId(it.variantId),
 quantity: it.quantity,
 size_label: it.sizeLabel || null,
 }));

 const handlePlaceOrder = async (e) => {
 e.preventDefault();
 setError('');

 if (!canPlaceOrder) {
 setError('Choose pickup or delivery, add required contact/location details, then choose pay on delivery or paste an M-Pesa code.');
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
 city: needsDeliveryLocation ? 'Nairobi' : 'Pickup',
 country: 'Kenya',
 payment_choice: paymentChoice,
 ...(mpesaCode.trim() ? { mpesa_code: mpesaCode.trim().toUpperCase() } : {}),
 };

 const payload = {
 shipping_address,
 billing_address: shipping_address,
 payment_method: paymentChoice === 'mpesa' ? 'whatsapp_mpesa' : 'pay_on_delivery',
 items: lineItems(syncedItems),
 };

 const res = customerLoggedIn
 ? await orderAPI.create(payload)
 : await orderAPI.createGuest(payload);

 if (!res.data?.success) throw new Error(res.data?.message || 'Order failed');
 const order = res.data.data;
 sessionStorage.setItem('checkout-email', shipping_address.email);
 useCartStore.getState().clearLocalItems();

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
 window.location.href = whatsappUrl;
 } catch (err) {
 setError(err.response?.data?.message || err.message || 'Could not place order');
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="bg-primary min-h-screen">
 <Navbar />

 <main className="pt-24 sm:pt-32 pb-16 sm:pb-24">
 <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
 <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
  <Link to="/cart" className="text-secondary hover:text-accent shrink-0 transition-colors duration-300">
 <ChevronLeft size={22} />
 </Link>
 <h1 className="text-2xl sm:text-3xl font-serif text-secondary uppercase tracking-widest">Checkout</h1>
 </div>

 {error && (
 <div className="mb-6 bg-red-500/10 border border-red-500/25 text-red-600 text-sm py-3.5 px-5 text-center tracking-wide">{error}</div>
 )}

{!customerLoggedIn ? (
  <div className="mb-6 bg-utility-gray/40 border border-white/6 text-secondary text-sm py-3.5 px-5 sm:px-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
  <span className="font-light">Checking out as guest — no account needed.</span>
   <Link to="/login?redirect=/checkout" className="text-accent text-[10px] font-semibold uppercase tracking-widest hover:text-accent transition-colors shrink-0">
  Sign in instead
   </Link>
  </div>
  ) : (
 <p className="mb-6 text-secondary/60 text-[10px] uppercase tracking-widest">Signed in as {user?.email}</p>
 )}

 <form onSubmit={handlePlaceOrder} className="space-y-6 sm:space-y-8">
 <section className="bg-utility-gray/40 border border-white/6 p-5 sm:p-8 space-y-6 rounded-2xl">
 <div className="flex items-center space-x-3 border-b border-utility-gray/60 pb-4">
 <Truck className="text-secondary shrink-0" size={18} />
 <h2 className="text-lg font-serif text-secondary uppercase tracking-widest">Fulfillment</h2>
 </div>

 {!customerLoggedIn ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
 <div className="space-y-1.5">
 <label className="text-[10px] text-secondary uppercase tracking-widest font-semibold">First name</label>
 <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-sleek w-full py-3.5 px-4 text-sm" placeholder="John" />
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Last name</label>
 <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-sleek w-full py-3.5 px-4 text-sm" placeholder="Doe" />
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Email</label>
 <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-sleek w-full py-3.5 px-4 text-sm" placeholder="you@example.com" />
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Phone</label>
 <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-sleek w-full py-3.5 px-4 text-sm" placeholder="0712 345 678" />
 </div>
 </div>
 ) : (
 <div className="bg-utility-gray/60 border border-utility-gray/60 p-5 text-sm text-secondary/70 rounded-xl">
 <p className="text-secondary font-medium">{user?.name}</p>
 <p className="text-secondary mt-1">{effectiveEmail}</p>
 {!effectivePhone && (
 <div className="mt-4 space-y-1.5">
 <label className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Phone</label>
 <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-sleek w-full py-3.5 px-4 text-sm" placeholder="0712 345 678" />
 </div>
 )}
 </div>
 )}

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {[
 ['pickup', 'Pick from shop'],
 ['delivery', 'Deliver to my location'],
 ].map(([value, label]) => (
 <button
 key={value}
 type="button"
 onClick={() => setFulfillmentMethod(value)}
  className={`border px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 rounded-xl ${
  fulfillmentMethod === value
  ? 'bg-accent text-primary border-accent'
  : 'border-white/10 text-secondary/70 hover:border-accent/30 hover:text-secondary'
  }`}
 >
 {label}
 </button>
 ))}
 </div>

 {needsDeliveryLocation && (
 <div className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
 {[
 ['cbd', 'CBD'],
 ['nairobi_outside_cbd', 'Outside CBD'],
 ['outside_nairobi', 'Outside Nairobi'],
 ].map(([value, label]) => (
 <button
 key={value}
 type="button"
 onClick={() => setDeliveryZone(value)}
  className={`border px-3 py-3 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 rounded-xl ${
  deliveryZone === value
  ? 'bg-accent text-primary border-accent'
  : 'border-white/10 text-secondary/70 hover:border-accent/30 hover:text-secondary'
  }`}
 >
 {label}
 </button>
 ))}
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Exact location</label>
 <textarea
 required
 rows={4}
 value={address}
 onChange={(e) => setAddress(e.target.value)}
 className="input-sleek w-full py-3.5 px-4 text-base resize-y"
 placeholder="Estate, street, building, floor, landmark"
 />
 </div>
 </div>
 )}
 </section>

 <section className="bg-utility-gray/40 border border-white/6 p-5 sm:p-8 space-y-5 rounded-2xl">
 <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Payment option</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {[
 ['pay_on_delivery', 'Pay on delivery'],
 ['mpesa', 'M-Pesa code'],
 ].map(([value, label]) => (
 <button
 key={value}
 type="button"
 onClick={() => {
 setPaymentChoice(value);
 setMpesaConfirmed(value === 'mpesa');
 }}
  className={`border px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 rounded-xl ${
  paymentChoice === value
  ? 'bg-accent text-primary border-accent'
  : 'border-white/10 text-secondary/70 hover:border-accent/30 hover:text-secondary'
  }`}
 >
 {label}
 </button>
 ))}
 </div>
 {paymentChoice === 'mpesa' && (
 <MpesaCheckoutSection
 totals={totals}
 mpesaConfirmed={mpesaConfirmed}
 onMpesaConfirmedChange={setMpesaConfirmed}
 mpesaCode={mpesaCode}
 onMpesaCodeChange={setMpesaCode}
 showSummary
 />
 )}
 {paymentChoice !== 'mpesa' && (
 <div className="space-y-2 pt-2 border-t border-utility-gray/60">
 <div className="flex justify-between text-sm text-secondary">
 <span>Subtotal</span>
 <span>KSh {totals.subtotal.toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-base sm:text-lg font-bold text-secondary pt-1">
 <span>Total</span>
 <span className="text-secondary">KSh {Math.round(totals.total).toLocaleString()}</span>
 </div>
 </div>
 )}
 </section>

 {items.length > 0 && (
 <section className="bg-utility-gray/40 border border-white/6 p-5 sm:p-8 space-y-4 rounded-2xl">
 <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold">Your items</p>
 <div className="space-y-3">
 {items.map((item) => (
 <div key={item.cartItemId || `${item.productId}-${item.variantId}-${item.sizeLabel}`} className="flex gap-3 min-w-0">
<div className="w-12 h-12 sm:w-14 sm:h-14 bg-utility-gray overflow-hidden shrink-0 border border-white/6">
  <img src={item.image} alt="" loading="lazy" className="w-full h-full object-cover" />
  </div>
 <div className="flex-1 min-w-0">
 <p className="text-secondary text-sm truncate tracking-wide">{item.name}</p>
 <p className="text-[10px] text-secondary font-medium">Qty {item.quantity}{item.sizeLabel ? ` · ${item.sizeLabel}` : ''}</p>
 </div>
 <p className="text-secondary text-sm shrink-0 font-light italic">KSh {(item.price * item.quantity).toLocaleString()}</p>
 </div>
 ))}
 </div>
 </section>
 )}

 <section className="bg-utility-gray/40 border border-white/6 p-5 sm:p-8 space-y-5 rounded-2xl">
 <button
 type="submit"
 disabled={!canPlaceOrder}
 className="w-full bg-[#00A651] hover:bg-[#009648] text-secondary py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 rounded-xl disabled:bg-utility-gray disabled:text-secondary disabled:cursor-not-allowed"
 >
 <ShoppingBag size={17} />
 <span>{submitting ? 'Placing order…' : 'Place order'}</span>
 </button>
 </section>
 </form>
 </div>
 </main>

 <Footer />
 </div>
 );
};

export default Checkout;
