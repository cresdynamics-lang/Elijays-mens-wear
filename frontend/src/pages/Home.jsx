import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Tag, Clock, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import ProductShowcase from '../components/ProductShowcase';
import { bannerAPI } from '../services/api';
import { routeSeo } from '../seo/seoData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: 'easeOut' },
  }),
};

const Home = () => {
  const [homepageData, setHomepageData] = useState(null);
  const features = [
    { icon: Truck, label: 'FREE SHIPPING', desc: 'Free Shipping on orders over $150' },
    { icon: Tag, label: 'BIG SAVING', desc: 'Big Saving on First Order Over $99' },
    { icon: Clock, label: '24/7 SUPPORT', desc: 'Dedicated fashion assistance' },
    { icon: CreditCard, label: 'FLEXIBLE PAYMENT', desc: 'Split payments with multiple options' },
  ];

  const collections = [
    {
      name: 'TAILORED BLAZERS',
      count: 24,
      image: '/WhatsApp%20Image%202026-05-12%20at%208.07.17%20PM.jpeg',
      link: '/suits',
    },
    {
      name: 'PREMIUM FOOTWEAR',
      count: 38,
      image: '/WhatsApp%20Image%202026-05-12%20at%208.07.33%20PM.jpeg',
      link: '/products?category=jackets',
    },
    {
      name: 'MODERN STREETWEAR',
      count: 19,
      image: '/belt-001.jpeg',
      link: '/products?category=belts-ties',
    },
  ];

  const mosaicPanels = [
    {
      eyebrow: 'PREMIUM QUALITY',
      title: 'THE FINEST WOOL COATS',
      image: '/WhatsApp%20Image%202026-05-12%20at%208.07.17%20PM.jpeg',
      span: 'panel-tall',
      link: '/products?category=suits',
    },
    {
      eyebrow: 'WORLD BRANDED',
      title: 'APPAREL COLLECTION',
      image: '/WhatsApp%20Image%202026-05-12%20at%208.07.30%20PM.jpeg',
      span: 'panel-wide',
      link: '/suits',
    },
    {
      eyebrow: 'CASUAL LUXURY',
      title: 'KNITWEAR',
      image: '/polo%20light%20blue.jpeg',
      span: '',
      link: '/shirts',
    },
    {
      eyebrow: 'SEASON SALE',
      title: 'NEW LUXURY COLLECTION',
      image: '/WhatsApp%20Image%202026-05-12%20at%208.07.33%20PM.jpeg',
      span: '',
      link: '/products?category=jackets',
    },
    {
      eyebrow: 'LIMITED OFFER',
      title: 'GET SAVE UP TO 20% OFF',
      image: '/WhatsApp%20Image%202026-05-12%20at%208.07.20%20PM.jpeg',
      span: 'panel-tall',
      link: '/products',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    bannerAPI
      .getHomepageData()
      .then((res) => {
        if (!cancelled) setHomepageData(res.data?.data || null);
      })
      .catch((error) => {
        console.error('Home: homepage data unavailable', error);
        // Don't crash the app if API fails - homepage will render with static content
        if (!cancelled) setHomepageData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout>
      <SEO
        {...routeSeo.home}
        schema={[]}
      />

      {/* Hero — Split Layout */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex overflow-hidden">
        {/* Left Column - Content */}
        <div className="w-1/2 flex items-center justify-center bg-[#0B0B0B] px-12 md:px-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-lg space-y-8"
          >
            <span className="text-[#8A8A6B] text-[10px] font-bold tracking-[0.3em] uppercase block">
              EXTRA 10% OFF WITH CODE: TITAN01
            </span>
            <h1 className="text-[42px] md:text-[52px] lg:text-[64px] font-sans text-white leading-[1.1] tracking-tight font-bold uppercase">
              GET YOUR NEW<br />EDITION SUITS
            </h1>
            <Link
              to="/products"
              className="inline-block bg-white text-[#0B0B0B] px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#8A8A6B] hover:text-white transition-all duration-[0.3s] ease"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </div>

        {/* Right Column - Visual */}
        <div className="w-1/2 relative overflow-hidden">
          <img
            src="/WhatsApp%20Image%202026-05-12%20at%208.07.17%20PM.jpeg"
            alt="Premium men's blazer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0B0B0B]/30" />
        </div>
      </section>

      {/* SECTION A — Featured Categories Mosaic Grid */}
      <section className="py-20 md:py-28 bg-[#0d0d0d]">
        <div className="container mx-auto px-6">
          <div className="mb-14 space-y-4">
            <span className="text-accent text-[10px] font-semibold tracking-[0.2em] uppercase">
              Curated Selection
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
              Featured Categories
            </h2>
          </div>

          <div className="mosaic-grid">
            {mosaicPanels.map((panel, idx) => (
              <Link
                key={idx}
                to={panel.link}
                className={`relative group overflow-hidden cursor-pointer ${panel.span}`}
              >
                <img
                  src={panel.image}
                  alt={panel.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors duration-[0.25s] ease" />
                <div className="absolute bottom-0 left-0 p-5 md:p-6 z-10">
                  <span className="block text-[#c9a84c] font-sans text-[10px] uppercase tracking-[0.2em] mb-2">
                    {panel.eyebrow}
                  </span>
                  <h3 className="font-serif text-[20px] md:text-[26px] font-medium text-white leading-tight mb-3">
                    {panel.title}
                  </h3>
                  <span className="text-white text-[11px] font-sans uppercase tracking-wider underline decoration-transparent group-hover:decoration-[#c9a84c] group-hover:text-[#c9a84c] transition-all duration-[0.25s] ease">
                    SHOP NOW
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase — horizontal scrolling product rows */}
      <ProductShowcase categoryRows={homepageData?.categoryRows} />

      {/* Trust / Features Bar */}
      <section className="py-16 md:py-20 bg-[#111]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <feat.icon size={24} className="text-accent" />
                <div>
                  <h4 className="text-white text-[11px] font-bold tracking-[0.2em] uppercase">
                    {feat.label}
                  </h4>
                  <p className="text-[#888] text-[11px] mt-1 font-light">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B — Shop by Collection (3-Column Card Grid) */}
      <section className="py-24 md:py-32 bg-[#0B0B0B]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-12 h-12 mx-auto mb-6 border-2 border-[#8A8A6B] flex items-center justify-center">
              <div className="w-6 h-6 bg-[#8A8A6B]" />
            </div>
            <span className="text-[#8A8A6B] text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
              MENSWEAR COLLECTION
            </span>
            <h2 className="text-3xl md:text-4xl font-sans text-white tracking-tight font-bold uppercase">
              SHOP BY COLLECTION
            </h2>
          </div>

          <div className="collection-grid">
            {collections.map((col, i) => (
              <Link
                key={col.name}
                to={col.link}
                className="collection-card"
              >
                <div className="collection-card-image">
                  <img
                    src={col.image}
                    alt={col.name}
                    loading="lazy"
                  />
                </div>
                <div className="collection-card-label">
                  <div className="collection-name">
                    {col.name}
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="w-8 h-8 border border-white/30 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Bleed Promo Banner */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/WhatsApp%20Image%202026-05-12%20at%208.07.18%20PM.jpeg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h2 className="text-[40px] md:text-[48px] lg:text-[56px] font-sans text-white leading-tight tracking-tight font-bold uppercase">
              WORLD BRANDED LUXURY CLOTHING
            </h2>
            <Link
              to="/products"
              className="inline-block bg-white text-[#0B0B0B] px-12 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#8A8A6B] hover:text-white transition-all duration-[0.3s] ease"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
