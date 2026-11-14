'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import api from '../../lib/api';
import GiftBoxUnboxing from '../../components/GiftBoxUnboxing';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number') || 'EG54586';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animation DOM Refs
  const containerRef = useRef(null);
  const summaryCardRef = useRef(null);
  const metaCardsContainerRef = useRef(null);

  // Fetch actual order data from Laravel backend
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function fetchOrder() {
      if (!orderNumber) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.orders.getByNumber(orderNumber);
        if (!isCancelled && res.success && res.order) {
          setOrder(res.order);
        } else if (!isCancelled) {
          // Graceful fallback for mock preview if order number was typed directly
          setOrder({
            order_number: orderNumber,
            customer_name: 'Valued Customer',
            customer_email: 'customer@earthglaze.in',
            payment_method: 'cod',
            subtotal: 649,
            total_amount: 649,
            shipping_fee: 0,
            shipping_address: {
              address: 'Standard Registered Address',
              city: 'Mangalore',
              state: 'Karnataka',
              postal_code: '575018',
            },
            items: [
              {
                product_name: 'Manjistha Soap',
                quantity: 1,
                unit_price: 349,
                total_price: 349,
              },
              {
                product_name: 'Goat Milk Soap',
                quantity: 1,
                unit_price: 300,
                total_price: 300,
              },
            ],
          });
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load order details:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    fetchOrder();

    return () => {
      isCancelled = true;
    };
  }, [orderNumber]);

  // Animate the bottom details card smoothly once unboxing approaches completion
  const handleUnboxingComplete = () => {
    if (summaryCardRef.current) {
      gsap.to(summaryCardRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power3.out',
      });
    }
  };

  useEffect(() => {
    if (loading || !order) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (summaryCardRef.current) summaryCardRef.current.style.opacity = '1';
      return;
    }

    const timer = setTimeout(() => {
      if (summaryCardRef.current && summaryCardRef.current.style.opacity !== '1') {
        gsap.to(summaryCardRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
        });
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [loading, order]);

  const activeOrderNum = order?.order_number || orderNumber;

  const getProductImage = (item) => {
    const name = (item.product_name || item.name || '').toLowerCase();
    const sku = (item.sku || '').toLowerCase();

    if (name.includes('goat') || sku.includes('goat')) {
      return '/assets/favourites_goat_milk_soap_hd.png';
    }
    if (name.includes('balm') || sku.includes('balm') || name.includes('beetroot')) {
      return '/assets/favourites_beetroot_lip_balm_hd.png';
    }
    if (name.includes('aloe')) {
      return '/assets/favourites_aloe_vera_soap_hd.png';
    }
    return '/assets/favourites_manjistha_soap_hd.png';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen text-[#1C1917] font-sans selection:bg-[#103321] selection:text-white overflow-hidden pb-16 sm:pb-24"
      style={{
        backgroundColor: '#F8F4EC',
        backgroundImage: 'radial-gradient(circle at 50% 18%, #FFFFFF 0%, #F8F4EC 65%, #F0EADB 100%)',
      }}
    >
      {/* =====================================================================
          NATURAL BOTANICAL CORNER SILHOUETTES (Pure Vector Transparency)
          Zero rectangular image seams, clean warm cream integration
          ===================================================================== */}
      {/* Top-Left Botanical Leaf Silhouette */}
      <div className="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none select-none z-0 opacity-25">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#173F2B]">
          <path d="M0 0C50 15 95 55 110 115C85 105 55 95 25 80C40 65 65 40 85 25C40 32 10 55 0 0Z" fill="currentColor" />
          <path d="M15 0C55 30 80 70 95 120" stroke="#C9A45C" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
          <path d="M45 30C65 18 90 25 98 42C82 50 58 46 45 30Z" fill="#103321" />
          <path d="M70 65C90 56 110 68 114 84C98 88 78 80 70 65Z" fill="#173F2B" />
        </svg>
      </div>

      {/* Top-Right Botanical Leaf Silhouette */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none select-none z-0 opacity-25">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#173F2B]">
          <path d="M200 0C150 15 105 55 90 115C115 105 145 95 175 80C160 65 135 40 115 25C160 32 190 55 200 0Z" fill="currentColor" />
          <path d="M185 0C145 30 120 70 105 120" stroke="#C9A45C" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
          <path d="M155 30C135 18 110 25 102 42C118 50 142 46 155 30Z" fill="#103321" />
          <path d="M130 65C110 56 90 68 86 84C102 88 122 80 130 65Z" fill="#173F2B" />
        </svg>
      </div>

      {/* =====================================================================
          MAIN ORDER CONFIRMATION CONTENT
          ===================================================================== */}
      <main className="relative z-10 max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex-1 w-full">
        
        {/* ===================================================================
            REAL 3D HERO UNBOXING EXPERIENCE
            1. First: Animated green success checkmark with 8 rays & pulse
            2. Header reveals & checkmark translates upward
            3. Genuine 3D Gift Box arrives closed
            4. Box lid physically rotates backward on its hinge
            5. Purchased products emerge from inside, clear front wall & arrange
            6. Subtle breathing floating motion
            7. Action CTAs
            =================================================================== */}
        {!loading && order ? (
          <GiftBoxUnboxing
            key={`${activeOrderNum}-${order?.items?.length || 0}`}
            items={order?.items || []}
            activeOrderNum={activeOrderNum}
            order={order}
            onComplete={handleUnboxingComplete}
          />
        ) : (
          <div className="w-full h-80 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#103321] border-t-transparent animate-spin" />
            <p className="text-xs font-sans text-[#103321] font-semibold tracking-wide">Preparing your botanical ritual...</p>
          </div>
        )}

        {/* ===================================================================
            LUXURY ORDER DETAILS CARD (Warm Cream Palette)
            Rendered in Natural White (#FFFFFF) with Deep Green Headings
            =================================================================== */}
        <div
          ref={summaryCardRef}
          className="mt-8 sm:mt-10 max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-[28px] border border-[#E7E2D9] p-5 sm:p-7 shadow-[0_20px_50px_rgba(40,30,10,0.06)] text-[#1C1917] opacity-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Elevated Order Summary Sub-Card (5 cols) */}
            <div className="md:col-span-5 bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E2D9]">
                <h2 className="font-sans font-bold text-base text-[#103321]">Order Summary</h2>
                <span className="text-[11px] font-semibold text-[#15803D] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                  {order?.items?.length || 1} item{(order?.items?.length || 1) !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {order?.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E2D9] p-1 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src={getProductImage(item)}
                        alt={item.product_name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans font-bold text-xs text-[#1C1917] truncate">
                        {item.quantity}× {item.product_name}
                      </p>
                      <span className="text-[11px] font-bold text-[#103321]">
                        ₹{item.total_price || item.unit_price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Subtotal / Total Paid */}
              <div className="pt-2 border-t border-[#E7E2D9] flex justify-between items-baseline text-xs">
                <span className="text-stone-600 font-medium">Total Paid</span>
                <span className="font-sans font-bold text-base text-[#103321]">
                  ₹{order?.total_amount}
                </span>
              </div>
            </div>

            {/* Right Column: Payment Method, Delivery Address & Estimated Delivery (7 cols) */}
            <div ref={metaCardsContainerRef} className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 items-start pl-0 sm:pl-3">
              
              {/* Sub-column 1: Payment Method + Estimated Delivery */}
              <div className="space-y-4">
                {/* Payment Method */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center shrink-0 border border-[#C8E6C9] shadow-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-[#103321]">
                      Payment Method
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      {order?.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}
                    </p>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 border border-[#FDE68A] shadow-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-[#103321]">
                      Estimated Delivery
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      Within 2–3 Business Days
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-column 2: Delivery Address */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center shrink-0 border border-[#C8E6C9] shadow-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-[13px] text-[#103321]">
                      Delivery Address
                    </h3>
                    <p className="text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                      <span className="font-semibold text-[#1C1917]">{order?.customer_name || 'Ayesha N.'}</span><br />
                      {order?.shipping_address?.address ? `${order.shipping_address.address}, ` : ''}{order?.shipping_address?.city || 'Mangalore'}, {order?.shipping_address?.state || 'Karnataka'} – {order?.shipping_address?.postal_code || '575018'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center text-sm font-semibold text-[#103321]">Confirming your botanical order...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
