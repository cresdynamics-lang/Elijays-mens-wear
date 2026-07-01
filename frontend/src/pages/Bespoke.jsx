import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Ruler, Shirt, Award, MessageCircle, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Bespoke = () => {
  return (
    <div className="bg-primary min-h-screen font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <div className="relative mb-20 overflow-hidden bg-utility-gray/40 border border-utility-gray/60 p-12 md:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl text-secondary font-serif mb-6">Bespoke Services</h1>
              <p className="text-accent/80 text-lg md:text-xl max-w-2xl font-light">
                Experience the art of custom tailoring. Our master craftsmen create garments that fit your unique style and measurements.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Scissors,
                title: 'Custom Suits',
                desc: 'Handcrafted suits made from premium fabrics with precise measurements for the perfect fit.',
                features: ['Italian fabrics', 'Hand-stitched details', 'Multiple fittings', 'Lifetime alterations']
              },
              {
                icon: Shirt,
                title: 'Made-to-Measure Shirts',
                desc: 'Custom shirts tailored to your exact specifications with premium cotton and linen options.',
                features: ['100+ fabric options', 'Custom collars & cuffs', 'Monogramming available', 'Perfect fit guarantee']
              },
              {
                icon: Ruler,
                title: 'Formal Wear',
                desc: 'Elegant tuxedos and formal attire for weddings, galas, and special occasions.',
                features: ['Classic & modern styles', 'Premium wool blends', 'Accessories included', 'Express service available']
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-utility-gray/30 border border-utility-gray/60 p-8 hover:border-accent/40 transition-all group"
              >
                <div className="w-16 h-16 bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all">
                  <service.icon className="text-accent" size={32} />
                </div>
                <h3 className="text-xl text-secondary font-serif mb-3">{service.title}</h3>
                <p className="text-secondary/70 text-sm mb-6 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-xs text-accent/80 flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-20">
            <h2 className="text-3xl text-secondary font-serif mb-12 text-center">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Consultation', desc: 'Meet with our tailors to discuss your style preferences and requirements.' },
                { step: '02', title: 'Measurements', desc: 'Precise measurements taken by our expert tailors for the perfect fit.' },
                { step: '03', title: 'Fabric Selection', desc: 'Choose from our curated collection of premium fabrics and materials.' },
                { step: '04', title: 'Fitting & Delivery', desc: 'Multiple fittings ensure perfection, followed by final delivery.' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-6xl text-accent/20 font-serif mb-4">{item.step}</div>
                  <h3 className="text-lg text-secondary font-serif mb-3">{item.title}</h3>
                  <p className="text-secondary/60 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-utility-gray/30 border border-utility-gray/60 p-12 mb-20">
            <div className="flex items-center gap-4 mb-8">
              <Award className="text-accent" size={40} />
              <h2 className="text-3xl text-secondary font-serif">Why Choose ELIJAY'S Bespoke</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'Master tailors with 20+ years of experience',
                'Premium fabrics sourced from Italy and England',
                'Personalized service from consultation to delivery',
                'Lifetime alterations on all bespoke garments',
                'Quick turnaround times without compromising quality',
                'Competitive pricing for luxury custom tailoring'
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <p className="text-secondary/80 text-sm">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 p-12 text-center">
            <h2 className="text-3xl text-secondary font-serif mb-4">Ready to Experience Bespoke Excellence?</h2>
            <p className="text-secondary/70 mb-8 max-w-xl mx-auto">
              Schedule a consultation with our master tailors and begin your journey to perfectly fitted garments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/254721844475"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-accent text-white px-10 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-accent/80 transition-all"
              >
                <MessageCircle size={18} />
                Book Consultation
              </a>
              <a
                href="tel:0721844475"
                className="inline-flex items-center justify-center gap-3 border border-accent text-accent px-10 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-accent hover:text-white transition-all"
              >
                <Phone size={18} />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Bespoke;
