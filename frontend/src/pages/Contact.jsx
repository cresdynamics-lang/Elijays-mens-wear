import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CONTACT_PHONE, CONTACT_EMAIL } from '../seo/seoData';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to your backend
    const whatsappMessage = `*New Contact Form Submission*\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    window.open(`https://wa.me/254721844475?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <div className="bg-primary min-h-screen font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <div className="relative mb-20 overflow-hidden bg-utility-gray/40 border border-utility-gray/60 p-12 md:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl text-secondary font-serif mb-6">Contact Us</h1>
              <p className="text-accent/80 text-lg md:text-xl max-w-2xl font-light">
                Have a question or need assistance? We'd love to hear from you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl text-secondary font-serif">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-accent/80 tracking-[0.2em] font-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-primary border border-utility-gray/60 py-4 px-5 text-secondary text-sm outline-none focus:border-accent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-accent/80 tracking-[0.2em] font-bold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-primary border border-utility-gray/60 py-4 px-5 text-secondary text-sm outline-none focus:border-accent transition-all"
                      placeholder="0721 844 475"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-accent/80 tracking-[0.2em] font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-primary border border-utility-gray/60 py-4 px-5 text-secondary text-sm outline-none focus:border-accent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-accent/80 tracking-[0.2em] font-bold">Subject</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-primary border border-utility-gray/60 py-4 px-5 text-secondary text-sm outline-none focus:border-accent transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Bespoke Services">Bespoke Services</option>
                    <option value="Shipping & Delivery">Shipping & Delivery</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-accent/80 tracking-[0.2em] font-bold">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-primary border border-utility-gray/60 py-4 px-5 text-secondary text-sm outline-none focus:border-accent transition-all resize-y"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-white py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-accent/80 transition-all flex items-center justify-center gap-3"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl text-secondary font-serif">Contact Information</h2>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
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
                  initial={{ opacity: 0, x: 20 }}
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
                  initial={{ opacity: 0, x: 20 }}
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
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 p-8 text-center">
                <MessageCircle className="text-accent mx-auto mb-4" size={40} />
                <h3 className="text-xl text-secondary font-serif mb-3">Quick Response</h3>
                <p className="text-secondary/70 mb-6 text-sm">
                  For faster assistance, chat with us directly on WhatsApp
                </p>
                <a
                  href="https://wa.me/254721844475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-accent/80 transition-all"
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
