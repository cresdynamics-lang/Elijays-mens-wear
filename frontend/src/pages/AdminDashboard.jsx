import React, { useState, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 LayoutDashboard, Package, ShoppingBag, Tag, Award, Users, 
 ShieldCheck, Image as ImageIcon, Mail,
 Star, Settings, LogOut, Bell, Search, Menu, X,
 ArrowUpRight, ArrowDownRight, MoreVertical, Plus, 
 Download, Filter, CheckCircle2, AlertCircle, Clock, 
 UserPlus, UserMinus, Trash2, Edit, Eye, ChevronRight, ChevronDown,
 Phone, Globe, Truck, CreditCard, CreditCard as CardIcon,
 BookOpen
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, isStaffSession } from '../store/useAuthStore';
import { userInitials } from '../lib/format';
import { adminToast, apiErrorMessage } from '../lib/adminToast';
import { 
 adminAnalyticsAPI, 
 adminOrderAPI, 
 adminCategoryAPI, 
 adminBrandAPI, 
 adminCustomerAPI,
 adminReviewAPI,
 adminSettingsAPI,
 adminUploadAPI,
} from '../services/api';
import { useEffect } from 'react';
import {
 getUploadUrl,
 getPersistImageUrl,
 getImageSrc,
 resolveDisplayImageUrl,
} from '../utils/cloudinary';
import { ensureSocket, disconnectSocket } from '../lib/socket';
import { ConfirmProvider, useConfirm } from '../components/admin/ConfirmDialog';
import {
 canAccessProducts,
 canViewCustomers,
 canManageUsers,
 canAccessFinance,
 hasPermission,
 parsePermissions,
 STAFF_ACCESS_PRESETS,
 STAFF_PERMISSION_GROUPS,
 detectStaffPreset,
 applyPermissionToggle,
 normalizeStaffPermissions,
} from '../utils/staffPermissions';

const FinanceHub = lazy(() => import('../components/admin/FinanceHub'));
const ProductsView = lazy(() => import('../components/admin/ProductsView'));
const BlogsView = lazy(() => import('../components/admin/BlogsView'));

const SectionLoader = () => (
 <div className="flex items-center justify-center h-64">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500" />
 </div>
);

/** Scrollable table wrapper for mobile */
const AdminTable = ({ children }) => (
 <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">{children}</div>
);

const AdminDashboard = () => {
 const location = useLocation();
 const [activeSection, setActiveSection] = useState(() =>
 useAuthStore.getState().isAdmin ? 'dashboard' : 'dashboard'
 );
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
 const navigate = useNavigate();
 const logout = useAuthStore(state => state.logout);
 const authState = useAuthStore();
 const { user, isAuthenticated, isAdmin } = authState;
 const staffSession = isStaffSession(authState);
 const [authReady, setAuthReady] = useState(
 () => useAuthStore.persist?.hasHydrated?.() ?? true
 );

 useEffect(() => {
 const done = () => setAuthReady(true);
 if (useAuthStore.persist?.hasHydrated?.()) {
 setAuthReady(true);
 return undefined;
 }
 const unsub = useAuthStore.persist?.onFinishHydration?.(done);
 useAuthStore.persist?.rehydrate?.();
 return unsub;
 }, []);

 useEffect(() => {
 if (!authReady) return;
 if (!staffSession) {
 navigate('/admin/login', { replace: true });
 }
 }, [authReady, staffSession, navigate]);

 const allSidebarItems = useMemo(() => [
 { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
 { id: 'orders', label: 'Orders', icon: Package, section: 'Store' },
 { id: 'products', label: 'Products', icon: ShoppingBag, section: 'Store' },
 { id: 'blogs', label: 'Blog', icon: BookOpen, section: 'Store' },
 { id: 'users', label: 'Users', icon: Users, section: 'People' },
 { id: 'finance', label: 'Finance', icon: CreditCard, section: 'Operations' },
 { id: 'reviews', label: 'Reviews', icon: Star, section: 'Marketing', badge: '5' },
 { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
 ], []);

 const sidebarItems = useMemo(() => {
 const items = allSidebarItems;
 return items.filter((item) => {
 if (user?.role === 'admin') return true;
 if (user?.role === 'staff') {
 if (item.id === 'finance') return canAccessFinance(user);
 if (item.id === 'users') return canViewCustomers(user);
 if (item.id === 'products') return canAccessProducts(user);
 return hasPermission(user, item.id) || (item.id === 'users' && hasPermission(user, 'customers'));
 }
 return false;
 });
 }, [user, allSidebarItems]);

 useEffect(() => {
 if (!authReady || !staffSession) return undefined;
 ensureSocket();
 return undefined;
 }, [authReady, staffSession]);

 useEffect(() => {
 if (user?.role === 'staff' && sidebarItems.length > 0) {
 if (!sidebarItems.find((i) => i.id === activeSection)) {
 setActiveSection(sidebarItems[0].id);
 }
 }
 }, [user, sidebarItems, activeSection]);

 if (!authReady || !staffSession) return null;

 const handleLogout = async () => {
 try {
 // Optional: call backend logout
 // await adminAuthAPI.logout(); 
 } catch (e) {}
 disconnectSocket();
 logout();
 navigate('/admin/login');
 };

 const navSections = [...new Set(sidebarItems.map((item) => item.section))];

 const renderContent = () => {
 if (user?.role === 'staff') {
 const allowed =
 hasPermission(user, activeSection) ||
 (activeSection === 'users' && canViewCustomers(user)) ||
 (activeSection === 'products' && canAccessProducts(user)) ||
 (activeSection === 'finance' && canAccessFinance(user)) ||
 (activeSection === 'blogs' && hasPermission(user, 'blogs'));
 if (!allowed) {
 return <div className="p-8 text-center text-red-600">Unauthorized Access</div>;
 }
 }

 const heavySection = (
 <Suspense fallback={<SectionLoader />}>
 {(() => {
 switch (activeSection) {
 case 'products':
 return <ProductsView />;
 case 'finance':
 return <FinanceHub />;
 default:
 return null;
 }
 })()}
 </Suspense>
 );

 switch (activeSection) {
 case 'dashboard':
 return <DashboardView />;
 case 'orders': return <OrdersView />;
 case 'products':
 case 'finance':
 return heavySection;
 case 'blogs': return <BlogsView />;
 case 'users': return <UsersView />;
 case 'reviews': return <ReviewsView />;
 case 'settings': return <SettingsView />;
 default: return <DashboardView />;
 }
 };

 const handleNavClick = (sectionId) => {
 setActiveSection(sectionId);
 setIsMobileNavOpen(false);
 };

 const toggleSidebar = () => {
 if (typeof window !== 'undefined' && window.innerWidth < 1024) {
 setIsMobileNavOpen((open) => !open);
 } else {
 setIsSidebarOpen((open) => !open);
 }
 };

 const isMobileMenuVisible = isMobileNavOpen;

 return (
 <ConfirmProvider>
 <div className="flex h-dvh bg-primary text-accent-50 font-sans overflow-hidden">
 {isMobileNavOpen && (
 <button
 type="button"
 aria-label="Close menu"
 className="fixed inset-0 bg-primary/80 z-30 lg:hidden"
 onClick={() => setIsMobileNavOpen(false)}
 />
 )}

 {/* Sidebar */}
 <aside 
 className={`${
 isSidebarOpen ? 'w-72 lg:w-64' : 'w-72 lg:w-20'
 } fixed lg:relative inset-y-0 left-0 z-40 lg:z-20 bg-utility-gray/95 lg:bg-utility-gray/50 border-r border-utility-gray/60 transition-all duration-300 flex flex-col backdrop-blur-xl ${
 isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
 }`}
 >
 <div className="p-6 border-b border-utility-gray/60 flex items-center gap-3">
 <div className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center text-base-950 font-bold text-xl">
 PE
 </div>
 {isSidebarOpen && (
 <motion.div 
 initial={{ opacity: 0 }} 
 animate={{ opacity: 1 }}
 className="font-serif font-bold text-lg text-gradient-gold"
 >
 ELIJAY'S Men's Wear
 </motion.div>
 )}
 </div>

 <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
 {navSections.map((section) => (
 <div key={section} className="mb-6">
 {isSidebarOpen && (
 <h3 className="px-4 text-[10px] font-bold tracking-[0.2em] text-secondary/60 mb-2">
 {section}
 </h3>
 )}
 {sidebarItems
 .filter((item) => item.section === section)
 .map((item) => (
 <button
 key={item.id}
 onClick={() => handleNavClick(item.id)}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
 activeSection === item.id
 ? 'bg-accent-600 text-base-950 shadow-lg shadow-accent-600/20'
 : 'text-secondary/70 hover:bg-utility-gray hover:text-accent-400'
 }`}
 >
 <item.icon size={20} className={activeSection === item.id ? 'text-base-950' : 'group-hover:text-accent-400'} />
 {isSidebarOpen && (
 <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
 )}
 {isSidebarOpen && item.badge && (
 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
 activeSection === item.id ? 'bg-primary text-accent-500' : 'bg-accent-600/20 text-accent-500'
 }`}>
 {item.badge}
 </span>
 )}
 </button>
 ))}
 </div>
 ))}
 </nav>

 <div className="p-4 border-t border-utility-gray/60">
 <button 
 onClick={handleLogout}
 className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-400/10 rounded-xl transition-all"
 >
 <LogOut size={20} />
 {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
 </button>
 </div>
 </aside>

 {/* Main Content */}
 <main className="flex-1 flex flex-col overflow-hidden min-w-0 w-full lg:ml-0">
 {/* Topbar */}
 <header className="h-16 sm:h-20 bg-utility-gray/30 border-b border-utility-gray/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 backdrop-blur-md shrink-0 gap-3">
 <div className="flex items-center gap-2 sm:gap-4 min-w-0">
 <button 
 type="button"
 onClick={toggleSidebar}
 className="p-2 text-secondary/70 hover:text-accent-500 transition-colors bg-utility-gray rounded-lg border border-utility-gray/60 shrink-0"
 >
 {(isMobileMenuVisible || (isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 1024)) ? <X size={20} /> : <Menu size={20} />}
 </button>
 <div className="hidden sm:block h-8 w-[1px] bg-accent-500/10 mx-1 sm:mx-2" />
 <div className="flex flex-col min-w-0">
 <span className="text-[9px] sm:text-[10px] font-bold text-secondary/60 truncate">
 {isAdmin ? 'Admin' : 'Staff / Overview'}
 </span>
 <h2 className="text-base sm:text-xl font-serif font-bold text-secondary capitalize truncate">
 {sidebarItems.find((i) => i.id === activeSection)?.label || activeSection.replace(/-/g, ' ')}
 </h2>
 </div>
 </div>

 <div className="flex items-center gap-2 sm:gap-6 shrink-0">
 <div className="hidden md:flex items-center gap-2 bg-utility-gray border border-utility-gray/60 px-4 py-2 rounded-xl focus-within:border-accent-500/30 transition-all">
 <Search size={18} className="text-secondary/60" />
 <input
 type="text" 
 placeholder="Search anything..." 
 className="bg-transparent border-none outline-none text-sm text-secondary placeholder:text-secondary/70 w-64"
 />
 </div>
 <div className="flex items-center gap-3">
 <button className="relative p-2.5 text-secondary/70 hover:text-accent-500 transition-all bg-utility-gray rounded-xl border border-utility-gray/60 group">
 <Bell size={20} />
 <span className="absolute top-2 right-2 w-2 h-2 bg-accent-600 rounded-full border-2 border-base-900 group-hover:scale-125 transition-transform"></span>
 </button>
 <div
 className="h-10 w-10 bg-gradient-to-br from-accent-400 to-accent-700 rounded-full flex items-center justify-center text-base-950 font-bold border-2 border-base-800 cursor-pointer hover:scale-105 transition-transform text-sm"
 title={[user?.fullName, user?.name, user?.full_name, user?.email].filter(Boolean).join(' Â· ')}
 >
 {userInitials(user)}
 </div>
 </div>
 </div>
 </header>

 {/* Scrollable Content */}
 <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar bg-gradient-to-b from-base-950 to-base-900/50">
 <AnimatePresence mode="wait">
 <motion.div
 key={activeSection}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.2 }}
 className="min-w-0"
 >
 {renderContent()}
 </motion.div>
 </AnimatePresence>
 </div>
 </main>
 </div>
 </ConfirmProvider>
 );
};

