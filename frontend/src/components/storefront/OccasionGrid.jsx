import { Link } from 'react-router-dom';
import { OCCASIONS, SECTIONS } from '../../content/nairobiBrand';

const OccasionGrid = () => (
  <section className="py-14 md:py-20 bg-brand-black text-white">
    <div className="container mx-auto px-5 md:px-8">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-brand-yellow mb-3">
          Nairobi occasions
        </p>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white">
          {SECTIONS.collectionsTitle}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
        {OCCASIONS.map((item) => (
          <Link
            key={item.title}
            to={item.link}
            className="group bg-brand-black p-8 md:p-10 hover:bg-white/[0.04] transition-colors"
          >
            <h3 className="text-lg font-medium text-white mb-3 group-hover:text-brand-yellow transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed font-light">{item.copy}</p>
            <span className="inline-block mt-6 text-[11px] font-medium tracking-[0.12em] uppercase text-brand-yellow opacity-80 group-hover:opacity-100">
              Shop →
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default OccasionGrid;
