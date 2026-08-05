import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_URL, SOCIAL_INSTAGRAM, SOCIAL_FACEBOOK, SOCIAL_TIKTOK } from '../seo/seoData';
import { STORE, NAV_PARENTS } from '../data/navCategories';
import { WHATSAPP_NUMBER } from '../lib/storeContact';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';

const Footer = () => (
  <footer className="bg-elijays-black border-t border-elijays-gold text-elijays-white">
    <div className="section-rule" aria-hidden />
    <div className="container mx-auto px-5 md:px-8 py-12 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div className="space-y-4">
          <Link to="/" aria-label="Elijay's Men's Wear home" className="inline-flex items-center gap-3">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-elijays-gold/50 bg-elijays-black shadow-[0_0_14px_rgba(212,175,55,0.28)]">
              <img
                src="/elijays-logo-square.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="leading-none">
              <span className="block font-display text-elijays-gold text-xl tracking-[0.14em] uppercase">
                ELIJAYS
              </span>
              <span className="mt-1 block font-sans text-[10px] tracking-[0.22em] uppercase text-elijays-white/70">
                Men&apos;s Wear
              </span>
            </span>
          </Link>
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
            <li><a href="tel:+254708269209" className="hover:text-elijays-gold">{STORE.phoneDisplay}</a></li>
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
            <a href={SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1877F2] text-white hover:brightness-110 transition-[filter]">
              <i className="fa-brands fa-facebook-f text-[13px]" aria-hidden />
            </a>
            <a href={SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white hover:brightness-110 transition-[filter] [background:radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]">
              <i className="fa-brands fa-instagram text-[13px]" aria-hidden />
            </a>
            <a href={SOCIAL_TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white border border-[#25F4EE] hover:brightness-110 transition-[filter]">
              <i className="fa-brands fa-tiktok text-[13px]" aria-hidden />
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366] text-white hover:brightness-110 transition-[filter]">
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
        <div className="flex items-center gap-4">
          <Link to="/admin/login" className="hover:text-elijays-gold tracking-[0.12em] uppercase">Staff</Link>
          <a href={SITE_URL} className="hover:text-elijays-gold">elijays-mens-wear.co.ke</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
