import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import { inventoryAPI } from '../../services/api';

const isUnpublished = (p) => {
 const live = p.on_website ?? (p.website_product_id && p.website_published);
 return !live;
};

const PickInventoryProductModal = ({ open, onClose, onSelect }) => {
 const [items, setItems] = useState([]);
 const [loading, setLoading] = useState(false);
 const [category, setCategory] = useState('');
 const [search, setSearch] = useState('');
 const [selectedId, setSelectedId] = useState('');

 useEffect(() => {
 if (!open) return;
 setLoading(true);
 setSelectedId('');
 setCategory('');
 setSearch('');
 inventoryAPI
 .stockLevels()
 .then((res) => setItems(res.data?.data || []))
 .catch(() => setItems([]))
 .finally(() => setLoading(false));
 }, [open]);

 const categories = useMemo(() => {
 const names = new Set();
 for (const p of items) {
 if (isUnpublished(p) && p.category) names.add(p.category);
 }
 return [...names].sort();
 }, [items]);

 const unpublished = useMemo(() => {
 const q = search.trim().toLowerCase();
 return items.filter((p) => {
 if (!isUnpublished(p)) return false;
 if (category && p.category !== category) return false;
 if (!q) return true;
 return (
 p.name?.toLowerCase().includes(q) ||
 p.sku?.toLowerCase().includes(q) ||
 p.category?.toLowerCase().includes(q)
 );
 });
 }, [items, category, search]);

 if (!open) return null;

 const handleContinue = () => {
 if (!selectedId) return;
 onSelect(selectedId);
 };

 return (
 <div className="fixed inset-0 z-[60] overflow-y-auto">
 <button
 type="button"
 aria-label="Close"
 className="fixed inset-0 bg-primary backdrop-blur-sm"
 onClick={onClose}
 />
 <div className="relative flex min-h-full items-center justify-center p-4 py-8">
 <motion.div
 initial={{ opacity: 0, scale: 0.96 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative w-full max-w-lg max-h-[min(90dvh,640px)] flex flex-col bg-utility-gray border border-utility-gray/60 rounded-2xl shadow-2xl"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="shrink-0 flex justify-between items-center p-5 border-b border-utility-gray/60">
 <div>
 <h3 className="font-serif font-bold text-secondary text-lg">Add product from inventory</h3>
 <p className="text-[11px] text-secondary/50 mt-1">
 Choose an inventory item that is not live on the website yet. Add images and publish when ready.
 </p>
 </div>
 <button type="button" onClick={onClose} className="text-secondary/60 hover:text-accent-500">
 <X size={20} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <label className="space-y-1">
 <span className="text-[10px] font-bold text-secondary/50">Category</span>
 <div className="relative">
 <select
 value={category}
 onChange={(e) => {
 setCategory(e.target.value);
 setSelectedId('');
 }}
 className="w-full appearance-none bg-primary border border-utility-gray/60 rounded-xl px-3 py-2.5 pr-9 text-sm text-secondary"
 >
 <option value="">All categories</option>
 {categories.map((c) => (
 <option key={c} value={c}>{c}</option>
 ))}
 </select>
 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60 pointer-events-none" />
 </div>
 </label>
 <label className="space-y-1">
 <span className="text-[10px] font-bold text-secondary/50">Search</span>
 <div className="relative">
 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60" />
 <input
 type="search"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Name or SKU…"
 className="w-full bg-primary border border-utility-gray/60 rounded-xl pl-9 pr-3 py-2.5 text-sm text-secondary"
 />
 </div>
 </label>
 </div>

 <label className="block space-y-1">
 <span className="text-[10px] font-bold text-secondary/50">
 Product ({unpublished.length} not published)
 </span>
 <div className="relative">
 <select
 value={selectedId}
 onChange={(e) => setSelectedId(e.target.value)}
 disabled={loading || unpublished.length === 0}
 className="w-full appearance-none bg-primary border border-utility-gray/60 rounded-xl px-3 py-3 pr-9 text-sm text-secondary disabled:opacity-50"
 >
 <option value="">
 {loading ? 'Loading inventory…' : unpublished.length ? 'Select a product…' : 'No unpublished items in this category'}
 </option>
 {unpublished.map((p) => (
 <option key={p.id} value={p.id}>
 {p.name} — Shop {p.currentQty ?? 0} · Store {p.storeQty ?? 0}
 {p.sku ? ` · ${p.sku}` : ''}
 </option>
 ))}
 </select>
 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60 pointer-events-none" />
 </div>
 </label>
 </div>

 <div className="shrink-0 p-5 border-t border-utility-gray/60 flex gap-3">
 <button
 type="button"
 onClick={onClose}
 className="flex-1 py-3 border border-utility-gray/60 text-accent-400 rounded-xl text-sm font-medium"
 >
 Cancel
 </button>
 <button
 type="button"
 disabled={!selectedId}
 onClick={handleContinue}
 className="flex-1 py-3 bg-accent-600 text-base-950 rounded-xl text-sm font-bold disabled:opacity-40"
 >
 Continue
 </button>
 </div>
 </motion.div>
 </div>
 </div>
 );
};

export default PickInventoryProductModal;
