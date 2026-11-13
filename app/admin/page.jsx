'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { DEFAULT_SITE_CONTENT } from '../../lib/siteContent';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAdmin, login } = useAuth();

  // Admin login credentials state
  const [adminEmail, setAdminEmail] = useState('admin@earthglaze.in');
  const [adminPassword, setAdminPassword] = useState('EarthGlaze@2026');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Tab
  const [currentTab, setCurrentTab] = useState('analytics'); // 'analytics', 'products', 'orders', 'customers', 'coupons', 'cms'

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // CMS Content Management State
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);
  const [selectedCmsPage, setSelectedCmsPage] = useState('home');
  const [selectedCmsSection, setSelectedCmsSection] = useState('hero');
  const [savingCms, setSavingCms] = useState(false);

  // Modals & Forms
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  
  // New coupon form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percent',
    value: 10,
    min_order_amount: 0,
    max_discount_amount: 200,
  });

  const notify = (msg, type = 'success') => {
    setActionMessage({ text: msg, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const loadAllAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [statsRes, prodRes, ordRes, custRes, coupRes, contentRes] = await Promise.all([
        api.admin.getDashboard(),
        api.admin.getProducts(),
        api.admin.getOrders(),
        api.admin.getCustomers(),
        api.admin.getCoupons(),
        api.admin.getContent(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (prodRes.success && Array.isArray(prodRes.products)) setProducts(prodRes.products);
      if (ordRes.success && Array.isArray(ordRes.orders)) setOrders(ordRes.orders);
      if (custRes.success && Array.isArray(custRes.customers)) setCustomers(custRes.customers);
      if (coupRes.success && Array.isArray(coupRes.coupons)) setCoupons(coupRes.coupons);
      if (contentRes.success && contentRes.content) setSiteContent(contentRes.content);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin, loadAllAdminData]);

  // Handle Admin Sign In
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await login(adminEmail, adminPassword);
      if (!res.success) {
        setLoginError(res.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setLoginError('Authentication failed. Please verify your credentials.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Update Product Price & Stock
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await api.admin.updateProduct(editingProduct.id, {
        price: parseFloat(editPrice),
        sale_price: parseFloat(editPrice),
        stock_qty: parseInt(editStock, 10),
      });
      if (res.success) {
        notify(`Updated ${editingProduct.name} successfully!`);
        setEditingProduct(null);
        loadAllAdminData();
      } else {
        notify(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      notify('Failed to update product', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.admin.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        notify(`Order status updated to "${newStatus}"!`);
        loadAllAdminData();
      } else {
        notify(res.message || 'Failed to update order', 'error');
      }
    } catch (err) {
      notify('Server communication error', 'error');
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.admin.createCoupon(newCoupon);
      if (res.success) {
        notify(`Coupon "${newCoupon.code.toUpperCase()}" created!`);
        setNewCoupon({ code: '', type: 'percent', value: 10, min_order_amount: 0, max_discount_amount: 200 });
        loadAllAdminData();
      } else {
        notify(res.message || 'Coupon creation failed', 'error');
      }
    } catch (err) {
      notify('Coupon creation error', 'error');
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to deactivate this coupon?')) return;
    try {
      const res = await api.admin.deleteCoupon(id);
      if (res.success) {
        notify('Coupon deactivated.');
        loadAllAdminData();
      }
    } catch (err) {
      notify('Failed to delete coupon', 'error');
    }
  };

  // CMS: Update single section field (text, title, image, etc.)
  const handleUpdateCmsField = (pageKey, sectionKey, field, value) => {
    setSiteContent((prev) => {
      const updated = { ...prev };
      if (!updated[pageKey]) updated[pageKey] = {};
      if (!updated[pageKey][sectionKey]) updated[pageKey][sectionKey] = {};
      updated[pageKey][sectionKey] = {
        ...updated[pageKey][sectionKey],
        [field]: value,
      };
      return updated;
    });
  };

  // CMS: Update single point within section
  const handleUpdateCmsPoint = (pageKey, sectionKey, pointIndex, field, value) => {
    setSiteContent((prev) => {
      const updated = { ...prev };
      const sec = updated[pageKey]?.[sectionKey] || {};
      const points = Array.isArray(sec.points) ? [...sec.points] : [];
      if (points[pointIndex]) {
        points[pointIndex] = { ...points[pointIndex], [field]: value };
      }
      updated[pageKey][sectionKey] = { ...sec, points };
      return updated;
    });
  };

  // CMS: Add new point to section
  const handleAddCmsPoint = (pageKey, sectionKey) => {
    setSiteContent((prev) => {
      const updated = { ...prev };
      const sec = updated[pageKey]?.[sectionKey] || {};
      const points = Array.isArray(sec.points) ? [...sec.points] : [];
      points.push({
        id: Date.now(),
        title: 'New Feature or Highlight',
        desc: 'Describe this botanical highlight or benefit here.',
        icon: '🌿',
        text: 'Handcrafted botanical formulation benefit',
      });
      updated[pageKey][sectionKey] = { ...sec, points };
      return updated;
    });
    notify('Added new point. Remember to click Save Changes below.');
  };

  // CMS: Delete point from section
  const handleDeleteCmsPoint = (pageKey, sectionKey, pointIndex) => {
    setSiteContent((prev) => {
      const updated = { ...prev };
      const sec = updated[pageKey]?.[sectionKey] || {};
      const points = Array.isArray(sec.points) ? [...sec.points] : [];
      points.splice(pointIndex, 1);
      updated[pageKey][sectionKey] = { ...sec, points };
      return updated;
    });
  };

  // CMS: Save all content to persistent store & server API
  const handleSaveCms = async () => {
    setSavingCms(true);
    try {
      const res = await api.admin.saveAllContent(siteContent);
      if (res.success) {
        notify('Page sections, images, and points saved to live store!');
      } else {
        notify(res.message || 'Saved locally.', 'success');
      }
    } catch (e) {
      notify('Failed to save CMS changes', 'error');
    } finally {
      setSavingCms(false);
    }
  };

  // CMS: Reset to default botanical content
  const handleResetCms = () => {
    if (!confirm('Are you sure you want to restore all original botanical texts, points, and images?')) return;
    const res = api.admin.resetContent();
    setSiteContent(res.content);
    notify('Restored original botanical defaults!');
  };

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FAF7F2] flex items-center justify-center text-sm font-semibold text-stone-500">
        Verifying admin authorization...
      </div>
    );
  }

  // =========================================================================
  // LOGIN / ACCESS DENIED SCREEN
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E8DEC8] space-y-6">
          <div className="text-center space-y-2">
            <span className="w-12 h-12 rounded-full bg-[#1E3B2B] text-amber-300 font-bold flex items-center justify-center mx-auto text-xl shadow">
              🛡️
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#1E3B2B]">
              EarthGlaze Administration
            </h1>
            <p className="text-xs text-stone-500">
              Restricted area. Please authenticate with administrator credentials to manage the store.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input 
                type="email" 
                required 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input 
                type="password" 
                required 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer active:scale-95"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In as Administrator →'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-stone-500 hover:text-stone-800 underline">
              ← Return to EarthGlaze Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="w-full min-h-screen bg-[#F6F3ED] text-[#1E3B2B] font-sans pb-16">
      
      {/* Toast Notification */}
      {actionMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full shadow-2xl text-white text-xs font-semibold flex items-center gap-2 ${
          actionMessage.type === 'success' ? 'bg-[#0D2D1C] border border-emerald-500/40' : 'bg-red-800'
        }`}>
          <span>{actionMessage.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/earthglaze-logo-hd.png" alt="EarthGlaze" className="h-9 w-auto" />
            <span className="h-6 w-px bg-stone-300"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3B2B] bg-[#E3EBE4] px-2.5 py-1 rounded-full">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-stone-600 hidden sm:inline">
              Logged in as <strong className="text-stone-900">{user.email}</strong>
            </span>
            <Link 
              href="/" 
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 transition text-stone-700"
            >
              View Live Store ↗
            </Link>
            <button
              type="button"
              onClick={loadAllAdminData}
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 transition text-stone-800 font-bold"
            >
              {loadingData ? 'Refreshing...' : '↻ Refresh'}
            </button>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-stone-100">
          {[
            { id: 'analytics', label: '📊 Overview & Analytics' },
            { id: 'products', label: '🌿 Products & Inventory' },
            { id: 'orders', label: '📦 Orders & Fulfillment' },
            { id: 'customers', label: '👥 Customers' },
            { id: 'coupons', label: '🏷️ Coupons & Discounts' },
            { id: 'cms', label: '📄 Pages & Content CMS' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap cursor-pointer ${
                currentTab === tab.id
                  ? 'border-[#1E3B2B] text-[#1E3B2B] font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* ===================================================================
            TAB 1: ANALYTICS & OVERVIEW
            =================================================================== */}
        {currentTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Sales &amp; Business Metrics</h2>
              <p className="text-xs text-stone-500 mt-0.5">Real-time statistics synced with MySQL database.</p>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Total Sales Revenue
                </span>
                <span className="text-3xl font-bold text-[#1E3B2B]">
                  ₹{stats?.total_sales || '0.00'}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  Verified payments &amp; settled orders
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Total Orders
                </span>
                <span className="text-3xl font-bold text-[#1E3B2B]">
                  {stats?.total_orders || 0}
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  {stats?.orders_by_status?.processing || 0} processing, {stats?.orders_by_status?.shipped || 0} in transit
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Active Customers
                </span>
                <span className="text-3xl font-bold text-[#1E3B2B]">
                  {stats?.total_customers || 0}
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  Registered profiles in database
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Catalog Inventory
                </span>
                <span className="text-3xl font-bold text-emerald-700">
                  {products.reduce((acc, p) => acc + (p.stock_qty || 0), 0)} units
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  Across the 3 active artisan skincare products
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">Recent Orders</h3>
                <button
                  type="button"
                  onClick={() => setCurrentTab('orders')}
                  className="text-xs font-bold text-[#1E3B2B] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-3 px-3">Order #</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 font-bold text-[#1E3B2B]">#{ord.order_number}</td>
                        <td className="py-3 px-3 font-medium text-stone-800">{ord.customer_name}</td>
                        <td className="py-3 px-3 text-stone-500">{new Date(ord.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-3 uppercase font-semibold text-stone-600">{ord.payment_method}</td>
                        <td className="py-3 px-3 font-bold text-stone-900">₹{ord.total_amount}</td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: PRODUCTS & INVENTORY
            =================================================================== */}
        {currentTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Products &amp; Inventory</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Current active catalog (Only the 3 authorized artisan products).
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Image</th>
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">SKU</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock Qty</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] p-1 flex items-center justify-center border border-stone-200">
                            <img 
                              src={p.image_photo || p.image_closed || p.image || '/assets/shop_card_manjistha_hd.png'} 
                              alt={p.name} 
                              className="max-h-full max-w-full object-contain" 
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-stone-900 block font-serif text-sm">{p.name}</strong>
                          <span className="text-[11px] text-stone-400">{p.weight || '100 g'}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-600 font-semibold">{p.sku || p.slug?.toUpperCase()}</td>
                        <td className="py-3 px-4 text-stone-600">{p.category?.name || p.category_name || p.category || 'Soaps'}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">₹{p.sale_price || p.price}</td>
                        <td className="py-3 px-4">
                          <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            (p.stock_qty || 0) < 10 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock_qty || 0} in stock
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                            {p.is_active ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setEditPrice(String(p.sale_price || p.price));
                              setEditStock(String(p.stock_qty || 0));
                            }}
                            className="px-3.5 py-1.5 bg-[#1E3B2B] text-white rounded-xl text-xs font-bold hover:bg-[#14291E] transition cursor-pointer"
                          >
                            Edit Price &amp; Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EDIT MODAL */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                      Update {editingProduct.name}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setEditingProduct(null)} 
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Sale Price (₹)
                      </label>
                      <input 
                        type="number" 
                        required 
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Stock Quantity (Units)
                      </label>
                      <input 
                        type="number" 
                        required 
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-bold shadow cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: ORDERS MANAGEMENT
            =================================================================== */}
        {currentTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Orders &amp; Fulfillment</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Update fulfillment stages directly to notify customers on their tracking screen.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Order Ref</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Current Status</th>
                      <th className="py-3.5 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4">
                          <strong className="text-[#1E3B2B] text-sm block">#{ord.order_number}</strong>
                          <span className="text-[11px] text-stone-400">
                            {new Date(ord.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-stone-900 block">{ord.customer_name}</strong>
                          <span className="text-[11px] text-stone-500 block">{ord.customer_email}</span>
                          <span className="text-[11px] text-stone-500 block">{ord.customer_phone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="text-[11px] text-stone-700">
                                {it.quantity}× {it.product_name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-sm text-stone-900">
                          ₹{ord.total_amount}
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase font-semibold text-stone-700 block">
                            {ord.payment_method}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {ord.payment?.status || 'verified'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#1E3B2B] cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing (Packed)</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: CUSTOMERS
            =================================================================== */}
        {currentTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Registered Customers</h2>
              <p className="text-xs text-stone-500 mt-0.5">Customer profiles saved in MySQL.</p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-4">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 font-bold text-stone-900">{c.name}</td>
                        <td className="py-3 px-4 text-stone-600">{c.email}</td>
                        <td className="py-3 px-4 text-stone-600">{c.phone || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'
                          }`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-500">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {c.orders_count ?? c.orders?.length ?? 1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: COUPONS & DISCOUNTS
            =================================================================== */}
        {currentTab === 'coupons' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Discount Coupons</h2>
              <p className="text-xs text-stone-500 mt-0.5">Create and manage marketing promo codes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form: Add Coupon */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#1E3B2B] border-b border-stone-100 pb-3">
                  Create New Coupon
                </h3>

                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Coupon Code
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. GLOW20" 
                      className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 uppercase font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Type
                      </label>
                      <select 
                        value={newCoupon.type}
                        onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                        className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="fixed">Fixed Flat (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Value
                      </label>
                      <input 
                        type="number" 
                        required 
                        value={newCoupon.value}
                        onChange={(e) => setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) })}
                        className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Minimum Order Amount (₹)
                    </label>
                    <input 
                      type="number" 
                      value={newCoupon.min_order_amount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: parseFloat(e.target.value) })}
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-bold rounded-xl transition shadow cursor-pointer active:scale-95"
                  >
                    Create Coupon Code →
                  </button>
                </form>
              </div>

              {/* List: Existing Coupons */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-stone-100">
                  <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">Active Coupons</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Discount</th>
                        <th className="py-3 px-4">Min Order</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {coupons.map((cp) => (
                        <tr key={cp.id} className="hover:bg-stone-50/70">
                          <td className="py-3 px-4 font-bold text-stone-900 font-mono tracking-wider">
                            🏷️ {cp.code}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#1E3B2B]">
                            {cp.type === 'percent' ? `${cp.value}% OFF` : `₹${cp.value} OFF`}
                          </td>
                          <td className="py-3 px-4 text-stone-600">₹{cp.min_order_amount || 0}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCoupon(cp.id)}
                              className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: PAGES & CONTENT CMS (Update points, text, images & sections)
            =================================================================== */}
        {currentTab === 'cms' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header & Global Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#1E3B2B] flex items-center gap-2">
                  <span>📄</span>
                  <span>Pages &amp; Content Management (CMS)</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Customize headings, points, images, and copy across every page and section of your live store.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleResetCms}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition cursor-pointer"
                >
                  ↺ Restore Defaults
                </button>

                <a
                  href={
                    selectedCmsPage === 'home' ? '/' :
                    selectedCmsPage === 'about' ? '/about' :
                    selectedCmsPage === 'story' ? '/story' :
                    selectedCmsPage === 'shop' ? '/shop' :
                    selectedCmsPage === 'contact' ? '/contact' : '/#faq'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>👁️ Preview Live</span>
                  <span>↗</span>
                </a>

                <button
                  type="button"
                  onClick={handleSaveCms}
                  disabled={savingCms}
                  className="px-6 py-2.5 rounded-xl bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-bold tracking-wide transition shadow cursor-pointer active:scale-95 disabled:opacity-60 flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>{savingCms ? 'Saving Changes...' : 'Save Changes to Live Store'}</span>
                </button>
              </div>
            </div>

            {/* Page Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'home', label: '🏠 Home Page', path: '/' },
                { id: 'about', label: '🌿 About Us Page', path: '/about' },
                { id: 'story', label: '📖 Our Story Page', path: '/story' },
                { id: 'shop', label: '🛍️ Shop Catalog', path: '/shop' },
                { id: 'contact', label: '💬 Contact Page', path: '/contact' },
                { id: 'faq', label: '❓ FAQ & Rituals', path: '/#faq' },
              ].map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => {
                    setSelectedCmsPage(pg.id);
                    // default to first section of newly selected page
                    const availableSections = Object.keys(siteContent[pg.id] || {});
                    if (availableSections.length > 0) {
                      setSelectedCmsSection(availableSections[0]);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    selectedCmsPage === pg.id
                      ? 'bg-[#1E3B2B] text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <span>{pg.label}</span>
                </button>
              ))}
            </div>

            {/* Section Selector for Current Page */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                Available Sections on this Page
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {Object.keys(siteContent[selectedCmsPage] || {}).map((secKey) => (
                  <button
                    key={secKey}
                    type="button"
                    onClick={() => setSelectedCmsSection(secKey)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition capitalize cursor-pointer ${
                      selectedCmsSection === secKey
                        ? 'bg-[#E3EBE4] text-[#1E3B2B] font-bold border border-[#235327]/30'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{secKey.replace(/_/g, ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Section Form Editor */}
            {(() => {
              const currentSectionData = siteContent[selectedCmsPage]?.[selectedCmsSection] || {};
              const points = Array.isArray(currentSectionData.points) ? currentSectionData.points : [];

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (8 cols): Headings, Copy, Points & CTAs */}
                  <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                    
                    <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Editing {selectedCmsPage} • {selectedCmsSection.replace(/_/g, ' ')}
                        </span>
                        <h3 className="font-serif font-bold text-xl text-[#1E3B2B] mt-1 capitalize">
                          {selectedCmsSection.replace(/_/g, ' ')} Content &amp; Points
                        </h3>
                      </div>
                    </div>

                    {/* Section Eyebrow / Tagline */}
                    {'eyebrow' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Section Eyebrow / Tagline
                        </label>
                        <input
                          type="text"
                          value={currentSectionData.eyebrow || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'eyebrow', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                          placeholder="e.g. About Us / Botanical Rituals"
                        />
                      </div>
                    )}

                    {/* Main Title */}
                    {'title' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Main Heading / Title
                        </label>
                        <input
                          type="text"
                          value={currentSectionData.title || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'title', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-serif font-bold text-[#1E3B2B] focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    )}

                    {/* Subtitle */}
                    {'subtitle' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={currentSectionData.subtitle || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'subtitle', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    )}

                    {/* Long Description / Paragraph */}
                    {'description' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Body Text / Description Paragraph
                        </label>
                        <textarea
                          rows={3}
                          value={currentSectionData.description || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'description', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B] leading-relaxed"
                        />
                      </div>
                    )}

                    {/* Formulation Promise / Special Note */}
                    {'promise' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Botanical Formulation Promise Note
                        </label>
                        <textarea
                          rows={2}
                          value={currentSectionData.promise || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'promise', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    )}

                    {/* Primary & Secondary CTA Buttons */}
                    {('cta_primary_label' in currentSectionData || 'cta_secondary_label' in currentSectionData) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                            Primary CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={currentSectionData.cta_primary_label || ''}
                            onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'cta_primary_label', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                            Primary CTA Target Link
                          </label>
                          <input
                            type="text"
                            value={currentSectionData.cta_primary_link || ''}
                            onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'cta_primary_link', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                          />
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC POINTS / HIGHLIGHTS SECTION */}
                    <div className="pt-4 border-t border-stone-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#1E3B2B]">
                            Section Highlights &amp; Bullet Points
                          </h4>
                          <p className="text-xs text-stone-500">
                            Add, edit, or remove specific bullet points, benefits, and feature tags.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddCmsPoint(selectedCmsPage, selectedCmsSection)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>+ Add Point</span>
                        </button>
                      </div>

                      {points.length === 0 ? (
                        <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                          No bullet points for this section yet. Click "+ Add Point" above to create one.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {points.map((pt, pIdx) => (
                            <div 
                              key={pt.id || pIdx} 
                              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-3 transition hover:shadow-xs"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    value={pt.icon || '🌿'}
                                    onChange={(e) => handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'icon', e.target.value)}
                                    className="w-10 h-10 text-center text-lg bg-white rounded-xl border border-stone-300 shrink-0"
                                    title="Icon / Emoji"
                                  />
                                  <input
                                    type="text"
                                    value={pt.title || pt.text || ''}
                                    onChange={(e) => {
                                      handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'title', e.target.value);
                                      handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'text', e.target.value);
                                    }}
                                    placeholder="Point Headline / Benefit"
                                    className="w-full text-xs sm:text-sm font-bold px-3 py-2 bg-white rounded-xl border border-stone-300"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCmsPoint(selectedCmsPage, selectedCmsSection, pIdx)}
                                  className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                  title="Delete this point"
                                >
                                  🗑️
                                </button>
                              </div>

                              {(pt.desc || pt.subtitle !== undefined) && (
                                <textarea
                                  rows={2}
                                  value={pt.desc || pt.subtitle || ''}
                                  onChange={(e) => {
                                    handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'desc', e.target.value);
                                    handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'subtitle', e.target.value);
                                  }}
                                  placeholder="Detailed explanation or supporting description..."
                                  className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Column (4 cols): Media Assets & Live Image Previews */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                      <h4 className="font-serif font-bold text-base text-[#1E3B2B] border-b border-stone-100 pb-2">
                        🖼️ Section Imagery &amp; Visuals
                      </h4>

                      {/* Primary Image Input */}
                      {('image' in currentSectionData || 'bg_image' in currentSectionData || 'banner_image' in currentSectionData) && (
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                            Primary Section Image URL
                          </label>
                          <input
                            type="text"
                            value={currentSectionData.image || currentSectionData.bg_image || currentSectionData.banner_image || ''}
                            onChange={(e) => {
                              const key = 'image' in currentSectionData ? 'image' : 'bg_image' in currentSectionData ? 'bg_image' : 'banner_image';
                              handleUpdateCmsField(selectedCmsPage, selectedCmsSection, key, e.target.value);
                            }}
                            className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-mono text-[11px]"
                            placeholder="/assets/about-img.png"
                          />

                          {/* Live Image Thumbnail Preview */}
                          <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center min-h-[160px]">
                            <img
                              src={currentSectionData.image || currentSectionData.bg_image || currentSectionData.banner_image || '/assets/earthglaze-logo-hd.png'}
                              alt="Live Image Preview"
                              className="max-h-36 w-auto object-contain rounded-lg drop-shadow-sm"
                              onError={(e) => {
                                e.target.src = '/assets/earthglaze-logo-hd.png';
                              }}
                            />
                            <span className="text-[10px] text-stone-400 mt-2 font-mono">
                              Live Asset Preview
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Secondary Image Input (e.g. Mortar or Open Box) */}
                      {'mortar_image' in currentSectionData && (
                        <div className="pt-3 border-t border-stone-100">
                          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                            Secondary Prop Image (Mortar)
                          </label>
                          <input
                            type="text"
                            value={currentSectionData.mortar_image || ''}
                            onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'mortar_image', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 font-mono text-[11px]"
                          />
                        </div>
                      )}

                      {/* Quick HD Asset Suggestions */}
                      <div className="pt-3 border-t border-stone-100">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                          Quick HD Asset Suggestions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: 'Podium', url: '/assets/about-img.png' },
                            { name: 'Mortar Prop', url: '/assets/hero_mortar_prop_transparent.png' },
                            { name: 'Elixir Prop', url: '/assets/hero_bottle_prop_transparent.png' },
                            { name: 'Seamless Arch', url: '/assets/about_hero_seamless_hd.png' },
                            { name: 'Leaves Banner', url: '/assets/banner_newly_leaves.png' },
                            { name: 'Combo Closed', url: '/assets/botanical_combo_original_soaps_closed.png' },
                            { name: 'Combo Open', url: '/assets/botanical_combo_original_soaps_open.png' },
                            { name: 'Manjistha Soap', url: '/assets/favourites_manjistha_soap_hd.png' },
                            { name: 'Goat Milk Soap', url: '/assets/favourites_goat_milk_soap_hd.png' },
                          ].map((ast) => (
                            <button
                              key={ast.name}
                              type="button"
                              onClick={() => {
                                const key = 'image' in currentSectionData ? 'image' : 'bg_image' in currentSectionData ? 'bg_image' : 'banner_image';
                                handleUpdateCmsField(selectedCmsPage, selectedCmsSection, key, ast.url);
                                notify(`Applied ${ast.name} image`);
                              }}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-stone-100 hover:bg-[#E3EBE4] hover:text-[#1E3B2B] rounded-lg transition text-stone-600 cursor-pointer"
                            >
                              + {ast.name}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Save Changes Floating Action Helper */}
                    <div className="bg-[#1E3B2B] text-white p-6 rounded-3xl shadow-lg space-y-3">
                      <h4 className="font-serif font-bold text-base text-amber-300">
                        Ready to Apply Updates?
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Changes are saved immediately and synchronized with your live storefront.
                      </p>
                      <button
                        type="button"
                        onClick={handleSaveCms}
                        disabled={savingCms}
                        className="w-full py-3 bg-[#C28328] hover:bg-[#a66d1f] text-white font-bold text-xs rounded-xl transition shadow active:scale-95 cursor-pointer"
                      >
                        {savingCms ? 'Saving...' : '💾 Save Changes Now'}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })()}

          </div>
        )}

      </main>

    </div>
  );
}
