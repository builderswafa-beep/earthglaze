'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const {
    items,
    totals,
    loading,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    couponMessage,
    updatingItemId,
    addToCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  };

  const handleApplyPreset = async (code) => {
    setCouponInput(code);
    setApplying(true);
    await applyCoupon(code);
    setApplying(false);
  };

  // Select high-definition product thumbnail matching reference composition
  const getProductImage = (item) => {
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

  const getProductTag = (item) => {
    const p = item.product || {};
    const name = (p.name || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();

    if (slug.includes('balm') || name.includes('balm')) {
      return 'LIP CARE • 10 g';
    }
    return 'SOAP • 100 g';
  };

  // Quick recommendations for empty cart
  const EMPTY_RECOMMENDATIONS = [
    {
      id: 2,
      name: 'Goat Milk Soap',
      tag: 'SOAP • 100 g',
      price: 300,
      image: '/assets/favourites_goat_milk_soap_hd.png',
    },
    {
      id: 1,
      name: 'Manjistha Soap',
      tag: 'SOAP • 100 g',
      price: 349,
      image: '/assets/favourites_manjistha_soap_hd.png',
    },
    {
      id: 3,
      name: 'Beetroot Lip Balm',
      tag: 'LIP CARE • 10 g',
      price: 249,
      image: '/assets/favourites_beetroot_lip_balm_hd.png',
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#FAF7F2] text-[#0D2D1C] font-sans selection:bg-[#1A4B2F] selection:text-white overflow-hidden pb-16 sm:pb-20">
      
      {/* Decorative Botanical Foliage in Top Right Corner */}
      <img
        src="/assets/banner_offer_top_leaves.png"
        alt=""
        className="absolute top-0 right-0 w-44 sm:w-64 lg:w-72 pointer-events-none select-none opacity-85 z-0"
        aria-hidden="true"
      />

      {/* Clean SVG Botanical Foliage in Bottom Left Corner - Zero mirrored artifacts */}
      <div className="absolute bottom-0 left-0 w-40 sm:w-56 h-40 sm:h-56 pointer-events-none select-none opacity-40 z-0">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#2E6B3E]">
          <path d="M0 200C60 190 110 150 140 90C110 100 70 110 30 130C50 110 70 80 80 50C50 70 20 120 0 200Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M0 200C30 170 60 130 80 80" stroke="#8A6A32" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />
        </svg>
      </div>

      {/* Decorative Botanical Foliage in Bottom Right Corner */}
      <img
        src="/assets/banner_offer_top_leaves.png"
        alt=""
        className="absolute bottom-0 right-0 w-36 sm:w-56 pointer-events-none select-none opacity-70 z-0 scale-y-[-1]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        
        {/* =========================================================================
            HEADER: BREADCRUMBS, TITLE & STEPPER PILL
            ========================================================================= */}
        <div className="mb-6 sm:mb-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-2 font-sans" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0D2D1C] transition-colors">Home</Link>
            <span className="text-stone-400 font-light">&gt;</span>
            <Link href="/shop" className="hover:text-[#0D2D1C] transition-colors">Shop</Link>
            <span className="text-stone-400 font-light">&gt;</span>
            <span className="text-[#0D2D1C] font-semibold">Shopping Bag</span>
          </nav>

          {/* Title Row & Stepper Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Title & Subtitle */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0D2D1C] tracking-tight leading-[1.12]">
                Your Botanical <span className="italic font-normal text-[#8A6A32]">Ritual Bag</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5C6B5E] mt-1 font-sans">
                Handpicked natural care, ready for you.
              </p>
            </div>

            {/* Stepper Navigation Pills (Exactly Matching Reference) */}
            <div className="flex items-center gap-2 text-xs font-semibold self-start md:self-end">
              {/* Step 1: Bag (Active Solid Forest-Green Pill) */}
              <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0D2D1C] text-white shadow-2xs font-bold text-xs">
                <span>1</span>
                <span>Bag</span>
              </span>

              {/* Arrow */}
              <span className="text-stone-400 text-xs font-light">→</span>

              {/* Step 2: Checkout (Inactive Pill) */}
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-stone-500 hover:text-stone-800 transition text-xs font-medium">
                <span>2</span>
                <span>Checkout</span>
              </span>

              {/* Arrow */}
              <span className="text-stone-400 text-xs font-light">→</span>

              {/* Step 3: Confirmation (Inactive Pill) */}
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-stone-400 text-xs font-medium">
                <span>3</span>
                <span>Confirmation</span>
              </span>
            </div>

          </div>

        </div>

        {/* =========================================================================
            MAIN CONTENT AREA
            ========================================================================= */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#0D2D1C]/20 border-t-[#0D2D1C] rounded-full animate-spin mx-auto"></div>
            <p className="font-serif italic text-sm text-stone-500">
              Gathering your botanical selections...
            </p>
          </div>
        ) : items.length === 0 ? (
          /* EMPTY CART STATE */
          <div className="max-w-2xl mx-auto py-12 px-6 text-center bg-white/95 backdrop-blur-xs rounded-[28px] border border-[#EAE3D2] shadow-sm space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF4EE] border border-[#EAE3D2] flex items-center justify-center text-3xl text-[#8A6A32]">
              🌿
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#0D2D1C]">
                Your Bag is Currently Empty
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                Discover our artisanal cold-pressed Ayurvedic cleansing bars and pure organic lip butter.
              </p>
            </div>

            {/* Quick 1-Click Formulations */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {EMPTY_RECOMMENDATIONS.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#EAE3D2] flex flex-col justify-between"
                >
                  <div className="w-full aspect-square bg-white rounded-xl p-2 flex items-center justify-center mb-2">
                    <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#2E6B3E] block">
                      {prod.tag}
                    </span>
                    <h3 className="font-serif font-bold text-xs text-[#0D2D1C] truncate mt-0.5">
                      {prod.name}
                    </h3>
                    <span className="font-bold text-xs text-[#0D2D1C] block mt-1">₹{prod.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(prod.id, 1, { productInfo: prod, showToast: true })}
                    className="mt-3 w-full py-1.5 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white text-[11px] font-bold rounded-lg transition"
                  >
                    + Add to Bag
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white font-bold text-xs rounded-full shadow-md transition active:scale-95"
              >
                <span>Explore Full Collection</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* FILLED CART: TWO-COLUMN LUXURY LAYOUT (MATCHING REFERENCE PROPORTIONS) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* =========================================================================
                COLUMN 1: ITEMS IN BAG CARD + BOTANICAL BADGES (LEFT - 8 COLS)
                ========================================================================= */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Shopping Bag Card Container */}
              <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-[#EAE3D2] shadow-sm">
                
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-4 mb-4">
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-[#0D2D1C]">
                    Items in Bag ({totals.total_items})
                  </h2>

                  <Link
                    href="/shop"
                    className="text-xs font-semibold text-[#8A6A32] hover:text-[#0D2D1C] transition-colors flex items-center gap-1 group"
                  >
                    <span className="transition-transform group-hover:translate-x-0.5">+</span>
                    <span>Add More Formulations</span>
                  </Link>
                </div>

                {/* Items List */}
                <div className="space-y-3.5">
                  {items.map((item) => {
                    const product = item.product || {};
                    const isUpdating = updatingItemId === item.id;
                    const isConfirming = confirmRemoveId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`relative bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] rounded-2xl p-3.5 sm:p-4 border border-[#EAE3D2] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 ${
                          isUpdating ? 'opacity-50 pointer-events-none' : 'opacity-100'
                        }`}
                      >
                        {/* Left: Product Thumbnail & Meta Details */}
                        <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                          
                          {/* High-Definition Thumbnail Stage */}
                          <Link
                            href={`/product?id=${product.id || item.product_id}`}
                            className="w-18 h-18 sm:w-20 sm:h-20 bg-white rounded-xl p-1.5 border border-[#EAE3D2] flex items-center justify-center shrink-0 shadow-2xs group"
                          >
                            <img
                              src={getProductImage(item)}
                              alt={product.name || 'Artisan formulation'}
                              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          </Link>

                          {/* Title, Category & Price */}
                          <div className="space-y-0.5 min-w-0">
                            {/* Small Category Pill */}
                            <span className="inline-block bg-[#EAF2EC] text-[#2E6B3E] font-bold text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full">
                              {getProductTag(item)}
                            </span>

                            {/* Product Title */}
                            <Link href={`/product?id=${product.id || item.product_id}`}>
                              <h3 className="font-serif font-bold text-sm sm:text-base text-[#0D2D1C] hover:text-[#2E6B3E] transition truncate">
                                {product.name || 'Botanical Cleansing Bar'}
                              </h3>
                            </Link>

                            {/* Unit Price */}
                            <p className="text-xs text-stone-500 font-sans">
                              ₹{item.unit_price} each
                            </p>
                          </div>

                        </div>

                        {/* Right: Quantity Control Pill, Line Price & Remove Icon */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE3D2]/70">
                          
                          {/* Capsule Quantity Selector */}
                          <div className="flex items-center bg-white border border-[#D5C9B8] rounded-full px-1 py-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              disabled={isUpdating}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition font-bold text-xs cursor-pointer disabled:opacity-50"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            
                            <span className="w-6 sm:w-7 text-center text-xs font-bold text-[#0D2D1C] select-none">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition font-bold text-xs cursor-pointer disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Line Total */}
                          <div className="text-right min-w-[65px]">
                            <span className="font-bold text-sm sm:text-base text-[#0D2D1C]">
                              ₹{item.unit_price * item.quantity}
                            </span>
                          </div>

                          {/* Remove Action with Inline Confirmation */}
                          <div className="relative">
                            {isConfirming ? (
                              <div className="flex items-center gap-1.5 bg-[#FFF5F5] border border-red-200 p-1 rounded-xl shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeFromCart(item.id);
                                    setConfirmRemoveId(null);
                                  }}
                                  className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-md transition cursor-pointer"
                                >
                                  Remove
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmRemoveId(null)}
                                  className="px-2 py-0.5 text-stone-600 text-[10px] font-semibold hover:bg-stone-200/60 rounded-md transition cursor-pointer"
                                >
                                  Keep
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmRemoveId(item.id)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 transition text-xs cursor-pointer"
                                title="Remove formulation"
                                aria-label={`Remove ${product.name} from cart`}
                              >
                                ✕
                              </button>
                            )}
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* 4 Botanical Trust Badges (Positioned Directly Below Left Card Matching Reference) */}
              <div className="pt-3 pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-center">
                  
                  {/* Badge 1: 100% Natural */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-[#D5C9B8] bg-white flex items-center justify-center text-sm text-[#0D2D1C] shadow-2xs mb-1.5">
                      🌿
                    </div>
                    <h4 className="font-serif font-bold text-xs text-[#0D2D1C] leading-tight">
                      100% Natural
                    </h4>
                    <p className="text-[10px] text-stone-500 leading-tight">
                      Ingredients
                    </p>
                  </div>

                  {/* Badge 2: No Harsh Chemicals */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-[#D5C9B8] bg-white flex items-center justify-center text-sm text-[#0D2D1C] shadow-2xs mb-1.5">
                      🧪
                    </div>
                    <h4 className="font-serif font-bold text-xs text-[#0D2D1C] leading-tight">
                      No Harsh
                    </h4>
                    <p className="text-[10px] text-stone-500 leading-tight">
                      Chemicals
                    </p>
                  </div>

                  {/* Badge 3: Cruelty Free */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-[#D5C9B8] bg-white flex items-center justify-center text-sm text-[#0D2D1C] shadow-2xs mb-1.5">
                      ♡
                    </div>
                    <h4 className="font-serif font-bold text-xs text-[#0D2D1C] leading-tight">
                      Cruelty
                    </h4>
                    <p className="text-[10px] text-stone-500 leading-tight">
                      Free
                    </p>
                  </div>

                  {/* Badge 4: Handcrafted in Mangalore */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-[#D5C9B8] bg-white flex items-center justify-center text-sm text-[#0D2D1C] shadow-2xs mb-1.5">
                      ✨
                    </div>
                    <h4 className="font-serif font-bold text-xs text-[#0D2D1C] leading-tight">
                      Handcrafted
                    </h4>
                    <p className="text-[10px] text-stone-500 leading-tight">
                      in Mangalore
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* =========================================================================
                COLUMN 2: ORDER SUMMARY CARD (RIGHT - 4 COLS)
                ========================================================================= */}
            <div className="lg:col-span-4 bg-white rounded-[24px] p-5 sm:p-6 border border-[#EAE3D2] shadow-sm sticky top-24 relative overflow-hidden space-y-5">
              
              {/* Corner Foliage Accent on the Summary Card */}
              <img
                src="/assets/banner_offer_top_leaves.png"
                alt=""
                className="absolute -top-3 -right-3 w-24 sm:w-28 opacity-80 pointer-events-none select-none z-0"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-4">
                
                <h2 className="font-serif font-bold text-xl text-[#0D2D1C]">
                  Order Summary
                </h2>

                {/* Promo / Coupon Code Section */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-stone-500">
                    Promo / Coupon Code
                  </label>

                  {totals.coupon_code ? (
                    /* Applied Coupon State (Exact Match to Reference Design) */
                    <div className="flex items-center justify-between bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl px-3.5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs tracking-wider text-[#0D2D1C] uppercase">
                          {totals.coupon_code}
                        </span>
                        <span className="w-4 h-4 rounded-full bg-[#0D2D1C] text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <span>Applied</span>
                          <span>✓</span>
                        </span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs text-stone-400 hover:text-red-600 transition pl-1"
                          title="Remove coupon"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Unapplied Coupon Form */
                    <div className="space-y-2">
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="e.g. WELCOME10"
                          className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] uppercase font-bold text-stone-800 tracking-wider placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
                        />
                        <button
                          type="submit"
                          disabled={applying || !couponInput.trim()}
                          className="px-4 py-2.5 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white text-xs font-bold rounded-xl transition shadow-2xs disabled:opacity-50 cursor-pointer"
                        >
                          {applying ? '...' : 'Apply'}
                        </button>
                      </form>

                      {/* Preset Coupon Quick Pill */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[11px] text-stone-400">Try:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('WELCOME10')}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FAF4EE] hover:bg-[#F0E4D2] border border-[#EAE3D2] text-[11px] font-bold text-[#8A6A32] transition cursor-pointer"
                        >
                          <span>WELCOME10</span>
                          <span className="text-[10px] text-stone-500 font-normal">(10% off)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {couponMessage && (
                    <p className={`text-xs mt-1.5 font-medium ${couponMessage.type === 'success' ? 'text-emerald-800' : 'text-red-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Breakdown Calculations */}
                <div className="space-y-2 pt-2 border-t border-[#F0EAE0] text-xs sm:text-sm">
                  
                  <div className="flex justify-between text-stone-600">
                    <span>Bag Subtotal</span>
                    <span className="font-bold text-stone-900">₹{totals.subtotal}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Discount ({totals.coupon_code || 'WELCOME10'})</span>
                      <span className="font-bold">-₹{totals.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Express Delivery</span>
                    <span className="font-bold text-emerald-800">
                      {totals.shipping > 0 ? `₹${totals.shipping}` : 'FREE'}
                    </span>
                  </div>

                  {/* Total Payable Row */}
                  <div className="pt-2.5 border-t border-[#EAE3D2] flex justify-between items-baseline">
                    <span className="font-serif font-bold text-base text-stone-900">
                      Total Payable
                    </span>
                    <span className="font-bold text-2xl text-[#0D2D1C]">
                      ₹{totals.total}
                    </span>
                  </div>

                </div>

                {/* Primary Proceed to Checkout CTA */}
                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-3.5 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-98 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0110 0v4"></path>
                    </svg>
                    <span>Proceed to Secure Checkout</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Micro Trust Indicators Row */}
                <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-[10px] text-stone-500 font-medium">
                  <span className="flex items-center gap-1">
                    <span>🔒</span>
                    <span>256-bit SSL Encrypted</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💵</span>
                    <span>Cash on Delivery</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⚡</span>
                    <span>Razorpay</span>
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
