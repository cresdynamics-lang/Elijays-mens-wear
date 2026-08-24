import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="bg-white text-elijays-ink min-h-screen font-sans">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
