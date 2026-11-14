'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { DEFAULT_SITE_CONTENT } from '../../lib/siteContent';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAdmin, login, logout } = useAuth();

  // Admin login credentials state (never pre-filled on screen)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
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

  // Product Modals & Forms State
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Artisan Soaps',
    price: 349,
    sale_price: 349,
    stock_qty: 30,
    weight: '100 g',
    description: '',
    image: '/assets/shop_card_manjistha_hd.png',
  });

  // Orders Modals & Forms State
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Customers Modals & Forms State
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerRoleFilter, setCustomerRoleFilter] = useState('all');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
  });

  // Coupons Modals & Forms State
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponSearch, setCouponSearch] = useState('');
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percent',
    value: 10,
    min_order_amount: 0,
    max_discount_amount: 200,
    is_active: true,
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

  // =========================================================================
  // PRODUCT ACTIONS
  // =========================================================================
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await api.admin.updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price || editingProduct.sale_price),
        sale_price: parseFloat(editingProduct.sale_price || editingProduct.price),
        stock_qty: parseInt(editingProduct.stock_qty, 10),
        category: editingProduct.category,
        description: editingProduct.description,
        is_active: editingProduct.is_active,
        image: editingProduct.image,
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

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.admin.createProduct(newProduct);
      if (res.success) {
        notify(`Product "${newProduct.name}" added to catalog!`);
        setShowAddProductModal(false);
        setNewProduct({
          name: '',
          category: 'Artisan Soaps',
          price: 349,
          sale_price: 349,
          stock_qty: 30,
          weight: '100 g',
          description: '',
          image: '/assets/shop_card_manjistha_hd.png',
        });
        loadAllAdminData();
      } else {
        notify(res.message || 'Failed to add product', 'error');
      }
    } catch (err) {
      notify('Error creating product', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return;
    try {
      const res = await api.admin.deleteProduct(id);
      if (res.success) {
        notify(`"${name}" removed from catalog.`);
        loadAllAdminData();
      }
    } catch (err) {
      notify('Failed to delete product', 'error');
    }
  };

  // =========================================================================
  // ORDER ACTIONS
  // =========================================================================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.admin.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        notify(`Order #${orderId} status updated to "${newStatus}"!`);
        loadAllAdminData();
      } else {
        notify(res.message || 'Failed to update order', 'error');
      }
    } catch (err) {
      notify('Server communication error', 'error');
    }
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      const res = await api.admin.updateOrder(editingOrder.id, {
        status: editingOrder.status,
        tracking_number: editingOrder.tracking_number,
        courier: editingOrder.courier,
        shipping_address: editingOrder.shipping_address,
        customer_phone: editingOrder.customer_phone,
        customer_email: editingOrder.customer_email,
        notes: editingOrder.notes,
      });
      if (res.success) {
        notify(`Order #${editingOrder.order_number} details saved!`);
        setEditingOrder(null);
        loadAllAdminData();
      } else {
        notify(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      notify('Failed to update order details', 'error');
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (!confirm(`Are you sure you want to permanently delete Order #${orderNumber}? This will recalculate sales totals.`)) return;
    try {
      const res = await api.admin.deleteOrder(orderId);
      if (res.success) {
        notify(`Order #${orderNumber} deleted.`);
        if (viewingOrder?.id === orderId) setViewingOrder(null);
        if (editingOrder?.id === orderId) setEditingOrder(null);
        loadAllAdminData();
      } else {
        notify(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      notify('Failed to delete order', 'error');
    }
  };

  // =========================================================================
  // CUSTOMER / USER ACTIONS
  // =========================================================================
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    try {
      const res = await api.admin.updateCustomer(editingCustomer.id, {
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        role: editingCustomer.role,
      });
      if (res.success) {
        notify(`Customer "${editingCustomer.name}" updated!`);
        setEditingCustomer(null);
        loadAllAdminData();
      } else {
        notify(res.message || 'Customer update failed', 'error');
      }
    } catch (err) {
      notify('Failed to update customer', 'error');
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.admin.createCustomer(newCustomer);
      if (res.success) {
        notify(`Customer "${newCustomer.name}" created!`);
        setShowAddCustomerModal(false);
        setNewCustomer({ name: '', email: '', phone: '', role: 'customer' });
        loadAllAdminData();
      } else {
        notify(res.message || 'Failed to create customer', 'error');
      }
    } catch (err) {
      notify('Customer creation failed', 'error');
    }
  };

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!confirm(`Are you sure you want to delete customer account for "${customerName}"?`)) return;
    try {
      const res = await api.admin.deleteCustomer(customerId);
      if (res.success) {
        notify(`Customer "${customerName}" removed.`);
        if (viewingCustomer?.id === customerId) setViewingCustomer(null);
        if (editingCustomer?.id === customerId) setEditingCustomer(null);
        loadAllAdminData();
      } else {
        notify(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      notify('Failed to delete customer', 'error');
    }
  };

  // =========================================================================
  // COUPON ACTIONS
  // =========================================================================
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.admin.createCoupon(newCoupon);
      if (res.success) {
        notify(`Coupon "${newCoupon.code.toUpperCase()}" created!`);
        setNewCoupon({ code: '', type: 'percent', value: 10, min_order_amount: 0, max_discount_amount: 200, is_active: true });
        loadAllAdminData();
      } else {
        notify(res.message || 'Coupon creation failed', 'error');
      }
    } catch (err) {
      notify('Coupon creation error', 'error');
    }
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;
    try {
      const res = await api.admin.updateCoupon(editingCoupon.id, {
        code: editingCoupon.code,
        type: editingCoupon.type,
        value: editingCoupon.value,
        min_order_amount: editingCoupon.min_order_amount,
        max_discount_amount: editingCoupon.max_discount_amount,
        is_active: editingCoupon.is_active,
      });
      if (res.success) {
        notify(`Coupon "${editingCoupon.code}" updated successfully!`);
        setEditingCoupon(null);
        loadAllAdminData();
      } else {
        notify(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      notify('Failed to update coupon', 'error');
    }
  };

  const handleToggleCoupon = async (id, code, currentStatus) => {
    try {
      const res = await api.admin.toggleCoupon(id);
      if (res.success) {
        notify(`Coupon "${code}" ${!currentStatus ? 'activated' : 'paused'}!`);
        loadAllAdminData();
      }
    } catch (err) {
      notify('Toggle failed', 'error');
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;
    try {
      const res = await api.admin.deleteCoupon(id);
      if (res.success) {
        notify(`Coupon "${code}" deleted.`);
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
      
      if (sectionKey === 'reviews') {
        points.push({
          id: Date.now(),
          name: 'Verified Customer',
          rating: 5,
          product: 'Artisanal Care',
          comment: 'Wonderful experience with pure botanical formulation.',
          icon: '⭐',
        });
      } else if (sectionKey === 'faq' || sectionKey === 'questions') {
        points.push({
          id: Date.now(),
          title: 'Frequently asked question?',
          desc: 'Detailed transparent response for customer care.',
        });
      } else {
        points.push({
          id: Date.now(),
          title: 'New Botanical Highlight',
          desc: 'Describe this botanical highlight or benefit here.',
          icon: '🌿',
          text: 'Handcrafted botanical formulation benefit',
        });
      }
      
      updated[pageKey][sectionKey] = { ...sec, points };
      return updated;
    });
    notify('Added new item. Click "Save Changes" to publish to live store.');
  };

  // CMS: Handle Direct File Upload for Any Image Field
  const handleImageFileUpload = (pageKey, sectionKey, fieldKey, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      handleUpdateCmsField(pageKey, sectionKey, fieldKey, dataUrl);
      notify(`Loaded new image for ${fieldKey.replace(/_/g, ' ')}! Click Save Changes.`);
    };
    reader.readAsDataURL(file);
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
                placeholder="Enter administrator email"
                autoComplete="off"
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
                placeholder="Enter password"
                autoComplete="new-password"
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
            <button
              type="button"
              onClick={() => logout()}
              className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Sign out of Admin Dashboard"
            >
              <span>Sign Out</span>
              <span>🚪</span>
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

            {/* Metric KPI Cards (Calculated directly from live real dataset) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Total Sales Revenue
                </span>
                <span className="text-3xl font-bold text-[#1E3B2B]">
                  ₹{orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  Verified customer orders &amp; payments
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Total Orders
                </span>
                <span className="text-3xl font-bold text-[#1E3B2B]">
                  {orders.length}
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  {orders.filter(o => o.status === 'processing').length} processing, {orders.filter(o => o.status === 'shipped').length} in transit
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Active Customers
                </span>
                <span className="text-3xl font-bold text-[#1E3B2B]">
                  {customers.length}
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  Registered customer accounts
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
                  Across active catalog formulations
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
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-xs text-stone-400">
                          No customer orders placed yet. Live orders will appear here automatically.
                        </td>
                      </tr>
                    )}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Products &amp; Inventory</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage product catalog, real-time pricing, stock units, and active status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>+ Add New Product</span>
              </button>
            </div>

            {/* Product Search Toolbar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by name, category, or SKU..."
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-[#1E3B2B] shadow-2xs"
                />
                <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {products.filter(p => !productSearch || (p.name || '').toLowerCase().includes(productSearch.toLowerCase())).length} Products
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Image</th>
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price / Sale</th>
                      <th className="py-3.5 px-4">Stock Qty</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products
                      .filter(p => !productSearch || (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || (p.category || '').toLowerCase().includes(productSearch.toLowerCase()))
                      .map((p) => (
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
                        <td className="py-3 px-4 text-stone-600">{p.category?.name || p.category_name || p.category || 'Soaps'}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          ₹{p.sale_price || p.price}
                          {p.sale_price && p.price && p.sale_price !== p.price && (
                            <span className="text-stone-400 line-through font-normal ml-1.5 text-[11px]">₹{p.price}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            (p.stock_qty || 0) < 10 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock_qty || 0} in stock
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            p.is_active !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {p.is_active !== false ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct({ ...p });
                              }}
                              className="px-2.5 py-1.5 bg-stone-100 hover:bg-[#1E3B2B] text-stone-700 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="Edit product"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="Delete product"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EDIT PRODUCT MODAL */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                      Edit Product: {editingProduct.name}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setEditingProduct(null)} 
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Product Name
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Regular Price (₹)
                        </label>
                        <input 
                          type="number" 
                          required 
                          value={editingProduct.price || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Sale Price (₹)
                        </label>
                        <input 
                          type="number" 
                          required 
                          value={editingProduct.sale_price || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value })}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Stock Quantity
                        </label>
                        <input 
                          type="number" 
                          required 
                          value={editingProduct.stock_qty || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock_qty: e.target.value })}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Category
                        </label>
                        <input 
                          type="text" 
                          value={editingProduct.category || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Product Description
                      </label>
                      <textarea
                        rows="2"
                        value={editingProduct.description || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="prod-active-chk"
                        checked={editingProduct.is_active !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                        className="rounded text-[#1E3B2B] focus:ring-[#1E3B2B] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="prod-active-chk" className="text-xs font-bold text-stone-700 cursor-pointer">
                        Active in customer shop catalog
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                      <button 
                        type="button" 
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-bold shadow cursor-pointer"
                      >
                        Save Product Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ADD PRODUCT MODAL */}
            {showAddProductModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                      Add New Botanical Product
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setShowAddProductModal(false)} 
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Product Title
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. Saffron &amp; Sandalwood Radiance Bar"
                        className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                        >
                          <option value="Artisan Soaps">Artisan Soaps</option>
                          <option value="Lip Care">Lip Care</option>
                          <option value="Combos">Combos &amp; Kits</option>
                          <option value="Facial Oils">Facial Oils</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Net Weight
                        </label>
                        <input 
                          type="text" 
                          value={newProduct.weight}
                          onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                          placeholder="e.g. 100 g or 10 ml"
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Price (₹)
                        </label>
                        <input 
                          type="number" 
                          required 
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0, sale_price: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Stock Quantity
                        </label>
                        <input 
                          type="number" 
                          required 
                          value={newProduct.stock_qty}
                          onChange={(e) => setNewProduct({ ...newProduct, stock_qty: parseInt(e.target.value, 10) || 0 })}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Short Botanical Description
                      </label>
                      <textarea
                        rows="2"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Botanical active ingredients and ritual benefits..."
                        className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                      <button 
                        type="button" 
                        onClick={() => setShowAddProductModal(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-bold shadow cursor-pointer"
                      >
                        Add to Store Catalog →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: ORDERS MANAGEMENT (VIEW, EDIT, UPDATE, DELETE)
            =================================================================== */}
        {currentTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Orders &amp; Fulfillment</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                View, update fulfillment stages, edit tracking credentials, addresses, or delete orders.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, customer name, email, phone..."
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1E3B2B]"
                />
                <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition cursor-pointer shrink-0 ${
                      orderStatusFilter === st
                        ? 'bg-[#1E3B2B] text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Order Ref</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders
                      .filter(ord => {
                        const s = orderSearch.toLowerCase();
                        const matchesSearch = !orderSearch || 
                          (ord.order_number || '').toLowerCase().includes(s) ||
                          (ord.customer_name || '').toLowerCase().includes(s) ||
                          (ord.customer_email || '').toLowerCase().includes(s) ||
                          (ord.customer_phone || '').toLowerCase().includes(s);
                        const matchesStatus = orderStatusFilter === 'all' || (ord.status || '').toLowerCase() === orderStatusFilter.toLowerCase();
                        return matchesSearch && matchesStatus;
                      })
                      .map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70">
                        <td className="py-3.5 px-4">
                          <strong className="text-[#1E3B2B] text-sm block">#{ord.order_number}</strong>
                          <span className="text-[11px] text-stone-400">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-stone-900 block">{ord.customer_name}</strong>
                          <span className="text-[11px] text-stone-500 block truncate max-w-[180px]">{ord.customer_email}</span>
                          <span className="text-[11px] text-stone-400 block">{ord.customer_phone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            {ord.items?.slice(0, 2).map((it, idx) => (
                              <div key={idx} className="text-[11px] text-stone-700 truncate max-w-[160px]">
                                {it.quantity}× {it.product_name}
                              </div>
                            ))}
                            {(ord.items?.length || 0) > 2 && (
                              <span className="text-[10px] text-stone-400">+{ord.items.length - 2} more item(s)</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-sm text-stone-900">
                          ₹{ord.total_amount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="uppercase font-semibold text-stone-700 block text-[11px]">
                            {ord.payment_method}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            ord.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {(ord.payment_status || 'pending').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="text-xs font-semibold px-2 py-1 rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-[#1E3B2B] cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingOrder(ord)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-[#1E3B2B] text-stone-700 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="View full order details"
                            >
                              👁️ View
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingOrder({ ...ord })}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-[#1E3B2B] text-stone-700 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="Edit fulfillment &amp; address"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(ord.id, ord.order_number)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="Delete order"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-xs text-stone-400">
                          No orders in database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VIEW ORDER DETAILS MODAL */}
            {viewingOrder && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-stone-200 space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#EAF3EC] text-[#1E3B2B] flex items-center justify-center text-lg">
                        📦
                      </span>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                          Order #{viewingOrder.order_number}
                        </h3>
                        <p className="text-xs text-stone-400">
                          Placed on {new Date(viewingOrder.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingOrder(null)}
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Customer & Delivery Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                    <div>
                      <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Customer Info
                      </span>
                      <strong className="text-stone-900 block font-serif text-sm">{viewingOrder.customer_name}</strong>
                      <span className="text-stone-600 block">{viewingOrder.customer_email}</span>
                      <span className="text-stone-600 block">{viewingOrder.customer_phone}</span>
                    </div>
                    <div>
                      <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
                        Delivery Address
                      </span>
                      <p className="text-stone-700 leading-relaxed">
                        {typeof viewingOrder.shipping_address === 'string'
                          ? viewingOrder.shipping_address
                          : `${viewingOrder.shipping_address?.address || ''}, ${viewingOrder.shipping_address?.city || ''}, ${viewingOrder.shipping_address?.state || ''} - ${viewingOrder.shipping_address?.postal_code || ''}`}
                      </p>
                    </div>
                  </div>

                  {/* Tracking & Courier Status */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-emerald-900 block">
                        Fulfillment: <span className="uppercase">{viewingOrder.status}</span>
                      </span>
                      <span className="text-emerald-700">
                        Courier: {viewingOrder.courier || 'EarthGlaze Express'} • AWB: {viewingOrder.tracking_number || viewingOrder.order_number}
                      </span>
                    </div>
                    <Link
                      href={`/track-order?order_number=${viewingOrder.order_number}`}
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-xl bg-[#1E3B2B] text-white font-bold hover:bg-[#14291E] transition text-xs"
                    >
                      Customer Tracking Page ↗
                    </Link>
                  </div>

                  {/* Items Table */}
                  <div className="space-y-2">
                    <span className="font-serif font-bold text-sm text-stone-900 block">Ordered Items</span>
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3">Item</th>
                            <th className="py-2.5 px-3">Qty</th>
                            <th className="py-2.5 px-3">Price</th>
                            <th className="py-2.5 px-3 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {viewingOrder.items?.map((it, idx) => (
                            <tr key={idx}>
                              <td className="py-2.5 px-3 font-semibold text-stone-900">{it.product_name}</td>
                              <td className="py-2.5 px-3 text-stone-600">{it.quantity}</td>
                              <td className="py-2.5 px-3 text-stone-600">₹{it.unit_price}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-stone-900">₹{it.subtotal || it.quantity * it.unit_price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="pt-2 border-t border-stone-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-stone-900">₹{viewingOrder.subtotal || viewingOrder.total_amount}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Discount</span>
                      <span className="text-emerald-700">-₹{viewingOrder.discount || 0}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Shipping</span>
                      <span className="text-emerald-700">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#1E3B2B] pt-2 border-t border-stone-100">
                      <span>Grand Total ({viewingOrder.payment_method?.toUpperCase()})</span>
                      <span>₹{viewingOrder.total_amount}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setViewingOrder(null)}
                      className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT ORDER DETAILS MODAL */}
            {editingOrder && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                      Update Order #{editingOrder.order_number}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingOrder(null)}
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Fulfillment Stage Status
                      </label>
                      <select
                        value={editingOrder.status}
                        onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                        className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:border-[#1E3B2B]"
                      >
                        <option value="pending">Pending Confirmation</option>
                        <option value="confirmed">Order Confirmed</option>
                        <option value="processing">Processing &amp; Packed in Apothecary</option>
                        <option value="shipped">Handed to Courier Partner (Shipped)</option>
                        <option value="out_for_delivery">Out for Delivery to Customer</option>
                        <option value="delivered">Delivered Successfully</option>
                        <option value="cancelled">Cancelled / Returned</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Courier Partner
                        </label>
                        <input
                          type="text"
                          value={editingOrder.courier || ''}
                          onChange={(e) => setEditingOrder({ ...editingOrder, courier: e.target.value })}
                          placeholder="e.g. BlueDart / Delhivery / DTDC"
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Tracking AWB #
                        </label>
                        <input
                          type="text"
                          value={editingOrder.tracking_number || ''}
                          onChange={(e) => setEditingOrder({ ...editingOrder, tracking_number: e.target.value })}
                          placeholder="e.g. BLU9821045"
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 font-mono focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Customer Delivery Address
                      </label>
                      <textarea
                        rows="2"
                        value={typeof editingOrder.shipping_address === 'string' ? editingOrder.shipping_address : JSON.stringify(editingOrder.shipping_address)}
                        onChange={(e) => setEditingOrder({ ...editingOrder, shipping_address: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Customer Phone
                        </label>
                        <input
                          type="tel"
                          value={editingOrder.customer_phone || ''}
                          onChange={(e) => setEditingOrder({ ...editingOrder, customer_phone: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Customer Email
                        </label>
                        <input
                          type="email"
                          value={editingOrder.customer_email || ''}
                          onChange={(e) => setEditingOrder({ ...editingOrder, customer_email: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Internal Notes / Dispatch Remarks
                      </label>
                      <input
                        type="text"
                        value={editingOrder.notes || ''}
                        onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                        placeholder="e.g. Fragile glass jar included, eco-padded box."
                        className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setEditingOrder(null)}
                        className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white font-bold rounded-xl shadow cursor-pointer"
                      >
                        Save Order Updates
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 4: CUSTOMERS & USERS (VIEW, EDIT, ADD, DELETE)
            =================================================================== */}
        {currentTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Registered Users &amp; Customers</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  View customer activity, order volume, edit contact details, roles, or delete users.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                className="px-4 py-2.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>+ Add New User</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search users by name, email address, or phone..."
                  className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1E3B2B]"
                />
                <span className="absolute left-3 top-2 text-stone-400 text-xs">🔍</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Filter Role:</span>
                <select
                  value={customerRoleFilter}
                  onChange={(e) => setCustomerRoleFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
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
                      <th className="py-3.5 px-4">Orders Placed</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customers
                      .filter(c => {
                        const s = customerSearch.toLowerCase();
                        const matchesSearch = !customerSearch ||
                          (c.name || '').toLowerCase().includes(s) ||
                          (c.email || '').toLowerCase().includes(s) ||
                          (c.phone || '').toLowerCase().includes(s);
                        const matchesRole = customerRoleFilter === 'all' || (c.role || 'customer') === customerRoleFilter;
                        return matchesSearch && matchesRole;
                      })
                      .map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full bg-[#1E3B2B] text-white flex items-center justify-center font-serif font-bold text-xs">
                              {c.name?.charAt(0) || 'U'}
                            </span>
                            <strong className="text-stone-900 font-semibold">{c.name}</strong>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-medium">{c.email}</td>
                        <td className="py-3 px-4 text-stone-600">{c.phone || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {c.role || 'customer'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          {orders.filter(o => (o.customer_email || '').toLowerCase() === (c.email || '').toLowerCase()).length || c.orders_count || 0} Orders
                        </td>
                        <td className="py-3 px-4 text-stone-500">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingCustomer(c)}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-[#1E3B2B] text-stone-700 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="View user details &amp; order history"
                            >
                              👁️ View
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCustomer({ ...c })}
                              className="px-2.5 py-1 bg-stone-100 hover:bg-[#1E3B2B] text-stone-700 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="Edit user info"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomer(c.id, c.name)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="Delete user"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-xs text-stone-400">
                          No registered customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VIEW CUSTOMER MODAL */}
            {viewingCustomer && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-[#1E3B2B] text-white flex items-center justify-center font-serif font-bold text-lg">
                        {viewingCustomer.name?.charAt(0) || 'U'}
                      </span>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                          {viewingCustomer.name}
                        </h3>
                        <span className="text-xs text-stone-400">{viewingCustomer.email}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingCustomer(null)}
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                    <div>
                      <span className="text-stone-400 font-bold uppercase block text-[10px]">Phone</span>
                      <span className="text-stone-900 font-semibold">{viewingCustomer.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 font-bold uppercase block text-[10px]">Role</span>
                      <span className="text-stone-900 font-semibold capitalize">{viewingCustomer.role || 'Customer'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 font-bold uppercase block text-[10px]">Member Since</span>
                      <span className="text-stone-900 font-semibold">{viewingCustomer.created_at ? new Date(viewingCustomer.created_at).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 font-bold uppercase block text-[10px]">Total Orders Placed</span>
                      <span className="text-[#1E3B2B] font-bold text-sm">
                        {orders.filter(o => (o.customer_email || '').toLowerCase() === (viewingCustomer.email || '').toLowerCase()).length} Orders
                      </span>
                    </div>
                  </div>

                  {/* Customer Orders History List */}
                  <div className="space-y-2">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-700 block">
                      Order History for this Customer
                    </span>
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      {orders.filter(o => (o.customer_email || '').toLowerCase() === (viewingCustomer.email || '').toLowerCase()).length === 0 ? (
                        <div className="py-6 text-center text-xs text-stone-400">
                          This customer has placed 0 orders so far.
                        </div>
                      ) : (
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-[10px] uppercase">
                            <tr>
                              <th className="py-2 px-3">Order ID</th>
                              <th className="py-2 px-3">Date</th>
                              <th className="py-2 px-3">Total</th>
                              <th className="py-2 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {orders
                              .filter(o => (o.customer_email || '').toLowerCase() === (viewingCustomer.email || '').toLowerCase())
                              .map((ord) => (
                              <tr key={ord.id}>
                                <td className="py-2.5 px-3 font-bold text-[#1E3B2B]">#{ord.order_number}</td>
                                <td className="py-2.5 px-3 text-stone-500">{new Date(ord.created_at).toLocaleDateString()}</td>
                                <td className="py-2.5 px-3 font-bold text-stone-900">₹{ord.total_amount}</td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                                    {ord.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setViewingCustomer(null)}
                      className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT CUSTOMER MODAL */}
            {editingCustomer && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                      Edit Customer Profile
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingCustomer(null)}
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCustomer.name}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={editingCustomer.email}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editingCustomer.phone || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        System Role
                      </label>
                      <select
                        value={editingCustomer.role || 'customer'}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:border-[#1E3B2B]"
                      >
                        <option value="customer">Customer (Storefront Member)</option>
                        <option value="admin">Administrator (Full Dashboard Access)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setEditingCustomer(null)}
                        className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white font-bold rounded-xl shadow cursor-pointer"
                      >
                        Save Customer Info
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ADD CUSTOMER MODAL */}
            {showAddCustomerModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                      Add New Customer Account
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomerModal(false)}
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Customer Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="e.g. Meera Nair"
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="e.g. meera@example.com"
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Role
                      </label>
                      <select
                        value={newCustomer.role}
                        onChange={(e) => setNewCustomer({ ...newCustomer, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:border-[#1E3B2B]"
                      >
                        <option value="customer">Customer (Storefront Member)</option>
                        <option value="admin">Administrator (Admin Portal)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setShowAddCustomerModal(false)}
                        className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white font-bold rounded-xl shadow cursor-pointer"
                      >
                        Create Customer Account →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 5: COUPONS & DISCOUNTS (CREATE, EDIT, TOGGLE, DELETE)
            =================================================================== */}
        {currentTab === 'coupons' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1E3B2B]">Discount Coupons &amp; Promos</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Create new marketing promo codes, update discount values, toggle active/paused status, or delete codes.
              </p>
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
                      placeholder="e.g. GLOW25" 
                      className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 uppercase font-bold focus:outline-none focus:border-[#1E3B2B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Discount Type
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
                        Discount Value
                      </label>
                      <input 
                        type="number" 
                        required 
                        value={newCoupon.value}
                        onChange={(e) => setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Min Order (₹)
                      </label>
                      <input 
                        type="number" 
                        value={newCoupon.min_order_amount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Max Cap (₹)
                      </label>
                      <input 
                        type="number" 
                        value={newCoupon.max_discount_amount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, max_discount_amount: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300"
                      />
                    </div>
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
                <div className="p-4 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">Active Store Coupons</h3>
                  <div className="relative max-w-xs">
                    <input
                      type="text"
                      value={couponSearch}
                      onChange={(e) => setCouponSearch(e.target.value)}
                      placeholder="Filter coupons..."
                      className="w-full text-xs pl-8 pr-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1E3B2B]"
                    />
                    <span className="absolute left-2.5 top-1.5 text-stone-400 text-xs">🔍</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Discount</th>
                        <th className="py-3 px-4">Min Order</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {coupons
                        .filter(cp => !couponSearch || (cp.code || '').toLowerCase().includes(couponSearch.toLowerCase()))
                        .map((cp) => (
                        <tr key={cp.id} className="hover:bg-stone-50/70">
                          <td className="py-3 px-4 font-bold text-stone-900 font-mono tracking-wider">
                            🏷️ {cp.code}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#1E3B2B]">
                            {cp.type === 'percent' ? `${cp.value}% OFF` : `₹${cp.value} OFF`}
                          </td>
                          <td className="py-3 px-4 text-stone-600">₹{cp.min_order_amount || 0}</td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleCoupon(cp.id, cp.code, cp.is_active !== false)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                                cp.is_active !== false 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                              }`}
                              title="Click to toggle active status"
                            >
                              {cp.is_active !== false ? '✓ Active' : '⏸ Paused'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingCoupon({ ...cp })}
                                className="px-2.5 py-1 bg-stone-100 hover:bg-[#1E3B2B] text-stone-700 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                                title="Edit coupon"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCoupon(cp.id, cp.code)}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                                title="Delete coupon"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* EDIT COUPON MODAL */}
            {editingCoupon && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="font-serif font-bold text-lg text-[#1E3B2B]">
                      Edit Coupon Code: {editingCoupon.code}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingCoupon(null)}
                      className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCoupon.code}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-stone-300 uppercase font-mono font-bold focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Type
                        </label>
                        <select
                          value={editingCoupon.type}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                        >
                          <option value="percent">Percentage (%)</option>
                          <option value="fixed">Fixed Flat (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Value
                        </label>
                        <input
                          type="number"
                          required
                          value={editingCoupon.value}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, value: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Min Order (₹)
                        </label>
                        <input
                          type="number"
                          value={editingCoupon.min_order_amount || 0}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, min_order_amount: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">
                          Max Cap (₹)
                        </label>
                        <input
                          type="number"
                          value={editingCoupon.max_discount_amount || 200}
                          onChange={(e) => setEditingCoupon({ ...editingCoupon, max_discount_amount: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="coupon-active-chk"
                        checked={editingCoupon.is_active !== false}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, is_active: e.target.checked })}
                        className="rounded text-[#1E3B2B] focus:ring-[#1E3B2B] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="coupon-active-chk" className="text-xs font-bold text-stone-700 cursor-pointer">
                        Coupon is active for customers at checkout
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setEditingCoupon(null)}
                        className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white font-bold rounded-xl shadow cursor-pointer"
                      >
                        Save Coupon Updates
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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
                { id: 'faq', label: '❓ FAQ Page', path: '/faq' },
                { id: 'footer', label: '🦶 Footer & Global', path: '/' },
                { id: 'navbar', label: '📢 Header & Announcement', path: '/' },
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
              const isReviewsSection = selectedCmsSection === 'reviews';
              const isFaqSection = selectedCmsSection === 'faq' || selectedCmsSection === 'questions';

              // Detect all image fields present in current section
              const imageKeys = Object.keys(currentSectionData).filter(
                (k) => k.includes('image') || k.includes('img') || k === 'logo' || k === 'banner_image'
              );

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column (8 cols): Headings, Copy, Pricing, Points & CTAs */}
                  <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                    
                    <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                          Editing {selectedCmsPage} • {selectedCmsSection.replace(/_/g, ' ')}
                        </span>
                        <h3 className="font-serif font-bold text-xl text-[#1E3B2B] mt-1.5 capitalize">
                          {selectedCmsSection.replace(/_/g, ' ')} Content &amp; Details
                        </h3>
                      </div>
                      <span className="text-xs text-stone-400 font-mono">
                        Page: /{selectedCmsPage === 'home' ? '' : selectedCmsPage}
                      </span>
                    </div>

                    {/* Section Eyebrow / Tagline */}
                    {('eyebrow' in currentSectionData || 'badge_text' in currentSectionData) && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Section Eyebrow / Tagline
                        </label>
                        <input
                          type="text"
                          value={currentSectionData.eyebrow || currentSectionData.badge_text || ''}
                          onChange={(e) => {
                            const k = 'eyebrow' in currentSectionData ? 'eyebrow' : 'badge_text';
                            handleUpdateCmsField(selectedCmsPage, selectedCmsSection, k, e.target.value);
                          }}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                          placeholder="e.g. Natural Skincare / Pure Botanical Formulation"
                        />
                      </div>
                    )}

                    {/* Main Title / Prefix */}
                    {('title' in currentSectionData || 'title_prefix' in currentSectionData) && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Main Heading / Title
                        </label>
                        <input
                          type="text"
                          value={currentSectionData.title || currentSectionData.title_prefix || ''}
                          onChange={(e) => {
                            const k = 'title' in currentSectionData ? 'title' : 'title_prefix';
                            handleUpdateCmsField(selectedCmsPage, selectedCmsSection, k, e.target.value);
                          }}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-serif font-bold text-[#1E3B2B] focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    )}

                    {/* Dynamic Rotating Words (for Hero Section) */}
                    {'rotating_words' in currentSectionData && (
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                        <label className="block text-xs font-bold text-emerald-900 uppercase">
                          Rotating Headline Words (Separated by comma)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(currentSectionData.rotating_words)
                              ? currentSectionData.rotating_words.join(', ')
                              : currentSectionData.rotating_words || ''
                          }
                          onChange={(e) => {
                            const words = e.target.value.split(',').map((w) => w.trim()).filter(Boolean);
                            handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'rotating_words', words);
                          }}
                          placeholder="Artisanal., Natural., Pure., Radiant., Personal."
                          className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white rounded-xl border border-emerald-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(Array.isArray(currentSectionData.rotating_words) ? currentSectionData.rotating_words : []).map((w, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white border border-emerald-200 text-xs font-bold text-emerald-800">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subtitle / Tagline */}
                    {'subtitle' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Subtitle / Supporting Copy
                        </label>
                        <textarea
                          rows={2}
                          value={currentSectionData.subtitle || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'subtitle', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    )}

                    {/* Long Description Paragraph */}
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

                    {/* Announcement Text (for Navbar) */}
                    {'text' in currentSectionData && selectedCmsPage === 'navbar' && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Header Announcement Bar Text
                        </label>
                        <input
                          type="text"
                          value={currentSectionData.text || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'text', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                        />
                      </div>
                    )}

                    {/* Brand Tagline & Copyright (for Footer) */}
                    {'tagline' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Brand Tagline
                        </label>
                        <input
                          type="text"
                          value={currentSectionData.tagline || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'tagline', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300"
                        />
                      </div>
                    )}

                    {'copyright' in currentSectionData && (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                          Copyright Text
                        </label>
                        <input
                          type="text"
                          value={currentSectionData.copyright || ''}
                          onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'copyright', e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-300"
                        />
                      </div>
                    )}

                    {/* Formulation Promise Note */}
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

                    {/* Pricing, Discounts, and Ratings (for Combo, Newly Launched, Shop) */}
                    {('price' in currentSectionData || 'original_price' in currentSectionData || 'discount_label' in currentSectionData || 'rating' in currentSectionData) && (
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-3">
                        <span className="block text-xs font-bold text-amber-900 uppercase">
                          Pricing, Discounts &amp; Customer Ratings
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {'price' in currentSectionData && (
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Offer Price (₹)</label>
                              <input
                                type="number"
                                value={currentSectionData.price || 0}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'price', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300 font-bold"
                              />
                            </div>
                          )}
                          {'original_price' in currentSectionData && (
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">MRP / Old Price (₹)</label>
                              <input
                                type="number"
                                value={currentSectionData.original_price || 0}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'original_price', Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                              />
                            </div>
                          )}
                          {'discount_label' in currentSectionData && (
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Discount Tag</label>
                              <input
                                type="text"
                                value={currentSectionData.discount_label || ''}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'discount_label', e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                                placeholder="15% OFF"
                              />
                            </div>
                          )}
                          {'rating' in currentSectionData && (
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Customer Rating</label>
                              <input
                                type="text"
                                value={currentSectionData.rating || ''}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'rating', e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                                placeholder="★ 4.9 (334 reviews)"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Information & Hours (for Contact Page & Footer) */}
                    {('phone' in currentSectionData || 'email' in currentSectionData || 'address' in currentSectionData || 'timings' in currentSectionData) && (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <span className="block text-xs font-bold text-stone-700 uppercase">
                          Contact Details &amp; Location
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {'phone' in currentSectionData && (
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Support Phone</label>
                              <input
                                type="text"
                                value={currentSectionData.phone || ''}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'phone', e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                              />
                            </div>
                          )}
                          {'email' in currentSectionData && (
                            <div>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Support Email</label>
                              <input
                                type="email"
                                value={currentSectionData.email || ''}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'email', e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                              />
                            </div>
                          )}
                          {'address' in currentSectionData && (
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Studio Address</label>
                              <input
                                type="text"
                                value={currentSectionData.address || ''}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'address', e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                              />
                            </div>
                          )}
                          {'timings' in currentSectionData && (
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-stone-600 mb-1">Working Hours</label>
                              <input
                                type="text"
                                value={currentSectionData.timings || ''}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'timings', e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Social Media Links (for Footer) */}
                    {('instagram' in currentSectionData || 'facebook' in currentSectionData || 'youtube' in currentSectionData || 'pinterest' in currentSectionData) && (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <span className="block text-xs font-bold text-stone-700 uppercase">
                          Social Media Profiles
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {['instagram', 'facebook', 'youtube', 'pinterest'].map((soc) => (
                            <div key={soc}>
                              <label className="block text-[11px] font-bold text-stone-600 mb-1 capitalize">{soc} URL</label>
                              <input
                                type="text"
                                value={currentSectionData[soc] || ''}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, soc, e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary & Secondary CTA Buttons */}
                    {('cta_primary_label' in currentSectionData || 'cta_secondary_label' in currentSectionData || 'link' in currentSectionData) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                        {'cta_primary_label' in currentSectionData && (
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
                        )}
                        {'cta_primary_link' in currentSectionData && (
                          <div>
                            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                              Primary CTA Link
                            </label>
                            <input
                              type="text"
                              value={currentSectionData.cta_primary_link || ''}
                              onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'cta_primary_link', e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                            />
                          </div>
                        )}
                        {'cta_secondary_label' in currentSectionData && (
                          <div>
                            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                              Secondary CTA Button Text
                            </label>
                            <input
                              type="text"
                              value={currentSectionData.cta_secondary_label || ''}
                              onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'cta_secondary_label', e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300 font-semibold"
                            />
                          </div>
                        )}
                        {'cta_secondary_link' in currentSectionData && (
                          <div>
                            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                              Secondary CTA Link
                            </label>
                            <input
                              type="text"
                              value={currentSectionData.cta_secondary_link || ''}
                              onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'cta_secondary_link', e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                            />
                          </div>
                        )}
                        {'link' in currentSectionData && !('cta_primary_link' in currentSectionData) && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                              Target Link URL
                            </label>
                            <input
                              type="text"
                              value={currentSectionData.link || ''}
                              onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, 'link', e.target.value)}
                              className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* DYNAMIC POINTS / HIGHLIGHTS / REVIEWS / FAQ ITEMS */}
                    {('points' in currentSectionData || isReviewsSection || isFaqSection) && (
                      <div className="pt-4 border-t border-stone-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#1E3B2B]">
                              {isReviewsSection ? 'Customer Reviews & Testimonials' : isFaqSection ? 'FAQ Questions & Answers' : 'Section Highlights & Bullet Points'}
                            </h4>
                            <p className="text-xs text-stone-500">
                              {isReviewsSection
                                ? 'Add, edit, or remove customer feedback cards and star ratings.'
                                : isFaqSection
                                ? 'Add, edit, or remove questions and transparent answers.'
                                : 'Add, edit, or remove specific bullet points, benefits, and feature tags.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddCmsPoint(selectedCmsPage, selectedCmsSection)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ Add {isReviewsSection ? 'Review' : isFaqSection ? 'FAQ' : 'Point'}</span>
                          </button>
                        </div>

                        {points.length === 0 ? (
                          <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                            No items in this section yet. Click "+ Add" above to create one.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {points.map((pt, pIdx) => (
                              <div 
                                key={pt.id || pIdx} 
                                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-3 transition hover:shadow-xs"
                              >
                                {isReviewsSection ? (
                                  /* Testimonials Item Editor */
                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                                        <input
                                          type="text"
                                          value={pt.name || pt.title || ''}
                                          onChange={(e) => handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'name', e.target.value)}
                                          placeholder="Customer Name (e.g. Ayesha N.)"
                                          className="text-xs font-bold px-3 py-2 bg-white rounded-xl border border-stone-300"
                                        />
                                        <input
                                          type="text"
                                          value={pt.product || ''}
                                          onChange={(e) => handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'product', e.target.value)}
                                          placeholder="Product Tag (e.g. Goat Milk Soap)"
                                          className="text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                                        />
                                        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-stone-300">
                                          <span className="text-amber-500 text-xs">⭐</span>
                                          <select
                                            value={pt.rating || 5}
                                            onChange={(e) => handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'rating', Number(e.target.value))}
                                            className="text-xs bg-transparent focus:outline-none w-full cursor-pointer"
                                          >
                                            <option value={5}>5 Stars (Excellent)</option>
                                            <option value={4}>4 Stars (Very Good)</option>
                                            <option value={3}>3 Stars (Good)</option>
                                          </select>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCmsPoint(selectedCmsPage, selectedCmsSection, pIdx)}
                                        className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                        title="Delete this review"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={pt.comment || pt.desc || pt.text || ''}
                                      onChange={(e) => {
                                        handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'comment', e.target.value);
                                        handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'desc', e.target.value);
                                      }}
                                      placeholder="Customer review comment..."
                                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                                    />
                                  </div>
                                ) : isFaqSection ? (
                                  /* FAQ Item Editor */
                                  <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-3">
                                      <input
                                        type="text"
                                        value={pt.title || pt.q || pt.question || ''}
                                        onChange={(e) => {
                                          handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'title', e.target.value);
                                          handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'question', e.target.value);
                                        }}
                                        placeholder="Question headline..."
                                        className="w-full text-xs sm:text-sm font-bold px-3 py-2 bg-white rounded-xl border border-stone-300"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCmsPoint(selectedCmsPage, selectedCmsSection, pIdx)}
                                        className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                        title="Delete this question"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                    <textarea
                                      rows={3}
                                      value={pt.desc || pt.a || pt.answer || ''}
                                      onChange={(e) => {
                                        handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'desc', e.target.value);
                                        handleUpdateCmsPoint(selectedCmsPage, selectedCmsSection, pIdx, 'answer', e.target.value);
                                      }}
                                      placeholder="Detailed transparent answer..."
                                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300"
                                    />
                                  </div>
                                ) : (
                                  /* Standard Bullet Point / Feature Item Editor */
                                  <div className="space-y-2">
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

                                    {(pt.desc !== undefined || pt.subtitle !== undefined) && (
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
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Right Column (4 cols): Media Assets & Live Image Previews */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
                      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                        <h4 className="font-serif font-bold text-base text-[#1E3B2B] flex items-center gap-1.5">
                          <span>🖼️</span>
                          <span>Section Imagery &amp; Visuals</span>
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {imageKeys.length} {imageKeys.length === 1 ? 'image' : 'images'}
                        </span>
                      </div>

                      {imageKeys.length === 0 ? (
                        <div className="p-4 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                          This section does not use custom image assets directly.
                        </div>
                      ) : (
                        imageKeys.map((imgKey) => {
                          const currentImgVal = currentSectionData[imgKey] || '';
                          const friendlyTitle =
                            imgKey === 'bg_image' ? 'Background Backdrop Artwork' :
                            imgKey === 'image' ? 'Primary Section Image' :
                            imgKey === 'banner_image' ? 'Botanical Leaves Accent Banner' :
                            imgKey === 'image_closed' ? 'Closed Packaging Image' :
                            imgKey === 'image_open' ? 'Opened Packaging Image' :
                            imgKey === 'mortar_image' ? 'Mortar Prop (Transparent PNG)' :
                            imgKey === 'bottle_image' ? 'Bottle Prop (Transparent PNG)' :
                            imgKey === 'logo' ? 'Brand Logo HD' :
                            imgKey.replace(/_/g, ' ');

                          return (
                            <div key={imgKey} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-stone-700 capitalize">
                                  {friendlyTitle}
                                </label>
                                <span className="text-[10px] font-mono text-stone-400">{imgKey}</span>
                              </div>

                              <input
                                type="text"
                                value={currentImgVal}
                                onChange={(e) => handleUpdateCmsField(selectedCmsPage, selectedCmsSection, imgKey, e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300 font-mono text-[11px]"
                                placeholder="/assets/image_name.png"
                              />

                              {/* Local File Chooser */}
                              <div className="flex items-center gap-2">
                                <label className="flex-1 text-center py-1.5 px-3 rounded-lg border border-stone-300 hover:border-emerald-600 bg-white hover:bg-emerald-50 text-[11px] font-semibold text-stone-700 hover:text-emerald-800 transition cursor-pointer">
                                  <span>📁 Choose File from Device</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleImageFileUpload(selectedCmsPage, selectedCmsSection, imgKey, e.target.files[0]);
                                      }
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Live Image Thumbnail Preview */}
                              <div className="p-3 bg-white rounded-xl border border-stone-200 flex flex-col items-center justify-center min-h-[140px]">
                                <img
                                  src={currentImgVal || '/assets/earthglaze-logo-hd.png'}
                                  alt={friendlyTitle}
                                  className="max-h-32 w-auto object-contain rounded drop-shadow-sm"
                                  onError={(e) => {
                                    e.target.src = '/assets/earthglaze-logo-hd.png';
                                  }}
                                />
                                <span className="text-[10px] text-stone-400 mt-2 font-mono">
                                  Live Asset Preview
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}

                      {/* Quick HD Asset Suggestions */}
                      <div className="pt-3 border-t border-stone-100">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                          Quick HD Asset Suggestions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: 'Podium', url: '/assets/about-img.png' },
                            { name: 'Stage Backdrop', url: '/assets/hero_apothecary_stage_backdrop.jpg' },
                            { name: 'Mortar Prop', url: '/assets/hero_mortar_prop_transparent.png' },
                            { name: 'Elixir Prop', url: '/assets/hero_bottle_prop_transparent.png' },
                            { name: 'Seamless Arch', url: '/assets/about_hero_seamless_hd.png' },
                            { name: 'Contact Banner', url: '/assets/contact_hero_seamless_hd.png' },
                            { name: 'Leaves Banner', url: '/assets/banner_newly_leaves.png' },
                            { name: 'Combo Closed', url: '/assets/botanical_combo_original_soaps_closed.png' },
                            { name: 'Combo Open', url: '/assets/botanical_combo_original_soaps_open.png' },
                            { name: 'Balm Closed', url: '/assets/lip_balm_closed_box.png' },
                            { name: 'Balm Open', url: '/assets/lipbalmopenbox.png' },
                            { name: 'Manjistha Soap', url: '/assets/favourites_manjistha_soap_hd.png' },
                            { name: 'Goat Milk Soap', url: '/assets/favourites_goat_milk_soap_hd.png' },
                          ].map((ast) => (
                            <button
                              key={ast.name}
                              type="button"
                              onClick={() => {
                                if (imageKeys.length > 0) {
                                  handleUpdateCmsField(selectedCmsPage, selectedCmsSection, imageKeys[0], ast.url);
                                  notify(`Applied ${ast.name} to ${imageKeys[0]}`);
                                } else {
                                  notify(`Select a section with an image to apply`, 'error');
                                }
                              }}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-stone-100 hover:bg-[#E3EBE4] hover:text-[#1E3B2B] rounded-lg transition text-stone-600 cursor-pointer"
                            >
                              + {ast.name}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Save Changes Floating Action Card */}
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
