import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section relative min-h-[50vh] md:min-h-[55vh] flex items-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/WhatsApp Image 2026-05-12 at 8.07.12 PM.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4">
              <div className="h-px w-10 bg-accent" />
              <p className="text-accent tracking-widest text-xs font-bold uppercase">Excellence in every stitch</p>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-secondary leading-[1.05] tracking-tight">
              Bespoke<br />
              <span className="text-accent italic font-light">Elegance.</span>
            </h1>
            
            <p className="text-base md:text-lg text-secondary max-w-xl font-light leading-relaxed">
              Experience the pinnacle of luxury tailoring and curated footwear. 
              Crafted for the modern gentleman who demands nothing less than perfection.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-10 pt-6">
              <Link 
                to="/products"
                className="bg-accent text-white px-12 py-5 text-xs font-bold tracking-widest hover:bg-accent/80 transition-all flex items-center space-x-4 group shadow-lg shadow-accent/20"
              >
                <span>DISCOVER COLLECTION</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="flex items-center space-x-5 group">
                <div className="w-16 h-16 rounded-full border border-accent/40 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent transition-all duration-500">
                  <Play size={20} className="text-accent group-hover:text-accent/80" />
                </div>
                <span className="text-secondary group-hover:text-accent text-xs font-bold tracking-widest uppercase transition-colors">WATCH FILM</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-10 bottom-20 origin-right rotate-90 hidden lg:block">
        <p className="text-accent/25 text-xs font-bold tracking-[0.8em]">ELIJAY'S · 2026</p>
      </div>
    </section>
  );
};

export default Hero;

