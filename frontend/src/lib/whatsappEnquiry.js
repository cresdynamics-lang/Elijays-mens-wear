import { WHATSAPP_NUMBER } from './storeContact';
import { BRAND_NAME } from './brand';
import { trackMetaContact } from './metaPixel';

/** Open WhatsApp with a product enquiry prefilled (MVP commerce). */
export const openWhatsAppEnquiry = (product = {}) => {
  trackMetaContact(product);
  const name = product.name || 'a piece from your collection';
  const price = product.price != null
    ? ` (KSh ${Number(product.price).toLocaleString()})`
    : '';
  const slug = product.slug ? `\nLink: ${window.location.origin}/product/${product.slug}` : '';
  const text = `Hello ${BRAND_NAME}, I'd like to enquire about ${name}${price}.${slug}\nI'm interested in sizing / availability.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const openWhatsAppGeneral = (message) => {
  trackMetaContact();
  const text = message || `Hello ${BRAND_NAME}, I'd like to book a fitting / ask about stock.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
};
