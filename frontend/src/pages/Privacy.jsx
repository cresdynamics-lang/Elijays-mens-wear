import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, User, Database, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="bg-primary min-h-screen font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Hero Section */}
          <div className="relative mb-20 overflow-hidden bg-utility-gray/40 border border-utility-gray/60 p-12 md:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl text-secondary font-serif mb-6">Privacy Policy</h1>
              <p className="text-accent/80 text-lg md:text-xl max-w-2xl font-light">
                Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {/* Information We Collect */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-utility-gray/30 border border-utility-gray/60 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <Database className="text-accent" size={28} />
                <h2 className="text-2xl text-secondary font-serif">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-secondary/80 text-sm leading-relaxed">
                <p>We collect information you provide directly, including:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Name, email address, and phone number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Shipping and billing addresses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Payment information (processed securely)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Order history and preferences</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* How We Use Your Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-utility-gray/30 border border-utility-gray/60 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <Eye className="text-accent" size={28} />
                <h2 className="text-2xl text-secondary font-serif">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-secondary/80 text-sm leading-relaxed">
                <p>We use your information to:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Process and fulfill your orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Send order confirmations and shipping updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Provide customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Improve our products and services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Send promotional communications (with your consent)</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Data Security */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-utility-gray/30 border border-utility-gray/60 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <Lock className="text-accent" size={28} />
                <h2 className="text-2xl text-secondary font-serif">Data Security</h2>
              </div>
              <div className="space-y-4 text-secondary/80 text-sm leading-relaxed">
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>SSL encryption for all data transmissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Secure payment processing through trusted providers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Restricted access to personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Regular security audits and updates</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Your Rights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-utility-gray/30 border border-utility-gray/60 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <User className="text-accent" size={28} />
                <h2 className="text-2xl text-secondary font-serif">Your Rights</h2>
              </div>
              <div className="space-y-4 text-secondary/80 text-sm leading-relaxed">
                <p>You have the right to:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Access your personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Correct inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Request deletion of your data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Opt-out of marketing communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Withdraw consent at any time</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Third-Party Services */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-utility-gray/30 border border-utility-gray/60 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <Globe className="text-accent" size={28} />
                <h2 className="text-2xl text-secondary font-serif">Third-Party Services</h2>
              </div>
              <div className="space-y-4 text-secondary/80 text-sm leading-relaxed">
                <p>We may share your information with trusted third parties for:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Payment processing (M-Pesa, card processors)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Shipping and delivery services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Email and messaging services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Analytics and website optimization</span>
                  </li>
                </ul>
                <p className="mt-4">We never sell your personal information to third parties.</p>
              </div>
            </motion.section>

            {/* Contact Us */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <Shield className="text-accent" size={28} />
                <h2 className="text-2xl text-secondary font-serif">Contact Us</h2>
              </div>
              <div className="space-y-4 text-secondary/80 text-sm leading-relaxed">
                <p>If you have questions about this privacy policy or your personal information, please contact us:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Email: contact@elijays.co.ke</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Phone: 0721-844475</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>WhatsApp: 0721-844475</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Last Updated */}
            <div className="text-center text-secondary/50 text-xs">
              <p>Last updated: July 1, 2026</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
