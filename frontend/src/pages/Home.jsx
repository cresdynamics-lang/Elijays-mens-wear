import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import ProductShowcase from '../components/ProductShowcase';
import CategoryGrid from '../components/CategoryGrid';
import BlogShowcase from '../components/BlogShowcase';
import SEO from '../components/SEO';
import { bannerAPI } from '../services/api';
import { localBusinessSchema, organizationSchema, routeSeo, websiteSchema } from '../seo/seoData';
import Layout from '../components/Layout';

const Home = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

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

  useEffect(() => {
    let cancelled = false;

    const fetchFeaturedBlogs = async () => {
      try {
        const response = await fetch('/api/blog?limit=3', {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch featured blogs');
        const data = await response.json();

        if (!cancelled) {
          setFeaturedBlogs(Array.isArray(data.posts) ? data.posts : []);
        }
      } catch (error) {
        console.error('Home: featured blogs unavailable', error);
      }
    };

    fetchFeaturedBlogs();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout>
      <SEO
        {...routeSeo.home}
        schema={[organizationSchema, localBusinessSchema, websiteSchema]}
      />

      <HeroSlider heroSlides={homepageData?.heroSlides} />

      <ProductShowcase categoryRows={homepageData?.categoryRows} />

      {/* Quote Section */}
      <section className="relative py-20 md:py-24 text-center overflow-hidden border-y border-utility-gray/50">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/WhatsApp Image 2026-05-12 at 8.07.18 PM.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-28 bg-gradient-to-b from-accent/50 to-transparent" />
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-serif italic text-secondary leading-snug">
              "Dress well, feel confident, leave a mark."
            </h2>
            <div className="flex items-center justify-center space-x-6">
              <div className="w-16 h-px bg-accent/30" />
              <span className="text-accent/70 tracking-widest text-xs font-semibold">ELIJAY&apos;S</span>
              <div className="w-16 h-px bg-accent/30" />
            </div>
          </motion.div>
        </div>
      </section>

      <CategoryGrid />

      <section className="relative py-10 md:py-14 border-b border-utility-gray/50 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/WhatsApp Image 2026-05-12 at 8.07.17 PM.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-accent/80 text-xs tracking-widest font-semibold uppercase">Nairobi Menswear</span>
              <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-serif text-secondary leading-snug tracking-tight">
                Built Around What We Stock
              </h1>
            </div>
            <div className="lg:col-span-7 space-y-5 text-secondary/90 font-light leading-[1.8]">
              <p className="text-base md:text-[1.05rem]">
                ELIJAY&apos;S Men&apos;s Wear is a focused menswear house — suits, shirts, trousers, polos, jackets,
                sweaters, and finishing accessories chosen from our live inventory, not an endless catalogue.
              </p>
              <p className="text-base md:text-[1.05rem]">
                Every item online reflects what we carry in-store: official shirts and florals, khakis and denim,
                tailored suits, belts, ties, caps, and the layers that complete a Kenyan gentleman&apos;s wardrobe.
              </p>
              <p className="text-base md:text-[1.05rem]">
                Shop with confidence knowing stock levels match our daily inventory sheet. Visit us in Nairobi or
                order for delivery across Kenya with straightforward support.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5">
                {['Live inventory sync', 'In-store & online', 'Delivery across Kenya'].map((item) => (
                  <div key={item} className="border-l border-accent/30 pl-4">
                    <p className="text-accent/80 text-[10px] tracking-widest font-semibold uppercase">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/products"
                className="btn-primary inline-block mt-5"
              >
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Background CTA */}
      <section className="relative min-h-[620px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url("/WhatsApp Image 2026-05-12 at 8.07.18 PM.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-primary/75" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-3xl mx-auto space-y-10"
          >
            <h3 className="text-accent/80 tracking-widest text-sm font-semibold uppercase">The ELIJAY&apos;S Standard</h3>
            <h2 className="text-3xl md:text-4xl font-serif text-secondary tracking-tighter leading-[1.05]">
              Quality You Can<br />
              <span className="text-accent/90 italic font-light">See &amp; Feel</span>
            </h2>
            <p className="text-secondary font-light leading-relaxed max-w-xl mx-auto text-base">
              From the fabric in our shirts to the finish on our belts — we stock pieces meant to be worn,
              not just displayed. Walk in, try on, and build a wardrobe that works.
            </p>
            <Link
              to="/products"
              className="btn-outline inline-flex items-center justify-center hover:shadow-lg hover:shadow-accent/10"
            >
              Browse In-Stock Items
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-36 bg-primary relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[
              { title: 'In-Stock Guarantee', desc: 'What you see online matches our inventory sheet — no phantom products or outdated listings.', icon: '01' },
              { title: 'Everyday to Formal', desc: 'Official shirts, suits, khakis, polos, and accessories under one roof for the full wardrobe.', icon: '02' },
              { title: 'Personal Service', desc: 'Visit our shop for sizing help, styling advice, and the human touch online stores cannot replicate.', icon: '03' }
            ].map((promise, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: 'easeOut' }}
                className="space-y-8 group"
              >
                <span className="text-4xl font-serif text-accent/10 group-hover:text-accent/25 transition-colors duration-700 block">{promise.icon}</span>
                <h3 className="text-lg md:text-xl font-serif text-accent/80 border-b border-utility-gray/50 pb-4">{promise.title}</h3>
                <p className="text-secondary font-light text-base leading-relaxed">{promise.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featuredBlogs.length > 0 && (
        <section className="pt-12 pb-20 bg-primary border-t border-utility-gray/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div className="max-w-3xl space-y-4">
                <span className="text-accent/70 text-xs tracking-widest font-semibold uppercase">
                  Style Journal
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-secondary leading-snug tracking-tight">
                  Recent notes from the ELIJAY'S Men's Wear journal
                </h2>
                <p className="text-secondary text-base max-w-2xl leading-relaxed font-light">
                  Short editorial reads, wardrobe guidance, and product-led style ideas that support the collection and keep the brand discoverable.
                </p>
              </div>
              <Link
                to="/blog"
                className="btn-primary inline-flex items-center justify-center uppercase"
              >
                View all articles
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {featuredBlogs.map((blog) => (
                <BlogShowcase key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Home;
