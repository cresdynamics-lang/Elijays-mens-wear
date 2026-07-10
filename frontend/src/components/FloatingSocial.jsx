import { SOCIAL_INSTAGRAM, SOCIAL_FACEBOOK } from '../seo/seoData';
import { WHATSAPP_NUMBER } from '../lib/storeContact';

const LINKS = [
  { href: SOCIAL_INSTAGRAM, label: 'Instagram', icon: 'fa-brands fa-instagram' },
  { href: SOCIAL_FACEBOOK, label: 'Facebook', icon: 'fa-brands fa-facebook-f' },
  { href: `https://wa.me/${WHATSAPP_NUMBER}`, label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
];

/** Fixed vertical social stack — lower left of viewport */
const FloatingSocial = () => (
  <aside
    className="fixed left-3 md:left-4 bottom-24 md:bottom-28 z-40 flex flex-col gap-2.5"
    aria-label="Social links"
  >
    {LINKS.map(({ href, label, icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex h-10 w-10 items-center justify-center border border-elijays-gold bg-elijays-black text-elijays-gold shadow-lg shadow-black/40 transition-colors hover:bg-elijays-gold hover:text-elijays-ink"
      >
        <i className={`${icon} text-[15px]`} aria-hidden />
      </a>
    ))}
  </aside>
);

export default FloatingSocial;
