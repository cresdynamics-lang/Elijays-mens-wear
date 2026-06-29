import { useState } from 'react';
import { ChevronDown, Check, Copy } from 'lucide-react';
import {
 MPESA_ACCOUNT,
 MPESA_PAYBILL,
 MPESA_TILL,
 getMpesaPaymentType,
} from '../lib/storeContact';

const PAYBILL_STEPS = [
 'Open the M-Pesa menu on your phone',
 'Select Lipa na M-Pesa',
 'Select Pay Bill',
 `Enter business number ${MPESA_PAYBILL}`,
 `Enter account number ${MPESA_ACCOUNT}`,
 'Enter the exact order total',
 'Enter your M-Pesa PIN and confirm',
];

const TILL_STEPS = [
 'Open the M-Pesa menu on your phone',
 'Select Lipa na M-Pesa',
 'Select Buy Goods and Services',
 `Enter till number ${MPESA_TILL}`,
 'Enter the exact order total',
 'Enter your M-Pesa PIN and confirm',
];

const GENERIC_STEPS = [
 'Open the M-Pesa menu on your phone',
 'Select Lipa na M-Pesa',
 'Pay the exact order total shown below',
 'Enter your M-Pesa PIN and confirm',
];

const CopyBtn = ({ value, label, className = '' }) => {
 const [copied, setCopied] = useState(false);
 const copy = async () => {
 if (!value) return;
 try {
 await navigator.clipboard.writeText(String(value));
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 } catch { /* ignore */ }
 };
 return (
 <button
 type="button"
 onClick={copy}
  className={`inline-flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-accent hover:text-secondary ${className}`}
 >
 {copied ? <Check size={12} /> : <Copy size={12} />}
 {copied ? 'Copied' : label}
 </button>
 );
};

const MpesaCheckoutSection = ({
 totals,
 mpesaConfirmed,
 onMpesaConfirmedChange,
 mpesaCode,
 onMpesaCodeChange,
 showSummary = true,
}) => {
 const [instructionsOpen, setInstructionsOpen] = useState(false);
 const paymentType = getMpesaPaymentType();
 const steps = paymentType === 'paybill' ? PAYBILL_STEPS : paymentType === 'till' ? TILL_STEPS : GENERIC_STEPS;
 const totalRounded = Math.round(totals.total);
 const deliveryLabel = totals.shipping > 0 ? `KSh ${totals.shipping.toLocaleString()}` : 'Free';

 const headerLabel = paymentType === 'paybill'
 ? `M-Pesa Pay Bill – ${MPESA_PAYBILL} (ELIJAY'S Men's Wear)`
 : paymentType === 'till'
 ? `M-Pesa Lipa na M-Pesa (Buy Goods) – Till ${MPESA_TILL}`
 : 'Pay with M-Pesa';

 return (
 <div className="space-y-4">
  <div className="border border-accent/15 bg-utility-gray/70 px-4 py-3.5 rounded-xl">
 <p className="text-sm text-secondary font-medium tracking-wide">{headerLabel}</p>
 {paymentType === 'paybill' && (
  <p className="text-xs text-secondary/50 mt-1.5 font-light">Account no. {MPESA_ACCOUNT}</p>
 )}
 </div>

 <div className="border border-white/6">
 <button
 type="button"
 onClick={() => setInstructionsOpen((o) => !o)}
  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm text-secondary/70 hover:bg-utility-gray/[0.02] transition-colors duration-300"
 >
 <span className="font-medium tracking-wide">M-Pesa payment instructions</span>
 <ChevronDown
 size={18}
 className={`shrink-0 text-secondary transition-transform duration-300 ${instructionsOpen ? 'rotate-180' : ''}`}
 />
 </button>
 {instructionsOpen && (
 <div className="px-4 pb-4 space-y-3 border-t border-white/5">
 {paymentType === 'paybill' && (
 <>
 <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-3 text-sm">
  <span className="text-secondary/70">Pay bill:</span>
 <span className="font-bold text-secondary">{MPESA_PAYBILL}</span>
 <CopyBtn value={MPESA_PAYBILL} label="Copy pay bill" />
 </div>
 <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
  <span className="text-secondary/70">Account:</span>
 <span className="font-bold text-secondary">{MPESA_ACCOUNT}</span>
 <CopyBtn value={MPESA_ACCOUNT} label="Copy account" />
 </div>
 </>
 )}
 {paymentType === 'till' && (
 <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-3 text-sm">
  <span className="text-secondary/70">Till:</span>
 <span className="font-bold text-secondary">{MPESA_TILL}</span>
 <CopyBtn value={MPESA_TILL} label="Copy till" />
 </div>
 )}
 <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
  <span className="text-secondary/70">Amount:</span>
 <span className="font-serif text-secondary tracking-wide">KSh {totalRounded.toLocaleString()}</span>
 <CopyBtn value={String(totalRounded)} label="Copy amount" />
 </div>
 <ol className="space-y-2.5 pt-1">
 {steps.map((step, i) => (
  <li key={step} className="flex gap-2.5 text-xs sm:text-sm text-secondary/50">
 <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00A651] text-secondary text-[10px] font-bold">
 {i + 1}
 </span>
 <span className="pt-0.5 leading-relaxed min-w-0 font-light">{step}</span>
 </li>
 ))}
 </ol>
 </div>
 )}
 </div>

 <label className="flex items-start gap-3 cursor-pointer group">
 <input
 type="checkbox"
 checked={mpesaConfirmed}
 onChange={(e) => onMpesaConfirmedChange(e.target.checked)}
 className="mt-0.5 h-4 w-4 shrink-0 accent-[#00A651] cursor-pointer"
 />
  <span className="text-xs sm:text-sm text-secondary/50 leading-relaxed group-hover:text-secondary transition-colors">
 I will pay the order total via M-Pesa before my order is processed
 <span className="text-secondary"> *</span>
 </span>
 </label>

 <div className="space-y-1.5">
  <label className="text-xs text-secondary/70 font-medium">M-Pesa confirmation code (optional)</label>
 <input
 type="text"
 value={mpesaCode}
 onChange={(e) => onMpesaCodeChange(e.target.value.toUpperCase())}
  className="w-full bg-primary border border-white/8 py-3 px-4 text-secondary text-base outline-none focus:border-accent/40 font-mono tracking-wide transition-colors rounded-lg"
 placeholder="e.g. QHK7X2Y9AB"
 autoComplete="off"
 />
  <p className="text-[11px] text-secondary/40 leading-relaxed font-light">
 Paste the code from your M-Pesa SMS after paying — helps us confirm faster.
 </p>
 </div>

 {showSummary && (
 <div className="space-y-2.5 pt-2 border-t border-white/5">
  <div className="flex justify-between text-sm text-secondary/70">
  <span>Subtotal</span>
 <span>KSh {totals.subtotal.toLocaleString()}</span>
 </div>
  <div className="flex justify-between text-sm text-secondary/70">
  <span>Delivery</span>
 <span>{deliveryLabel}</span>
 </div>
  {totals.tax > 0 && (
  <div className="flex justify-between text-sm text-secondary/70">
  <span>VAT (16%)</span>
 <span>KSh {totals.tax.toLocaleString()}</span>
 </div>
 )}
 <div className="flex justify-between text-base sm:text-lg font-bold text-secondary pt-1">
 <span>Total</span>
 <span className="text-secondary">KSh {totalRounded.toLocaleString()}</span>
 </div>
 </div>
 )}
 </div>
 );
};

export default MpesaCheckoutSection;
