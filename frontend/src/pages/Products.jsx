import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useCartStore } from '../store/useCartStore';
import { getPremiumImage } from '../utils/productImages';
import { catalogueAPI, productAPI, adminCategoryAPI } from '../services/api';
import { buildBreadcrumbSchema, categoryFallbackIntro, routeSeo } from '../seo/seoData';
import ProductCard from '../components/product/ProductCard';
import { DUMMY_PRODUCTS } from '../utils/dummyData';

const categoryPages = ['polo-t-shirts', 'shirts', 'suits', 'trousers', 'linen'];
const beltProductSlugs = new Set([
 'black-leather-belt-set',
 'base-brown-leather-belt-set',
]);

const isBeltCategory = (value) => {
 const normalized = String(value || '').toLowerCase();
 return normalized.includes('belt') || normalized.includes('tie');
};

const CATEGORY_DATA = [
 { id: 'All', name: 'All', sub: [] },
 { id: 'gifts-accessories', name: 'Gifts & Accessories', sub: ['Gifts & Accessories'] },
 { id: 'clothing-apparel', name: 'Clothing & Apparel', sub: ['Clothing & Apparel'] },
 { id: 'polo-t-shirts', name: 'Polo T-shirts', sub: ['Knitted Polos', 'Polos'] },
 { id: 'trousers', name: 'Trousers', sub: ['Khaki', 'Formal', 'Chino', 'Jeans', 'Gurkha'] },
 { id: 'shirts', name: 'Shirts', sub: ['Formal shirts', 'Casual', 'Presidential'] },
 { id: 'suits', name: 'Suits', sub: ['Two piece', 'Three piece'] },
 { id: 'blazers', name: 'Blazers', sub: ['Modern', 'Casual', 'Classic'] },
 { id: 'track-suits', name: 'Track Suits', sub: [] },
 { id: 'jackets', name: 'Jackets', sub: ['Jackets', 'Half jackets'] },
 { id: 'linen', name: 'Linen', sub: ['Linen Set', 'Linen Trousers', 'Linen shirts', 'Linen shorts'] },
 { id: 'caps-hats', name: 'Caps & Hats', sub: [] },
 { id: 'belts-ties', name: 'Belts & Ties', sub: [] },
 { id: 'sweaters', name: 'Sweaters', sub: [] },
 { id: 't-shirts', name: 'T-shirts', sub: ['Sweat-shirts', 'Round-neck T-shirts', 'V-neck T-shirts'] },
];

