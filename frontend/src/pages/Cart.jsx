import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
 const { items, removeFromCart, updateQuantity, getTotal } = useCartStore();
 const { isAuthenticated } = useAuthStore();
 const navigate = useNavigate();

 const lineKey = (item) =>
 item.cartItemId ? `c-${item.cartItemId}` : `g-${item.productId}-${item.variantId}-${item.sizeLabel || ''}`;

 return (
 <div className="bg-primary min-h-screen">
 <Navbar />

 <main className="pt-28 pb-24">
 <div className="container mx-auto px-6 max-w-6xl">
 <div className="flex items-center space-x-4 mb-10">
  <button onClick={() => navigate(-1)} className="text-secondary hover:text-accent transition-colors duration-300">
 <ChevronLeft size={22} />
 </button>
 <span className="text-[10px] text-secondary/50 font-medium">Back</span>
 </div>
 <div className="flex flex-col lg:flex-row gap-14 lg:gap-16">
 <div className="lg:w-2/3">
 <div className="flex justify-between items-end mb-12 border-b border-white/6 pb-8">
 <h1 className="text-3xl md:text-4xl font-serif text-secondary tracking-tight">Shopping Bag</h1>
 <span className="text-[10px] font-semibold tracking-[0.28em] text-secondary/70 uppercase">
 {items.reduce((n, i) => n + i.quantity, 0)} Items
 </span>
 </div>

 {items.length === 0 ? (
 <div className="py-24 text-center border border-white/6 bg-utility-gray/30">
 <div className="w-20 h-20 bg-utility-gray rounded-full flex items-center justify-center mx-auto mb-8 border border-white/6">
 <ShoppingBag className="text-secondary" size={32} />
 </div>
 <p className="text-secondary mb-8 font-light italic text-sm tracking-wide">Your bag is currently empty.</p>
 <Link
 to="/products"
 className="btn-primary inline-block px-12 py-4 text-[10px] tracking-[0.22em]"
 >
 Start Shopping
 </Link>
 </div>
 ) : (
 <div className="space-y-10">
 <AnimatePresence>
 {items.map((item) => (
 <motion.div
 key={lineKey(item)}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
 className="flex flex-col sm:flex-row gap-8 p-6 sm:p-8 bg-utility-gray/40 border border-utility-gray/60 relative group hover:border-white/10 transition-all duration-500"
 >
 <div className="w-full sm:w-32 aspect-square bg-utility-gray overflow-hidden shrink-0 border border-white/6">
 <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
 </div>

 <div className="flex-1 flex flex-col justify-between">
 <div className="flex justify-between items-start">
 <div className="space-y-2.5">
  <p className="text-[10px] font-semibold tracking-[0.2em] text-accent/35 uppercase">
 {item.brandName || 'Bespoke'}
 </p>
 <h3 className="text-xl font-serif text-secondary tracking-snug">{item.name}</h3>
 <div className="flex flex-wrap gap-3 pt-3">
 <div className="text-[10px] font-semibold text-secondary bg-primary px-4 py-1.5 border border-white/8 rounded-full">
 Size: {item.sizeLabel || '—'}
 </div>
 <div className="text-[10px] font-semibold text-secondary bg-primary px-4 py-1.5 border border-white/8 rounded-full">
 Color: {item.variantValue || '—'}
 </div>
 </div>
 </div>
 <p className="text-lg font-light text-secondary italic tracking-wide">KSh {item.price.toLocaleString()}</p>
 </div>

 <div className="flex justify-between items-center mt-8">
 <div className="flex items-center bg-primary border border-white/8 px-3 py-2 rounded-lg">
 <button
 type="button"
 onClick={() => updateQuantity(item, item.quantity - 1)}
  className="p-1 text-secondary hover:text-accent transition-colors duration-200"
 >
 <Minus size={14} />
 </button>
 <span className="px-5 text-[10px] font-semibold text-secondary w-10 text-center">{item.quantity}</span>
 <button
 type="button"
 onClick={() => updateQuantity(item, item.quantity + 1)}
  className="p-1 text-secondary hover:text-accent transition-colors duration-200"
 >
 <Plus size={14} />
 </button>
 </div>

 <button
 type="button"
 onClick={() => removeFromCart(item)}
 className="text-secondary hover:text-red-600 transition-colors duration-300 p-2"
 >
 <Trash2 size={17} />
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}
 </div>

 <div className="lg:w-1/3">
 <div className="bg-utility-gray/50 p-8 sm:p-10 border border-white/6 sticky top-28 space-y-10 backdrop-blur-xl">
 <h2 className="text-xl md:text-2xl font-serif text-secondary border-b border-utility-gray/60 pb-6 tracking-tight">Summary</h2>

 <div className="space-y-6">
 <div className="flex justify-between text-[10px] font-semibold tracking-wider">
 <span className="text-secondary uppercase">Subtotal</span>
 <span className="text-secondary font-bold">KSh {getTotal().toLocaleString()}</span>
 </div>
 <div className="flex justify-between text-[10px] font-semibold tracking-wider">
 <span className="text-secondary uppercase">Shipping</span>
 <span className="text-secondary/70 font-light lowercase normal-case">KSh 250 at checkout</span>
 </div>
 <div className="pt-6 border-t border-utility-gray/60 flex justify-between items-center">
 <span className="text-xl font-serif text-secondary tracking-tight">Total</span>
 <span className="text-2xl md:text-3xl font-serif text-secondary italic tracking-tight">KSh {getTotal().toLocaleString()}</span>
 </div>
 </div>

 <div className="space-y-4 pt-2">
 <motion.button
 whileHover={{ scale: 1.02 }}
 whileTap={{ scale: 0.98 }}
 type="button"
 disabled={items.length === 0}
 onClick={() => navigate('/checkout')}
 className="btn-primary w-full py-5 px-6 text-[10px] tracking-[0.22em] inline-flex items-center justify-center space-x-4 disabled:opacity-30 disabled:cursor-not-allowed"
 >
 <span>Proceed to Checkout</span>
 <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
 </motion.button>
 <p className="text-[9px] text-secondary text-center tracking-[0.28em] font-semibold uppercase">
 Guest checkout available — sign in optional
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </main>

 <Footer />
 </div>
 );
};

export default Cart;
