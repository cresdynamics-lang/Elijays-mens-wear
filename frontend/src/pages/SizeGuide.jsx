import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Shirt, User, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SizeGuide = () => {
  return (
    <div className="bg-primary min-h-screen font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Section */}
          <div className="relative mb-20 overflow-hidden bg-utility-gray/40 border border-utility-gray/60 p-12 md:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl text-secondary font-serif mb-6">Size Guide</h1>
              <p className="text-accent/80 text-lg md:text-xl max-w-2xl font-light">
                Find your perfect fit with our comprehensive size guide. Measurements are in centimeters.
              </p>
            </div>
          </div>

          {/* How to Measure */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl text-secondary font-serif mb-8">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: User,
                  title: 'Chest',
                  desc: 'Measure around the fullest part of your chest, keeping the tape measure horizontal.'
                },
                {
                  icon: Shirt,
                  title: 'Waist',
                  desc: 'Measure around your natural waistline, typically where your pants sit comfortably.'
                },
                {
                  icon: Ruler,
                  title: 'Length',
                  desc: 'Measure from the base of your neck down to your desired length.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-utility-gray/30 border border-utility-gray/60 p-6 hover:border-accent/40 transition-all"
                >
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mb-4">
                    <item.icon className="text-accent" size={24} />
                  </div>
                  <h3 className="text-lg text-secondary font-serif mb-2">{item.title}</h3>
                  <p className="text-secondary/70 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shirt Size Chart */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl text-secondary font-serif mb-8">Shirt Sizes</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-utility-gray/30 border border-utility-gray/60">
                <thead>
                  <tr className="border-b border-utility-gray/60">
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">SIZE</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">CHEST (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">WAIST (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">LENGTH (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">SLEEVE (CM)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'S', chest: '92-96', waist: '76-80', length: '68', sleeve: '62' },
                    { size: 'M', chest: '97-101', waist: '81-85', length: '70', sleeve: '64' },
                    { size: 'L', chest: '102-106', waist: '86-90', length: '72', sleeve: '66' },
                    { size: 'XL', chest: '107-111', waist: '91-95', length: '74', sleeve: '68' },
                    { size: 'XXL', chest: '112-116', waist: '96-100', length: '76', sleeve: '70' }
                  ].map((row, index) => (
                    <tr key={row.size} className="border-b border-utility-gray/40 hover:bg-utility-gray/40 transition-all">
                      <td className="p-4 text-secondary font-bold">{row.size}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.chest}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.waist}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.length}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Suit Size Chart */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl text-secondary font-serif mb-8">Suit Sizes</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-utility-gray/30 border border-utility-gray/60">
                <thead>
                  <tr className="border-b border-utility-gray/60">
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">SIZE</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">CHEST (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">WAIST (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">SHOULDER (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">INSEAM (CM)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: '38S', chest: '92-96', waist: '78-82', shoulder: '44', inseam: '76' },
                    { size: '40R', chest: '97-101', waist: '83-87', shoulder: '46', inseam: '81' },
                    { size: '42R', chest: '102-106', waist: '88-92', shoulder: '48', inseam: '81' },
                    { size: '44R', chest: '107-111', waist: '93-97', shoulder: '50', inseam: '81' },
                    { size: '46L', chest: '112-116', waist: '98-102', shoulder: '52', inseam: '86' }
                  ].map((row, index) => (
                    <tr key={row.size} className="border-b border-utility-gray/40 hover:bg-utility-gray/40 transition-all">
                      <td className="p-4 text-secondary font-bold">{row.size}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.chest}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.waist}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.shoulder}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trouser Size Chart */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl text-secondary font-serif mb-8">Trouser Sizes</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-utility-gray/30 border border-utility-gray/60">
                <thead>
                  <tr className="border-b border-utility-gray/60">
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">SIZE</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">WAIST (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">HIPS (CM)</th>
                    <th className="text-left p-4 text-accent text-xs font-bold tracking-wider">INSEAM (CM)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: '30', waist: '76', hips: '94', inseam: '81' },
                    { size: '32', waist: '81', hips: '99', inseam: '81' },
                    { size: '34', waist: '86', hips: '104', inseam: '81' },
                    { size: '36', waist: '91', hips: '109', inseam: '81' },
                    { size: '38', waist: '96', hips: '114', inseam: '81' }
                  ].map((row, index) => (
                    <tr key={row.size} className="border-b border-utility-gray/40 hover:bg-utility-gray/40 transition-all">
                      <td className="p-4 text-secondary font-bold">{row.size}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.waist}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.hips}</td>
                      <td className="p-4 text-secondary/80 text-sm">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/30 p-8">
            <h3 className="text-xl text-secondary font-serif mb-4">Size Tips</h3>
            <ul className="space-y-3 text-secondary/80 text-sm">
              <li className="flex items-start gap-3">
                <ArrowRight className="text-accent shrink-0" size={16} />
                <span>If you're between sizes, we recommend sizing up for a more comfortable fit</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-accent shrink-0" size={16} />
                <span>For bespoke orders, our tailors will take precise measurements during consultation</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-accent shrink-0" size={16} />
                <span>Consider your preferred fit - regular, slim, or relaxed when choosing sizes</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="text-accent shrink-0" size={16} />
                <span>Contact our support team if you need personalized size recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SizeGuide;
