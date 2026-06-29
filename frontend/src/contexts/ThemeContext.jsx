import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    console.log('%c[Theme] Changing to:', 'color: #D4AF37; font-weight: bold;', theme);
    console.log('[Theme] Before - html classes:', root.className);
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    console.log('[Theme] After - html classes:', root.className);
    console.log('[Theme] --color-primary:', getComputedStyle(root).getPropertyValue('--color-primary').trim());
    console.log('[Theme] --color-secondary:', getComputedStyle(root).getPropertyValue('--color-secondary').trim());
    console.log('[Theme] body bg:', getComputedStyle(document.body).backgroundColor);
    console.log('[Theme] body color:', getComputedStyle(document.body).color);
    
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      console.log('%c[Theme] Toggle:', 'color: #D4AF37;', prev, '→', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
