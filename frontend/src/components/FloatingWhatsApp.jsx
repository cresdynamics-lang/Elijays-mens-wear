import { WHATSAPP_NUMBER } from '../lib/storeContact';

const DEFAULT_MESSAGE = "Hello ELIJAY'S, I'd like to enquire about your menswear.";

/** WhatsApp chat button — bottom right */
const FloatingWhatsApp = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-3 md:right-5 bottom-6 md:bottom-8 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform hover:scale-105 hover:brightness-110"
    >
      <i className="fa-brands fa-whatsapp text-[28px]" aria-hidden />
    </a>
  );
};

export default FloatingWhatsApp;