const normalizeName = (value) => String(value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const orderDatabaseCategories = (categories) => {
 const ordered = CATEGORY_DATA.slice(1)
 .map((canonical) => {
 const fromDatabase = categories.find((category) => (
 normalizeName(category.id) === normalizeName(canonical.id) ||
 normalizeName(category.name) === normalizeName(canonical.name)
 ));

 if (!fromDatabase) return null;

 const databaseSubs = fromDatabase.sub || [];
 const orderedSubs = [
 ...canonical.sub.filter((sub) => databaseSubs.some((dbSub) => normalizeName(dbSub) === normalizeName(sub))),
 ...databaseSubs.filter((dbSub) => !canonical.sub.some((sub) => normalizeName(sub) === normalizeName(dbSub))),
 ];

 return {
 id: fromDatabase.id || canonical.id,
 name: fromDatabase.name || canonical.name,
 sub: orderedSubs.length ? orderedSubs : canonical.sub,
 };
 })
 .filter(Boolean);

 return ordered.length ? [{ id: 'All', name: 'All', sub: [] }, ...ordered] : CATEGORY_DATA;
};

const matchesText = (value, target) => (value || '').toLowerCase() === (target || '').toLowerCase();

const filterCatalogueProducts = (allProducts, category, sub) => {
 const beltOnly = isBeltCategory(category);
 return allProducts.filter((product) => {
 if (beltOnly) {
 const slug = String(product.slug || '').toLowerCase();
 const name = String(product.name || '').toLowerCase();
 const categoryText = [
 product.category_slug,
 product.category_name,
 product.parent_category_slug,
 product.parent_category_name,
 product.subcategory,
 ]
 .filter(Boolean)
 .join(' ')
 .toLowerCase();
 const matchesBeltContent =
 beltProductSlugs.has(slug) ||
 /belt|tie/.test(slug) ||
 /belt|tie/.test(name) ||
 /belt|tie/.test(categoryText);

 if (!matchesBeltContent) return false;
 }

 const productCategory = product.category_slug || product.category_name;
 const parentCategory = product.parent_category_slug || product.parent_category_name;

 const matchesCategory = category === 'All' || [
 productCategory,
 parentCategory,
 product.category_name,
 product.parent_category_name,
 ].some((value) => matchesText(value, category));

 const matchesSub = sub === 'All' || [
 productCategory,
 product.category_name,
 product.subcategory,
 ].some((value) => matchesText(value, sub));

 return matchesCategory && matchesSub;
 });
};

const Products = ({ categoryOverride = null }) => {
 const [searchParams, setSearchParams] = useSearchParams();
 const navigate = useNavigate();
 const addToCart = useCartStore((state) => state.addToCart);

 const [dynamicCategories, setDynamicCategories] = useState([]);
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [stockFilter, setStockFilter] = useState('all');
 const [addedProductId, setAddedProductId] = useState(null);
 const [fetchError, setFetchError] = useState('');

 const isDedicatedCategoryPage = Boolean(categoryOverride);
 const currentCategory = categoryOverride || searchParams.get('category') || 'All';
 const currentSub = searchParams.get('sub') || 'All';

  useEffect(() => {
 const fetchData = async () => {
 setLoading(true);
 setFetchError('');
 const params = {};
 if (currentCategory !== 'All') params.category = currentCategory;
 if (currentSub !== 'All') params.sub = currentSub;

 // Use dummy data directly instead of API calls
 let fetchedProducts = DUMMY_PRODUCTS;
 
 // Filter by category
 if (currentCategory !== 'All') {
   fetchedProducts = fetchedProducts.filter(p => 
     p.category_name === currentCategory || 
     p.category_name.toLowerCase() === currentCategory.toLowerCase()
   );
 }
 
 // Filter by subcategory
 if (currentSub !== 'All') {
   fetchedProducts = fetchedProducts.filter(p => 
     p.subcategory === currentSub || 
     p.subcategory.toLowerCase() === currentSub.toLowerCase()
   );
 }
 
 setProducts(fetchedProducts);
 setLoading(false);
 window.scrollTo(0, 0);
 };
 fetchData();
 }, [currentCategory, currentSub]);

 const allCategoryData = dynamicCategories.length ? orderDatabaseCategories(dynamicCategories) : CATEGORY_DATA;

 const selectedCategory = allCategoryData.find(c => c.id === currentCategory || c.name.toLowerCase() === currentCategory.toLowerCase());
 const seo = routeSeo[currentCategory] || routeSeo.products;
 const intro = seo.introCopy
 ? { title: seo.introTitle, copy: seo.introCopy }
 : categoryFallbackIntro;
 const subCategoryList = currentCategory === 'All'
 ? [...new Set(allCategoryData.flatMap((category) => category.sub || []))]
 : selectedCategory?.sub || [];

 const setFilter = (cat, sub = 'All') => {
 const params = {};

 if (cat === 'All') {
 if (sub !== 'All') params.sub = sub;
 navigate(`/products${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ''}`);
 return;
 }

 if (sub !== 'All') params.sub = sub;

 if (categoryPages.includes(cat)) {
 navigate(`/${cat}${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ''}`);
 return;
 }

 params.category = cat;
 if (sub !== 'All') params.sub = sub;
 setSearchParams(params);
 };

 const handleQuickAdd = async (product) => {
 const needsSize = ['shoes', 'shirts', 'trousers', 'suits', 'tracksuits', 'jackets', 'linen', 't-shirts', 'polo-t-shirts'].includes((product.category_name || '').toLowerCase());

 if (needsSize) {
 navigate(`/product/${product.slug}`);
 } else {
 await addToCart({
 productId: product.id,
 variantId: null,
 quantity: 1,
 sizeLabel: '',
 name: product.name,
 price: parseFloat(product.price),
 image: getPremiumImage(product),
 slug: product.slug,
 brandName: product.brand_name,
 });
 setAddedProductId(product.id);
 setTimeout(() => setAddedProductId(null), 1400);
 }
 };

 const filteredProducts = products.filter((product) => {
 const matchesSearch =
 product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 (product.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase());

 if (!matchesSearch) return false;
 if (stockFilter === 'in_stock' && product.out_of_stock) return false;
 if (stockFilter === 'out_of_stock' && !product.out_of_stock) return false;
 return true;
 });

 return (
 <div className="bg-primary min-h-screen">
 <SEO
 {...seo}
 schema={[
 buildBreadcrumbSchema([
 { name: 'Home', path: '/' },
 { name: currentCategory === 'All' ? 'Collections' : selectedCategory?.name || 'Collections', path: seo.path },
 ]),
 ]}
 />
 <Navbar />

 <main className="pt-28 pb-24">
 <div className="container mx-auto px-6">
 <div className="flex items-center space-x-4 mb-10">
 <button onClick={() => navigate(-1)} className="text-accent/70 hover:text-accent transition-colors duration-300">
 <ChevronLeft size={22} />
 </button>
 <span className="text-[10px] text-accent/50 font-medium">Back</span>
 </div>
 <div className="mb-14">
 <span className="text-accent/70 text-[10px] tracking-[0.35em] font-semibold uppercase">ELIJAY'S Men's Wear</span>
 <h1 className="text-3xl md:text-4xl font-serif text-secondary tracking-tight mt-2">
 {currentCategory === 'All' ? 'Our Collections' : selectedCategory?.name}
 </h1>
 <div className="max-w-3xl mt-6 space-y-3">
 <h2 className="text-lg md:text-xl font-serif text-accent/70">{intro.title}</h2>
 <p className="text-sm text-secondary/70 font-light leading-relaxed">{intro.copy}</p>
 </div>
 <div className="flex gap-4 mt-4">
 {currentSub !== 'All' && (
 <p className="text-accent/50 text-[12px] font-medium">
 Exploring: {currentSub}
 </p>
 )}
 </div>
 </div>

 <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 mb-14 border-b border-white/10 pb-10">
 <div className="w-full space-y-8">
 {!isDedicatedCategoryPage && (
 <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-2 snap-x snap-mandatory">
 {allCategoryData.map((cat) => (
 <button
 key={cat.id}
 type="button"
 onClick={() => setFilter(cat.id, 'All')}
 className={`shrink-0 px-5 py-2.5 text-[9px] font-semibold tracking-[0.18em] transition-all duration-300 border rounded-full ${
 currentCategory === cat.id || currentCategory.toLowerCase() === cat.name.toLowerCase()
 ? 'bg-accent text-white border-accent'
 : 'bg-transparent text-secondary/70 border-utility-gray hover:border-accent/30 hover:text-accent'
 }`}
 >
 {cat.name}
 </button>
 ))}
 </div>
 )}

 <div className={`flex gap-2 items-center overflow-x-auto custom-scrollbar pb-2 flex-wrap ${isDedicatedCategoryPage ? '' : 'pt-4 border-t border-white/10'}`}>
 <span className="text-[8px] font-bold text-accent/60 mr-2 uppercase tracking-wider">
 Sub Categories:
 </span>
 <button
 type="button"
 onClick={() => setFilter(currentCategory, 'All')}
 className={`shrink-0 px-4 py-1.5 text-[8px] font-semibold transition-all duration-300 rounded-full border ${
 currentSub === 'All'
 ? 'bg-accent/10 text-accent border-accent/30'
 : 'bg-transparent text-secondary/70 border-utility-gray hover:border-accent/20 hover:text-accent/70'
 }`}
 >
 All
 </button>
 {subCategoryList.map((sub) => (
 <button
 key={sub}
 type="button"
 onClick={() => setFilter(currentCategory, sub)}
 className={`shrink-0 px-4 py-1.5 text-[8px] font-semibold transition-all duration-300 rounded-full border ${
 currentSub === sub
 ? 'bg-accent/10 text-accent border-accent/30'
 : 'bg-transparent text-secondary/70 border-utility-gray hover:border-accent/20 hover:text-accent/70'
 }`}
 >
 {sub}
 </button>
 ))}
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
 <select
 value={stockFilter}
 onChange={(e) => setStockFilter(e.target.value)}
 className="bg-primary border border-utility-gray text-[10px] text-secondary/70 px-4 py-3.5 outline-none focus:border-accent/40 transition-colors rounded-lg appearance-none cursor-pointer"
 >
 <option value="all">All availability</option>
 <option value="in_stock">In stock only</option>
 <option value="out_of_stock">Out of stock</option>
 </select>
 <div className="relative w-full md:w-72 group">
 <Search
 className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50 group-focus-within:text-accent/60 transition-colors"
 size={15}
 />
 <input
 type="text"
 placeholder="Search collection..."
 className="w-full pl-11 pr-4 py-3.5 text-[10px] bg-primary border border-utility-gray rounded-lg text-secondary placeholder:text-secondary/50 focus:border-accent/50"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 </div>
 </div>

 {fetchError && (
 <p className="text-center text-red-600 text-sm py-8">{fetchError}</p>
 )}

 {loading ? (
 <p className="text-center text-secondary/50 text-[10px] py-20 tracking-wider uppercase">Loading collection…</p>
 ) : (
 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-8 gap-y-14 sm:gap-y-20">
 <AnimatePresence mode="popLayout">
 {filteredProducts.map((product, index) => (
 <motion.div
 key={product.id}
 layout
 initial={{ opacity: 0, y: 24 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.92 }}
 transition={{ duration: 0.5, ease: 'easeOut' }}
 >
 <ProductCard product={product} onAddToCart={handleQuickAdd} addedProductId={addedProductId} />
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}

 {!loading && filteredProducts.length === 0 && (
 <div className="text-center py-24 space-y-5">
 <p className="text-secondary/50 text-[10px] tracking-wider uppercase">No pieces found in this curation.</p>
 <button
 onClick={() => setFilter('All')}
 className="text-secondary text-[10px] font-semibold border-b border-white/15 pb-1.5 hover:border-white/60 transition-colors duration-300"
 >
 Clear Filters
 </button>
 </div>
 )}
 </div>
 </main>

 <Footer />
 </div>
 );
};

export default Products;
