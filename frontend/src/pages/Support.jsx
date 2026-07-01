import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CONTACT_PHONE, CONTACT_EMAIL, SITE_URL } from '../seo/seoData';

const Support = () => {
  return (
    <div className="bg-primary min-h-screen font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <div className="relative mb-20 overflow-hidden bg-utility-gray/40 border border-utility-gray/60 p-12 md:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl text-secondary font-serif mb-6">Support Center</h1>
              <p className="text-accent/80 text-lg md:text-xl max-w-2xl font-light">
                We're here to help you with any questions about your orders, products, or services.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl text-secondary font-serif">Get in Touch</h2>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6 hover:border-accent/40 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                      <Phone className="text-accent" size={20} />
                    </div>
                    <div>
                      <h3 className="text-accent text-sm font-bold mb-2">Phone</h3>
                      <p className="text-secondary text-lg">0721-844475</p>
                      <p className="text-secondary/60 text-sm mt-1">Mon-Sat, 9am-6pm EAT</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6 hover:border-accent/40 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                      <Mail className="text-accent" size={20} />
                    </div>
                    <div>
                      <h3 className="text-accent text-sm font-bold mb-2">Email</h3>
                      <p className="text-secondary text-lg">{CONTACT_EMAIL}</p>
                      <p className="text-secondary/60 text-sm mt-1">We respond within 24 hours</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6 hover:border-accent/40 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                      <MapPin className="text-accent" size={20} />
                    </div>
                    <div>
                      <h3 className="text-accent text-sm font-bold mb-2">Location</h3>
                      <p className="text-secondary text-lg">ELIJAY'S Men's Wear</p>
                      <p className="text-secondary/60 text-sm mt-1">Nairobi, Kenya</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6 hover:border-accent/40 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                      <Clock className="text-accent" size={20} />
                    </div>
                    <div>
                      <h3 className="text-accent text-sm font-bold mb-2">Business Hours</h3>
                      <p className="text-secondary text-lg">Monday - Saturday</p>
                      <p className="text-secondary/60 text-sm mt-1">9:00 AM - 6:00 PM EAT</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl text-secondary font-serif">Quick Links</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'Contact Us', desc: 'Send us a direct message', link: '/contact' },
                  { title: 'Bespoke Services', desc: 'Custom tailoring inquiries', link: '/bespoke' },
                  { title: 'Shipping & Returns', desc: 'Delivery and return policies', link: '/shipping' },
                  { title: 'Size Guide', desc: 'Find your perfect fit', link: '/size-guide' },
                  { title: 'Privacy Policy', desc: 'How we protect your data', link: '/privacy' },
                ].map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block bg-utility-gray/30 border border-utility-gray/60 p-6 hover:border-accent/40 hover:bg-utility-gray/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-accent text-sm font-bold mb-1">{item.title}</h3>
                        <p className="text-secondary/60 text-sm">{item.desc}</p>
                      </div>
                      <div className="w-8 h-8 bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                        <span className="text-accent group-hover:text-white">→</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 p-12 text-center">
            <MessageCircle className="text-accent mx-auto mb-4" size={48} />
            <h2 className="text-2xl md:text-3xl text-secondary font-serif mb-4">Chat with us on WhatsApp</h2>
            <p className="text-secondary/70 mb-8 max-w-xl mx-auto">
              Get instant support for your orders, product inquiries, or any questions you may have.
            </p>
            <a
              href={`https://wa.me/254721844475`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-accent/80 transition-all"
            >
              <MessageCircle size={18} />
              Start Chat
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
