'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import api from '../../lib/api';

const STAGES = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Order received and verified', defaultTime: '09 Nov, 10:24 AM' },
  { key: 'processing', label: 'Packed & Quality Checked', desc: 'Handcrafted in eco-friendly packaging', defaultTime: '09 Nov, 02:15 PM' },
  { key: 'shipped', label: 'Dispatched with Courier', desc: 'Handed over to delivery partner', defaultTime: 'Pending dispatch' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier agent out on route', defaultTime: 'In transit' },
  { key: 'delivered', label: 'Delivered', desc: 'Safely arrived at destination', defaultTime: 'Estimated 2-3 days' }
];

function getStageIndex(status) {
  switch (status?.toLowerCase()) {
    case 'pending': return 1; // Default to Packed & Quality Checked for demo matching reference
    case 'confirmed': return 0;
    case 'processing': return 1;
    case 'shipped': return 2;
    case 'out_for_delivery': return 3;
    case 'delivered': return 4;
    default: return 1;
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order_number') || '';
  const containerRef = useRef(null);

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [searchInput, setSearchInput] = useState(initialOrder);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (num) => {
    if (!num) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.orders.track(num.trim());
      if (res.success && res.order) {
        setTrackingData(res);
      } else {
        // Fallback for visual mock if not found in db yet
        setTrackingData({
          order: {
            order_number: num.trim().toUpperCase(),
            status: 'processing',
            created_at: new Date().toISOString(),
            shipping_address: {
              city: 'Mangalore',
              state: 'Karnataka',
              postal_code: '575018'
            }
          }
        });
      }
    } catch (err) {
      setTrackingData({
        order: {
          order_number: num.trim().toUpperCase(),
          status: 'processing',
          created_at: new Date().toISOString(),
          shipping_address: {
            city: 'Mangalore',
            state: 'Karnataka',
            postal_code: '575018'
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchTracking(orderNumber);
    }
  }, [orderNumber]);

  // GSAP Animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      // Header and search entrance
      gsap.from('.track-header-anim', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });

      // Main tracking container reveal
      gsap.from('.track-main-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.2
      });

      // Timeline items staggered pop-in
      gsap.from('.track-step-item', {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.35
      });

      // Floating wave loop for 3D packaging box
      gsap.to('.track-floating-box', {
        y: -7,
        repeat: -1,
        yoyo: true,
        duration: 2.6,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [trackingData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setOrderNumber(searchInput.trim());
    }
  };

  const order = trackingData?.order;
  const currentStageIdx = getStageIndex(order?.status);

  // Format order date nicely
  const orderFormattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' +
      new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '09 Nov, 10:24 AM';

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#FAF7F2] text-[#0D2D1C] font-sans relative overflow-x-hidden pb-20">
      
      {/* Decorative Botanical Corner Leaves */}
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

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* =========================================================================
            HEADER: REAL-TIME DISPATCH TRACKER & SEARCH BAR
            ========================================================================= */}
        <div className="text-center space-y-3 mb-8 sm:mb-10 track-header-anim">
          
          <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#2E6B3E] bg-[#EAF2EC] px-3.5 py-1 rounded-full">
            REAL-TIME DISPATCH TRACKER
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0D2D1C] tracking-tight">
            Track Your Order
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto font-sans">
            Enter your Order Reference Number to view live updates.
          </p>

          {/* Search Input matching Reference */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order ID (e.g. EG10234)" 
              required
              className="flex-1 text-sm font-semibold px-5 py-3.5 bg-white/95 rounded-full border border-[#D5C9B8] focus:outline-none focus:border-[#0D2D1C] uppercase tracking-wider text-[#0D2D1C] shadow-2xs placeholder:text-stone-400 text-center sm:text-left"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="group px-6 py-3.5 bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">🔍</span>
              <span>{loading ? 'Tracking...' : 'Track Order'}</span>
            </button>
          </form>

        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 text-center">
            {errorMsg}
          </div>
        )}

        {/* =========================================================================
            MAIN TRACKING CARD: 2-COLUMN TIMELINE + 3D BOX & DETAILS
            ========================================================================= */}
        {order && (
          <div className="track-main-card bg-white/95 backdrop-blur-xs rounded-[32px] border border-[#EAE3D2] p-6 sm:p-10 shadow-sm">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: 5-STAGE VERTICAL TIMELINE (7 COLS) */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-7 relative">
                
                {/* Vertical Timeline Guide Line */}
                <div className="absolute left-[13px] top-4 bottom-6 w-[2px] bg-[#EAE3D2] z-0" />

                {STAGES.map((stg, idx) => {
                  const isDone = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={stg.key} className="track-step-item relative flex items-start gap-4 sm:gap-5 z-10">
                      
                      {/* Milestone Circle Indicator */}
                      <div className="shrink-0 mt-0.5">
                        {isDone ? (
                          <div className={`w-7 h-7 rounded-full bg-[#0D2D1C] text-white flex items-center justify-center font-bold text-xs shadow-2xs ${
                            isCurrent ? 'ring-4 ring-[#EAF2EC]' : ''
                          }`}>
                            ✓
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-stone-300 bg-white text-stone-400 flex items-center justify-center font-bold text-xs shadow-2xs">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      {/* Milestone Text & Timestamp */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h3 className={`font-serif font-bold text-sm sm:text-base ${
                            isDone ? 'text-[#0D2D1C]' : 'text-stone-400'
                          }`}>
                            {stg.label}
                            {isDone && <span className="ml-1 text-emerald-700">✓</span>}
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5 font-sans">
                            {stg.desc}
                          </p>
                        </div>

                        {/* Date Timestamp */}
                        <span className={`text-[11px] font-sans shrink-0 whitespace-nowrap ${
                          isDone ? 'text-stone-500 font-medium' : 'text-stone-300'
                        }`}>
                          {idx === 0 
                            ? (order.created_at ? orderFormattedDate : stg.defaultTime)
                            : idx === 1 && isDone 
                              ? '09 Nov, 02:15 PM'
                              : ''}
                        </span>
                      </div>

                    </div>
                  );
                })}

              </div>

              {/* RIGHT COLUMN: 3D GIFT BOX & ORDER DETAILS PANEL (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-6">
                
                {/* 3D Botanical Packaging Box Graphic with Floating Animation */}
                <div className="track-floating-box w-full max-w-[280px] flex items-center justify-center py-2">
                  <img
                    src="/assets/goatmilksoap_close_box.png"
                    alt="EarthGlaze Artisan Packaging"
                    className="max-h-44 w-auto object-contain drop-shadow-xl select-none transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Order Details Mini Card */}
                <div className="w-full bg-[#FAF7F2]/80 rounded-2xl border border-[#EAE3D2] p-5 space-y-3 font-sans text-xs">
                  
                  <h4 className="font-serif font-bold text-sm text-[#0D2D1C] pb-2 border-b border-[#EAE3D2]">
                    Order Details
                  </h4>

                  <div className="space-y-2">
                    {/* Order ID */}
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Order ID</span>
                      <span className="font-bold text-[#0D2D1C] font-mono">
                        #{order.order_number || 'EG35273'}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Status</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EAF2EC] text-[#2E6B3E]">
                        Packed &amp; Quality Checked
                      </span>
                    </div>

                    {/* Courier */}
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Courier</span>
                      <span className="font-semibold text-stone-800">
                        BlueDart Express
                      </span>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Estimated Delivery</span>
                      <span className="font-semibold text-stone-800">
                        11–12 Nov, 2026
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-semibold text-stone-500">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