// --- Sub-views ---

const DashboardView = () => {
 const [stats, setStats] = useState(null);
 const [salesData, setSalesData] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchDashboardData = async () => {
 try {
 const [statsRes, chartRes] = await Promise.all([
 adminAnalyticsAPI.getStats(),
 adminAnalyticsAPI.getSalesChart(),
 ]);

 setStats(statsRes.data.data);
 setSalesData(chartRes.data.data);
 } catch (error) {
 console.error('Error fetching dashboard data:', error);
 } finally {
 setLoading(false);
 }
 };

 fetchDashboardData();
 }, []);

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
 </div>
 );
 }

 const statCards = [
 { label: 'Total Revenue', value: `KSh ${stats?.revenue?.toLocaleString()}`, icon: CreditCard },
 { label: 'Total Profit', value: `KSh ${stats?.profit?.toLocaleString()}`, icon: Tag },
 { label: 'Total Sales', value: stats?.orders || 0, icon: Package },
 { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock },
 ];

 return (
 <div className="space-y-8">
 {/* Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {statCards.map((stat, i) => (
 <div key={i} className="bg-utility-gray/40 border border-utility-gray/60 p-6 rounded-2xl hover:border-utility-gray/60 transition-all group backdrop-blur-sm">
 <div className="flex items-center justify-between mb-4">
 <div className="p-3 bg-utility-gray rounded-xl group-hover:bg-accent-600 group-hover:text-base-950 transition-all">
 <stat.icon size={22} className="text-accent-500 group-hover:text-base-950" />
 </div>
 {stat.change && (stat.up ? (
 <span className="flex items-center text-xs font-bold text-green-600 bg-green-400/10 px-2 py-1 rounded-lg">
 <ArrowUpRight size={14} className="mr-1" /> {stat.change}
 </span>
 ) : (
 <span className="flex items-center text-xs font-bold text-red-600 bg-red-400/10 px-2 py-1 rounded-lg">
 <ArrowDownRight size={14} className="mr-1" /> {stat.change}
 </span>
 ))}
 </div>
 <div className="text-[10px] font-bold text-secondary/60 mb-1">{stat.label}</div>
 <div className="text-2xl font-serif font-bold text-secondary">{stat.value}</div>
 </div>
 ))}
 </div>

 <div className="bg-utility-gray/40 border border-utility-gray/60 rounded-2xl overflow-hidden backdrop-blur-sm">
 <div className="px-6 py-5 border-b border-utility-gray/60 flex items-center justify-between">
 <h3 className="font-serif font-bold text-lg text-secondary">Monthly Sales</h3>
 <div className="text-[10px] font-bold text-secondary/60 ">Current Year</div>
 </div>
 <div className="p-8 h-64 flex items-end justify-between gap-2">
 {salesData.length > 0 ? salesData.map((d, i) => (
 <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
 <div className="relative w-full flex justify-center">
 <motion.div
 initial={{ height: 0 }}
 animate={{ height: `${(d.total / Math.max(...salesData.map(s => s.total || 1))) * 100}%` }}
 className="w-8 bg-gradient-to-t from-accent-600 to-accent-400 rounded-t-lg group-hover:from-accent-500 group-hover:to-accent-300 transition-all shadow-lg shadow-accent-600/10"
 />
 <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-accent-600 text-base-950 text-[10px] font-bold px-2 py-1 rounded pointer-events-none">
 KSh {parseInt(d.total).toLocaleString()}
 </div>
 </div>
 <span className="text-[10px] font-bold text-secondary/70 ">{d.label}</span>
 </div>
 )) : (
 <div className="w-full h-full flex items-center justify-center text-accent-500/20 text-xs ">No sales data yet</div>
 )}
 </div>
 </div>
 </div>
 );
};

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const parseOrderAddress = (value) => {
 if (!value) return {};
 if (typeof value === 'string') {
 try {
 return JSON.parse(value);
 } catch {
 return {};
 }
 }
 return value;
};

const formatPaymentLabel = (method) => {
 if (method === 'whatsapp_mpesa') return 'WhatsApp + M-Pesa';
 if (method === 'mpesa') return 'M-Pesa';
 return method || 'â€”';
};

const OrdersView = ({ readOnly = false }) => {
 const confirm = useConfirm();
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [filter, setFilter] = useState('All');
 const [detailOrder, setDetailOrder] = useState(null);
 const [detailLoading, setDetailLoading] = useState(false);
 const [editOrder, setEditOrder] = useState(null);
 const [editStatus, setEditStatus] = useState('pending');
 const [editPaymentStatus, setEditPaymentStatus] = useState('pending');
 const [saving, setSaving] = useState(false);
 const [actionError, setActionError] = useState('');

 const fetchOrders = async () => {
 setLoading(true);
 setError('');
 try {
 const res = await adminOrderAPI.getAll();
 setOrders(Array.isArray(res.data.data) ? res.data.data : []);
 } catch (err) {
 console.error('Error fetching orders:', err);
 setError(err.response?.data?.message || 'Could not load orders. Try again.');
 setOrders([]);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchOrders();
 }, []);

 const filteredOrders = filter === 'All'
 ? orders
 : orders.filter((o) => o.status.toLowerCase() === filter.toLowerCase());

 const openOrderDetail = async (orderId) => {
 setDetailOrder(null);
 setDetailLoading(true);
 setActionError('');
 try {
 const res = await adminOrderAPI.getOne(orderId);
 setDetailOrder(res.data?.data || null);
 } catch (err) {
 setActionError(err.response?.data?.message || 'Could not load order details.');
 } finally {
 setDetailLoading(false);
 }
 };

 const openOrderEdit = (order) => {
 setEditOrder(order);
 setEditStatus(order.status || 'pending');
 setEditPaymentStatus(order.payment_status || 'pending');
 setActionError('');
 };

 const handleSaveOrder = async () => {
 if (!editOrder) return;
 setSaving(true);
 setActionError('');
 try {
 const statusChanged = editStatus !== editOrder.status;
 const paymentChanged = editPaymentStatus !== editOrder.payment_status;

 if (statusChanged) {
 await adminOrderAPI.updateStatus(editOrder.id, editStatus);
 }
 if (paymentChanged) {
 await adminOrderAPI.updatePayment(editOrder.id, editPaymentStatus);
 }

 setEditOrder(null);
 await fetchOrders();
 } catch (err) {
 setActionError(err.response?.data?.message || 'Could not update order.');
 } finally {
 setSaving(false);
 }
 };

 const handleExportOrders = async () => {
 try {
 const res = await adminOrderAPI.exportCsv();
 const blob = new Blob([res.data], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
 a.click();
 URL.revokeObjectURL(url);
 } catch (err) {
 setError(err.response?.data?.message || 'Export failed');
 }
 };

 const handleCancelOrder = async () => {
 if (!editOrder) return;
 const ok = await confirm({
 title: 'Cancel order',
 message: 'Cancel this order? Stock will be restored if already paid.',
 confirmLabel: 'Cancel order',
 variant: 'warning',
 });
 if (!ok) return;
 setSaving(true);
 setActionError('');
 try {
 await adminOrderAPI.cancel(editOrder.id);
 setEditOrder(null);
 await fetchOrders();
 } catch (err) {
 setActionError(err.response?.data?.message || 'Could not cancel order.');
 } finally {
 setSaving(false);
 }
 };

 const handleRefundOrder = async () => {
 if (!editOrder) return;
 const ok = await confirm({
 title: 'Refund order',
 message: 'Refund this paid order and restore stock to inventory?',
 confirmLabel: 'Refund order',
 variant: 'warning',
 });
 if (!ok) return;
 setSaving(true);
 setActionError('');
 try {
 await adminOrderAPI.refund(editOrder.id);
 setEditOrder(null);
 await fetchOrders();
 } catch (err) {
 setActionError(err.response?.data?.message || 'Could not refund order.');
 } finally {
 setSaving(false);
 }
 };

 const closeDetail = () => {
 setDetailOrder(null);
 setDetailLoading(false);
 setActionError('');
 };

 const closeEdit = () => {
 setEditOrder(null);
 setActionError('');
 };

 const detailAddress = parseOrderAddress(detailOrder?.shipping_address);

 return (
 <div className="space-y-6">
 {error && (
 <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm py-3 px-4 rounded-xl">
 {error}
 </div>
 )}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
 <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
 {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((f) => (
 <button
 key={f}
 type="button"
 onClick={() => setFilter(f)}
 className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
 filter === f
 ? 'bg-accent-600 text-base-950 border-accent-600'
 : 'bg-utility-gray/50 text-secondary/70 border-utility-gray/60 hover:border-accent-500/30'
 }`}
 >
 {f}
 </button>
 ))}
 </div>
 <div className="flex gap-3">
 <button
 type="button"
 onClick={handleExportOrders}
 className="flex items-center gap-2 px-4 py-2 bg-utility-gray border border-utility-gray/60 rounded-xl text-xs font-bold text-accent-500 hover:bg-utility-gray transition-all"
 >
 <Download size={16} /> Export CSV
 </button>
 {!readOnly && (
 <button
 type="button"
 onClick={() => fetchOrders()}
 className="flex items-center gap-2 px-4 py-2 bg-utility-gray border border-utility-gray/60 rounded-xl text-xs font-bold text-accent-500 hover:bg-utility-gray transition-all"
 >
 Refresh
 </button>
 )}
 </div>
 </div>

 <div className="bg-utility-gray/40 border border-utility-gray/60 rounded-2xl overflow-hidden backdrop-blur-sm">
 {loading ? (
 <div className="py-24 text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500 mx-auto"></div>
 </div>
 ) : filteredOrders.length > 0 ? (
 <AdminTable>
 <table className="w-full min-w-[900px] text-left">
 <thead className="bg-utility-gray">
 <tr className="text-[10px] font-bold text-secondary/60 tracking-[0.2em]">
 <th className="px-6 py-4">Order ID</th>
 <th className="px-6 py-4">Customer</th>
 <th className="px-6 py-4">Total</th>
 <th className="px-6 py-4">Payment</th>
 <th className="px-6 py-4">Status</th>
 <th className="px-6 py-4">Date</th>
 <th className="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-accent-500/5">
 {filteredOrders.map((o) => (
 <tr key={o.id} className="hover:bg-utility-gray transition-colors">
 <td className="px-6 py-4 font-bold text-accent-500">#{o.id.substring(0, 8).toUpperCase()}</td>
 <td className="px-6 py-4 text-sm text-secondary">{o.customer_name}</td>
 <td className="px-6 py-4 font-bold text-secondary">KSh {parseFloat(o.total_amount).toLocaleString()}</td>
 <td className="px-6 py-4 text-xs">
 <span className={`px-2 py-1 rounded border border-utility-gray/60 ${o.payment_status === 'paid' ? 'text-green-600 bg-green-400/5' : 'text-secondary/70 bg-base-800'}`}>
 {formatPaymentLabel(o.payment_method)} ({o.payment_status})
 </span>
 </td>
 <td className="px-6 py-4">
 <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
 o.status === 'pending' ? 'bg-accent-500/10 text-accent-500' :
 o.status === 'delivered' ? 'bg-green-400/10 text-green-600' :
 o.status === 'cancelled' ? 'bg-red-400/10 text-red-600' :
 'bg-blue-400/10 text-blue-400'
 }`}>
 {o.status}
 </span>
 </td>
 <td className="px-6 py-4 text-xs text-secondary/60">
 {new Date(o.created_at).toLocaleDateString()}
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex justify-end gap-2">
 <button
 type="button"
 onClick={() => openOrderDetail(o.id)}
 className="p-2 text-secondary/70 hover:text-accent-500 hover:bg-utility-gray rounded-lg transition-all"
 title="View Details"
 >
 <Eye size={16} />
 </button>
 {!readOnly && (
 <button
 type="button"
 onClick={() => openOrderEdit(o)}
 className="p-2 text-secondary/70 hover:text-accent-500 hover:bg-utility-gray rounded-lg transition-all"
 title="Edit Order"
 >
 <Edit size={16} />
 </button>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </AdminTable>
 ) : (
 <div className="py-24 text-center text-secondary/60 text-sm">
 No orders found matching this criteria.
 </div>
 )}
 </div>

 {(detailLoading || detailOrder || actionError) && !editOrder && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-utility-gray border border-utility-gray/60 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
 <div className="flex items-start justify-between gap-4 mb-6">
 <div>
 <h3 className="text-xl font-serif text-secondary">Order Details</h3>
 {detailOrder && (
 <p className="text-secondary/50 text-xs mt-1 ">
 #{detailOrder.id.substring(0, 8).toUpperCase()}
 </p>
 )}
 </div>
 <button type="button" onClick={closeDetail} className="text-secondary/60 hover:text-accent-500">
 <X size={20} />
 </button>
 </div>

 {detailLoading ? (
 <div className="py-12 text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500 mx-auto" />
 </div>
 ) : actionError && !detailOrder ? (
 <p className="text-red-600 text-sm">{actionError}</p>
 ) : detailOrder ? (
 <div className="space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
 <div>
 <p className="text-[10px] text-secondary/60 mb-1">Customer</p>
 <p className="text-secondary">{detailOrder.customer_name}</p>
 <p className="text-secondary/70 text-xs">{detailOrder.customer_email}</p>
 </div>
 <div>
 <p className="text-[10px] text-secondary/60 mb-1">Placed</p>
 <p className="text-secondary">{new Date(detailOrder.created_at).toLocaleString()}</p>
 </div>
 <div>
 <p className="text-[10px] text-secondary/60 mb-1">Status</p>
 <p className="text-secondary text-xs font-bold">{detailOrder.status}</p>
 </div>
 <div>
 <p className="text-[10px] text-secondary/60 mb-1">Payment</p>
 <p className="text-secondary text-xs">
 {formatPaymentLabel(detailOrder.payment_method)} Â· {detailOrder.payment_status}
 </p>
 </div>
 </div>

 <div className="bg-primary/60 border border-utility-gray/60 rounded-xl p-4 text-sm">
 <p className="text-[10px] text-secondary/60 mb-2">Shipping</p>
 <p className="text-secondary">
 {[detailAddress.first_name, detailAddress.last_name].filter(Boolean).join(' ')}
 </p>
 <p className="text-secondary text-xs mt-1">{detailAddress.line1}</p>
 <p className="text-secondary text-xs">{detailAddress.city}, {detailAddress.country || 'Kenya'}</p>
 <p className="text-secondary text-xs mt-1">{detailAddress.phone}</p>
 <p className="text-secondary text-xs">{detailAddress.email}</p>
 </div>

 <div>
 <p className="text-[10px] text-secondary/60 mb-3">Items</p>
 <div className="space-y-2">
 {(detailOrder.items || []).map((item) => (
 <div key={item.id} className="flex justify-between gap-4 bg-primary/60 border border-accent-500/5 rounded-xl px-4 py-3 text-sm">
 <div>
 <p className="text-secondary">{item.name}</p>
 <p className="text-secondary/50 text-xs">
 Qty {item.quantity}
 {item.size_label ? ` Â· Size ${item.size_label}` : ''}
 {(item.variant_sku || item.product_sku) ? ` Â· SKU ${item.variant_sku || item.product_sku}` : ''}
 </p>
 </div>
 <p className="text-accent-400 shrink-0">
 KSh {(parseFloat(item.price) * item.quantity).toLocaleString()}
 </p>
 </div>
 ))}
 </div>
 </div>

 <div className="flex justify-between border-t border-utility-gray/60 pt-4 text-sm font-bold">
 <span className="text-secondary/70">Total</span>
 <span className="text-accent-400">KSh {parseFloat(detailOrder.total_amount).toLocaleString()}</span>
 </div>

 {!readOnly && (
 <button
 type="button"
 onClick={() => {
 closeDetail();
 openOrderEdit(detailOrder);
 }}
 className="w-full py-3 rounded-xl bg-accent-600 text-base-950 text-[10px] font-bold hover:bg-accent-500"
 >
 Edit Order
 </button>
 )}
 </div>
 ) : null}
 </div>
 </div>
 )}

 {editOrder && (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
 <div className="bg-utility-gray border border-utility-gray/60 rounded-2xl p-6 max-w-md w-full">
 <div className="flex items-start justify-between gap-4 mb-6">
 <div>
 <h3 className="text-xl font-serif text-secondary">Edit Order</h3>
 <p className="text-secondary/50 text-xs mt-1 ">
 #{editOrder.id.substring(0, 8).toUpperCase()} Â· {editOrder.customer_name}
 </p>
 </div>
 <button type="button" onClick={closeEdit} className="text-secondary/60 hover:text-accent-500">
 <X size={20} />
 </button>
 </div>

 {actionError && (
 <p className="text-red-600 text-sm mb-4">{actionError}</p>
 )}

 <div className="space-y-4">
 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-bold">Order Status</label>
 <select
 value={editStatus}
 onChange={(e) => setEditStatus(e.target.value)}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl px-4 py-3 text-secondary text-sm outline-none focus:border-accent-500"
 >
 {ORDER_STATUSES.map((status) => (
 <option key={status} value={status}>{status}</option>
 ))}
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-bold">Payment Status</label>
 <select
 value={editPaymentStatus}
 onChange={(e) => setEditPaymentStatus(e.target.value)}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl px-4 py-3 text-secondary text-sm outline-none focus:border-accent-500"
 >
 {PAYMENT_STATUSES.map((status) => (
 <option key={status} value={status}>{status}</option>
 ))}
 </select>
 </div>
 </div>

 {!readOnly && editOrder.status !== 'cancelled' && editOrder.status !== 'delivered' && (
 <button
 type="button"
 onClick={handleCancelOrder}
 disabled={saving}
 className="w-full mt-4 py-3 rounded-xl border border-red-500/30 text-red-600 text-[10px] font-bold hover:bg-red-500/10 disabled:opacity-50"
 >
 Cancel Order
 </button>
 )}

 {!readOnly && editOrder.payment_status === 'paid' && (
 <button
 type="button"
 onClick={handleRefundOrder}
 disabled={saving}
 className="w-full mt-2 py-3 rounded-xl border border-amber-500/30 text-amber-600 text-[10px] font-bold hover:bg-amber-500/10 disabled:opacity-50"
 >
 Refund Order
 </button>
 )}

 <div className="flex gap-3 mt-6">
 <button
 type="button"
 onClick={closeEdit}
 className="flex-1 py-3 rounded-xl border border-utility-gray/60 text-secondary/70 text-[10px] font-bold "
 >
 Close
 </button>
 {!readOnly && (
 <button
 type="button"
 onClick={handleSaveOrder}
 disabled={saving}
 className="flex-1 py-3 rounded-xl bg-accent-600 text-base-950 text-[10px] font-bold hover:bg-accent-500 disabled:opacity-50"
 >
 {saving ? 'Savingâ€¦' : 'Save Changes'}
 </button>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

const CategoriesView = () => {
 const confirm = useConfirm();
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentCategory, setCurrentCategory] = useState(null);
 const [submitting, setSubmitting] = useState(false);
 const [formData, setFormData] = useState({
 name: '',
 slug: '',
 description: '',
 image: '',
 is_featured: false,
 is_active: true
 });

 const fetchCategories = async () => {
 setLoading(true);
 try {
 const res = await adminCategoryAPI.getAll();
 setCategories(res.data.data);
 } catch (error) {
 console.error('Error fetching categories:', error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchCategories();
 }, []);

 const handleImageChange = async (e) => {
 const file = e.target.files[0];
 if (file) {
 const uploadData = new FormData();
 uploadData.append('images', file);
 try {
 const res = await adminUploadAPI.upload(uploadData);
 if (res.data.success) {
 setFormData({ ...formData, image: res.data.data[0] });
 }
 } catch (error) {
 console.error('Category image upload failed:', error);
 }
 }
 };

 const handleOpenModal = (category = null) => {
 if (category) {
 setCurrentCategory(category);
 setFormData({
 name: category.name || '',
 slug: category.slug || '',
 description: category.description || '',
 image: category.image || '',
 is_featured: category.is_featured || false,
 is_active: category.is_active ?? true
 });
 } else {
 setCurrentCategory(null);
 setFormData({
 name: '',
 slug: '',
 description: '',
 image: '',
 is_featured: false,
 is_active: true
 });
 }
 setIsModalOpen(true);
 };

 const handleDelete = async (id) => {
 const ok = await confirm({
 title: 'Delete category',
 message: 'Products in this category may be affected. Are you sure you want to delete it?',
 confirmLabel: 'Delete category',
 variant: 'danger',
 });
 if (!ok) return;
 try {
 await adminCategoryAPI.remove(id);
 fetchCategories();
 } catch (error) {
 alert('Error deleting category');
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setSubmitting(true);
 try {
 if (currentCategory) {
 await adminCategoryAPI.update(currentCategory.id, formData);
 } else {
 await adminCategoryAPI.create(formData);
 }
 setIsModalOpen(false);
 fetchCategories();
 } catch (error) {
 alert('Error saving category');
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="space-y-6 relative">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xl font-serif font-bold text-secondary">Categories ({categories.length})</h3>
 <button 
 onClick={() => handleOpenModal()}
 className="flex items-center gap-2 px-6 py-3 bg-utility-gray border border-utility-gray/60 text-accent-500 rounded-xl font-bold hover:bg-utility-gray transition-all"
 >
 <Plus size={20} /> New Category
 </button>
 </div>

 <div className="bg-utility-gray/40 border border-utility-gray/60 rounded-2xl overflow-hidden backdrop-blur-sm">
 {loading ? (
 <div className="py-24 text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500 mx-auto"></div>
 </div>
 ) : categories.length > 0 ? (
 <table className="w-full text-left">
 <thead className="bg-utility-gray text-[10px] font-bold text-secondary/60 tracking-[0.2em]">
 <tr>
 <th className="px-6 py-4">Name</th>
 <th className="px-6 py-4">Slug</th>
 <th className="px-6 py-4">Featured</th>
 <th className="px-6 py-4">Status</th>
 <th className="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-accent-500/5">
 {categories.map((c) => (
 <tr key={c.id} className="hover:bg-utility-gray transition-colors text-sm">
 <td className="px-6 py-4 font-bold text-secondary flex items-center gap-2">
 {c.parent_id && <ChevronRight size={14} className="text-accent-500/20" />}
 {c.name}
 </td>
 <td className="px-6 py-4 font-mono text-secondary/70 text-xs">{c.slug}</td>
 <td className="px-6 py-4 text-accent-200">{c.is_featured ? 'Yes' : 'No'}</td>
 <td className="px-6 py-4">
 <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
 c.is_active ? 'bg-green-400/10 text-green-600' : 'bg-utility-gray text-secondary/70'
 }`}>
 {c.is_active ? 'Active' : 'Inactive'}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex justify-end gap-2">
 <button 
 onClick={() => handleOpenModal(c)}
 className="p-2 text-secondary/70 hover:text-accent-500 transition-all"
 >
 <Edit size={16} />
 </button>
 <button 
 onClick={() => handleDelete(c.id)}
 className="p-2 text-red-600 hover:text-red-600 transition-all"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 ) : (
 <div className="py-24 text-center text-secondary/60 text-sm">
 No categories defined.
 </div>
 )}
 </div>

 {/* Category Modal */}
 {isModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/80 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-utility-gray border border-utility-gray/60 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
 >
 <div className="flex items-center justify-between mb-8">
 <h4 className="text-2xl font-serif font-bold text-secondary">
 {currentCategory ? 'Edit Category' : 'Create New Category'}
 </h4>
 <button onClick={() => setIsModalOpen(false)} className="text-secondary/60 hover:text-accent-500"><X size={24} /></button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Name</label>
 <input 
 type="text" 
 required
 value={formData.name}
 onChange={(e) => {
 const val = e.target.value.toUpperCase();
 setFormData({...formData, name: val, slug: val.toLowerCase().replace(/ /g, '-')});
 }}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl py-3 px-4 text-secondary outline-none focus:border-accent-500/40 transition-all font-bold "
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Slug</label>
 <input 
 type="text" 
 required
 value={formData.slug}
 onChange={(e) => setFormData({...formData, slug: e.target.value})}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl py-3 px-4 text-secondary outline-none focus:border-accent-500/40 transition-all font-mono"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Image</label>
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-xl border border-utility-gray/60 overflow-hidden bg-primary flex items-center justify-center relative">
 {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-accent-500/20" />}
 <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
 </div>
 <p className="text-[9px] text-secondary/60 ">Click to upload cover image</p>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Description</label>
 <textarea 
 value={formData.description}
 onChange={(e) => setFormData({...formData, description: e.target.value.toUpperCase()})}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl py-3 px-4 text-secondary outline-none focus:border-accent-500/40 transition-all h-24 font-bold "
 />
 </div>

 <div className="flex gap-8">
 <label className="flex items-center gap-3 cursor-pointer">
 <input 
 type="checkbox" 
 checked={formData.is_featured}
 onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
 className="w-4 h-4 rounded border-utility-gray/60 bg-primary text-accent-600 focus:ring-0 focus:ring-offset-0"
 />
 <span className="text-xs text-secondary">Featured Category</span>
 </label>
 <label className="flex items-center gap-3 cursor-pointer">
 <input 
 type="checkbox" 
 checked={formData.is_active}
 onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
 className="w-4 h-4 rounded border-utility-gray/60 bg-primary text-accent-600 focus:ring-0 focus:ring-offset-0"
 />
 <span className="text-xs text-secondary">Active</span>
 </label>
 </div>

 <button 
 type="submit" 
 disabled={submitting}
 className="w-full bg-accent-600 text-base-950 py-4 rounded-xl font-bold hover:bg-accent-500 transition-all disabled:opacity-50"
 >
 {submitting ? 'AUTHENTICATING...' : 'COMMIT CATEGORY'}
 </button>
 </form>
 </motion.div>
 </div>
 )}
 </div>
 );
};

