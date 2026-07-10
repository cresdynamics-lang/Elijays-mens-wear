import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

/** Sticky mobile CTA — gold WhatsApp bar (MVP). Cart can replace later. */
const StickyAddToCart = ({
  visible,
  productName,
  displayPrice,
  disabled,
  onEnquire,
}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-elijays-gold border-t border-elijays-ink/10"
        role="region"
        aria-label="Enquire on WhatsApp"
      >
        <button
          type="button"
          onClick={onEnquire}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-[13px] font-medium text-elijays-ink disabled:opacity-40"
        >
          <MessageCircle size={16} strokeWidth={2} />
          <span className="truncate max-w-[70%]">
            Enquire — {productName}
            {displayPrice != null ? ` · KSh ${displayPrice.toLocaleString()}` : ''}
          </span>
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default StickyAddToCart;
