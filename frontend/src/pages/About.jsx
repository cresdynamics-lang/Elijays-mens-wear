import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { STORE } from '../data/navCategories';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';

const About = () => (
  <Layout>
    <SEO
      title="About | ELIJAY'S Men's Wear"
      description="Elijay's Men's Wear — luxury menswear on Muindi Mbingu × Biashara Street, Nairobi CBD. Tailoring craft, real stock, fittings on the floor."
      path="/about"
    />
    <section className="bg-elijays-ink text-white py-16 md:py-24">
      <div className="container mx-auto px-5 md:px-8 max-w-3xl">
        <p className="text-elijays-gold text-[12px] mb-3">About us</p>
        <h1 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
          A showroom on the street that built Nairobi trade.
        </h1>
        <p className="text-white/75 text-[15px] leading-relaxed font-light mb-4">
          Elijay&apos;s sits on Muindi Mbingu Street at the Biashara Street junction — CBD ground where men still walk in to feel the cloth, get sized, and leave dressed for the occasion.
        </p>
        <p className="text-white/75 text-[15px] leading-relaxed font-light">
          We stock suits, shirts, trousers, polos, outerwear, and accessories for the man who arrives: office, church, ruracio, or Friday after work. No hype — just the garment, the fit, and the street.
        </p>
      </div>
    </section>

    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-10 max-w-5xl">
        <div>
          <h2 className="font-display text-2xl text-elijays-ink mb-4">The craft</h2>
          <p className="text-sm text-elijays-muted leading-relaxed font-light">
            Pieces are selected for clean lines and fabric that holds up in Nairobi heat. Walk in for a fitting — we&apos;d rather you try it on than guess online.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-elijays-ink mb-4">The store</h2>
          <p className="text-sm text-elijays-muted leading-relaxed font-light mb-4">
            {STORE.street}, {STORE.city}. {STORE.hours[0].day}: {STORE.hours[0].time}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="btn-gold">Shop the floor</Link>
            <button type="button" onClick={() => openWhatsAppGeneral()} className="btn-gold-outline">WhatsApp</button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
