import { SOCIAL_INSTAGRAM, SOCIAL_FACEBOOK, SOCIAL_TIKTOK } from '../seo/seoData';

const LINKS = [
  {
    href: SOCIAL_FACEBOOK,
    label: 'Facebook',
    icon: 'fa-brands fa-facebook-f',
    className: 'bg-[#1877F2] border-[#1877F2] text-white hover:brightness-110',
  },
  {
    href: SOCIAL_INSTAGRAM,
    label: 'Instagram',
    icon: 'fa-brands fa-instagram',
    className:
      'border-transparent text-white hover:brightness-110 [background:radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]',
  },
  {
    href: SOCIAL_TIKTOK,
    label: 'TikTok',
    icon: 'fa-brands fa-tiktok',
    className: 'bg-black border-[#25F4EE] text-white hover:brightness-110 shadow-[2px_0_0_#FE2C55,-2px_0_0_#25F4EE]',
  },
];

/** Fixed vertical social stack — bottom left of viewport */
const FloatingSocial = () => (
  <aside
    className="fixed left-3 md:left-4 bottom-6 md:bottom-8 z-40 flex flex-col gap-2.5"
    aria-label="Social links"
  >
    {LINKS.map(({ href, label, icon, className }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg shadow-black/30 transition-[filter,transform] hover:scale-105 ${className}`}
      >
        <i className={`${icon} text-[15px]`} aria-hidden />
      </a>
    ))}
  </aside>
);

export default FloatingSocial;
