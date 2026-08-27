import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HOMEPAGE_CATEGORY_CARDS } from '../data/homepageCategories';

/** Brand-coloured SVG shown if a remote placeholder image fails to load. */
const fallbackImage = (title) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#1a1a1a'/>
        <stop offset='1' stop-color='#3d3b37'/>
      </linearGradient>
    </defs>
    <rect width='600' height='800' fill='url(#g)'/>
    <text x='50%' y='50%' fill='#D4AF37' font-family='Georgia, serif' font-size='38' text-anchor='middle'>${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/** Right arrow used inside each category's shortcut chip. */
const ArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CategoryCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-5 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-elijays-gold text-[11px] tracking-[0.25em] uppercase font-semibold mb-2">
              In Stock at ELIJAY&apos;S
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-elijays-ink tracking-tight">
              See Your Wardrobe
            </h2>
          </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {HOMEPAGE_CATEGORY_CARDS.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.6 }}
              className="group"
            >
              <button
                type="button"
                onClick={() => navigate(cat.link)}
                aria-label={cat.title}
                className="relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-elijays-charcoal focus:outline-none focus:ring-2 focus:ring-elijays-gold"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage(cat.title);
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-left">
                  <p className="text-elijays-gold/90 text-[9px] tracking-[0.3em] uppercase font-semibold mb-1">
                    {cat.subtitle}
                  </p>
                  <h3 className="text-white font-display text-lg md:text-xl tracking-wide">
                    {cat.title}
                  </h3>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate(cat.link)}
                aria-label={`View ${cat.shortcut} collection`}
                className="mt-3 flex w-full items-center justify-between rounded-xl bg-white px-4 py-2.5 text-left shadow-sm ring-1 ring-black/5 transition group-hover:ring-elijays-gold/60 focus:outline-none focus:ring-2 focus:ring-elijays-gold"
              >
                <span className="text-sm font-medium text-elijays-ink">
                  {cat.shortcut}
                </span>
                <span className="text-elijays-gold">
                  <ArrowRight />
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
