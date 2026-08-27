import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ProductShowcase from '../components/ProductShowcase';
import CategoryCards from '../components/CategoryCards';
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

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    bannerAPI
      .getHomepageData()
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data || res.data;
        const arrivals = data?.newArrivals || data?.new_arrivals || [];
        const best = data?.bestSellers || data?.best_sellers || [];
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
            arrivals.filter((p) => !String(p.category_name || '').includes('belt')).slice(0, 12)
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
          .slice(0, 12),
      })).filter((section) => section.products.length > 0),
    [allProducts]
  );

  return (
    <Layout>
      <SEO {...routeSeo.home} schema={[]} />

      {/* Hero Banner */}
      <section className="relative w-full h-[80vh] md:h-[92vh] min-h-[520px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="ELIJAYS Men's Wear"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative z-10 container mx-auto px-5 md:px-8 h-full flex flex-col items-center justify-end pb-12 md:pb-16 text-center text-white">
          <div className="flex flex-row flex-wrap gap-3 justify-center">
            <Link to="/products?sort=new" className="btn-gold text-center">
              New Arrivals
            </Link>
            <Link to="/products" className="btn-gold-outline text-center">
              Shop All
            </Link>
          </div>
        </div>
      </section>

      {/* Category cards — MensWorld-style image grid */}
      <CategoryCards />

      {/* Category Sections with Banners */}
      {categorySections.map((section) => (
        <ProductShowcase
          key={section.title}
          title={section.title}
          products={section.products}
          viewAllPath={section.viewAllPath}
          bannerImage={section.products[0]?.image_url || section.products[0]?.thumbnail}
        />
      ))}

      {/* Features Section */}
      <section className="bg-elijays-charcoal py-10 md:py-14">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-3">
                <i className="fa-solid fa-truck-fast text-elijays-gold text-lg" aria-hidden />
              </div>
              <h3 className="font-display text-elijays-ink text-sm md:text-base font-medium mb-1">Cash on Delivery</h3>
              <p className="text-xs text-elijays-muted">Nationwide delivery service.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-3">
                <i className="fa-solid fa-location-dot text-elijays-gold text-lg" aria-hidden />
              </div>
              <h3 className="font-display text-elijays-ink text-sm md:text-base font-medium mb-1">Store Locator</h3>
              <p className="text-xs text-elijays-muted">Find us on Muindi Mbingu Street.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-3">
                <i className="fa-solid fa-headset text-elijays-gold text-lg" aria-hidden />
              </div>
              <h3 className="font-display text-elijays-ink text-sm md:text-base font-medium mb-1">Support</h3>
              <p className="text-xs text-elijays-muted">Help for returns, exchange, and sizing.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-3">
                <i className="fa-solid fa-shield-halved text-elijays-gold text-lg" aria-hidden />
              </div>
              <h3 className="font-display text-elijays-ink text-sm md:text-base font-medium mb-1">Secure Payment</h3>
              <p className="text-xs text-elijays-muted">M-Pesa and card payments accepted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locator Banner */}
      <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <img
          src="/hero/hero-elijays.jpg"
          alt="ELIJAYS Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-[11px] tracking-[0.2em] uppercase font-medium mb-2 text-elijays-gold">Find Us</p>
            <h2 className="font-display text-2xl md:text-4xl font-medium tracking-[0.02em] mb-4">Store Locator</h2>
            <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
              Visit us at Muindi Mbingu Street × Biashara Street, Nairobi CBD. Open Mon – Sat, 9AM – 6PM.
            </p>
            <a
              href="https://maps.google.com/?q=Muindi+Mbingu+Street+Biashara+Street+Nairobi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-center"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-elijays-gold py-10 md:py-14">
        <div className="container mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-2 font-medium tracking-[0.02em]">
            Get Early Access to New Collections
          </h2>
          <p className="text-white/80 text-sm mb-6 font-light tracking-wide">
            Subscribe to our newsletter for exclusive offers and new arrivals.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); }}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-sm bg-white text-elijays-ink placeholder:text-elijays-muted outline-none focus:ring-2 focus:ring-white/30 rounded-lg"
            />
            <button type="submit" className="btn-primary rounded-lg">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      {/* New Arrivals Showcase */}
      <ProductShowcase
        title="New arrivals"
        products={featuredProducts}
        viewAllPath="/products"
      />

      {/* Journal Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-elijays-gold text-[12px] mb-1 tracking-[0.12em] uppercase font-medium">From the floor</p>
              <h2 className="font-display text-2xl md:text-3xl text-elijays-ink">Journal</h2>
            </div>
            <Link
              to="/journal"
              className="text-[12px] text-elijays-ink underline underline-offset-4 decoration-elijays-gold hover:text-elijays-gold transition-colors shrink-0"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
            {[
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
            ].map((tile) => (
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
