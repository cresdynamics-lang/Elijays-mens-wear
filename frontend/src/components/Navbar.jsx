import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { userInitials } from '../lib/format';
import { NAV_PARENTS } from '../data/navCategories';
import { openWhatsAppGeneral } from '../lib/whatsappEnquiry';

const iconBox =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-elijays-ink/10 text-elijays-ink hover:border-elijays-gold hover:text-elijays-gold transition-colors';

const BrandLogo = ({ markClassName = 'h-10 w-10 md:h-11 md:w-11' }) => (
  <Link
    to="/"
    className="inline-flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0"
    aria-label="Elijay's Men's Wear home"
  >
    <span
      className={`${markClassName} shrink-0 overflow-hidden rounded-xl border border-elijays-gold/50 bg-elijays-white shadow-none`}
    >
      <img
        src="/elijays-logo-square.png"
        alt=""
        className="h-full w-full object-cover"
      />
    </span>
    <span className="min-w-0 leading-none">
      <span className="block font-display text-elijays-ink text-[17px] sm:text-xl md:text-[1.35rem] tracking-[0.14em] uppercase">
        ELIJAYS
      </span>
      <span className="mt-0.5 block font-sans text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-elijays-muted">
        Men&apos;s Wear
      </span>
    </span>
  </Link>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      {/* Top announcement bar */}
      <div className="bg-elijays-ink text-white">
        <div className="container mx-auto px-4 md:px-8 h-9 flex items-center justify-center">
          <p className="text-[11px] md:text-[12px] tracking-[0.04em] text-center">
            New season linen shirts — in store now. Free shipping on orders above KSh 5,000.
          </p>
        </div>
      </div>

      {/* Header — always visible, clean horizontal nav */}
      <header className="sticky top-0 z-50 bg-white border-b border-elijays-ink/5 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          {/* Mobile header */}
          <div className="lg:hidden h-14 flex items-center justify-between gap-3">
            <BrandLogo markClassName="h-9 w-9" />
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setSearchOpen((v) => !v)} className={iconBox} aria-label="Search">
                <i className="fa-solid fa-magnifying-glass text-[14px]" aria-hidden />
              </button>
              <Link to="/wishlist" className={`${iconBox}`} aria-label="Wishlist">
                <i className="fa-regular fa-heart text-[14px]" aria-hidden />
              </Link>
              <Link to="/cart" className={`${iconBox} relative`} aria-label="Cart">
                <i className="fa-solid fa-bag-shopping text-[14px]" aria-hidden />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-elijays-gold text-white text-[8px] font-semibold flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <button type="button" onClick={() => setIsOpen(true)} className={iconBox} aria-label="Menu">
                <i className="fa-solid fa-bars text-[14px]" aria-hidden />
              </button>
            </div>
          </div>

          {/* Desktop header — logo left, all nav links center, icons right */}
          <div className="hidden lg:flex items-center justify-between h-[64px] gap-6">
            <div className="shrink-0">
              <BrandLogo markClassName="h-11 w-11" />
            </div>

            <nav className="flex items-center justify-center gap-6 xl:gap-8">
              {NAV_PARENTS.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-[11px] xl:text-[12px] tracking-[0.04em] uppercase text-elijays-ink/80 hover:text-elijays-gold transition-colors whitespace-nowrap font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {[
                { name: 'Journal', href: '/journal' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((l) => (
                <Link
                  key={l.name}
                  to={l.href}
                  className="text-[11px] xl:text-[12px] tracking-[0.04em] uppercase text-elijays-ink/80 hover:text-elijays-gold transition-colors whitespace-nowrap font-medium"
                >
                  {l.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2.5 shrink-0">
              <button type="button" onClick={() => setSearchOpen((v) => !v)} className={iconBox} aria-label="Search">
                <i className="fa-solid fa-magnifying-glass text-[14px]" aria-hidden />
              </button>
              <Link to="/wishlist" className={iconBox} aria-label="Wishlist">
                <i className="fa-regular fa-heart text-[14px]" aria-hidden />
              </Link>
              <Link to={isAuthenticated ? '/profile' : '/login'} className={iconBox} aria-label="Account">
                {isAuthenticated ? (
                  <span className="text-[9px] font-semibold">{userInitials(user)}</span>
                ) : (
                  <i className="fa-regular fa-user text-[14px]" aria-hidden />
                )}
              </Link>
              <Link to="/cart" className={`${iconBox} relative`} aria-label="Cart">
                <i className="fa-solid fa-bag-shopping text-[14px]" aria-hidden />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-elijays-gold text-white text-[8px] font-semibold flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {searchOpen && (
            <form onSubmit={submitSearch} className="pb-3 pt-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search suits, shirts, khakis…"
                className="w-full bg-white border border-elijays-ink/10 text-elijays-ink px-4 py-2.5 text-sm outline-none focus:border-elijays-gold placeholder:text-elijays-muted rounded-lg"
              />
            </form>
          )}
        </div>
      </header>

      {/* Mobile drawer — simple flat list, all items visible */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-white border-r border-elijays-ink/10 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <BrandLogo markClassName="h-9 w-9" />
              <button type="button" onClick={() => setIsOpen(false)} className={iconBox} aria-label="Close menu">
                <i className="fa-solid fa-xmark text-[15px]" aria-hidden />
              </button>
            </div>

            <div className="space-y-1">
              {NAV_PARENTS.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left py-3.5 text-elijays-ink border-b border-elijays-ink/5 text-[15px] font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {[
                { name: 'Journal', href: '/journal' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((l) => (
                <Link
                  key={l.name}
                  to={l.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left py-3.5 text-elijays-ink/80 border-b border-elijays-ink/5 text-[15px]"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
