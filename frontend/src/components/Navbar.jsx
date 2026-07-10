import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ChevronRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { userInitials } from '../lib/format';
import { NAV_PARENTS } from '../data/navCategories';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';
import FloatingSocial from './FloatingSocial';

const iconBox = 'inline-flex h-8 w-8 items-center justify-center border border-elijays-gold text-elijays-gold hover:bg-elijays-gold hover:text-elijays-ink transition-colors';

const BrandLogo = ({ className = 'h-8 md:h-9' }) => (
  <Link
    to="/"
    className="inline-flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0"
    aria-label="Elijay's Men's Wear home"
  >
    <img
      src="/elijays-logo-nav.png"
      alt=""
      className={`${className} w-auto object-contain shrink-0`}
    />
    <span className="font-display text-elijays-gold text-[15px] sm:text-lg md:text-xl tracking-[0.06em] leading-none whitespace-nowrap">
      Elijay&apos;s <span className="font-normal text-elijays-white">Men&apos;s Wear</span>
    </span>
  </Link>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileParent, setMobileParent] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const cartCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  const go = (href) => {
    navigate(href);
    setIsOpen(false);
    setOpenDropdown(null);
    setMobileParent(null);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* 1. Utility bar — address only (socials float left) */}
      <div className="bg-elijays-black">
        <div className="container mx-auto px-4 md:px-8 h-8 flex items-center">
          <span className="text-[10px] md:text-[11px] tracking-[0.12em] text-elijays-gold font-medium truncate">
            Muindi Mbingu × Biashara St, Nairobi
          </span>
        </div>
      </div>

      {/* 2. Header — logo left, nav center, icons right */}
      <header className="sticky top-0 z-50 bg-elijays-black border-b border-elijays-gold">
        <div className="container mx-auto px-4 md:px-8">
          {/* Mobile header — logo left; search, cart, menu right */}
          <div className="lg:hidden h-14 flex items-center justify-between gap-3">
            <BrandLogo className="h-8" />
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setSearchOpen((v) => !v)} className={iconBox} aria-label="Search">
                <Search size={16} strokeWidth={1.5} />
              </button>
              <Link to="/cart" className={`${iconBox} relative`} aria-label="Cart">
                <ShoppingBag size={16} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-elijays-gold text-elijays-ink text-[8px] font-semibold flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <button type="button" onClick={() => setIsOpen(true)} className={iconBox} aria-label="Menu">
                <Menu size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-[68px] gap-6">
            <div className="justify-self-start">
              <BrandLogo className="h-10" />
            </div>

            <nav className="flex items-center justify-center gap-7">
              {NAV_PARENTS.map((item) => (
                <MegaLink key={item.name} item={item} open={openDropdown} setOpen={setOpenDropdown} go={go} />
              ))}
            </nav>

            <div className="justify-self-end flex items-center gap-2.5">
              <button type="button" onClick={() => setSearchOpen((v) => !v)} className={iconBox} aria-label="Search">
                <Search size={15} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => openWhatsAppGeneral()} className={iconBox} aria-label="WhatsApp">
                <MessageCircle size={15} strokeWidth={1.5} />
              </button>
              <Link to={isAuthenticated ? '/profile' : '/login'} className={iconBox} aria-label="Account">
                {isAuthenticated ? (
                  <span className="text-[9px] font-semibold">{userInitials(user)}</span>
                ) : (
                  <User size={15} strokeWidth={1.5} />
                )}
              </Link>
            </div>
          </div>

          {searchOpen && (
            <form onSubmit={submitSearch} className="pb-3">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search suits, shirts, khakis…"
                className="w-full bg-elijays-charcoal border border-elijays-gold/40 text-elijays-white px-4 py-2.5 text-sm outline-none focus:border-elijays-gold placeholder:text-elijays-white/40"
              />
            </form>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-elijays-black/70" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-[88%] max-w-sm h-full bg-elijays-black border-r border-elijays-gold p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <BrandLogo className="h-8" />
                <button type="button" onClick={() => setIsOpen(false)} className={iconBox}><X size={16} /></button>
              </div>

              {mobileParent ? (
                <div>
                  <button type="button" onClick={() => setMobileParent(null)} className="text-sm text-elijays-gold mb-5">← Back</button>
                  <p className="font-display text-xl text-elijays-white mb-4">{mobileParent.name}</p>
                  <div className="space-y-1">
                    {mobileParent.children.map((c) => (
                      <button key={c.name} type="button" onClick={() => go(c.href)} className="block w-full text-left text-elijays-white/80 py-2.5 border-b border-white/10 text-sm">
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {NAV_PARENTS.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setMobileParent(item)}
                      className="flex w-full items-center justify-between py-3.5 text-left text-elijays-white border-b border-white/10"
                    >
                      <span className="text-[15px]">{item.name}</span>
                      <ChevronRight size={16} className="text-elijays-gold" />
                    </button>
                  ))}
                  {[
                    { name: 'Journal', href: '/journal' },
                    { name: 'About', href: '/about' },
                    { name: 'Contact', href: '/contact' },
                  ].map((l) => (
                    <button key={l.name} type="button" onClick={() => go(l.href)} className="block w-full text-left py-3.5 text-elijays-white/80 border-b border-white/10 text-[15px]">
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingSocial />
    </>
  );
};

const MegaLink = ({ item, open, setOpen, go }) => {
  const active = open === item.name;
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(item.name)}
      onMouseLeave={() => setOpen(null)}
    >
      <button
        type="button"
        onClick={() => go(item.href)}
        className="text-[13px] text-elijays-white/90 hover:text-elijays-gold transition-colors whitespace-nowrap"
      >
        {item.name}
      </button>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[60]"
          >
            <div className="bg-elijays-charcoal border border-elijays-gold py-2 min-w-[180px]">
              {item.children.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => go(c.href)}
                  className="block w-full text-left px-4 py-2 text-[13px] text-elijays-white/80 hover:text-elijays-gold hover:bg-elijays-black/50 transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
