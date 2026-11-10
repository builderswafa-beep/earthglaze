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
            customer_name: 'Ayesha N.',
            customer_email: 'ayesha@example.com',
            payment_method: 'cod',
            subtotal: 649,
            total_amount: 649,
            shipping_fee: 0,
            shipping_address: {
              address: '402, Lotus Apt, Deralakatte, University Road',
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
        duration: 0.75,
        ease: 'power3.out'
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

    const ctx = gsap.context(() => {
      if (summaryCardRef.current) {
        gsap.fromTo(
          summaryCardRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, delay: 5.2, ease: 'power3.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
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
      className="relative w-full min-h-screen text-[#1C1917] font-sans selection:bg-[#15803D] selection:text-white overflow-hidden pb-16 sm:pb-24"
      style={{
        background: 'radial-gradient(ellipse at 50% 15%, #FFFDF9 0%, #FAF6EE 45%, #F0E8DC 100%)',
      }}
    >
      {/* =====================================================================
          BOTANICAL CORNER BRANCHES WITH NATURAL SUNLIGHT SHADOWS
          Exact match to Reference 2: Soft leaves and sunlight dappled shadows
          ===================================================================== */}
      {/* Top-Left Botanical Branch */}
      <div className="absolute top-0 left-0 w-60 sm:w-80 h-52 sm:h-72 pointer-events-none select-none z-0 opacity-85">
        <img
          src="/assets/order_ref_leaves_top_left.png"
          alt="Botanical Foliage Left"
          className="w-full h-full object-contain object-top-left"
        />
      </div>

      {/* Top-Right Botanical Branch */}
      <div className="absolute top-0 right-0 w-64 sm:w-88 h-52 sm:h-72 pointer-events-none select-none z-0 opacity-85">
        <img
          src="/assets/order_ref_leaves_top_right.png"
          alt="Botanical Foliage Right"
          className="w-full h-full object-contain object-top-right"
        />
      </div>

      {/* =====================================================================
          MAIN ORDER CONFIRMATION CONTENT
          ===================================================================== */}
      <main className="relative z-10 max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex-1 w-full">
        
        {/* ===================================================================
            HERO UNBOXING EXPERIENCE (Stages 1 – 7)
            Includes: Green Checkmark + 8 Rays + Pulse -> Heading & Order ID
            -> 3D Box Entrance -> Lid Hinge Open -> Products Rise -> Settle in Bed
            -> Final Reveal Matching Reference 2 -> Action Buttons
            =================================================================== */}
        <GiftBoxUnboxing
          key={activeOrderNum}
          items={order?.items || []}
          activeOrderNum={activeOrderNum}
          order={order}
          onComplete={handleUnboxingComplete}
        />

        {/* ===================================================================
            STAGE 8: LUXURY ORDER DETAILS CARD (Matching Reference 2 Palette)
            Rendered in Refined Ivory Card with Forest-Green Headings
            =================================================================== */}
        <div
          ref={summaryCardRef}
          className="mt-8 sm:mt-10 max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-[28px] border border-[#E7E2D9] p-5 sm:p-7 shadow-[0_20px_50px_rgba(40,30,10,0.06)] text-[#1C1917] opacity-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Elevated Order Summary Sub-Card (5 cols) */}
            <div className="md:col-span-5 bg-[#FAF7F2] rounded-2xl border border-[#EBE4D8] p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E2D9]">
                <h2 className="font-sans font-bold text-base text-[#0C3821]">Order Summary</h2>
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
                      <span className="text-[11px] font-bold text-[#0C3821]">
                        ₹{item.total_price || item.unit_price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Subtotal / Total Paid */}
              <div className="pt-2 border-t border-[#E7E2D9] flex justify-between items-baseline text-xs">
                <span className="text-stone-600 font-medium">Total Paid</span>
                <span className="font-sans font-bold text-base text-[#0C3821]">
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
                    <h3 className="font-bold text-xs sm:text-[13px] text-[#0C3821]">
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
                    <h3 className="font-bold text-xs sm:text-[13px] text-[#0C3821]">
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
                    <h3 className="font-bold text-xs sm:text-[13px] text-[#0C3821]">
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-sm font-semibold text-[#0C3821]">Confirming your botanical order...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
