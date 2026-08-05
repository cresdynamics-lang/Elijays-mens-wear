import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ProductShowcase from '../components/ProductShowcase';
import { bannerAPI } from '../services/api';
import { routeSeo } from '../seo/seoData';
import { DUMMY_PRODUCTS } from '../utils/dummyData';
import {
  HOME_INTRO_CARDS,
  HOME_CATEGORY_SECTIONS,
  productMatchesCategory,
} from '../data/navCategories';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';

const HERO_IMAGE = '/hero/hero-elijays.jpg';

const JOURNAL_TILES = [
  {
    title: 'How to wear linen in Nairobi heat',
    date: '12 Jun 2026',
    href: '/journal',
    image: '/hero/hero-shirts.jpg',
  },
  {
    title: 'Suiting for ruracio and the office',
    date: '28 May 2026',
    href: '/journal',
    image: '/hero/hero-suits.jpg',
  },
  {
    title: 'The belt that finishes the fit',
    date: '9 May 2026',
    href: '/journal',
    image: '/belt-001.jpeg',
  },
];

const Home = () => {
  const [allProducts, setAllProducts] = useState(DUMMY_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState(
    DUMMY_PRODUCTS.filter((p) => p.category_name !== 'belts-ties').slice(0, 8)
  );

  useEffect(() => {
    let cancelled = false;
    bannerAPI
      .getHomepageData()
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data || res.data;
        const arrivals = data?.new_arrivals || [];
        const best = data?.best_sellers || [];
        const merged = [...arrivals, ...best, ...DUMMY_PRODUCTS];
        const unique = [];
        const seen = new Set();
        for (const p of merged) {
          const key = p.id || p.slug;
          if (!key || seen.has(key)) continue;
          seen.add(key);
          unique.push(p);
        }
        if (unique.length) setAllProducts(unique);
        if (arrivals.length) {
          setFeaturedProducts(
            arrivals.filter((p) => !String(p.category_name || '').includes('belt')).slice(0, 8)
          );
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const categorySections = useMemo(
    () =>
      HOME_CATEGORY_SECTIONS.map((section) => ({
        ...section,
        products: allProducts
          .filter((p) => productMatchesCategory(p, section.match))
          .slice(0, 8),
      })).filter((section) => section.products.length > 0),
    [allProducts]
  );

  return (
    <Layout>
      <SEO {...routeSeo.home} schema={[]} />

      <section className="relative w-full min-h-[85vh] md:min-h-[94vh] overflow-hidden bg-elijays-black">
        <img
          src={HERO_IMAGE}
          alt="ELIJAYS Men's Wear — illuminated Muindi Mbingu storefront"
          className="hero-kenburns absolute inset-0 w-full h-full object-cover object-[center_42%] md:object-[center_38%]"
          fetchPriority="high"
        />
        {/* Dark left veil so white copy stays readable over neon storefront */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 34%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.2) 100%), linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 28%, transparent 62%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        <div className="relative z-10 container mx-auto px-5 md:px-8 min-h-[85vh] md:min-h-[94vh] flex flex-col justify-end md:justify-center pb-16 pt-28 md:py-24">
          <div className="self-start max-w-xl w-full hero-copy-in rounded-sm bg-black/55 backdrop-blur-[2px] border border-white/15 px-5 py-6 sm:px-7 sm:py-8 shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
            <p className="font-display text-white text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[0.95] tracking-[0.06em] uppercase mb-1 [text-shadow:0_1px_0_#000,0_3px_0_#000,0_6px_18px_#000]">
              ELIJAYS
            </p>
            <p className="font-display text-white text-xl sm:text-2xl md:text-3xl leading-none tracking-[0.18em] uppercase mb-5 [text-shadow:0_1px_0_#000,0_3px_0_#000,0_5px_14px_#000]">
              Men&apos;s Wear
            </p>
            <h1 className="font-display text-[1.65rem] sm:text-2xl md:text-[2rem] leading-snug mb-0 font-normal text-white [text-shadow:0_1px_0_#000,0_3px_0_#000,0_6px_16px_#000]">
              Tailored for the man who arrives.
            </h1>
            <p className="mt-4 mb-0 max-w-md text-[15px] md:text-base font-normal leading-relaxed tracking-wide text-white [text-shadow:0_1px_0_#000,0_3px_10px_#000]">
              Suits, shirts and outerwear cut for Nairobi&apos;s CBD — walk in on Muindi Mbingu, feel the cloth, own the fit.
            </p>
            <div className="flex flex-row flex-wrap gap-3 mt-8">
              <Link to="/suits" className="btn-gold btn-sm text-center">
                Shop suits
              </Link>
              <button
                type="button"
                onClick={() => openWhatsAppGeneral("Hello ELIJAY'S, I'd like to book a fitting.")}
                className="btn-gold-outline btn-sm text-center"
              >
                Book a fitting
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-elijays-white">
        <div className="container mx-auto px-5 md:px-8">
          <p className="text-elijays-gold text-[11px] tracking-[0.2em] uppercase font-sans font-medium mb-2">
            Welcome
          </p>
          <p className="font-display text-elijays-ink text-2xl md:text-3xl mb-3 max-w-2xl font-medium leading-snug tracking-[0.01em]">
            Dress like the room expects you.
          </p>
          <p className="text-elijays-ink text-sm md:text-base mb-8 md:mb-10 max-w-2xl font-normal leading-relaxed tracking-wide">
            Suiting, fittings on the floor, and everyday pieces for how Nairobi dresses — chosen so a man adds what fits, not what fills a cart.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
            {HOME_INTRO_CARDS.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-elijays-charcoal"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-elijays-black via-elijays-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 md:p-5">
                  <div className="bg-elijays-black/85 backdrop-blur-md border border-elijays-gold/40 p-3 sm:p-4">
                    <p className="text-elijays-gold text-[10px] sm:text-[11px] mb-0.5 sm:mb-1 font-medium tracking-[0.12em] uppercase">
                      {card.eyebrow}
                    </p>
                    <h3 className="font-display text-elijays-white text-lg sm:text-2xl md:text-[1.65rem] mb-1 sm:mb-2 font-medium tracking-[0.02em]">
                      {card.title}
                    </h3>
                    <p className="hidden sm:block text-elijays-white text-sm mb-3 font-normal leading-snug line-clamp-2">
                      {card.description}
                    </p>
                    <span className="inline-block border border-elijays-gold bg-elijays-gold text-elijays-ink px-2.5 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[10px] tracking-[0.12em] uppercase font-medium group-hover:bg-elijays-white transition-colors">
                      Shop now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-elijays-black border-y border-elijays-gold">
        <div className="container mx-auto px-5 md:px-8 py-3.5 text-center">
          <p className="text-elijays-gold text-[12px] md:text-[13px] tracking-[0.04em]">
            New season linen shirts — in store now.
          </p>
        </div>
      </section>

      <ProductShowcase
        title="New arrivals"
        products={featuredProducts}
        viewAllPath="/products"
      />

      {categorySections.map((section) => (
        <ProductShowcase
          key={section.title}
          title={section.title}
          products={section.products}
          viewAllPath={section.viewAllPath}
        />
      ))}

      <section className="bg-elijays-gold">
        <div className="container mx-auto px-5 md:px-8 py-10 md:py-12 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-elijays-ink mb-2 font-medium tracking-[0.02em]">
            Get styled
          </h2>
          <p className="text-elijays-ink/80 text-[15px] mb-6 font-light tracking-wide">
            Message us — we&apos;ll confirm size, stock, and a fitting.
          </p>
          <button
            type="button"
            onClick={() => openWhatsAppGeneral()}
            className="inline-flex items-center justify-center px-8 py-3.5 text-[11px] font-medium tracking-[0.14em] uppercase border border-elijays-ink bg-elijays-ink text-elijays-white hover:bg-transparent hover:text-elijays-ink transition-colors"
          >
            Enquire on WhatsApp
          </button>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-elijays-white">
        <div className="container mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-elijays-gold text-[12px] mb-1">Journal</p>
              <h2 className="font-display text-2xl md:text-3xl text-elijays-ink">From the floor</h2>
            </div>
            <Link
              to="/journal"
              className="text-[12px] text-elijays-ink underline underline-offset-4 decoration-elijays-gold shrink-0"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
            {JOURNAL_TILES.map((tile) => (
              <Link key={tile.title} to={tile.href} className="group min-w-0">
                <div className="aspect-[3/4] sm:aspect-[4/3] overflow-hidden bg-elijays-charcoal mb-2 sm:mb-3">
                  <img
                    src={tile.image}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <p className="text-[9px] sm:text-[11px] text-elijays-gold mb-0.5 sm:mb-1">{tile.date}</p>
                <h3 className="font-display text-[12px] sm:text-base md:text-lg text-elijays-ink group-hover:text-elijays-gold-dim transition-colors leading-snug line-clamp-2">
                  {tile.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
