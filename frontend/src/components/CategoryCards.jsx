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
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {HOMEPAGE_CATEGORY_CARDS.map((cat, i) => (
            <motion.button
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.6 }}
              type="button"
              onClick={() => navigate(cat.link)}
              aria-label={cat.title}
              className="group relative block aspect-[3/4] overflow-hidden bg-elijays-charcoal focus:outline-none focus:ring-2 focus:ring-elijays-gold"
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
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
