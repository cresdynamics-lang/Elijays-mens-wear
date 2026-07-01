import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, RefreshCw, Clock, MapPin, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Shipping = () => {
  return (
    <div className="bg-primary min-h-screen font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <div className="relative mb-20 overflow-hidden bg-utility-gray/40 border border-utility-gray/60 p-12 md:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl text-secondary font-serif mb-6">Shipping & Returns</h1>
              <p className="text-accent/80 text-lg md:text-xl max-w-2xl font-light">
                Everything you need to know about delivery, returns, and our satisfaction guarantee.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Shipping Information */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <Truck className="text-accent" size={32} />
                <h2 className="text-2xl md:text-3xl text-secondary font-serif">Shipping Policy</h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6"
                >
                  <h3 className="text-accent text-sm font-bold mb-3 flex items-center gap-2">
                    <MapPin size={16} />
                    Delivery Zones
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-utility-gray/40">
                      <span className="text-secondary text-sm">Nairobi CBD</span>
                      <span className="text-accent text-sm font-bold">KSh 300</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-utility-gray/40">
                      <span className="text-secondary text-sm">Nairobi Outside CBD</span>
                      <span className="text-accent text-sm font-bold">KSh 500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary text-sm">Outside Nairobi</span>
                      <span className="text-accent text-sm font-bold">KSh 800</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6"
                >
                  <h3 className="text-accent text-sm font-bold mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    Delivery Timeline
                  </h3>
                  <ul className="space-y-2 text-secondary/80 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Nairobi CBD: 1-2 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Nairobi Outside CBD: 2-3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Outside Nairobi: 3-5 business days</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6"
                >
                  <h3 className="text-accent text-sm font-bold mb-3 flex items-center gap-2">
                    <Package size={16} />
                    Order Processing
                  </h3>
                  <p className="text-secondary/80 text-sm leading-relaxed">
                    Orders are processed within 24-48 hours. You will receive a confirmation email with tracking information once your order ships.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Returns Information */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <RefreshCw className="text-accent" size={32} />
                <h2 className="text-2xl md:text-3xl text-secondary font-serif">Returns & Exchanges</h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6"
                >
                  <h3 className="text-accent text-sm font-bold mb-3 flex items-center gap-2">
                    <Shield size={16} />
                    Return Policy
                  </h3>
                  <p className="text-secondary/80 text-sm leading-relaxed mb-4">
                    We accept returns within 7 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached.
                  </p>
                  <ul className="space-y-2 text-secondary/80 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Full refund or exchange available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Return shipping fee: KSh 300</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Refund processed within 5-7 business days</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6"
                >
                  <h3 className="text-accent text-sm font-bold mb-3">Non-Returnable Items</h3>
                  <ul className="space-y-2 text-secondary/80 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Custom/bespoke orders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Items marked as final sale</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full mt-2" />
                      <span>Undergarments and socks</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6"
                >
                  <h3 className="text-accent text-sm font-bold mb-3">How to Initiate a Return</h3>
                  <ol className="space-y-2 text-secondary/80 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">1.</span>
                      <span>Contact us via WhatsApp or email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">2.</span>
                      <span>Provide order number and reason for return</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">3.</span>
                      <span>Receive return authorization and shipping label</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">4.</span>
                      <span>Package item and ship back to us</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">5.</span>
                      <span>Receive refund or exchange once processed</span>
                    </li>
                  </ol>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 p-8">
            <h3 className="text-xl text-secondary font-serif mb-4">Important Notes</h3>
            <ul className="space-y-3 text-secondary/80 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-accent">•</span>
                <span>Delivery times may vary during peak seasons or holidays</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">•</span>
                <span>We recommend trying on items carefully before removing tags</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">•</span>
                <span>For bespoke orders, please refer to our Bespoke Services page for specific policies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">•</span>
                <span>Contact our support team for any shipping or return inquiries</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shipping;
