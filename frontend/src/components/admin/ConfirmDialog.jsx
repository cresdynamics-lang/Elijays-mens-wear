import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext(null);

const variantStyles = {
 danger: {
 icon: 'bg-red-500/15 text-red-600 border-red-500/20',
 button: 'bg-red-500 hover:bg-red-400 text-white',
 },
 warning: {
 icon: 'bg-accent-600/15 text-accent-500 border-utility-gray/60',
 button: 'bg-accent-600 hover:bg-accent-500 text-base-950',
 },
 default: {
 icon: 'bg-accent-600/15 text-accent-500 border-utility-gray/60',
 button: 'bg-accent-600 hover:bg-accent-500 text-base-950',
 },
};

export function ConfirmProvider({ children }) {
 const [state, setState] = useState(null);
 const resolveRef = useRef(null);

 const confirm = useCallback((options = {}) => {
 return new Promise((resolve) => {
 resolveRef.current = resolve;
 setState({
 title: options.title || 'Confirm action',
 message: options.message || 'Are you sure you want to continue?',
 confirmLabel: options.confirmLabel || 'Confirm',
 cancelLabel: options.cancelLabel || 'Cancel',
 variant: options.variant || 'danger',
 });
 });
 }, []);

 const close = (result) => {
 resolveRef.current?.(result);
 resolveRef.current = null;
 setState(null);
 };

 useEffect(() => {
 if (!state) return undefined;

 const onKeyDown = (e) => {
 if (e.key === 'Escape') close(false);
 };
 window.addEventListener('keydown', onKeyDown);
 return () => window.removeEventListener('keydown', onKeyDown);
 }, [state]);

 const styles = variantStyles[state?.variant] || variantStyles.danger;

 return (
 <ConfirmContext.Provider value={confirm}>
 {children}
 <AnimatePresence>
 {state && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
 role="dialog"
 aria-modal="true"
 aria-labelledby="confirm-dialog-title"
 >
 <button
 type="button"
 aria-label="Close"
 className="absolute inset-0 bg-primary backdrop-blur-sm"
 onClick={() => close(false)}
 />

 <motion.div
 initial={{ opacity: 0, scale: 0.96, y: 12 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.96, y: 12 }}
 transition={{ duration: 0.2 }}
 className="relative w-full max-w-md bg-utility-gray border border-accent-500/15 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
 >
 <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />

 <div className="p-6 sm:p-8">
 <div className="flex items-start gap-4">
 <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${styles.icon}`}>
 <AlertTriangle size={22} />
 </div>
 <div className="flex-1 min-w-0 pt-1">
 <h3
 id="confirm-dialog-title"
 className="text-lg font-serif font-bold text-secondary tracking-wide"
 >
 {state.title}
 </h3>
 <p className="mt-3 text-sm text-accent/80 leading-relaxed whitespace-pre-line">
 {state.message}
 </p>
 </div>
 <button
 type="button"
 onClick={() => close(false)}
 className="shrink-0 p-1.5 rounded-lg text-secondary/60 hover:text-accent-500 hover:bg-utility-gray transition-colors"
 aria-label="Close"
 >
 <X size={18} />
 </button>
 </div>

 <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
 <button
 type="button"
 onClick={() => close(false)}
 className="w-full sm:w-auto px-6 py-3 rounded-xl border border-utility-gray/60 text-accent text-[10px] font-black tracking-[0.2em] hover:border-accent-500/40 hover:text-accent-500 transition-all"
 >
 {state.cancelLabel}
 </button>
 <button
 type="button"
 onClick={() => close(true)}
 className={`w-full sm:w-auto px-6 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all shadow-lg ${styles.button}`}
 >
 {state.confirmLabel}
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </ConfirmContext.Provider>
 );
}

export function useConfirm() {
 const ctx = useContext(ConfirmContext);
 if (!ctx) {
 throw new Error('useConfirm must be used within ConfirmProvider');
 }
 return ctx;
}
