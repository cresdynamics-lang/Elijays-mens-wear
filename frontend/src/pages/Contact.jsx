import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { STORE } from '../data/navCategories';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';

const Contact = () => (
  <Layout>
    <SEO
      title="Contact | ELIJAY'S Men's Wear"
      description="Visit Elijay's on Muindi Mbingu × Biashara Street, Nairobi CBD. Phone, WhatsApp, and store hours."
      path="/contact"
    />
    <section className="bg-elijays-black text-elijays-white py-14 md:py-20 border-b border-elijays-gold/30">
      <div className="container mx-auto px-5 md:px-8 max-w-3xl">
        <p className="text-elijays-gold text-[12px] mb-3">Contact</p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Find us on the floor</h1>
        <p className="text-elijays-white/70 font-light">Walk in, call, or WhatsApp — we&apos;ll sort size and stock.</p>
      </div>
    </section>

    <section className="py-14 md:py-16 bg-elijays-white">
      <div className="container mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 max-w-5xl">
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl text-elijays-ink mb-2">Address</h2>
            <p className="text-sm text-[#5c5c5c] leading-relaxed">
              {STORE.street}<br />{STORE.city}, Kenya
            </p>
            <span className="garment-tag !bg-elijays-ink mt-4 inline-flex">{STORE.tag}</span>
          </div>
          <div>
            <h2 className="font-display text-xl text-elijays-ink mb-2">Phone</h2>
            <a href="tel:+254708269209" className="text-sm text-elijays-gold hover:text-elijays-gold-dim">{STORE.phoneDisplay}</a>
          </div>
          <div>
            <h2 className="font-display text-xl text-elijays-ink mb-2">Email</h2>
            <a href={`mailto:${STORE.email}`} className="text-sm text-elijays-gold hover:text-elijays-gold-dim">{STORE.email}</a>
          </div>
          <div>
            <h2 className="font-display text-xl text-elijays-ink mb-2">Hours</h2>
            <ul className="text-sm text-[#5c5c5c] space-y-1">
              {STORE.hours.map((h) => (
                <li key={h.day}>{h.day}: {h.time}</li>
              ))}
            </ul>
          </div>
          <button type="button" onClick={() => openWhatsAppGeneral()} className="btn-gold">
            Enquire on WhatsApp
          </button>
        </div>

        <div className="bg-elijays-charcoal min-h-[280px] flex flex-col items-center justify-center p-8 text-center gap-4">
          <p className="font-display text-elijays-white text-xl">Muindi Mbingu × Biashara</p>
          <p className="text-elijays-white/60 text-sm font-light max-w-xs">
            Ask for Elijay&apos;s at the junction — or open the map for directions.
          </p>
          <a
            href="https://maps.google.com/?q=Muindi+Mbingu+Street+Biashara+Street+Nairobi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-outline"
          >
            Open in Maps
          </a>
        </div>
      </div>
    </section>
  </Layout>
);

export default Contact;
