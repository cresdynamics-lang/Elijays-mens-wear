import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { userInitials } from '../lib/format';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  const menuItems = [
    { name: 'New Arrivals', href: '/products?sort=newest' },
    {
      name: 'Clothing',
      subItems: [
        { name: 'Suits & Blazers', href: '/suits' },
        { name: 'Shirts', href: '/shirts' },
        { name: 'Trousers', href: '/trousers' },
        { name: 'Polo T-shirts', href: '/polo-t-shirts' },
        { name: 'Jackets', href: '/products?category=jackets' },
        { name: 'Sweaters', href: '/products?category=sweaters' },
      ],
    },
    {
      name: 'Accessories',
      subItems: [
        { name: 'Shoes', href: '/shoes' },
        { name: 'Belts & Ties', href: '/products?category=belts-ties' },
        { name: 'Caps & Hats', href: '/products?category=caps-hats' },
      ],
    },
    { name: 'The Journal', href: '/blog' },
  ];

  const handleLinkClick = (href) => {
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
          className="font-sans tracking-widest text-sm uppercase text-accent hover:text-accent/80 transition-colors duration-300"
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
              className="absolute top-full left-1/2 -translate-x-1/2 mt-4"
            >
              <div className="bg-primary shadow-2xl rounded-md border border-utility-gray/50 p-5 w-56">
                <div className="space-y-3">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleLinkClick(sub.href)}
                      className="block w-full text-left font-sans text-base text-secondary hover:text-accent transition-colors"
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
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' : 'bg-black backdrop-blur-sm'}`}>
        <div className="container mx-auto px-6 h-28 flex justify-between items-center">
          <div className="xl:hidden">
            <button onClick={() => setIsOpen(true)} className="text-secondary dark:text-secondary hover:text-accent">
              <Menu size={28} />
            </button>
          </div>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 xl:static xl:translate-x-0">
            <div className="h-12 md:h-14 w-12 md:w-14 rounded-full border-2 border-accent bg-white flex items-center justify-center overflow-hidden">
              <img src="/elijays-logo.png" alt="ELIJAY'S Men's Wear" className="h-10 md:h-12 w-auto object-contain" />
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-12">
            {menuItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-8 text-secondary">
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-accent/40 hover:border-accent hover:bg-accent/10 transition-all"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-primary" />}
            </button>
            <button className="hidden md:block hover:text-accent">
              <Search size={24} />
            </button>
            <div className="relative group">
              <Link to={isAuthenticated ? "/profile" : "/login"} className="block hover:text-accent">
                {isAuthenticated ? (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-utility-gray text-sm font-semibold text-secondary bg-utility-gray/50">
                    {userInitials(user)}
                  </span>
                ) : (
                  <User size={24} />
                )}
              </Link>
              {isAuthenticated && (
                <div className="absolute top-full right-0 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-primary border border-utility-gray/50 rounded-md shadow-2xl p-4 w-48">
                    <p className="font-sans text-sm text-secondary/70 mb-3 border-b border-utility-gray/50 pb-2">{user?.name || 'Profile'}</p>
                    <div className="space-y-2">
                      <Link to="/profile" className="block font-sans text-base text-secondary hover:text-accent">My Account</Link>
                      <button onClick={logout} className="flex items-center gap-2 font-sans text-base text-red-500/80 hover:text-red-500">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" className="relative hover:text-accent">
              <ShoppingBag size={24} />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent text-primary text-xs h-5 w-5 rounded-full flex items-center justify-center font-bold">
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
      <button onClick={onBack} className="font-sans text-base text-secondary/70 mb-8">
        &larr; Back to Main Menu
      </button>
      <div className="space-y-4">
        {item.subItems.map(sub => (
          <button
            key={sub.name}
            onClick={() => handleLinkClick(sub.href)}
            className="block w-full text-left font-sans text-2xl text-secondary hover:text-accent"
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
            <img src="/elijays-logo.png" alt="ELIJAY'S Men's Wear" className="h-12 w-12 rounded-full object-contain p-1" />
           <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-accent">
             <X size={28} />
           </button>
        </div>
        
        <div className="relative">
          <AnimatePresence>
            {openSubMenu ? (
              <SubMenu item={openSubMenu} onBack={() => setOpenSubMenu(null)} />
            ) : (
              <motion.div className="space-y-5">
                {menuItems.map(item =>
                  item.subItems ? (
                    <button
                      key={item.name}
                      onClick={() => setOpenSubMenu(item)}
                      className="flex justify-between items-center w-full text-left font-sans text-3xl text-secondary hover:text-accent"
                    >
                      {item.name}
                      <ChevronRight size={28} />
                    </button>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => handleLinkClick(item.href)}
                      className="block w-full text-left font-sans text-3xl text-secondary hover:text-accent"
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
