import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_URL, SOCIAL_INSTAGRAM, SOCIAL_FACEBOOK } from '../seo/seoData';
import { STORE, NAV_PARENTS } from '../data/navCategories';
import { WHATSAPP_NUMBER } from '../lib/storeContact';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';

const Footer = () => (
  <footer className="bg-elijays-black border-t border-elijays-gold text-elijays-white">
    <div className="container mx-auto px-5 md:px-8 py-12 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div className="space-y-4">
          <p className="font-display text-xl tracking-[0.06em] uppercase text-elijays-white">Elijay&apos;s</p>
          <span className="garment-tag !bg-transparent inline-flex">Muindi Mbingu × Biashara St</span>
          <p className="text-sm text-elijays-white/60 font-light leading-relaxed">
            Luxury menswear on Muindi Mbingu at Biashara Street, Nairobi CBD. Walk in for a fitting — or enquire on WhatsApp.
          </p>
          <a
            href="https://maps.google.com/?q=Muindi+Mbingu+Street+Biashara+Street+Nairobi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[12px] text-elijays-gold hover:text-elijays-white transition-colors underline underline-offset-4"
          >
            Open in Maps
          </a>
        </div>

        <div>
          <h4 className="text-elijays-gold text-[11px] tracking-[0.14em] uppercase mb-4">Shop</h4>
          <ul className="space-y-2">
            {NAV_PARENTS.map((p) => (
              <li key={p.name}>
                <Link to={p.href} className="text-sm text-elijays-white/70 hover:text-elijays-gold transition-colors">{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-elijays-gold text-[11px] tracking-[0.14em] uppercase mb-4">Visit</h4>
          <ul className="space-y-2 text-sm text-elijays-white/70">
            <li>{STORE.street}</li>
            <li>{STORE.city}</li>
            <li><a href="tel:+254721844475" className="hover:text-elijays-gold">{STORE.phoneDisplay}</a></li>
            <li><a href={`mailto:${STORE.email}`} className="hover:text-elijays-gold">{STORE.email}</a></li>
            {STORE.hours.map((h) => (
              <li key={h.day}>{h.day}: {h.time}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-elijays-gold text-[11px] tracking-[0.14em] uppercase mb-4">Connect</h4>
          <button type="button" onClick={() => openWhatsAppGeneral()} className="btn-gold-outline mb-5">
            WhatsApp
          </button>
          <div className="flex gap-2.5">
            <a href={SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center border border-elijays-gold text-elijays-gold hover:bg-elijays-gold hover:text-elijays-ink transition-colors">
              <i className="fa-brands fa-instagram text-[13px]" aria-hidden />
            </a>
            <a href={SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-8 w-8 items-center justify-center border border-elijays-gold text-elijays-gold hover:bg-elijays-gold hover:text-elijays-ink transition-colors">
              <i className="fa-brands fa-facebook-f text-[13px]" aria-hidden />
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-8 w-8 items-center justify-center border border-elijays-gold text-elijays-gold hover:bg-elijays-gold hover:text-elijays-ink transition-colors">
              <i className="fa-brands fa-whatsapp text-[14px]" aria-hidden />
            </a>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-elijays-white/60">
            <li><Link to="/about" className="hover:text-elijays-gold">About</Link></li>
            <li><Link to="/journal" className="hover:text-elijays-gold">Journal</Link></li>
            <li><Link to="/contact" className="hover:text-elijays-gold">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-elijays-gold/40 pt-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-elijays-white/40">
        <p>© {new Date().getFullYear()} Elijay&apos;s Men&apos;s Wear. All rights reserved.</p>
        <a href={SITE_URL} className="hover:text-elijays-gold">elijays-mens-wear.co.ke</a>
      </div>
    </div>
  </footer>
);

export default Footer;
