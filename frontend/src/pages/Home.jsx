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
    { icon: Truck, label: 'Free Shipping', desc: 'Orders over KES 5,000' },
    { icon: Tag, label: 'Big Savings', desc: 'Up to 30% off first order' },
    { icon: Clock, label: '24/7 Support', desc: 'Always here for you' },
    { icon: CreditCard, label: 'Flexible Payment', desc: 'M-Pesa, Visa, Cash on Delivery' },
  ];

  const collections = [
    {
      title: 'Tailored Suits',
      subtitle: 'THE ESSENTIALS',
      count: 24,
      image: '/WhatsApp Image 2026-05-12 at 8.07.17 PM.jpeg',
      link: '/suits',
    },
    {
      title: 'Streetwear',
      subtitle: 'MODERN EDGE',
      count: 38,
      image: '/WhatsApp Image 2026-05-12 at 8.07.33 PM.jpeg',
      link: '/products?category=jackets',
    },
    {
      title: "Men's Accessories",
      subtitle: 'FINISHING TOUCHES',
      count: 19,
      image: '/belt-001.jpeg',
      link: '/products?category=belts-ties',
    },
  ];

  const bentoPanels = [
    {
      title: 'The Statement Blazer',
      subtitle: 'LIMITED EDITION',
      image: '/WhatsApp Image 2026-05-12 at 8.07.17 PM.jpeg',
      span: 'lg:row-span-2',
      link: '/products?category=suits',
    },
    {
      title: 'World-Class Suit Collection',
      subtitle: 'CLASSIC TAILORING',
      image: '/WhatsApp Image 2026-05-12 at 8.07.30 PM.jpeg',
      span: '',
      link: '/suits',
    },
    {
      title: 'Premium Outerwear',
      subtitle: 'NEW SEASON',
      image: '/WhatsApp Image 2026-05-12 at 8.07.33 PM.jpeg',
      span: '',
      link: '/products?category=jackets',
    },
    {
      title: 'Relaxed Linen Shirts',
      subtitle: 'CASUAL ESSENTIALS',
      image: '/polo light blue.jpeg',
      span: '',
      link: '/shirts',
    },
    {
      title: 'New Luxury Menswear',
      subtitle: 'SEASON SALE',
      image: '/WhatsApp Image 2026-05-12 at 8.07.20 PM.jpeg',
      span: '',
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

      {/* Hero Section — Full-Bleed Editorial */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/WhatsApp Image 2026-05-12 at 8.07.17 PM.jpeg"
            alt="Men's fashion editorial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-5">
                <div className="h-px w-12 bg-accent" />
                <span className="text-accent text-[10px] md:text-xs font-semibold tracking-[0.35em] uppercase">
                  New Arrivals · 2025
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.9] tracking-tight">
                Dress With <br />
                <span className="italic font-light text-accent">Authority</span>
              </h1>

              <p className="text-white/60 text-base md:text-lg max-w-lg leading-relaxed font-light">
                Sharp silhouettes and uncompromising craftsmanship. Built for the man who moves
                with intention — from the boardroom to the evening.
              </p>

<Link
                 to="/products"
                 className="inline-flex items-center space-x-4 border border-white/50 text-white px-10 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-utility-gray hover:text-secondary transition-all duration-300"
               >
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories — Bento / Mosaic */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-6">
          <div className="mb-14 space-y-4">
            <span className="text-accent text-[10px] font-semibold tracking-[0.35em] uppercase">
              Curated Selection
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
              Featured Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-[300px] md:auto-rows-[280px] gap-3">
            {bentoPanels.map((panel, idx) => (
              <motion.div
                key={panel.title}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className={`relative group overflow-hidden cursor-pointer ${panel.span}`}
              >
                <img
                  src={panel.image}
                  alt={panel.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors duration-500" />
                <div className="absolute bottom-8 left-8 right-8 z-10">
                  <span className="text-accent/80 text-[9px] font-bold tracking-[0.35em] uppercase block mb-3">
                    {panel.subtitle}
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide leading-tight mb-4">
                    {panel.title}
                  </h3>
                  <span className="inline-flex items-center space-x-3 text-white/90 text-[10px] font-bold tracking-widest uppercase group-hover:text-accent transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase — horizontal scrolling product rows */}
      <ProductShowcase categoryRows={homepageData?.categoryRows} />

      {/* Trust / Features Bar */}
      <section className="py-16 md:py-20 border-y border-white/5 bg-utility-gray">
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
                <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center">
                  <feat.icon size={24} className="text-accent" />
                </div>
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

      {/* Shop by Collection */}
      <section className="py-24 md:py-32 bg-primary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-accent text-[10px] font-bold tracking-[0.35em] uppercase">
              The Gentleman's Wardrobe
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">
              Shop By Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="relative group h-[500px] md:h-[600px] overflow-hidden cursor-pointer"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[0.3s] ease-out group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-accent/80 text-[9px] tracking-[0.4em] font-bold uppercase mb-4 opacity-80">
                    {col.subtitle}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif text-white tracking-wide mb-4 leading-tight">
                    {col.title}
                  </h3>
                  <span className="inline-flex items-center justify-center bg-accent text-primary text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                    {col.count} items
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Bleed Promo Banner */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/WhatsApp Image 2026-05-12 at 8.07.18 PM.jpeg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/80" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <span className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase">
              Exclusive Offer · Use Code: ESQUIRE10
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight tracking-tight">
              World-Class <span className="italic font-light text-accent">Menswear</span> Collections
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
              Luxurious fabrics, impeccable tailoring. Experience the difference of world-class
              menswear from ELIJAY'S.
            </p>
<Link
               to="/products"
               className="inline-flex items-center space-x-4 border border-white/50 text-white px-10 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-utility-gray hover:text-secondary transition-all duration-300"
             >
              <span>Shop Now</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