const BrandsView = () => {
 const confirm = useConfirm();
 const [brands, setBrands] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentBrand, setCurrentBrand] = useState(null);
 const [submitting, setSubmitting] = useState(false);
 const [formData, setFormData] = useState({
 name: '',
 slug: '',
 description: '',
 logo: '',
 is_featured: false,
 is_active: true
 });

 const fetchBrands = async () => {
 setLoading(true);
 try {
 const res = await adminBrandAPI.getAll();
 setBrands(res.data.data);
 } catch (error) {
 console.error('Error fetching brands:', error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchBrands();
 }, []);

 const handleLogoChange = async (e) => {
 const file = e.target.files[0];
 if (file) {
 const uploadData = new FormData();
 uploadData.append('images', file);
 try {
 const res = await adminUploadAPI.upload(uploadData);
 if (res.data.success) {
 setFormData({ ...formData, logo: getUploadUrl(res.data.data[0]) });
 }
 } catch (error) {
 console.error('Brand logo upload failed:', error);
 }
 }
 };

 const handleOpenModal = (brand = null) => {
 if (brand) {
 setCurrentBrand(brand);
 setFormData({
 name: brand.name || '',
 slug: brand.slug || '',
 description: brand.description || '',
 logo: brand.logo || '',
 is_featured: brand.is_featured || false,
 is_active: brand.is_active ?? true
 });
 } else {
 setCurrentBrand(null);
 setFormData({
 name: '',
 slug: '',
 description: '',
 logo: '',
 is_featured: false,
 is_active: true
 });
 }
 setIsModalOpen(true);
 };

 const handleDelete = async (id) => {
 const ok = await confirm({
 title: 'Delete brand',
 message: 'This brand will be removed from your store. Products linked to it will remain but lose the brand label.',
 confirmLabel: 'Delete brand',
 variant: 'danger',
 });
 if (!ok) return;
 try {
 await adminBrandAPI.remove(id);
 fetchBrands();
 } catch (error) {
 alert('Error deleting brand');
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setSubmitting(true);
 try {
 if (currentBrand) {
 await adminBrandAPI.update(currentBrand.id, formData);
 } else {
 await adminBrandAPI.create(formData);
 }
 setIsModalOpen(false);
 fetchBrands();
 } catch (error) {
 alert('Error saving brand');
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="space-y-6 relative">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xl font-serif font-bold text-secondary">Brand Partners ({brands.length})</h3>
 <button 
 onClick={() => handleOpenModal()}
 className="flex items-center gap-2 px-6 py-3 bg-utility-gray border border-utility-gray/60 text-accent-500 rounded-xl font-bold hover:bg-utility-gray transition-all"
 >
 <Plus size={20} /> Add Brand
 </button>
 </div>

 <div className="bg-utility-gray/40 border border-utility-gray/60 rounded-2xl overflow-hidden backdrop-blur-sm">
 {loading ? (
 <div className="py-24 text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500 mx-auto"></div>
 </div>
 ) : brands.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
 {brands.map((brand) => (
 <div key={brand.id} className="bg-utility-gray/40 border border-utility-gray/60 p-6 rounded-2xl flex items-center justify-between group backdrop-blur-sm transition-all hover:bg-utility-gray">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-lg border border-utility-gray/60 overflow-hidden bg-primary flex items-center justify-center">
 {brand.logo ? <img src={brand.logo} className="w-full h-full object-contain" /> : <Award size={20} className="text-accent-500/20" />}
 </div>
 <div>
 <div className="text-lg font-bold text-secondary mb-1">{brand.name}</div>
 <div className="text-xs text-secondary/60 mb-3">{brand.product_count || 0} products live</div>
 <div className="flex gap-2">
 {brand.is_featured && <span className="bg-accent-600/10 text-accent-500 text-[9px] font-bold px-2 py-0.5 rounded border border-utility-gray/60">Featured</span>}
 <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${brand.is_active ? 'border-green-400/20 text-green-600' : 'border-accent-500/5 text-accent-500/20'}`}>
 {brand.is_active ? 'Active' : 'Inactive'}
 </span>
 </div>
 </div>
 </div>
 <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button onClick={() => handleOpenModal(brand)} className="w-10 h-10 bg-utility-gray rounded-xl border border-utility-gray/60 flex items-center justify-center text-secondary/70 hover:text-accent-500 hover:border-accent-500/40 transition-all">
 <Edit size={18} />
 </button>
 <button onClick={() => handleDelete(brand.id)} className="w-10 h-10 bg-red-400/10 rounded-xl border border-red-400/20 flex items-center justify-center text-red-600 hover:text-red-600 hover:border-red-400/40 transition-all">
 <Trash2 size={18} />
 </button>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-24 text-center text-secondary/60 text-sm">
 No brand partners found.
 </div>
 )}
 </div>

 {/* Brand Modal */}
 {isModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/80 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-utility-gray border border-utility-gray/60 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
 >
 <div className="flex items-center justify-between mb-8">
 <h4 className="text-2xl font-serif font-bold text-secondary">
 {currentBrand ? 'Edit Brand' : 'Create New Brand'}
 </h4>
 <button onClick={() => setIsModalOpen(false)} className="text-secondary/60 hover:text-accent-500"><X size={24} /></button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Name</label>
 <input 
 type="text" 
 required
 value={formData.name}
 onChange={(e) => {
 const val = e.target.value.toUpperCase();
 setFormData({...formData, name: val, slug: val.toLowerCase().replace(/ /g, '-')});
 }}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl py-3 px-4 text-secondary outline-none focus:border-accent-500/40 transition-all font-bold "
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Slug</label>
 <input 
 type="text" 
 required
 value={formData.slug}
 onChange={(e) => setFormData({...formData, slug: e.target.value})}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl py-3 px-4 text-secondary outline-none focus:border-accent-500/40 transition-all font-mono"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Logo</label>
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 rounded-xl border border-utility-gray/60 overflow-hidden bg-primary flex items-center justify-center relative">
 {formData.logo ? <img src={formData.logo} className="w-full h-full object-contain" /> : <Award size={20} className="text-accent-500/20" />}
 <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
 </div>
 <p className="text-[9px] text-secondary/60 ">Click to upload brand logo</p>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] text-secondary/60 font-black">Description</label>
 <textarea 
 value={formData.description}
 onChange={(e) => setFormData({...formData, description: e.target.value.toUpperCase()})}
 className="w-full bg-primary border border-utility-gray/60 rounded-xl py-3 px-4 text-secondary outline-none focus:border-accent-500/40 transition-all h-24 font-bold "
 />
 </div>

 <div className="flex gap-8">
 <label className="flex items-center gap-3 cursor-pointer">
 <input 
 type="checkbox" 
 checked={formData.is_featured}
 onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
 className="w-4 h-4 rounded border-utility-gray/60 bg-primary text-accent-600 focus:ring-0 focus:ring-offset-0"
 />
 <span className="text-xs text-secondary">Featured Brand</span>
 </label>
 <label className="flex items-center gap-3 cursor-pointer">
 <input 
 type="checkbox" 
 checked={formData.is_active}
 onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
 className="w-4 h-4 rounded border-utility-gray/60 bg-primary text-accent-600 focus:ring-0 focus:ring-offset-0"
 />
 <span className="text-xs text-secondary">Active</span>
 </label>
 </div>

 <button 
 type="submit" 
 disabled={submitting}
 className="w-full bg-accent-600 text-base-950 py-4 rounded-xl font-bold hover:bg-accent-500 transition-all disabled:opacity-50"
 >
 {submitting ? 'SAVING...' : 'SAVE BRAND'}
 </button>
 </form>
 </motion.div>
 </div>
 )}
 </div>
 );
};

const UsersView = () => {
 const currentUser = useAuthStore((s) => s.user);
 const isAdmin = canManageUsers(currentUser);
 const [tab, setTab] = useState('customers');

 const tabs = isAdmin
 ? [
 { id: 'customers', label: 'Customers' },
 { id: 'staff', label: 'Staff' },
 { id: 'admins', label: 'Admins' },
 ]
 : [{ id: 'customers', label: 'Customers' }];

 return (
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
 <div>
 <h3 className="text-xl sm:text-2xl font-serif font-bold text-secondary">Users</h3>
 <p className="text-xs text-secondary/60 mt-1">
 {isAdmin ? 'Website accounts, staff, and administrators' : 'Customer accounts only'}
 </p>
 </div>
 <div className="flex flex-wrap gap-2">
 {tabs.map((t) => (
 <button
 key={t.id}
 type="button"
 onClick={() => setTab(t.id)}
 className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
 tab === t.id
 ? 'bg-accent-600 text-base-950 border-accent-600'
 : 'bg-utility-gray/50 text-secondary border-accent-500/15 hover:border-accent-500/40'
 }`}
 >
 {t.label}
 </button>
 ))}
 </div>
 </div>

 {!isAdmin && currentUser && (
 <div className="bg-utility-gray/40 border border-accent-500/15 rounded-xl p-4 flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-accent-600 text-base-950 font-bold flex items-center justify-center">
 {userInitials(currentUser)}
 </div>
 <div>
 <p className="text-sm font-bold text-secondary">{currentUser.fullName || currentUser.name}</p>
 <p className="text-xs text-secondary/50">{currentUser.email} Â· Staff</p>
 </div>
 </div>
 )}

 {tab === 'customers' && <CustomersView embedded />}
 {tab === 'staff' && isAdmin && <AdminsView roleFilter="staff" />}
 {tab === 'admins' && isAdmin && <AdminsView roleFilter="admin" />}
 </div>
 );
};

const CustomersView = ({ embedded = false }) => {
 const confirm = useConfirm();
 const [customers, setCustomers] = useState([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCustomer, setSelectedCustomer] = useState(null);
 const [detailLoading, setDetailLoading] = useState(false);

 useEffect(() => {
 const fetchCustomers = async () => {
 try {
 const res = await adminCustomerAPI.getAll({ role: 'customer' });
 setCustomers(res.data.data || []);
 } catch (error) {
 console.error('Error fetching customers:', error);
 } finally {
 setLoading(false);
 }
 };
 fetchCustomers();
 }, []);

 const filteredCustomers = customers.filter((c) =>
 c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 c.email?.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const handleToggleStatus = async (id, currentStatus) => {
 try {
 await adminCustomerAPI.updateStatus(id, !currentStatus);
 setCustomers(customers.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c)));
 setSelectedCustomer((current) => (
 current && current.id === id ? { ...current, is_active: !currentStatus } : current
 ));
 } catch (error) {
 console.error('Error updating customer status:', error);
 }
 };

 const handleViewCustomer = async (id) => {
 setDetailLoading(true);
 try {
 const res = await adminCustomerAPI.getOne(id);
 setSelectedCustomer(res.data.data || res.data);
 } catch (error) {
 console.error('Error fetching customer detail:', error);
 adminToast.error(apiErrorMessage(error, 'Could not load customer details'));
 } finally {
 setDetailLoading(false);
 }
 };

 const closeModal = () => setSelectedCustomer(null);

 return (
 <div className="space-y-6">
 {!embedded && (
 <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
 <div className="flex flex-col">
 <h3 className="text-xl sm:text-2xl font-serif font-bold text-secondary">Customer Directory</h3>
 <p className="text-xs text-secondary/60 mt-1">Managing {customers.length} registered clients</p>
 </div>
 <div className="flex gap-3 w-full sm:w-auto">
 <div className="bg-utility-gray border border-utility-gray/60 px-4 py-2 rounded-xl flex items-center gap-2 w-full sm:w-auto">
 <Search size={16} className="text-secondary/60" />
 <input 
 type="text" 
 placeholder="Search customers..." 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="bg-transparent border-none outline-none text-sm text-secondary placeholder:text-accent-500/20 w-full sm:w-56" 
 />
 </div>
 </div>
 </div>
 )}
 {embedded && (
 <div className="flex flex-wrap gap-3 items-center justify-between">
 <p className="text-xs text-secondary/60">{customers.length} registered customers</p>
 <div className="bg-utility-gray border border-utility-gray/60 px-4 py-2 rounded-xl flex items-center gap-2 w-full sm:w-auto">
 <Search size={16} className="text-secondary/60" />
 <input 
 type="text" 
 placeholder="Search customers..." 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="bg-transparent border-none outline-none text-sm text-secondary placeholder:text-accent-500/20 w-full sm:w-48" 
 />
 </div>
 </div>
 )}

 <div className="overflow-hidden rounded-2xl border border-utility-gray/60 bg-utility-gray/40 backdrop-blur-sm">
 {loading ? (
 <div className="py-24 text-center">
 <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-accent-500"></div>
 </div>
 ) : filteredCustomers.length > 0 ? (
 <AdminTable>
 <table className="w-full min-w-[720px] text-left">
 <thead className="bg-utility-gray text-[10px] font-bold tracking-[0.2em] text-secondary/60">
 <tr>
 <th className="px-6 py-4">Customer</th>
 <th className="px-6 py-4">Contact Info</th>
 <th className="px-6 py-4">Total Spent</th>
 <th className="px-6 py-4">Joined</th>
 <th className="px-6 py-4">Account Status</th>
 <th className="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-accent-500/5">
 {filteredCustomers.map((c) => (
 <tr key={c.id} className="transition-colors hover:bg-utility-gray">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-base-800 bg-accent-600 font-bold text-base-950 shadow-lg">
 {userInitials(c)}
 </div>
 <div>
 <div className="flex items-center gap-2 text-sm font-bold text-secondary">
 {c.name}
 {c.is_verified && <CheckCircle2 size={14} className="text-blue-400" />}
 </div>
 <div className="mt-0.5 text-[10px] text-secondary/60">ID: {String(c.id).substring(0, 8)}</div>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="text-xs text-secondary">{c.email}</div>
 <div className="mt-1 flex items-center gap-1 text-[10px] text-secondary/60">
 <Phone size={10} /> {c.phone || 'No phone'}
 </div>
 </td>
 <td className="px-6 py-4 font-serif font-bold text-secondary">KSh {parseFloat(c.total_spent || 0).toLocaleString()}</td>
 <td className="px-6 py-4 text-xs text-secondary/70">{new Date(c.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}</td>
 <td className="px-6 py-4">
 <span className={`rounded px-2 py-0.5 text-[9px] font-black tracking-[0.1em] ${
 c.is_active !== false ? 'bg-green-400/10 text-green-600' : 'bg-red-400/10 text-red-600'
 }`}>
 {c.is_active !== false ? 'Active' : 'Suspended'}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex justify-end gap-2">
 <button 
 onClick={() => handleToggleStatus(c.id, c.is_active !== false)}
 className={`rounded-lg p-2 transition-all ${c.is_active !== false ? 'text-red-600 hover:bg-red-400/5 hover:text-red-600' : 'text-green-600 hover:bg-green-400/5 hover:text-green-600'}`}
 title={c.is_active !== false ? 'Suspend Account' : 'Activate Account'}
 >
 {c.is_active !== false ? <UserMinus size={16} /> : <UserPlus size={16} />}
 </button>
 <button
 type="button"
 onClick={() => handleViewCustomer(c.id)}
 className="rounded-lg p-2 text-secondary/60 transition-all hover:bg-utility-gray hover:text-accent-500"
 title="View details"
 >
 <Eye size={16} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </AdminTable>
 ) : (
 <div className="py-24 text-center text-sm text-secondary/60">
 No customers found matching your search.
 </div>
 )}
 </div>

 {selectedCustomer && (
 <div className="fixed inset-0 z-50 overflow-y-auto">
 <button
 type="button"
 aria-label="Close customer details"
 className="fixed inset-0 bg-primary/80 backdrop-blur-sm"
 onClick={closeModal}
 />
 <div className="relative flex min-h-full items-center justify-center p-4 py-8">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative flex max-h-[min(90dvh,760px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-utility-gray/60 bg-utility-gray shadow-2xl"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-start justify-between gap-4 border-b border-utility-gray/60 p-6">
 <div className="flex items-center gap-4">
 <div className="flex h-14 w-14 items-center justify-center rounded-full border border-utility-gray/60 bg-accent-600 text-lg font-bold text-base-950">
 {userInitials(selectedCustomer)}
 </div>
 <div>
 <h3 className="font-serif text-xl font-bold text-secondary">{selectedCustomer.name}</h3>
 <p className="text-sm text-secondary/50">Customer details and order history</p>
 </div>
 </div>
 <button type="button" onClick={closeModal} className="rounded-lg p-2 text-secondary/60 transition-colors hover:text-accent-500">
 <X size={20} />
 </button>
 </div>

 <div className="grid min-h-0 gap-6 overflow-hidden p-6 lg:grid-cols-[1.1fr_0.9fr]">
 <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
 {[
 { label: 'Email', value: selectedCustomer.email, icon: Mail },
 { label: 'Phone', value: selectedCustomer.phone || 'No phone', icon: Phone },
 { label: 'Joined', value: new Date(selectedCustomer.created_at).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }), icon: Clock },
 { label: 'Total Spent', value: `KSh ${parseFloat(selectedCustomer.total_spent || 0).toLocaleString()}`, icon: Package },
 ].map((item) => (
 <div key={item.label} className="rounded-2xl border border-utility-gray/60 bg-primary/50 p-4">
 <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/60">
 <item.icon size={12} /> {item.label}
 </div>
 <div className="text-sm font-bold text-secondary break-words">{item.value}</div>
 </div>
 ))}
 </div>

 <div className="rounded-2xl border border-utility-gray/60 bg-primary/50 p-4">
 <div className="mb-3 flex items-center justify-between">
 <h4 className="text-sm font-bold text-secondary">Account status</h4>
 <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${selectedCustomer.is_active !== false ? 'bg-green-400 text-base-950' : 'bg-red-400 text-base-950'}`}>
 {selectedCustomer.is_active !== false ? 'Active' : 'Suspended'}
 </span>
 </div>
 <div className="flex flex-wrap gap-3">
 <button
 type="button"
 onClick={() => handleToggleStatus(selectedCustomer.id, selectedCustomer.is_active !== false)}
 className="rounded-xl bg-accent-600 px-4 py-3 text-sm font-bold text-base-950 transition-colors hover:bg-accent-500"
 >
 Toggle status
 </button>
 <button
 type="button"
 onClick={closeModal}
 className="rounded-xl border border-accent-500/15 px-4 py-3 text-sm font-bold text-secondary hover:border-accent-500/40"
 >
 Close
 </button>
 </div>
 </div>
 </div>

 <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-utility-gray/60 bg-primary/50">
 <div className="border-b border-utility-gray/60 px-4 py-3">
 <h4 className="text-sm font-bold text-secondary">Orders</h4>
 <p className="text-xs text-secondary/60">{detailLoading ? 'Loading details...' : `${selectedCustomer.orders?.length || 0} order(s)`}</p>
 </div>
 <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
 {!detailLoading && (selectedCustomer.orders || []).length > 0 ? (
 selectedCustomer.orders.map((order) => (
 <div key={order.id} className="rounded-xl border border-utility-gray/60 bg-utility-gray/60 p-4">
 <div className="flex items-center justify-between gap-3">
 <div>
 <div className="text-sm font-bold text-secondary">Order #{String(order.id).slice(0, 8)}</div>
 <div className="text-[10px] uppercase tracking-[0.2em] text-secondary/60">{new Date(order.created_at).toLocaleDateString()}</div>
 </div>
 <span className="rounded-full border border-utility-gray/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-secondary/70">
 {order.status}
 </span>
 </div>
 <div className="mt-3 text-sm font-bold text-secondary">KSh {parseFloat(order.total_amount || 0).toLocaleString()}</div>
 </div>
 ))
 ) : (
 <div className="rounded-xl border border-dashed border-utility-gray/60 py-10 text-center text-sm text-secondary/60">
 No orders recorded.
 </div>
 )}
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 )}
 </div>
 );
};
const AdminsView = ({ roleFilter = null }) => {
 const confirm = useConfirm();
 const [admins, setAdmins] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingStaff, setEditingStaff] = useState(null);
 const [submitting, setSubmitting] = useState(false);
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 password: '',
 accessPreset: 'limited',
 permissions: [],
 });

 const fetchAdmins = async () => {
 setLoading(true);
 try {
 const [resStaff, resAdmin] = await Promise.all([
 adminCustomerAPI.getStaff(),
 adminCustomerAPI.getAdmins(),
 ]);
 const combined = [...(resAdmin.data.data || []), ...(resStaff.data.data || [])];
 setAdmins(combined);
 } catch (error) {
 console.error('Error fetching users:', error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchAdmins();
 }, []);

 const handleOpenModal = () => {
 setEditingStaff(null);
 setFormData({
 name: '',
 email: '',
 password: '',
 accessPreset: 'limited',
 permissions: [],
 });
 setIsModalOpen(true);
 };

 const handleOpenEdit = (staff) => {
 const permissions = parsePermissions(staff.permissions);
 setEditingStaff(staff);
 setFormData({
 name: staff.name || '',
 email: staff.email || '',
 password: '',
 accessPreset: detectStaffPreset(permissions),
 permissions,
 });
 setIsModalOpen(true);
 };

 const handlePresetChange = (presetId) => {
 const preset = STAFF_ACCESS_PRESETS.find((p) => p.id === presetId);
 if (!preset) return;
 setFormData({
 ...formData,
 accessPreset: presetId,
 permissions: preset.id === 'custom' ? formData.permissions : [...preset.permissions],
 });
 };

 const handlePermissionToggle = (permission, checked) => {
 setFormData({
 ...formData,
 accessPreset: 'custom',
 permissions: applyPermissionToggle(formData.permissions, permission, checked),
 });
 };

 const handleCloseModal = () => {
 setIsModalOpen(false);
 setEditingStaff(null);
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setSubmitting(true);
 try {
 if (editingStaff) {
 await adminCustomerAPI.updateStaff(editingStaff.id, {
 name: formData.name,
 permissions: normalizeStaffPermissions(formData.permissions),
 });
 adminToast.success('Staff duties updated');
 } else {
 await adminCustomerAPI.createStaff({
 ...formData,
 permissions: normalizeStaffPermissions(formData.permissions),
 });
 adminToast.success('Staff account created');
 }
 setIsModalOpen(false);
 setEditingStaff(null);
 fetchAdmins();
 } catch (error) {
 adminToast.error(apiErrorMessage(error, editingStaff ? 'Could not update staff' : 'Could not create staff'));
 } finally {
 setSubmitting(false);
 }
 };

 const handleToggleStatus = async (id, currentStatus) => {
 try {
 await adminCustomerAPI.updateStatus(id, !currentStatus);
 fetchAdmins();
 } catch (error) {
 console.error('Error updating status:', error);
 }
 };

 const handleDeleteStaff = async (id) => {
 const ok = await confirm({
 title: 'Remove staff member',
 message: 'This staff member will lose access to the admin dashboard immediately.',
 confirmLabel: 'Remove staff',
 variant: 'danger',
 });
 if (!ok) return;
 try {
 await adminCustomerAPI.deleteStaff(id);
 adminToast.success('Staff removed');
 fetchAdmins();
 } catch (error) {
 adminToast.error(apiErrorMessage(error, 'Could not remove staff'));
 }
 };

 const visibleAdmins = roleFilter
 ? admins.filter((a) => a.role === roleFilter)
 : admins;

 return (
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <p className="text-xs text-secondary/60">{visibleAdmins.length} {roleFilter || 'dashboard'} user(s)</p>
 {roleFilter === 'staff' && (
 <button 
 type="button"
 onClick={handleOpenModal}
 className="px-4 sm:px-6 py-3 bg-accent-600 text-base-950 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-500 transition-all shadow-lg shadow-accent-600/20 text-sm"
 >
 <UserPlus size={20} /> Add staff
 </button>
 )}
 </div>
 
 {loading ? (
 <div className="py-24 text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500 mx-auto"></div>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {visibleAdmins.length > 0 ? visibleAdmins.map((admin, i) => (
 <div key={i} className={`bg-utility-gray/40 border-l-4 border-accent-500 p-6 rounded-r-2xl border-y border-r border-utility-gray/60 backdrop-blur-sm group`}>
 <div className="flex justify-between items-start mb-4">
 <div>
 <div className="text-sm font-bold text-secondary flex items-center gap-2">
 {admin.name}
 {admin.is_active === false && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
 </div>
 <div className="text-xs text-secondary/60">{admin.email}</div>
 {admin.role === 'staff' && (
 <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded ${
 admin.is_active !== false ? 'bg-green-400/10 text-green-600' : 'bg-red-400/10 text-red-600'
 }`}>
 {admin.is_active !== false ? 'Active' : 'Suspended'}
 </span>
 )}
 </div>
 <span className={`text-[9px] font-bold px-2 py-1 rounded bg-utility-gray border border-utility-gray/60 ${admin.role === 'admin' ? 'text-accent-400' : 'text-blue-400'}`}>
 {admin.role}
 </span>
 </div>
 <div className="pt-4 border-t border-accent-500/5 flex justify-between items-center text-[10px]">
 <span className="text-secondary/70 ">ID: {admin.id.substring(0, 8)}</span>
 <div className="flex gap-2">
 {admin.role === 'staff' && (
 <>
 <button
 type="button"
 onClick={() => handleOpenEdit(admin)}
 className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider text-secondary hover:text-accent-400 hover:bg-utility-gray transition-all flex items-center gap-1"
 >
 <Eye size={14} /> View staff
 </button>
 <button 
 type="button"
 onClick={() => handleDeleteStaff(admin.id)}
 className="p-1.5 rounded-lg text-red-600 hover:text-red-600 hover:bg-red-400/5 transition-all"
 title="Remove Staff"
 >
 <Trash2 size={14} />
 </button>
 </>
 )}
 <button 
 onClick={() => handleToggleStatus(admin.id, admin.is_active !== false)}
 className="p-1.5 rounded-lg text-secondary/60 hover:text-accent-500 hover:bg-utility-gray transition-all"
 title={admin.is_active !== false ? "Suspend Access" : "Restore Access"}
 >
 {admin.is_active !== false ? <UserMinus size={14} /> : <CheckCircle2 size={14} />}
 </button>
 </div>
 </div>
 </div>
 )) : (
 <div className="col-span-full py-12 text-center text-secondary/60 text-sm">No admin accounts found.</div>
 )}
 </div>
 )}

 {/* Admin/Staff Modal */}
 {isModalOpen && (
 <div className="fixed inset-0 z-50 overflow-y-auto">
 <button
 type="button"
 aria-label="Close"
 className="fixed inset-0 bg-primary/80 backdrop-blur-sm"
 onClick={handleCloseModal}
 />
 <div className="relative flex min-h-full items-center justify-center p-4 py-8">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative bg-utility-gray border border-utility-gray/60 rounded-2xl w-full max-w-md max-h-[min(90dvh,720px)] flex flex-col shadow-2xl"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex shrink-0 justify-between items-center p-6 border-b border-utility-gray/60 bg-utility-gray/50">
 <h3 className="font-serif font-bold text-secondary text-xl">
 {editingStaff ? 'View staff & re-assign duties' : 'Add staff'}
 </h3>
 <button type="button" onClick={handleCloseModal} className="text-secondary/60 hover:text-accent-500 transition-colors">
 <X size={20} />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
 <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
 <div className="space-y-4">
 <div>
 <label className="block text-[10px] font-bold text-secondary/70 mb-2">Full Name</label>
 <input 
 type="text" 
 required
 value={formData.name}
 onChange={(e) => setFormData({...formData, name: e.target.value})}
 className="w-full bg-primary/50 border border-utility-gray/60 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-accent-500/50 transition-colors placeholder:text-accent-500/20"
 placeholder="E.g. James Arthur"
 />
 </div>

 <div>
 <label className="block text-[10px] font-bold text-secondary/70 mb-2">Email Address</label>
 <input 
 type="email" 
 required
 readOnly={Boolean(editingStaff)}
 value={formData.email}
 onChange={(e) => setFormData({...formData, email: e.target.value})}
 className={`w-full bg-primary/50 border border-utility-gray/60 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-accent-500/50 transition-colors placeholder:text-accent-500/20 ${editingStaff ? 'opacity-60 cursor-not-allowed' : ''}`}
 placeholder="staff@prince-esquare.com"
 />
 </div>

 {!editingStaff && (
 <div>
 <label className="block text-[10px] font-bold text-secondary/70 mb-2">Temporary Password</label>
 <input 
 type="password" 
 required
 value={formData.password}
 onChange={(e) => setFormData({...formData, password: e.target.value})}
 className="w-full bg-primary/50 border border-utility-gray/60 rounded-xl px-4 py-3 text-secondary focus:outline-none focus:border-accent-500/50 transition-colors placeholder:text-accent-500/20"
 placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
 />
 </div>
 )}

 <div>
 <label className="block text-[10px] font-bold text-secondary/70 mb-2">Access role</label>
 <div className="space-y-2">
 {STAFF_ACCESS_PRESETS.map((preset) => (
 <label
 key={preset.id}
 className={`block p-3 rounded-xl border cursor-pointer transition-all ${
 formData.accessPreset === preset.id
 ? 'border-accent-500/50 bg-accent-500/10'
 : 'border-accent-500/15 bg-primary/40 hover:border-accent-500/30'
 }`}
 >
 <div className="flex items-start gap-3">
 <input
 type="radio"
 name="accessPreset"
 checked={formData.accessPreset === preset.id}
 onChange={() => handlePresetChange(preset.id)}
 className="mt-1"
 />
 <div>
 <p className="text-sm font-bold text-secondary">{preset.label}</p>
 <p className="text-[11px] text-secondary/50 mt-0.5">{preset.description}</p>
 </div>
 </div>
 </label>
 ))}
 </div>
 </div>

 {(formData.accessPreset === 'custom' || editingStaff) && (
 <div>
 <label className="block text-[10px] font-bold text-secondary/70 mb-2">
 {editingStaff ? 'Assigned duties' : 'Custom duties'}
 </label>
 <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar p-3 bg-primary/50 border border-utility-gray/60 rounded-xl">
 {STAFF_PERMISSION_GROUPS.map((group) => (
 <div key={group.label}>
 <p className="text-[9px] font-bold text-secondary/60 mb-1">{group.label}</p>
 {group.hint && (
 <p className="text-[10px] text-secondary/70 mb-2">{group.hint}</p>
 )}
 <div className="grid grid-cols-1 gap-2">
 {group.permissions.map((perm) => (
 <label key={perm} className="flex items-center gap-2 cursor-pointer group">
 <input
 type="checkbox"
 checked={formData.permissions.includes(perm)}
 onChange={(e) => handlePermissionToggle(perm, e.target.checked)}
 className="w-3.5 h-3.5 rounded border-utility-gray/60 bg-utility-gray text-accent-600 focus:ring-0 focus:ring-offset-0"
 />
 <span className="text-[10px] font-bold text-secondary group-hover:text-accent-500 transition-colors">
 {perm.replace(/-/g, ' ')}
 </span>
 </label>
 ))}
 </div>
 </div>
 ))}
 </div>
 <p className="text-[10px] text-secondary/60 mt-2">
 Staff accounts can be configured with specific access to products, orders, blog, and finance sections.
 </p>
 </div>
 )}
 </div>
 </div>

 <div className="shrink-0 p-6 pt-4 border-t border-utility-gray/60 bg-utility-gray rounded-b-2xl">
 <button
 type="submit"
 disabled={submitting}
 className="w-full bg-accent-600 text-base-950 py-4 rounded-xl font-bold hover:bg-accent-500 transition-all disabled:opacity-50"
 >
 {submitting ? (editingStaff ? 'SAVING...' : 'CREATING...') : (editingStaff ? 'SAVE CHANGES' : 'CREATE STAFF ACCOUNT')}
 </button>
 </div>
 </form>
 </motion.div>
 </div>
 </div>
 )}
 </div>
 );
};

