import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User, LogOut, ChevronRight, Phone, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { userInitials } from '../lib/format';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    {
      name: 'Collections',
      subItems: [
        { name: 'Suits & Blazers', href: '/suits' },
        { name: 'Shirts', href: '/shirts' },
        { name: 'Trousers', href: '/trousers' },
        { name: 'Polo T-shirts', href: '/polo-t-shirts' },
        { name: 'Jackets', href: '/products?category=jackets' },
        { name: 'Sweaters', href: '/products?category=sweaters' },
      ],
    },
    { name: 'Blog', href: '/blog' },
  ];

  const handleLinkClick = (href) => {
    if (href === '#') return;
    navigate(href);
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const NavLink = ({ item }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div
        className="relative"
        onMouseEnter={() => hasSubItems && setOpenDropdown(item.name)}
        onMouseLeave={() => hasSubItems && setOpenDropdown(null)}
      >
        <button
          onClick={() => !hasSubItems && handleLinkClick(item.href)}
          className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-white/80 hover:text-accent transition-colors duration-300"
        >
          {item.name}
        </button>
        <AnimatePresence>
          {hasSubItems && openDropdown === item.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[60]"
            >
              <div className="bg-utility-gray border border-white/15 rounded-md shadow-2xl p-5 w-56">
                <div className="space-y-3">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleLinkClick(sub.href)}
                      className="block w-full text-left font-sans text-sm text-white/80 hover:text-accent transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#0B0B0B] border-b border-white/10 relative z-[55]">
        <div className="container mx-auto px-6 flex justify-between items-center py-2.5">
          <div className="flex items-center gap-2 text-[#888] text-[10px] font-medium tracking-widest uppercase">
            <span>10% off your next order. Use code: MENSWEAR01</span>
          </div>
          <div className="flex items-center gap-2 text-[#888] text-[10px] cursor-pointer hover:text-[#8A8A6B] transition-colors font-medium tracking-widest uppercase">
            <Globe size={12} className="text-[#8A8A6B]" />
            <span>Region</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <header
        className={`relative w-full z-[50] transition-all duration-500 ${
          scrolled
            ? 'bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]'
            : 'bg-[#0B0B0B]/80 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-6 h-[72px] flex justify-between items-center">
          {/* Logo on the LEFT */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3">
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-accent bg-primary flex items-center justify-center overflow-hidden">
              <img src="/elijays-logo.jpeg" alt="ELIJAY'S Men's Wear" className="h-10 md:h-12 w-auto object-contain" />
            </div>
            <span className="hidden md:block font-serif text-lg md:text-xl text-white tracking-wide">Elijay's Men's Wear</span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden xl:flex items-center gap-12">
            {menuItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-7 text-white/80">
            <div className="xl:hidden">
              <button onClick={() => setIsOpen(true)} className="text-white/80 hover:text-accent">
                <Menu size={24} />
              </button>
            </div>
            <button onClick={() => navigate('/products')} className="hidden md:flex hover:text-accent transition-colors">
              <Search size={20} />
            </button>
            <div className="relative group">
              <Link to={isAuthenticated ? "/profile" : "/login"} className="block hover:text-accent transition-colors">
                {isAuthenticated ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white">
                    {userInitials(user)}
                  </span>
                ) : (
                  <User size={20} />
                )}
              </Link>
              {isAuthenticated && (
                <div className="absolute top-full right-0 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                  <div className="bg-utility-gray border border-white/15 rounded-md shadow-2xl p-4 w-48">
                    <p className="font-sans text-sm text-white/70 mb-3 border-b border-white/10 pb-2">{user?.name || 'Profile'}</p>
                    <div className="space-y-2">
                      <Link to="/profile" className="block font-sans text-sm text-white/80 hover:text-accent">My Account</Link>
                      <button onClick={logout} className="flex items-center gap-2 font-sans text-sm text-red-400/90 hover:text-red-400">
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" className="relative hover:text-accent transition-colors">
              <ShoppingBag size={20} />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-accent text-primary text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && <MobileMenu setIsOpen={setIsOpen} menuItems={menuItems} handleLinkClick={handleLinkClick} />}
      </AnimatePresence>
    </>
  );
};

const MobileMenu = ({ setIsOpen, menuItems, handleLinkClick }) => {
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const SubMenu = ({ item, onBack }) => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      className="absolute inset-0 bg-primary p-6"
    >
      <button onClick={onBack} className="font-sans text-sm text-white/70 mb-8">
        &larr; Back to Main Menu
      </button>
      <div className="space-y-5">
        {item.subItems.map(sub => (
          <button
            key={sub.name}
            onClick={() => handleLinkClick(sub.href)}
            className="block w-full text-left font-sans text-2xl text-white/80 hover:text-accent"
          >
            {sub.name}
          </button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] xl:hidden"
    >
      <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="relative w-[85%] max-w-md h-full bg-primary p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-12">
            <div className="h-10 w-10 rounded-full border-2 border-accent bg-primary flex items-center justify-center overflow-hidden">
              <img src="/elijays-logo.jpeg" alt="ELIJAY'S Men's Wear" className="h-8 w-auto object-contain" />
            </div>
           <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-accent">
             <X size={24} />
           </button>
        </div>

        <div className="relative">
          <AnimatePresence>
            {openSubMenu ? (
              <SubMenu item={openSubMenu} onBack={() => setOpenSubMenu(null)} />
            ) : (
              <motion.div className="space-y-6">
                {menuItems.map(item =>
                  item.subItems ? (
                    <button
                      key={item.name}
                      onClick={() => setOpenSubMenu(item)}
                      className="flex justify-between items-center w-full text-left font-sans text-3xl text-white/80 hover:text-accent"
                    >
                      {item.name}
                      <ChevronRight size={24} />
                    </button>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => handleLinkClick(item.href)}
                      className="block w-full text-left font-sans text-3xl text-white/80 hover:text-accent"
                    >
                      {item.name}
                    </button>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;
