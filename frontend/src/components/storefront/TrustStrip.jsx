import { TRUST_ITEMS } from '../../content/nairobiBrand';

const TrustStrip = () => (
  <section className="bg-brand-black text-white border-y border-brand-black">
    <div className="container mx-auto px-5 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="py-6 md:py-8 px-4 md:px-6 text-center md:text-left">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brand-yellow mb-1">
              {item.label}
            </p>
            <p className="text-[13px] text-white/70 font-light">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;
