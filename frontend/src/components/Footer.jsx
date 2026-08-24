import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_URL, SOCIAL_INSTAGRAM, SOCIAL_FACEBOOK, SOCIAL_TIKTOK } from '../seo/seoData';
import { STORE, NAV_PARENTS } from '../data/navCategories';
import { WHATSAPP_NUMBER } from '../lib/storeContact';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';

const Footer = () => (
  <footer className="bg-white border-t border-elijays-ink/5 text-elijays-ink">
    <div className="container mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-4">
          <Link to="/" aria-label="Elijay's Men's Wear home" className="inline-flex items-center gap-3">
            <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-elijays-gold/50 bg-white">
              <img
                src="/elijays-logo-square.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="leading-none">
              <span className="block font-display text-elijays-ink text-lg tracking-[0.14em] uppercase">
                ELIJAYS
              </span>
              <span className="mt-1 block font-sans text-[9px] tracking-[0.22em] uppercase text-elijays-muted">
                Men&apos;s Wear
              </span>
            </span>
          </Link>
          <p className="text-xs text-elijays-muted font-light leading-relaxed">
            Premium menswear on Muindi Mbingu at Biashara Street, Nairobi CBD.
          </p>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.14em] uppercase text-elijays-ink font-semibold mb-4">Shop</h4>
          <ul className="space-y-2">
            {NAV_PARENTS.map((p) => (
              <li key={p.name}>
                <Link to={p.href} className="text-sm text-elijays-muted hover:text-elijays-ink transition-colors">{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.14em] uppercase text-elijays-ink font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-elijays-muted">
            <li><Link to="/about" className="hover:text-elijays-ink">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-elijays-ink">Contact Us</Link></li>
            <li><Link to="/journal" className="hover:text-elijays-ink">Journal</Link></li>
            <li><Link to="/shipping" className="hover:text-elijays-ink">Shipping Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-elijays-ink">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.14em] uppercase text-elijays-ink font-semibold mb-4">Customer Support</h4>
          <ul className="space-y-2 text-sm text-elijays-muted">
            <li><a href={`tel:${STORE.phone}`} className="hover:text-elijays-ink">{STORE.phoneDisplay}</a></li>
            <li><a href={`mailto:${STORE.email}`} className="hover:text-elijays-ink">{STORE.email}</a></li>
          </ul>
          <div className="flex gap-2.5 mt-4">
            <a href={SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877F2] text-white hover:brightness-110 transition-[filter]">
              <i className="fa-brands fa-facebook-f text-[12px]" aria-hidden />
            </a>
            <a href={SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white hover:brightness-110 transition-[filter] [background:radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]">
              <i className="fa-brands fa-instagram text-[12px]" aria-hidden />
            </a>
            <a href={SOCIAL_TIKTOK} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white border border-[#25F4EE] hover:brightness-110 transition-[filter]">
              <i className="fa-brands fa-tiktok text-[12px]" aria-hidden />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-elijays-ink/5 pt-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-elijays-muted">
        <p>© {new Date().getFullYear()} Elijay&apos;s Men&apos;s Wear. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/admin/login" className="hover:text-elijays-ink tracking-[0.12em] uppercase">Staff</Link>
          <span>{SITE_URL}</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