const ReviewsView = () => {
 const confirm = useConfirm();
 const [reviews, setReviews] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchReviews = async () => {
 try {
 const res = await adminReviewAPI.getAll();
 setReviews(res.data.data);
 } catch (error) {
 console.error('Error fetching reviews:', error);
 } finally {
 setLoading(false);
 }
 };
 fetchReviews();
 }, []);

 const handleApprove = async (id) => {
 try {
 await adminReviewAPI.approve(id);
 setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: true } : r));
 } catch (error) {
 console.error('Error approving review:', error);
 }
 };

 const handleDelete = async (id) => {
 const ok = await confirm({
 title: 'Delete review',
 message: 'This customer review will be permanently removed from your store.',
 confirmLabel: 'Delete review',
 variant: 'danger',
 });
 if (!ok) return;
 try {
 await adminReviewAPI.remove(id);
 setReviews(reviews.filter(r => r.id !== id));
 } catch (error) {
 console.error('Error deleting review:', error);
 }
 };

 const pendingCount = reviews.filter(r => !r.is_approved).length;

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <h3 className="text-xl font-serif font-bold text-secondary">Customer Feedback</h3>
 {pendingCount > 0 && (
 <span className="bg-accent-600 text-base-950 px-2 py-0.5 rounded-full text-[10px] font-black ">
 {pendingCount} Pending
 </span>
 )}
 </div>
 </div>

 {loading ? (
 <div className="py-24 text-center">
 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500 mx-auto"></div>
 </div>
 ) : reviews.length > 0 ? (
 <div className="space-y-4">
 {reviews.map((r) => (
 <div key={r.id} className="bg-utility-gray/40 border border-utility-gray/60 p-6 rounded-2xl backdrop-blur-sm relative group">
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-utility-gray rounded-full flex items-center justify-center text-accent-500 font-bold border border-utility-gray/60">
 {userInitials({ name: r.user_name, email: r.user_email })}
 </div>
 <div>
 <div className="text-sm font-bold text-secondary">{r.user_name || 'Anonymous'}</div>
 <div className="text-xs text-secondary/60">{r.product_name}</div>
 </div>
 </div>
 <div className="flex gap-0.5">
 {[1,2,3,4,5].map(star => (
 <Star key={star} size={14} className={star <= r.rating ? 'fill-accent-500 text-accent-500' : 'text-accent-500/10'} />
 ))}
 </div>
 </div>
 <p className="text-sm text-accent-200/80 leading-relaxed mb-6 italic">"{r.comment}"</p>
 <div className="flex items-center justify-between border-t border-accent-500/5 pt-4">
 <span className="text-[10px] text-secondary/70 ">{new Date(r.created_at).toLocaleDateString()}</span>
 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 {!r.is_approved && (
 <button 
 onClick={() => handleApprove(r.id)}
 className="flex items-center gap-2 px-3 py-1.5 bg-green-400 text-base-950 rounded-lg text-[10px] font-black "
 >
 <CheckCircle2 size={12} /> Approve
 </button>
 )}
 <button 
 onClick={() => handleDelete(r.id)}
 className="flex items-center gap-2 px-3 py-1.5 bg-red-400/10 text-red-600 rounded-lg text-[10px] font-black border border-red-400/20"
 >
 <Trash2 size={12} /> Delete
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-24 text-center text-secondary/60 text-sm bg-utility-gray/40 border border-utility-gray/60 rounded-2xl border-dashed">
 No reviews yet.
 </div>
 )}
 </div>
 );
};

const SettingsView = () => {
 const [settings, setSettings] = useState({
 store_name: '',
 support_email: '',
 phone_number: '',
 store_currency: '',
 });
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [adminsLoading, setAdminsLoading] = useState(true);
 const [creatingAdmin, setCreatingAdmin] = useState(false);
 const [admins, setAdmins] = useState([]);
 const [editingAdminId, setEditingAdminId] = useState(null);
 const [adminForm, setAdminForm] = useState({
 name: '',
 email: '',
 password: '',
 });

 useEffect(() => {
 const fetchSettings = async () => {
 try {
 const res = await adminSettingsAPI.get();
 setSettings(res.data.data);
 } catch (error) {
 console.error('Error fetching settings:', error);
 } finally {
 setLoading(false);
 }
 };
 fetchSettings();
 }, []);

 useEffect(() => {
 const fetchAdmins = async () => {
 try {
 const res = await adminCustomerAPI.getAdmins();
 setAdmins(res.data?.data || []);
 } catch (error) {
 console.error('Error fetching admins:', error);
 } finally {
 setAdminsLoading(false);
 }
 };
 fetchAdmins();
 }, []);

 const handleSave = async () => {
 setSaving(true);
 try {
 await adminSettingsAPI.update(settings);
 alert('Settings updated successfully');
 } catch (error) {
 console.error('Error saving settings:', error);
 alert('Error saving settings');
 } finally {
 setSaving(false);
 }
 };

 const resetAdminForm = () => {
 setEditingAdminId(null);
 setAdminForm({ name: '', email: '', password: '' });
 };

 const handleEditAdmin = (admin) => {
 setEditingAdminId(admin.id);
 setAdminForm({
 name: admin.name || '',
 email: admin.email || '',
 password: '',
 });
 };

 const refreshAdmins = async () => {
 try {
 const res = await adminCustomerAPI.getAdmins();
 setAdmins(res.data?.data || []);
 } catch (error) {
 console.error('Error refreshing admins:', error);
 }
 };

 const handleCreateAdmin = async (e) => {
 e.preventDefault();
 setCreatingAdmin(true);
 try {
 if (editingAdminId) {
 const payload = {
 name: adminForm.name,
 email: adminForm.email,
 };
 if (adminForm.password) payload.password = adminForm.password;
 await adminCustomerAPI.updateAdmin(editingAdminId, payload);
 adminToast.success('Admin account updated');
 } else {
 await adminCustomerAPI.createAdmin(adminForm);
 adminToast.success('Admin account created');
 }
 await refreshAdmins();
 resetAdminForm();
 } catch (error) {
 adminToast.error(apiErrorMessage(error, editingAdminId ? 'Could not update admin account' : 'Could not create admin account'));
 } finally {
 setCreatingAdmin(false);
 }
 };

 return (
 <div className="space-y-8 pb-12">
 <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
 <div className="space-y-8 lg:col-span-2">
 <div className="rounded-2xl border border-utility-gray/60 bg-utility-gray/40 p-8 backdrop-blur-sm">
 <h4 className="mb-6 flex items-center gap-3 font-serif text-xl font-bold text-secondary">
 <Settings size={20} className="text-accent-500" /> Store Information
 </h4>
 {loading ? (
 <div className="py-12 text-center text-xs text-secondary/60">Retrieving configurations...</div>
 ) : (
 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
 {[
 { label: 'Store Name', key: 'store_name' },
 { label: 'Support Email', key: 'support_email' },
 { label: 'Phone Number', key: 'phone_number' },
 { label: 'Store Currency', key: 'store_currency' },
 ].map((f, i) => (
 <div key={i} className="space-y-2">
 <label className="text-[10px] font-black text-secondary/60">{f.label}</label>
 <input 
 type="text" 
 value={settings[f.key] || ''} 
 onChange={(e) => {
 let val = e.target.value;
 if (!f.key.includes('email') && !f.key.includes('phone')) {
 val = val.toUpperCase();
 }
 setSettings({ ...settings, [f.key]: val });
 }}
 className="w-full rounded-xl border border-utility-gray/60 bg-primary px-4 py-3 font-bold text-secondary outline-none transition-all focus:border-accent-500/40"
 />
 </div>
 ))}
 </div>
 )}
 </div>

 <div className="rounded-2xl border border-utility-gray/60 bg-utility-gray/40 p-8 backdrop-blur-sm">
 <h4 className="mb-6 flex items-center gap-3 font-serif text-xl font-bold text-secondary">
 <Mail size={20} className="text-accent-500" /> Notification Preferences
 </h4>
 <div className="space-y-4">
 {[
 'Order Confirmation Emails',
 'Low Stock Alerts',
 'New Customer Registrations',
 'Daily Sales Summaries',
 ].map((pref, i) => (
 <label key={i} className="flex items-center justify-between rounded-xl border border-accent-500/5 bg-primary/50 p-4">
 <span className="text-xs font-bold text-secondary transition-colors">{pref}</span>
 <div className="relative h-6 w-12 rounded-full border border-utility-gray/60 bg-base-800">
 <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-accent-600" />
 </div>
 </label>
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-8">
 <div className="rounded-2xl border border-utility-gray/60 bg-utility-gray/40 p-8 backdrop-blur-sm">
 <div className="mb-5 flex items-center gap-3">
 <ShieldCheck size={20} className="text-accent-500" />
 <div>
 <h5 className="font-serif text-lg font-bold text-secondary">Admin accounts</h5>
 <p className="text-xs text-secondary/60">Edit existing admin access or select one to update.</p>
 </div>
 </div>
 {adminsLoading ? (
 <div className="py-10 text-center text-xs text-secondary/60">Loading admins...</div>
 ) : admins.length ? (
 <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
 {admins.map((admin) => (
 <div key={admin.id} className="rounded-xl border border-utility-gray/60 bg-primary/50 p-4 flex items-start justify-between gap-3">
 <div>
 <div className="flex items-center gap-2">
 <p className="text-sm font-bold text-secondary">{admin.name}</p>
 {admin.is_active === false && <span className="h-2 w-2 rounded-full bg-red-500" />}
 </div>
 <p className="text-[10px] uppercase tracking-[0.2em] text-accent-500/35">{admin.email}</p>
 <p className="mt-1 text-[10px] text-secondary/70">ID: {String(admin.id).substring(0, 8)}</p>
 </div>
 <button
 type="button"
 onClick={() => handleEditAdmin(admin)}
 className="inline-flex items-center gap-2 rounded-lg border border-accent-500/15 px-3 py-2 text-[10px] font-bold text-secondary hover:border-accent-500/40"
 >
 <Edit size={12} /> Edit
 </button>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-10 text-center text-xs text-secondary/60">No admin accounts found.</div>
 )}
 </div>

 <div className="rounded-2xl border border-utility-gray/60 bg-utility-gray/40 p-8 backdrop-blur-sm">
 <div className="mb-5 flex items-center gap-3">
 <ShieldCheck size={20} className="text-accent-500" />
 <div>
 <h5 className="font-serif text-lg font-bold text-secondary">{editingAdminId ? 'Edit admin account' : 'Add another admin'}</h5>
 <p className="text-xs text-secondary/60">{editingAdminId ? 'Update the selected admin details below.' : 'Create a full admin account from the settings page.'}</p>
 </div>
 </div>
 <form onSubmit={handleCreateAdmin} className="space-y-4">
 <input
 type="text"
 required
 value={adminForm.name}
 onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
 placeholder="Full name"
 className="w-full rounded-xl border border-utility-gray/60 bg-primary px-4 py-3 text-sm text-secondary outline-none placeholder:text-accent-500/25 focus:border-accent-500/40"
 />
 <input
 type="email"
 required
 value={adminForm.email}
 onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
 placeholder="Email address"
 className="w-full rounded-xl border border-utility-gray/60 bg-primary px-4 py-3 text-sm text-secondary outline-none placeholder:text-accent-500/25 focus:border-accent-500/40"
 />
 <input
 type="password"
 required={!editingAdminId}
 value={adminForm.password}
 onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
 placeholder={editingAdminId ? 'New password (optional)' : 'Temporary password'}
 className="w-full rounded-xl border border-utility-gray/60 bg-primary px-4 py-3 text-sm text-secondary outline-none placeholder:text-accent-500/25 focus:border-accent-500/40"
 />
 <button 
 type="submit"
 disabled={creatingAdmin}
 className="w-full rounded-2xl bg-accent-600 py-4 font-black tracking-[0.2em] text-base-950 shadow-xl shadow-accent-600/10 transition-all hover:bg-accent-500 disabled:opacity-50"
 >
 {creatingAdmin ? 'SAVING...' : editingAdminId ? 'UPDATE ADMIN' : 'CREATE ADMIN'}
 </button>
 {editingAdminId && (
 <button
 type="button"
 onClick={resetAdminForm}
 className="w-full rounded-2xl border border-accent-500/15 py-4 font-black tracking-[0.2em] text-secondary transition-all hover:border-accent-500/40"
 >
 CANCEL EDIT
 </button>
 )}
 </form>
 </div>

 <button 
 onClick={handleSave}
 disabled={saving}
 className="w-full rounded-2xl bg-accent-600 py-5 font-black tracking-[0.2em] text-base-950 shadow-xl shadow-accent-600/10 transition-all hover:bg-accent-500 disabled:opacity-50"
 >
 {saving ? 'UPDATING...' : 'SAVE CONFIGURATIONS'}
 </button>
 </div>
 </div>
 </div>
 );
};
export default AdminDashboard;

