'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function GiftBoxUnboxing({ order, items = [], activeOrderNum = 'EG54586', onComplete }) {
  const containerRef = useRef(null);
  const stage1WrapperRef = useRef(null);
  const checkmarkBadgeRef = useRef(null);
  const checkmarkCircleRef = useRef(null);
  const checkmarkPathRef = useRef(null);
  const raysRef = useRef(null);
  const pulseRef = useRef(null);

  const heroHeaderRef = useRef(null);
  const boxWrapperRef = useRef(null);
  const lidClosedRef = useRef(null);
  const lidOpenRef = useRef(null);
  const goldenGlowRef = useRef(null);
  const productsGroupRef = useRef(null);
  const finalRevealRef = useRef(null);
  const actionButtonsRef = useRef(null);

  const [copied, setCopied] = useState(false);

  // Normalize purchased items (up to 3 items shown prominently in the unboxing reveal)
  const displayItems = (items && items.length > 0) ? items.slice(0, 3) : [
    { product_name: 'Manjistha Soap', quantity: 1, unit_price: 349 },
    { product_name: 'Goat Milk Soap', quantity: 1, unit_price: 300 },
    { product_name: 'Beet Root Lip Balm', quantity: 1, unit_price: 249 }
  ];

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

  const handleCopyOrderNumber = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeOrderNum);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (checkmarkBadgeRef.current) gsap.set(checkmarkBadgeRef.current, { scale: 0.62, y: -24, opacity: 1 });
      if (heroHeaderRef.current) gsap.set(heroHeaderRef.current, { y: 0, opacity: 1 });
      if (boxWrapperRef.current) gsap.set(boxWrapperRef.current, { y: 0, opacity: 1, scale: 1 });
      if (lidClosedRef.current) gsap.set(lidClosedRef.current, { opacity: 0 });
      if (finalRevealRef.current) gsap.set(finalRevealRef.current, { opacity: 1 });
      if (actionButtonsRef.current) gsap.set(actionButtonsRef.current, { y: 0, opacity: 1 });
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      const badge = checkmarkBadgeRef.current;
      const circle = checkmarkCircleRef.current;
      const check = checkmarkPathRef.current;
      const rays = raysRef.current;
      const pulse = pulseRef.current;
      const heroHeader = heroHeaderRef.current;
      const boxWrapper = boxWrapperRef.current;
      const lidClosed = lidClosedRef.current;
      const lidOpen = lidOpenRef.current;
      const glow = goldenGlowRef.current;
      const products = containerRef.current.querySelectorAll('.purchased-product-stage');
      const tags = containerRef.current.querySelectorAll('.product-pill-tag');
      const finalReveal = finalRevealRef.current;
      const buttons = actionButtonsRef.current;

      // -----------------------------------------------------------------------
      // STAGE 1: SUCCESS CHECKMARK ANIMATION IN THE CENTER (0s – 1.0s)
      // Reference 1: Green circular indicator, draws checkmark, 8 rays, outward pulse
      // -----------------------------------------------------------------------
      if (badge && circle && check) {
        const circleLength = circle.getTotalLength ? circle.getTotalLength() : 200;
        const checkLength = check.getTotalLength ? check.getTotalLength() : 50;

        gsap.set(circle, { strokeDasharray: circleLength, strokeDashoffset: circleLength });
        gsap.set(check, { strokeDasharray: checkLength, strokeDashoffset: checkLength });
        gsap.set(badge, { scale: 0.15, opacity: 0 });

        if (rays) {
          gsap.set(rays, { scale: 0.35, opacity: 0 });
        }
        if (pulse) {
          gsap.set(pulse, { scale: 0.8, opacity: 0 });
        }

        // 1. Circle scales in with elastic bounce
        masterTl.to(badge, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: 'back.out(1.8)'
        })
        // 2. 8 Green Success Rays burst outward around the perimeter
        .to(rays, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: 'back.out(2)'
        }, '<0.08')
        // 3. Green circle stroke draws
        .to(circle, {
          strokeDashoffset: 0,
          duration: 0.38,
          ease: 'power2.out'
        }, '-=0.32')
        // 4. White checkmark stroke draws
        .to(check, {
          strokeDashoffset: 0,
          duration: 0.32,
          ease: 'power2.out'
        }, '-=0.15')
        // 5. Subtle green pulse expands outward
        .fromTo(pulse, 
          { scale: 0.85, opacity: 0.7 },
          { scale: 2.3, opacity: 0, duration: 0.65, ease: 'power2.out' },
          '-=0.25'
        );
      }

      // -----------------------------------------------------------------------
      // STAGE 2: CHECKMARK MOVES UPWARD & HEADING APPEARS (1.0s – 1.7s)
      // Heading, Subtitle & Order ID Pill Fade In
      // -----------------------------------------------------------------------
      if (badge) {
        masterTl.to(badge, {
          scale: 0.62,
          y: -22,
          duration: 0.55,
          ease: 'power3.inOut'
        }, '+=0.15');
      }

      if (rays) {
        masterTl.to(rays, {
          scale: 0.5,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in'
        }, '<');
      }

      if (heroHeader) {
        gsap.set(heroHeader, { y: 25, opacity: 0 });
        masterTl.to(heroHeader, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out'
        }, '-=0.35');
      }

      // -----------------------------------------------------------------------
      // STAGE 3: EARTHGLAZE 3D GIFT BOX ENTERS THE CENTRE (1.6s – 2.4s)
      // -----------------------------------------------------------------------
      if (boxWrapper) {
        gsap.set(boxWrapper, { y: 65, scale: 0.88, opacity: 0 });
        masterTl.to(boxWrapper, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: 'back.out(1.3)'
        }, '-=0.25');
      }

      // -----------------------------------------------------------------------
      // STAGE 4: BOX LID ROTATES OPEN SMOOTHLY & GOLDEN LIGHT RADIATES (2.4s – 3.2s)
      // -----------------------------------------------------------------------
      if (lidClosed) {
        masterTl.to(lidClosed, {
          rotateX: -110,
          y: -30,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.inOut'
        }, '+=0.05');
      }

      // Golden interior radiant light shines upward
      if (glow) {
        masterTl.fromTo(glow,
          { scale: 0.5, opacity: 0 },
          { scale: 1.45, opacity: 0.85, duration: 0.55, ease: 'power2.out' },
          '-=0.55'
        )
        .to(glow, {
          opacity: 0.25,
          duration: 0.5,
          ease: 'power2.inOut'
        }, '+=0.1');
      }

      // Open lid settles into place
      if (lidOpen) {
        gsap.set(lidOpen, { opacity: 0, y: 15, scale: 0.95 });
        masterTl.to(lidOpen, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power2.out'
        }, '-=0.6');
      }

      // -----------------------------------------------------------------------
      // STAGE 5: PURCHASED PRODUCTS RISE FROM INSIDE THE BOX (3.1s – 4.1s)
      // Products elevate with luxury frosted formulation tags
      // -----------------------------------------------------------------------
      if (products.length > 0) {
        gsap.set(products, {
          y: 35,
          scale: 0.4,
          opacity: 0
        });

        masterTl.to(products, {
          y: (i) => {
            if (displayItems.length === 1) return -85;
            if (displayItems.length === 2) return -88;
            return i === 1 ? -98 : -85;
          },
          scale: 1.05,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'back.out(1.5)'
        }, '-=0.45');
      }

      // -----------------------------------------------------------------------
      // STAGE 6: PRODUCTS SETTLE NATURALLY INTO THE BOX CUSHION (4.1s – 5.0s)
      // Products gently descend and nestle into the golden tissue paper bed
      // -----------------------------------------------------------------------
      if (products.length > 0) {
        masterTl.to(products, {
          y: (i) => {
            if (displayItems.length === 1) return 0;
            return i === 1 ? -4 : 0;
          },
          scale: 1.0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.inOut'
        }, '+=0.2');

        // Formulation tags softly fade out to reveal the resting products
        if (tags.length > 0) {
          masterTl.to(tags, {
            opacity: 0,
            y: 8,
            duration: 0.45,
            ease: 'power2.out'
          }, '-=0.5');
        }
      }

      // -----------------------------------------------------------------------
      // STAGE 7: FINAL REVEAL MATCHING REFERENCE 2 (4.8s – 5.4s)
      // The box remains open for the beautiful unboxing photograph reveal
      // -----------------------------------------------------------------------
      if (finalReveal) {
        masterTl.to(finalReveal, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, '-=0.4');
      }

      // -----------------------------------------------------------------------
      // STAGE 8: ACTION BUTTONS REVEAL (5.1s – 5.6s)
      // Track Your Order & Continue Shopping CTAs
      // -----------------------------------------------------------------------
      if (buttons) {
        masterTl.fromTo(
          buttons,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          '-=0.2'
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none pt-2 sm:pt-4 pb-4"
      style={{ perspective: '1200px' }}
    >

      {/* =====================================================================
          STAGE 1 & 2: SUCCESS CHECKMARK & RADIATING GREEN RAYS
          Exact match to Reference 1: Warm cream canvas, centered green circle,
          smoothly animated white checkmark, 8 green radiating rays, outward pulse
          ===================================================================== */}
      <div
        ref={stage1WrapperRef}
        className="relative flex flex-col items-center justify-center z-30"
      >
        {/* Subtle Outward Green Pulse Ring */}
        <div
          ref={pulseRef}
          className="absolute w-24 h-24 rounded-full border-2 border-[#22C55E] pointer-events-none opacity-0"
          style={{
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
          }}
        />

        {/* 8 Green Success Ray Ticks (Sunburst Compass) - Exactly matching Reference 1 & 2 */}
        <div
          ref={raysRef}
          className="absolute w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center pointer-events-none"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <div
              key={idx}
              className="absolute w-1 sm:w-1.5 h-4 sm:h-5 rounded-full bg-[#16A34A]"
              style={{
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)',
                transformOrigin: 'center center',
                transform: `rotate(${angle}deg) translateY(-46px)`,
              }}
            />
          ))}
        </div>

        {/* Central Circular Green Success Indicator with Animated SVG Checkmark */}
        <div
          ref={checkmarkBadgeRef}
          className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #4ADE80 0%, #22C55E 40%, #16A34A 80%, #15803D 100%)',
            boxShadow: '0 10px 25px rgba(22, 163, 74, 0.35), 0 0 15px rgba(74, 222, 128, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.5)'
          }}
        >
          <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 64 64" fill="none">
            <circle
              ref={checkmarkCircleRef}
              cx="32"
              cy="32"
              r="27"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2.5"
            />
            <path
              ref={checkmarkPathRef}
              d="M19 33L28 42L45 23"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* =====================================================================
          STAGE 2: HEADING, SUBTITLE & ORDER ID PILL
          Matches Reference 2: Forest green Outfit typography on warm cream
          ===================================================================== */}
      <div
        ref={heroHeaderRef}
        className="flex flex-col items-center text-center mt-2 sm:mt-3 z-20 space-y-2 max-w-lg px-4 opacity-0"
      >
        <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#0C3821] tracking-tight leading-[1.15]">
          Order Placed Successfully!
        </h1>

        <p className="text-xs sm:text-sm text-[#57534E] font-sans font-medium leading-relaxed">
          Thank you for choosing EarthGlaze.
        </p>

        {/* Copyable Order ID Pill */}
        <div className="pt-0.5">
          <span className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold text-[#143B22] bg-[#EFEAE1] hover:bg-[#EAE4D9] transition-colors px-3.5 py-1.5 rounded-full border border-[#DDD5C7] shadow-xs">
            <span>Order ID: <strong className="font-mono text-[#0C3821]">#{activeOrderNum}</strong></span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="text-[#57534E] hover:text-[#0C3821] transition-colors p-0.5 rounded focus:outline-none cursor-pointer"
              title="Copy Order ID"
              aria-label="Copy Order ID"
            >
              {copied ? (
                <span className="text-[#16A34A] text-xs font-bold">✓</span>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </span>
        </div>

        <p className="text-[11px] sm:text-xs text-[#78716C] font-sans pt-0.5">
          A confirmation email has been sent with tracking details.
        </p>
      </div>

      {/* =====================================================================
          STAGE 3 – 7: 3D EARTHGLAZE GIFT BOX & PRODUCT UNBOXING
          Matches Reference 2:
          - Dark forest-green gift box
          - Gold satin ribbon & tied 3D bow
          - EarthGlaze gold foil emblem & branding
          - Golden crumpled tissue paper cushion
          - Products rise from inside with tags, then settle into the box
          - Box remains open for final reveal matching Reference 2
          ===================================================================== */}
      <div
        ref={boxWrapperRef}
        className="relative z-20 flex flex-col items-center justify-center w-full max-w-[720px] px-2 sm:px-4 mt-4 sm:mt-6 opacity-0"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Table Drop Shadow beneath Box */}
        <div
          className="absolute -bottom-4 w-[75%] h-12 rounded-[100%] pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(60, 45, 20, 0.4) 0%, rgba(100, 80, 50, 0.15) 50%, transparent 75%)',
            filter: 'blur(10px)',
            transform: 'rotateX(75deg)'
          }}
        />

        {/* -------------------------------------------------------------------
            BOX BASE CONTAINER (Holds Box Body, Tissue Cavity & Ribbons)
            ------------------------------------------------------------------- */}
        <div className="relative w-full aspect-[824/355] max-w-[680px] flex items-center justify-center">

          {/* 1. Base Box with Cavity & Flowing Satin Ribbons */}
          <img
            src="/assets/order_box_cavity_empty.png"
            alt="EarthGlaze Luxury Gift Box"
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-lg"
          />

          {/* 2. Soft Golden Interior Light Beam (emerges when lid rotates open) */}
          <div
            ref={goldenGlowRef}
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[55%] h-[40%] rounded-full pointer-events-none opacity-0 z-15"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(254, 240, 138, 0.95) 0%, rgba(234, 179, 8, 0.55) 45%, rgba(34, 197, 94, 0.15) 70%, transparent 85%)',
              filter: 'blur(18px)'
            }}
          />

          {/* 3. Open Lid Resting Tilted Backward (revealed after opening) */}
          <div
            ref={lidOpenRef}
            className="absolute top-[8%] left-[28%] w-[52%] aspect-[480/160] pointer-events-none z-10 opacity-0"
          >
            <img
              src="/assets/order_box_lid_closed.png"
              alt="Open Box Lid"
              className="w-full h-full object-contain -rotate-[16deg] drop-shadow-md opacity-90"
            />
          </div>

          {/* 4. Closed Box Lid (Covers box during entrance, rotates open in 3D) */}
          <div
            ref={lidClosedRef}
            className="absolute top-[18%] left-[23.5%] w-[53%] aspect-[485/150] z-30"
            style={{
              transformOrigin: '50% 10%',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src="/assets/order_box_lid_closed.png"
              alt="Closed Box Lid"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>

          {/* 5. Ascending & Settling Purchased Products */}
          <div
            ref={productsGroupRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            {displayItems.map((item, idx) => {
              let xOffset = 0;
              let rot = 0;
              let zIndex = 20;

              if (displayItems.length === 1) {
                xOffset = 0;
                rot = 0;
                zIndex = 22;
              } else if (displayItems.length === 2) {
                xOffset = idx === 0 ? -75 : 75;
                rot = idx === 0 ? -6 : 6;
                zIndex = idx === 0 ? 21 : 22;
              } else if (displayItems.length === 3) {
                xOffset = idx === 0 ? -105 : idx === 1 ? 0 : 105;
                rot = idx === 0 ? -7 : idx === 1 ? 0 : 7;
                zIndex = idx === 1 ? 24 : 21;
              }

              return (
                <div
                  key={idx}
                  className="absolute flex flex-col items-center pointer-events-none"
                  style={{
                    transform: `translateX(${xOffset}px) rotate(${rot}deg)`,
                    zIndex,
                    top: '22%'
                  }}
                >
                  <div className="purchased-product-stage flex flex-col items-center">
                    {/* High-Definition Transparent Product Image */}
                    <div className="relative w-22 sm:w-28 h-22 sm:h-28 flex items-center justify-center">
                      <img
                        src={getProductImage(item)}
                        alt={item.product_name || 'EarthGlaze Formulation'}
                        className="max-h-full max-w-full object-contain select-none"
                        style={{
                          filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.45))'
                        }}
                      />
                    </div>

                    {/* Floating Luxury Frosted Formulation Tag */}
                    <div className="product-pill-tag mt-1 px-3 py-0.5 rounded-full bg-[#0C3821]/90 backdrop-blur-md border border-[#D4AF37]/60 shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <span className="font-sans font-bold text-[10px] sm:text-xs text-[#FAF7F2] truncate max-w-[120px]">
                        {item.quantity || 1}× {item.product_name || item.name || 'Botanical Soap'}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-[#FDE047] shrink-0">
                        • ₹{item.unit_price || item.total_price || 300}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 6. Final High-Fidelity Studio Photograph Reveal Overlay (Matching Reference 2) */}
          <div
            ref={finalRevealRef}
            className="absolute inset-0 pointer-events-none z-25 opacity-0"
          >
            <img
              src="/assets/order_box_unit_feathered.png"
              alt="EarthGlaze Open Box Reveal"
              className="w-full h-full object-contain drop-shadow-md select-none"
            />
          </div>

        </div>

      </div>

      {/* =====================================================================
          ACTION BUTTONS: TRACK YOUR ORDER & CONTINUE SHOPPING
          Matches Reference 2:
          - Deep forest-green Track Your Order CTA with truck icon
          - Refined ivory/cream Continue Shopping button with cart icon
          ===================================================================== */}
      <div
        ref={actionButtonsRef}
        className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md z-30 px-4 opacity-0"
      >
        {/* Track Your Order (Forest Green Solid CTA with Delivery Truck Icon) */}
        <Link
          href={`/track-order?order_number=${activeOrderNum}`}
          className="flex-1 min-w-[180px] px-6 py-3.5 bg-[#0C3821] hover:bg-[#14532D] text-[#FAF7F2] font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group active:scale-95 cursor-pointer border border-[#1B4D31]"
        >
          <svg className="w-4 h-4 text-[#86EFAC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>Track Your Order</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1 font-sans">→</span>
        </Link>

        {/* Continue Shopping (Refined Cream Secondary Button) */}
        <Link
          href="/shop"
          className="flex-1 min-w-[170px] px-6 py-3.5 bg-[#FAF7F2] hover:bg-white text-[#0C3821] font-semibold text-xs sm:text-sm rounded-full transition-all duration-200 border border-[#D6CEBF] shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#15803D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
}
