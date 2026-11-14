'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clearCart, refreshCart } = useCart();
  const { user } = useAuth();
  const containerRef = useRef(null);

  const [shippingData, setShippingData] = useState({
    name: '',
    phone: '',
    email: '',
    house_no: '',
    street: '',
    city: '',
    state: 'Karnataka',
    postal_code: '',
    country: 'India',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'razorpay'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill user data if authenticated with their real account data
  useEffect(() => {
    if (user) {
      let savedAddr = null;
      if (Array.isArray(user.addresses) && user.addresses.length > 0) {
        savedAddr = user.addresses[0];
      } else if (typeof window !== 'undefined' && user.email) {
        const local = localStorage.getItem(`earthglaze_addresses_${user.email}`);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) savedAddr = parsed[0];
          } catch (e) {}
        }
      }

      setShippingData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        house_no: savedAddr?.address_line ? savedAddr.address_line.split(',')[0] : prev.house_no,
        street: savedAddr?.address_line ? savedAddr.address_line.split(',').slice(1).join(',').trim() : prev.street,
        city: savedAddr?.city || prev.city,
        state: savedAddr?.state || prev.state,
        postal_code: savedAddr?.postal_code || prev.postal_code,
      }));
    }
  }, [user]);

  // Load Razorpay Checkout SDK script
  useEffect(() => {
    const scriptId = 'razorpay-checkout-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.checkout-header-anim', {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out'
      });

      // Cards staggered reveal
      gsap.from(['.checkout-delivery-card', '.checkout-payment-card', '.checkout-summary-card'], {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.1
      });

      // Stepper checkmark scale-bounce
      gsap.from('.checkout-stepper-active', {
        scale: 0.6,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        delay: 0.2
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const getProductThumbnail = (item) => {
    const p = item.product || {};
    const name = (p.name || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();

    if (slug.includes('goat') || name.includes('goat')) {
      return '/assets/favourites_goat_milk_soap_hd.png';
    }
    if (slug.includes('balm') || name.includes('balm') || name.includes('beetroot')) {
      return '/assets/favourites_beetroot_lip_balm_hd.png';
    }
    return '/assets/favourites_manjistha_soap_hd.png';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your bag is empty. Please select botanicals before checkout.');
      return;
    }

    setLoading(true);

    try {
      // 1. Process checkout on backend
      const res = await api.checkout.process({
        ...shippingData,
        address: `${shippingData.house_no ? shippingData.house_no + ', ' : ''}${shippingData.street}`,
        payment_method: paymentMethod,
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Checkout failed. Please verify your details.');
        setLoading(false);
        return;
      }

      // Case A: Cash on Delivery
      if (paymentMethod === 'cod') {
        await clearCart();
        router.push(`/order-confirmation?order_number=${res.order.order_number}`);
        return;
      }

      // Case B: Razorpay Online Payment
      if (paymentMethod === 'razorpay') {
        if (!window.Razorpay) {
          setErrorMessage('Payment gateway is initializing. Please try again in a few seconds.');
          setLoading(false);
          return;
        }

        const razorpayOptions = {
          key: res.razorpay.key,
          amount: res.razorpay.amount,
          currency: res.razorpay.currency || 'INR',
          name: 'EarthGlaze Natural Skincare',
          description: `Order #${res.order.order_number}`,
          image: '/assets/earthglaze-logo-hd.png',
          order_id: res.razorpay.order_id,
          handler: async function (response) {
            try {
              const verifyRes = await api.payments.verifyRazorpay({
                order_number: res.order.order_number,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                await clearCart();
                router.push(`/order-confirmation?order_number=${res.order.order_number}`);
              } else {
                setErrorMessage('Payment verification failed. Please contact support if debited.');
                setLoading(false);
              }
            } catch (err) {
              setErrorMessage('Payment verification error.');
              setLoading(false);
            }
          },
          prefill: {
            name: shippingData.name,
            email: shippingData.email,
            contact: shippingData.phone,
          },
          theme: {
            color: '#0D2D1C',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setErrorMessage('Payment window closed. You can retry anytime.');
            }
          }
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(`Payment failed: ${response.error.description || 'Transaction declined'}`);
          setLoading(false);
        });
        rzp.open();
      }

    } catch (err) {
      console.error(err);
      setErrorMessage('Server connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#FAF7F2] text-[#0D2D1C] font-sans relative overflow-x-hidden pb-16">
      
      {/* Decorative Corner Foliage */}
      <img
        src="/assets/banner_offer_top_leaves.png"
        alt=""
        className="absolute -top-6 -right-6 w-44 sm:w-60 pointer-events-none select-none opacity-80 z-0"
        aria-hidden="true"
      />
      <img
        src="/assets/banner_offer_top_leaves.png"
        alt=""
        className="absolute bottom-0 left-0 w-40 sm:w-56 pointer-events-none select-none opacity-50 z-0 scale-x-[-1] scale-y-[-1]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        
        {/* =========================================================================
            HEADER: BREADCRUMBS, TITLE & 3-STEPPER
            ========================================================================= */}
        <div className="mb-6 sm:mb-8 checkout-header-anim">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-2 font-sans" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0D2D1C] transition-colors">Home</Link>
            <span className="text-stone-400 font-light">&gt;</span>
            <Link href="/shop" className="hover:text-[#0D2D1C] transition-colors">Shop</Link>
            <span className="text-stone-400 font-light">&gt;</span>
            <span className="text-[#0D2D1C] font-semibold">Checkout</span>
          </nav>

          {/* Title Row & Stepper on the right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Title & Subtitle */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0D2D1C] tracking-tight leading-[1.12]">
                Checkout
              </h1>
              <p className="text-xs sm:text-sm text-[#5C6B5E] mt-1 font-sans">
                A few details to get your EarthGlaze essentials to you.
              </p>
            </div>

            {/* Stepper Navigation: Shipping -> Payment -> Confirmation */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs self-start md:self-end bg-white/70 backdrop-blur-xs px-3 sm:px-4 py-2 rounded-2xl border border-[#EAE3D2] shadow-2xs">
              
              {/* Step 1: Shipping (Active) */}
              <div className="flex items-center gap-2">
                <span className="checkout-stepper-active w-6 h-6 rounded-full bg-[#0D2D1C] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  ✓
                </span>
                <div className="leading-tight">
                  <span className="block font-bold text-[#0D2D1C] text-[11px] sm:text-xs">Shipping</span>
                  <span className="block text-[9px] sm:text-[10px] text-stone-400">Delivery Details</span>
                </div>
              </div>

              {/* Arrow */}
              <span className="text-stone-300 font-light text-xs mx-0.5">→</span>

              {/* Step 2: Payment */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full border border-stone-300 bg-white text-stone-400 flex items-center justify-center text-[10px]">
                  💳
                </span>
                <div className="leading-tight">
                  <span className="block font-semibold text-stone-600 text-[11px] sm:text-xs">Payment</span>
                  <span className="block text-[9px] sm:text-[10px] text-stone-400">Choose Method</span>
                </div>
              </div>

              {/* Arrow */}
              <span className="text-stone-300 font-light text-xs mx-0.5">→</span>

              {/* Step 3: Confirmation */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full border border-stone-300 bg-white text-stone-400 flex items-center justify-center text-[10px]">
                  🔒
                </span>
                <div className="leading-tight">
                  <span className="block font-semibold text-stone-400 text-[11px] sm:text-xs">Confirmation</span>
                  <span className="block text-[9px] sm:text-[10px] text-stone-400">Order Complete</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50/90 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 flex items-center gap-2 shadow-2xs">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Empty Bag Warning Banner */}
        {items.length === 0 && (
          <div className="mb-8 p-6 bg-white/95 rounded-3xl border border-[#EAE3D2] shadow-sm text-center space-y-3">
            <span className="text-2xl">🌿</span>
            <h3 className="font-serif font-bold text-lg text-[#0D2D1C]">Your Bag is Currently Empty</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Please select your handcrafted Ayurvedic cleansing bars or lip balm before placing an order.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/cart"
                className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#0D2D1C] font-bold text-xs rounded-xl border border-[#D5C9B8] transition"
              >
                ← Return to Bag
              </Link>
              <Link
                href="/shop"
                className="px-5 py-2.5 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white font-bold text-xs rounded-xl shadow transition"
              >
                Browse Botanical Shop →
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            TWO COLUMN LAYOUT: FORM (LEFT 8 COLS) + ORDER SUMMARY (RIGHT 4 COLS)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT COLUMN: DELIVERY & PAYMENT ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-6">
              
              {/* CARD 1: DELIVERY INFORMATION */}
              <div className="checkout-delivery-card bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EAE3D2] p-6 sm:p-8 shadow-sm space-y-5">
                
                {/* Section Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#EAE3D2]">
                  <span className="w-6 h-6 rounded-full bg-[#0D2D1C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0D2D1C]">
                    Delivery Information
                  </h2>
                </div>

                <div className="space-y-4 pt-1">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      value={shippingData.name}
                      onChange={handleChange}
                      placeholder="Ayesha N." 
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        required 
                        value={shippingData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210" 
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={shippingData.email}
                        onChange={handleChange}
                        placeholder="yourname@domain.com" 
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* House / Flat & Street */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Flat / House No. <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="house_no"
                        required
                        value={shippingData.house_no}
                        onChange={handleChange}
                        placeholder="Flat / House / Building" 
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        Street &amp; Area Landmark <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="street"
                        required
                        value={shippingData.street}
                        onChange={handleChange}
                        placeholder="Street, Landmark, Colony" 
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* City, State & PIN Code Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="city"
                        required 
                        value={shippingData.city}
                        onChange={handleChange}
                        placeholder="Mangalore" 
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="state"
                          required
                          value={shippingData.state}
                          onChange={handleChange}
                          className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition appearance-none cursor-pointer pr-8"
                        >
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Goa">Goa</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-xs">
                          ⌄
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="postal_code"
                        required 
                        value={shippingData.postal_code}
                        onChange={handleChange}
                        placeholder="575018" 
                        className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Delivery Instructions (Optional)
                    </label>
                    <input 
                      type="text" 
                      name="notes"
                      value={shippingData.notes}
                      onChange={handleChange}
                      placeholder="Leave with security or call on arrival" 
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-[#FAF7F2]/60 rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] focus:bg-white transition"
                    />
                  </div>

                </div>

              </div>

              {/* CARD 2: SELECT PAYMENT METHOD */}
              <div className="checkout-payment-card bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EAE3D2] p-6 sm:p-8 shadow-sm space-y-5">
                
                {/* Section Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#EAE3D2]">
                  <span className="w-6 h-6 rounded-full bg-[#0D2D1C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0D2D1C]">
                    Select Payment Method
                  </h2>
                </div>

                <div className="space-y-3.5 pt-1">
                  
                  {/* OPTION 1: Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative flex items-center justify-between gap-4 ${
                      paymentMethod === 'cod'
                        ? 'border-[#0D2D1C] bg-[#F4F8F5] shadow-sm'
                        : 'border-[#EAE3D2] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                      {/* Radio Circle */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === 'cod' ? 'border-[#0D2D1C]' : 'border-stone-300'
                      }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0D2D1C]" />
                        )}
                      </div>

                      {/* Cash Icon in Warm Pill */}
                      <div className="w-10 h-10 rounded-xl bg-[#FAF0E4] border border-[#E8DEC8] flex items-center justify-center text-lg shrink-0">
                        💵
                      </div>

                      {/* Title & Subtext */}
                      <div>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#0D2D1C] block">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-xs text-stone-500 mt-0.5 font-sans">
                          Pay at your doorstep
                        </p>
                      </div>
                    </div>

                    {/* Right Checkmark Badge for Active State */}
                    {paymentMethod === 'cod' && (
                      <div className="w-6 h-6 rounded-full bg-[#0D2D1C] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* OPTION 2: Online Payment (Razorpay) */}
                  <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative flex items-center justify-between gap-4 ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#0D2D1C] bg-[#F4F8F5] shadow-sm'
                        : 'border-[#EAE3D2] hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                      {/* Radio Circle */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        paymentMethod === 'razorpay' ? 'border-[#0D2D1C]' : 'border-stone-300'
                      }`}>
                        {paymentMethod === 'razorpay' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0D2D1C]" />
                        )}
                      </div>

                      {/* Razorpay Card Icon in Blue Pill */}
                      <div className="w-10 h-10 rounded-xl bg-[#EBF4FA] border border-[#D0E2EF] flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                        💳
                      </div>

                      {/* Title & Subtext */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm sm:text-base text-[#0D2D1C]">
                            Online Payment (Razorpay)
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 font-sans">
                          Pay securely via UPI, Cards, Net Banking &amp; more
                        </p>
                      </div>
                    </div>

                    {/* Right Razorpay Brand Logo */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs sm:text-sm font-extrabold italic tracking-tight text-[#0C2340]">
                        Razorpay
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </form>

          </div>

          {/* ================= RIGHT COLUMN: ORDER SUMMARY ================= */}
          <div className="lg:col-span-4 sticky top-24">
            
            <div className="checkout-summary-card bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EAE3D2] p-6 sm:p-7 shadow-sm relative overflow-hidden space-y-5">
              
              {/* Corner Decorative Botanical Leaf */}
              <img
                src="/assets/banner_offer_top_leaves.png"
                alt=""
                className="absolute -top-3 -right-3 w-16 sm:w-20 pointer-events-none select-none opacity-70 z-0"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <h3 className="font-serif font-bold text-xl text-[#0D2D1C] mb-4">
                  Order Summary
                </h3>

                {/* Products List */}
                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                  {items.length === 0 ? (
                    <div className="py-4 text-xs text-stone-400 italic text-center">
                      No items currently selected.
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EAE3D2] p-1 flex items-center justify-center shrink-0 shadow-2xs">
                            <img
                              src={getProductThumbnail(item)}
                              alt={item.product?.name || 'Skincare'}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          {/* Name and Qty */}
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-xs sm:text-sm text-[#0D2D1C] truncate">
                              {item.quantity}x {item.product?.name || 'Artisan Soap'}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <span className="font-bold text-xs sm:text-sm text-[#0D2D1C] shrink-0">
                          ₹{item.unit_price * item.quantity}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal, Shipping, Discount Calculations */}
                <div className="pt-4 border-t border-[#EAE3D2] space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#0D2D1C]">₹{totals.subtotal}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-[#2E6B3E]">
                      <span>Discount ({totals.coupon_code || 'COUPON'})</span>
                      <span className="font-bold">-₹{totals.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="font-bold text-[#2E6B3E]">
                      {totals.shipping > 0 ? `₹${totals.shipping}` : 'FREE'}
                    </span>
                  </div>

                  {/* Total Payable Line */}
                  <div className="pt-3 border-t border-[#EAE3D2] flex justify-between items-baseline">
                    <span className="font-serif font-bold text-base text-[#0D2D1C]">Total Payable</span>
                    <span className="font-serif font-bold text-2xl text-[#0D2D1C]">
                      ₹{totals.total}
                    </span>
                  </div>
                </div>

                {/* Forest-Green CTA Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading || items.length === 0}
                    className="w-full py-4 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white font-bold text-sm sm:text-base rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer group"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Securing your order...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs">🔒</span>
                        <span>{paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Pay'}</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1 font-sans">→</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badges matching reference */}
                <div className="pt-5 flex items-center justify-between text-[10px] text-stone-500 border-t border-[#EAE3D2]/70">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400">🔒</span>
                    <div>
                      <span className="block font-semibold text-stone-700">Secure Payment</span>
                      <span className="text-[9px] text-stone-400">256-bit SSL</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400">📦</span>
                    <span className="font-semibold text-stone-700">Cash on Delivery</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400">⚡</span>
                    <span className="font-semibold text-stone-700">Razorpay Powered</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
