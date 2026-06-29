import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORY_TILES } from '../data/homepageContent';

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-5"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-secondary tracking-tight">Shop by Category</h2>
            <div className="flex items-center space-x-4">
              <div className="h-px w-10 bg-accent/50" />
              <p className="text-accent/70 tracking-[0.3em] text-[9px] font-semibold uppercase">In stock at ELIJAY&apos;S</p>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate('/products')}
            className="text-accent/70 border-b border-accent/20 pb-2 text-[10px] tracking-[0.22em] font-semibold hover:text-accent hover:border-accent/40 transition-all duration-300"
          >
            Explore All Categories
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[380px] md:auto-rows-[280px] gap-7">
          {CATEGORY_TILES.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.9, ease: 'easeOut' }}
              className={`relative min-h-[380px] md:min-h-0 overflow-hidden group cursor-pointer ${cat.span} border border-utility-gray/50 group-hover:border-accent/30 transition-all duration-700`}
              onClick={() => navigate(cat.path || `/products?category=${cat.category}`)}
            >
              <img
                src={cat.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-primary/10 opacity-85 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="absolute bottom-10 left-10 right-10 transition-transform duration-700 transform group-hover:-translate-y-3">
                <span className="text-accent/70 text-[9px] tracking-[0.4em] font-semibold block mb-4 uppercase opacity-80">{cat.subtitle}</span>
                <h3 className="text-xl md:text-2xl font-serif text-secondary tracking-wide mb-6 leading-tight">{cat.title}</h3>
                <div className="w-10 group-hover:w-full h-px bg-gradient-to-r from-accent/60 to-transparent transition-all duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

