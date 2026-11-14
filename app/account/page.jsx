'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function AccountPage() {
  const { user, loading: authLoading, login, register, logout, updateProfile, isAdmin } = useAuth();
  const containerRef = useRef(null);

  // Auth form states (for logged-out visitors)
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [authError, setAuthError] = useState('');
  const [authLoadingAction, setAuthLoadingAction] = useState(false);

  // Authenticated Dashboard state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'addresses', 'profile'
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address state (no demo addresses)
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address_line: '',
    city: '',
    state: 'Karnataka',
    postal_code: '',
    phone: '',
    is_default: true,
  });

  // Profile update form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState(null);

  // Animated metric counters
  const [counts, setCounts] = useState({ total: 0, pending: 0, shipped: 0, delivered: 0 });

  const currentUser = user;

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      // Load saved addresses from user or storage
      if (Array.isArray(user.addresses) && user.addresses.length > 0) {
        setSavedAddresses(user.addresses);
      } else if (typeof window !== 'undefined' && user.email) {
        const localAddr = localStorage.getItem(`earthglaze_addresses_${user.email}`);
        if (localAddr) {
          try {
            setSavedAddresses(JSON.parse(localAddr));
          } catch (e) {
            setSavedAddresses([]);
          }
        } else {
          setSavedAddresses([]);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setMyOrders([]);
        return;
      }
      setOrdersLoading(true);
      try {
        const res = await api.orders.myOrders();
        if (res.success && Array.isArray(res.orders)) {
          setMyOrders(res.orders);
        } else {
          setMyOrders([]);
        }
      } catch (e) {
        setMyOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  // Metric Count-Up Animation (Calculated strictly from real user orders)
  useEffect(() => {
    const total = myOrders.length;
    const pending = myOrders.filter(o => (o.status || '').toLowerCase() === 'pending').length;
    const shipped = myOrders.filter(o => ['shipped', 'dispatched'].includes((o.status || '').toLowerCase())).length;
    const delivered = myOrders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
    const targets = { total, pending, shipped, delivered };
    const counterObj = { total: 0, pending: 0, shipped: 0, delivered: 0 };

    const tween = gsap.to(counterObj, {
      total: targets.total,
      pending: targets.pending,
      shipped: targets.shipped,
      delivered: targets.delivered,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        setCounts({
          total: Math.round(counterObj.total),
          pending: Math.round(counterObj.pending),
          shipped: Math.round(counterObj.shipped),
          delivered: Math.round(counterObj.delivered)
        });
      }
    });

    return () => tween.kill();
  }, [myOrders]);

  // GSAP Entrance Animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      // Sidebar entrance
      gsap.from('.profile-sidebar-anim', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Stat cards entrance
      gsap.from('.profile-stat-card', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.1
      });

      // Order cards staggered reveal
      gsap.from('.profile-order-card', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.25
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoadingAction(true);
    const res = await login(loginEmail, loginPassword);
    setAuthLoadingAction(false);
    if (!res.success) {
      setAuthError(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoadingAction(true);
    const res = await register(regName, regEmail, regPassword, regPhone);
    setAuthLoadingAction(false);
    if (!res.success) {
      setAuthError(res.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    const res = await updateProfile({ name: profileName, phone: profilePhone });
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'Update failed' });
    }
    setTimeout(() => setProfileMsg(null), 3500);
  };

  const getItemImage = (item) => {
    if (item.image) return item.image;
    const name = (item.product_name || item.name || '').toLowerCase();
    if (name.includes('goat')) return '/assets/favourites_goat_milk_soap_hd.png';
    if (name.includes('balm') || name.includes('beetroot')) return '/assets/favourites_beetroot_lip_balm_hd.png';
    return '/assets/favourites_manjistha_soap_hd.png';
  };

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FAF7F2] flex items-center justify-center text-sm font-semibold text-stone-500">
        Authenticating...
      </div>
    );
  }

  // =========================================================================
  // GUEST PORTAL: USER SIGN IN & SIGN UP (WHEN NOT LOGGED IN)
  // =========================================================================
  if (!user) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAF7F2] text-[#1E3B2B] font-sans selection:bg-[#235327] selection:text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        
        {/* Ambient Botanical Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#235327]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#C28328]/5 blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Brand Message & Membership Benefits (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF3EC] border border-[#235327]/20 text-[#235327] text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#235327] animate-ping" />
                <span>EarthGlaze Customer Sanctuary</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1E3B2B] tracking-tight leading-tight">
                {authMode === 'login' ? 'Welcome Back to Your Skincare Sanctuary' : 'Begin Your Pure Botanical Journey'}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg">
                {authMode === 'login'
                  ? 'Access your personal order history, live courier tracking, saved shipping addresses, and exclusive member discounts.'
                  : 'Create an account in seconds to unlock member-only formulas, track parcels in real time, and enjoy effortless checkout.'}
              </p>

              {/* 3 Core Member Benefits Cards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#E8DEC8] shadow-2xs">
                  <span className="w-9 h-9 rounded-xl bg-[#EAF3EC] text-[#235327] flex items-center justify-center text-lg shrink-0">
                    📦
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1E3B2B]">Live Order Tracking</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Stay updated with instant tracking numbers &amp; dispatched courier links.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#E8DEC8] shadow-2xs">
                  <span className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#C28328] flex items-center justify-center text-lg shrink-0">
                    📍
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1E3B2B]">Saved Address Book</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Speed through checkout with one-click saved delivery addresses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#E8DEC8] shadow-2xs">
                  <span className="w-9 h-9 rounded-xl bg-[#EAF3EC] text-[#235327] flex items-center justify-center text-lg shrink-0">
                    🌿
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1E3B2B]">VIP Small-Batch Formulations</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Early access to limited seasonal cures and special subscriber perks.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Form Card (6 cols) */}
            <div className="lg:col-span-6">
              <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DEC8] shadow-xl space-y-6">
                
                {/* Switcher Tabs */}
                <div className="grid grid-cols-2 p-1.5 bg-[#FAF7F2] rounded-full border border-stone-200">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className={`py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-[#1E3B2B] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className={`py-2.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-[#1E3B2B] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Banner */}
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{authError}</span>
                  </div>
                )}

                {/* SIGN IN FORM */}
                {authMode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                          Password
                        </label>
                        <span className="text-[11px] text-stone-500 hover:text-[#235327] cursor-pointer">
                          Forgot Password?
                        </span>
                      </div>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoadingAction}
                      className="w-full py-3.5 bg-[#1E3B2B] hover:bg-[#152a1f] text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{authLoadingAction ? 'Authenticating...' : 'Sign In as Member →'}</span>
                    </button>
                  </form>
                ) : (
                  /* SIGN UP FORM */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ayesha Nair"
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Phone Number (for order delivery alerts)
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Create Password
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1E3B2B]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoadingAction}
                      className="w-full py-3.5 bg-[#1E3B2B] hover:bg-[#152a1f] text-white font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{authLoadingAction ? 'Creating Account...' : 'Complete Sign Up →'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#FAF7F2] text-[#0D2D1C] font-sans relative overflow-x-hidden pb-20">
      
      {/* Decorative Botanical Corner Foliage */}
      <img
        src="/assets/banner_offer_top_leaves.png"
        alt=""
        className="absolute -top-6 -right-6 w-44 sm:w-60 pointer-events-none select-none opacity-80 z-0"
        aria-hidden="true"
      />
      <img
        src="/assets/banner_offer_top_leaves.png"
        alt=""
        className="absolute bottom-0 right-1/4 w-52 sm:w-72 pointer-events-none select-none opacity-30 z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* =========================================================================
            TWO COLUMN LAYOUT: SIDEBAR (3 COLS) + MAIN DASHBOARD (9 COLS)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR (Col-span 4 or 3) ================= */}
          <aside className="profile-sidebar-anim lg:col-span-3 space-y-4">
            
            {/* User Profile Mini Badge Card */}
            <div className="bg-white/95 backdrop-blur-xs rounded-[24px] border border-[#EAE3D2] p-5 shadow-2xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#0D2D1C] text-white flex items-center justify-center text-xl font-serif font-bold shadow-2xs uppercase shrink-0">
                {currentUser.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <h2 className="font-serif font-bold text-sm sm:text-base text-[#0D2D1C] truncate">
                  Hello, {currentUser.name}!
                </h2>
                <p className="text-xs text-stone-400 truncate font-sans">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Navigation Menu Pill List matching Reference */}
            <div className="bg-white/95 backdrop-blur-xs rounded-[24px] border border-[#EAE3D2] p-2.5 shadow-2xs space-y-1">
              
              {/* Overview (Active Green Pill) */}
              <button 
                type="button" 
                onClick={() => setActiveTab('overview')}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'overview' 
                    ? 'bg-[#0D2D1C] text-white shadow-2xs' 
                    : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-[#0D2D1C]'
                }`}
              >
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">📊</span>
                <span>Overview</span>
              </button>

              {/* My Orders */}
              <button 
                type="button" 
                onClick={() => setActiveTab('orders')}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'orders' 
                    ? 'bg-[#0D2D1C] text-white shadow-2xs' 
                    : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-[#0D2D1C]'
                }`}
              >
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">📦</span>
                <span>My Orders</span>
              </button>

              {/* Saved Addresses */}
              <button 
                type="button" 
                onClick={() => setActiveTab('addresses')}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'addresses' 
                    ? 'bg-[#0D2D1C] text-white shadow-2xs' 
                    : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-[#0D2D1C]'
                }`}
              >
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12">📍</span>
                <span>Saved Addresses</span>
              </button>

              {/* Account Details */}
              <button 
                type="button" 
                onClick={() => setActiveTab('profile')}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-[#0D2D1C] text-white shadow-2xs' 
                    : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-[#0D2D1C]'
                }`}
              >
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">👤</span>
                <span>Account Details</span>
              </button>

              {/* Logout */}
              <button 
                type="button" 
                onClick={logout}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-stone-500 hover:text-red-700 hover:bg-red-50/60 transition cursor-pointer"
              >
                <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:translate-x-1">🚪</span>
                <span>Logout</span>
              </button>

            </div>

          </aside>

          {/* ================= RIGHT MAIN PANEL (Col-span 8 or 9) ================= */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* ROW OF 4 METRIC CARDS (Exactly Matching Reference) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Card 1: Total Orders */}
              <div className="profile-stat-card bg-white/95 backdrop-blur-xs rounded-2xl border border-[#EAE3D2] p-4 text-center shadow-2xs space-y-1">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#EAF2EC] text-[#2E6B3E] flex items-center justify-center text-xs">
                  📦
                </div>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#0D2D1C] block">
                  {counts.total}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-sans font-medium block">
                  Total Orders
                </span>
              </div>

              {/* Card 2: Pending */}
              <div className="profile-stat-card bg-white/95 backdrop-blur-xs rounded-2xl border border-[#EAE3D2] p-4 text-center shadow-2xs space-y-1">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#FFF4E5] text-[#D97706] flex items-center justify-center text-xs">
                  ⏳
                </div>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#D97706] block">
                  {counts.pending}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-sans font-medium block">
                  Pending
                </span>
              </div>

              {/* Card 3: Shipped */}
              <div className="profile-stat-card bg-white/95 backdrop-blur-xs rounded-2xl border border-[#EAE3D2] p-4 text-center shadow-2xs space-y-1">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center text-xs">
                  🚚
                </div>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#4F46E5] block">
                  {counts.shipped}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-sans font-medium block">
                  Shipped
                </span>
              </div>

              {/* Card 4: Delivered */}
              <div className="profile-stat-card bg-white/95 backdrop-blur-xs rounded-2xl border border-[#EAE3D2] p-4 text-center shadow-2xs space-y-1">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#EAF2EC] text-[#2E6B3E] flex items-center justify-center text-xs">
                  ✨
                </div>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#2E6B3E] block">
                  {counts.delivered}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-500 font-sans font-medium block">
                  Delivered
                </span>
              </div>

            </div>

            {/* PANE CONTENT (Overview or My Orders) */}
            {(activeTab === 'overview' || activeTab === 'orders') && (
              <div className="bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EAE3D2] p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header Row */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D2]">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#0D2D1C]">
                    My Orders
                  </h3>
                  <span className="text-xs text-stone-500 font-sans font-medium">
                    {myOrders.length} {myOrders.length === 1 ? 'Total Order' : 'Total Orders'}
                  </span>
                </div>

                {/* Orders List or Clean Empty State */}
                {ordersLoading ? (
                  <div className="py-12 text-center text-xs font-semibold text-stone-400">
                    Loading your orders...
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="text-center py-14 px-4 space-y-4 bg-[#FAF7F2]/60 rounded-2xl border border-[#EAE3D2]">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white border border-[#EAE3D2] flex items-center justify-center text-2xl shadow-2xs">
                      📦
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-lg text-[#0D2D1C]">No Orders Placed Yet</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        You have not placed any orders yet. Discover our fresh, handcrafted botanical skincare formulations.
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Explore Shop</span>
                      <span>→</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((ord) => (
                      <div 
                        key={ord.id} 
                        className="profile-order-card bg-[#FAF7F2]/60 rounded-2xl border border-[#EAE3D2] p-4 sm:p-5 transition-all duration-300 hover:bg-[#FAF7F2] space-y-3"
                      >
                        {/* Top Bar: Order ID, Badge, Price */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE3D2]/70 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-[#0D2D1C]">
                              Order ID: <span className="font-mono">#{ord.order_number}</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF2EC] text-[#2E6B3E]">
                              {(ord.status || 'pending').toUpperCase()}
                            </span>
                          </div>
                          <span className="font-serif font-bold text-base text-[#0D2D1C]">
                            ₹{ord.total_amount}
                          </span>
                        </div>

                        {/* Middle: Items Thumbnail + Formulation */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE3D2] p-1 flex items-center justify-center shrink-0 shadow-2xs">
                              <img
                                src={getItemImage(ord.items?.[0] || {})}
                                alt="Botanical Formulation"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-[#0D2D1C] block">
                                {ord.items?.[0]?.quantity || 1}x {ord.items?.[0]?.product_name || 'Artisan Soap'}
                              </span>
                              <span className="text-[11px] text-stone-400 font-sans">
                                Placed on {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                              </span>
                            </div>
                          </div>

                          {/* Right: Track Order Button */}
                          <Link
                            href={`/track-order?order_number=${ord.order_number}`}
                            className="px-5 py-2.5 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white font-bold text-xs rounded-full transition-all duration-200 shadow-2xs hover:shadow flex items-center gap-1.5 active:scale-95 shrink-0"
                          >
                            <span>Track Order</span>
                            <span>→</span>
                          </Link>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* PANE: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EAE3D2] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D2]">
                  <div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#0D2D1C]">
                      Saved Addresses
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Manage your delivery destinations for effortless checkout.
                    </p>
                  </div>
                  {!showAddAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddAddressForm(true)}
                      className="px-4 py-2 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>+ Add Address</span>
                    </button>
                  )}
                </div>

                {/* Add Address Form */}
                {showAddAddressForm && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const addressItem = {
                        id: Date.now(),
                        name: newAddress.name || currentUser.name,
                        address_line: newAddress.address_line,
                        city: newAddress.city,
                        state: newAddress.state,
                        postal_code: newAddress.postal_code,
                        phone: newAddress.phone || currentUser.phone || '',
                        is_default: savedAddresses.length === 0,
                      };
                      const updated = [...savedAddresses, addressItem];
                      setSavedAddresses(updated);
                      if (typeof window !== 'undefined' && currentUser.email) {
                        localStorage.setItem(`earthglaze_addresses_${currentUser.email}`, JSON.stringify(updated));
                      }
                      setShowAddAddressForm(false);
                      setNewAddress({
                        name: '',
                        address_line: '',
                        city: '',
                        state: 'Karnataka',
                        postal_code: '',
                        phone: '',
                        is_default: false,
                      });
                    }}
                    className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D2] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-[#0D2D1C]">Add New Delivery Address</h4>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="e.g. Ayesha Nair"
                          className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0D2D1C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0D2D1C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Address (House No, Building, Street)</label>
                      <input
                        type="text"
                        required
                        value={newAddress.address_line}
                        onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
                        placeholder="e.g. Flat 301, Palm Grove Apts, 2nd Cross"
                        className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0D2D1C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="e.g. Bangalore"
                          className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0D2D1C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="e.g. Karnataka"
                          className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0D2D1C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">PIN Code</label>
                        <input
                          type="text"
                          required
                          value={newAddress.postal_code}
                          onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                          placeholder="560001"
                          className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0D2D1C]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List or Empty State */}
                {savedAddresses.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D2]">
                    <div className="w-14 h-14 mx-auto rounded-full bg-white border border-[#EAE3D2] flex items-center justify-center text-2xl shadow-2xs">
                      📍
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-base text-[#0D2D1C]">No Saved Addresses Yet</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Add your delivery address for smooth, effortless checkout on your orders.
                      </p>
                    </div>
                    {!showAddAddressForm && (
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(true)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                      >
                        <span>+ Add Your First Address</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map((addr, idx) => (
                      <div key={addr.id || idx} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE3D2] space-y-2 relative group">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs uppercase tracking-wider text-[#2E6B3E]">
                            {addr.is_default ? 'Primary Delivery Address' : 'Secondary Address'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = savedAddresses.filter((_, i) => i !== idx);
                              setSavedAddresses(updated);
                              if (typeof window !== 'undefined' && currentUser.email) {
                                localStorage.setItem(`earthglaze_addresses_${currentUser.email}`, JSON.stringify(updated));
                              }
                            }}
                            className="text-[11px] text-stone-400 hover:text-red-600 transition cursor-pointer"
                            title="Delete address"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-xs text-stone-700 font-medium leading-relaxed">
                          <strong className="block text-stone-900">{addr.name}</strong>
                          {addr.address_line}<br />
                          {addr.city}, {addr.state} - {addr.postal_code}<br />
                          {addr.phone && <span className="text-stone-500">Phone: {addr.phone}</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANE: ACCOUNT DETAILS */}
            {activeTab === 'profile' && (
              <div className="bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EAE3D2] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D2]">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#0D2D1C]">
                    Account Details
                  </h3>
                </div>

                {profileMsg && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    profileMsg.type === 'success' ? 'bg-[#EAF2EC] text-[#2E6B3E]' : 'bg-red-50 text-red-700'
                  }`}>
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      disabled
                      value={currentUser.email}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 bg-stone-100 rounded-xl border border-stone-200 text-stone-500 cursor-not-allowed"
                    />
                    <span className="text-[11px] text-stone-400 mt-0.5 block">Email cannot be changed directly.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs sm:text-sm px-4 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white text-xs font-bold rounded-xl transition shadow active:scale-95 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
