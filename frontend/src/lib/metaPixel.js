/**
 * Meta (Facebook) Pixel helpers.
 * Set VITE_META_PIXEL_ID in frontend env to enable.
 */
export const META_PIXEL_ID = String(import.meta.env.VITE_META_PIXEL_ID || '').trim();

export const isMetaPixelEnabled = () => Boolean(META_PIXEL_ID && typeof window !== 'undefined');

/** Load fbq once and fire PageView */
export const initMetaPixel = () => {
  if (!META_PIXEL_ID || typeof window === 'undefined') return;
  if (window.fbq && window.__elijaysMetaPixelReady) return;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
  window.__elijaysMetaPixelReady = true;
};

export const trackMetaPageView = () => {
  if (!isMetaPixelEnabled() || !window.fbq) return;
  window.fbq('track', 'PageView');
};

export const trackMetaEvent = (eventName, params = {}) => {
  if (!isMetaPixelEnabled() || !window.fbq) return;
  window.fbq('track', eventName, params);
};

/** Standard ecommerce-style ViewContent for a product page */
export const trackMetaViewContent = (product = {}) => {
  const price = product.discount_price ?? product.price;
  trackMetaEvent('ViewContent', {
    content_ids: [String(product.id || product.sku || product.slug || '')].filter(Boolean),
    content_type: 'product',
    content_name: product.name || undefined,
    content_category: product.category_name || product.parent_category_name || undefined,
    value: price != null ? Number(price) : undefined,
    currency: 'KES',
  });
};

/** WhatsApp enquiry / fitting intent */
export const trackMetaContact = (product) => {
  if (product?.id || product?.slug) {
    trackMetaEvent('Contact', {
      content_ids: [String(product.id || product.sku || product.slug)].filter(Boolean),
      content_type: 'product',
      content_name: product.name,
    });
    return;
  }
  trackMetaEvent('Contact');
};
