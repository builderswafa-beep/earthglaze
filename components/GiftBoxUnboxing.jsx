'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function GiftBoxUnboxing({
  order,
  items = [],
  activeOrderNum = 'EG54586',
  onComplete,
}) {
  const containerRef = useRef(null);
  const stage1WrapperRef = useRef(null);
  const checkmarkBadgeRef = useRef(null);
  const checkmarkCircleRef = useRef(null);
  const checkmarkPathRef = useRef(null);
  const particlesRef = useRef(null);
  const pulseRef = useRef(null);

  const heroHeaderRef = useRef(null);
  const boxWrapperRef = useRef(null);
  const lidRef = useRef(null);
  const glowRef = useRef(null);
  const actionButtonsRef = useRef(null);

  const [copied, setCopied] = useState(false);

  // Dynamically match customer's purchased items to the 3 real EarthGlaze products
  // ONLY show the products actually purchased!
  const getPurchasedProducts = () => {
    if (!items || items.length === 0) {
      return [
        {
          id: 'manjistha',
          name: 'Manjistha Soap',
          weight: '100g',
          price: 349,
          qty: 1,
          image: '/assets/3d_prod_manjistha_closed_box.png',
        },
        {
          id: 'goatmilk',
          name: 'Goat Milk Soap',
          weight: '100g',
          price: 300,
          qty: 1,
          image: '/assets/3d_prod_goatmilksoap_close_box.png',
        },
        {
          id: 'lipbalm',
          name: 'Beet Root Lip Balm',
          weight: '15g',
          price: 249,
          qty: 1,
          image: '/assets/3d_prod_lip_balm_closed_box.png',
        },
      ];
    }

    const matched = [];
    items.forEach((item) => {
      const name = (item.product_name || item.name || '').toLowerCase();
      const sku = (item.sku || '').toLowerCase();
      const qty = item.quantity || 1;
      const price = item.total_price || item.unit_price * qty || 300;

      if (name.includes('goat') || sku.includes('goat')) {
        matched.push({
          id: 'goatmilk',
          name: item.product_name || 'Goat Milk Soap',
          weight: '100g',
          price,
          qty,
          image: '/assets/3d_prod_goatmilksoap_close_box.png',
        });
      } else if (name.includes('balm') || sku.includes('balm') || name.includes('beet')) {
        matched.push({
          id: 'lipbalm',
          name: item.product_name || 'Beet Root Lip Balm',
          weight: '15g',
          price,
          qty,
          image: '/assets/3d_prod_lip_balm_closed_box.png',
        });
      } else {
        matched.push({
          id: 'manjistha',
          name: item.product_name || 'Manjistha Soap',
          weight: '100g',
          price,
          qty,
          image: '/assets/3d_prod_manjistha_closed_box.png',
        });
      }
    });

    // Deduplicate if identical product was present across lines, max 3 showcase
    const unique = [];
    const seen = new Set();
    for (const p of matched) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
      if (unique.length === 3) break;
    }
    return unique.length > 0 ? unique : [
      {
        id: 'manjistha',
        name: 'Manjistha Soap',
        weight: '100g',
        price: 349,
        qty: 1,
        image: '/assets/3d_prod_manjistha_closed_box.png',
      },
      {
        id: 'goatmilk',
        name: 'Goat Milk Soap',
        weight: '100g',
        price: 300,
        qty: 1,
        image: '/assets/3d_prod_goatmilksoap_close_box.png',
      },
      {
        id: 'lipbalm',
        name: 'Beet Root Lip Balm',
        weight: '15g',
        price: 249,
        qty: 1,
        image: '/assets/3d_prod_lip_balm_closed_box.png',
      },
    ];
  };

  const displayProducts = getPurchasedProducts();

  const handleCopyOrderNumber = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeOrderNum);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (checkmarkBadgeRef.current) gsap.set(checkmarkBadgeRef.current, { scale: 0.6, y: -20, opacity: 1 });
      if (heroHeaderRef.current) gsap.set(heroHeaderRef.current, { y: 0, opacity: 1 });
      if (boxWrapperRef.current) gsap.set(boxWrapperRef.current, { y: 0, opacity: 1, scale: 1 });
      if (lidRef.current) gsap.set(lidRef.current, { rotateX: -110, y: -16, opacity: 0.9 });
      if (actionButtonsRef.current) gsap.set(actionButtonsRef.current, { y: 0, opacity: 1 });
      const products = containerRef.current?.querySelectorAll('.purchased-product-unit');
      if (products) gsap.set(products, { y: -45, scale: 1, opacity: 1 });
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      const badge = checkmarkBadgeRef.current;
      const circle = checkmarkCircleRef.current;
      const check = checkmarkPathRef.current;
      const particles = particlesRef.current;
      const pulse = pulseRef.current;
      const heroHeader = heroHeaderRef.current;
      const boxWrapper = boxWrapperRef.current;
      const lid = lidRef.current;
      const glow = glowRef.current;
      const buttons = actionButtonsRef.current;
      const productUnits = containerRef.current.querySelectorAll('.purchased-product-unit');

      // -----------------------------------------------------------------------
      // 1. OPENING SUCCESS ANIMATION
      // - Clean green circular success indicator
      // - Animated white tick mark drawing itself via SVG stroke animation
      // - Subtle green glow and a few small outward particles
      // - Smooth scale-in and bounce effect (Flipkart / Amazon standard)
      // - Holds briefly, then smoothly shrinks and transitions upwards
      // -----------------------------------------------------------------------
      if (badge && circle && check) {
        const circleLength = circle.getTotalLength ? circle.getTotalLength() : 200;
        const checkLength = check.getTotalLength ? check.getTotalLength() : 50;

        gsap.set(circle, { strokeDasharray: circleLength, strokeDashoffset: circleLength });
        gsap.set(check, { strokeDasharray: checkLength, strokeDashoffset: checkLength });
        gsap.set(badge, { scale: 0.15, opacity: 0 });

        if (particles) {
          gsap.set(particles, { scale: 0.4, opacity: 0 });
        }
        if (pulse) {
          gsap.set(pulse, { scale: 0.8, opacity: 0 });
        }

        // 1. Green circle scales in with satisfying elastic pop
        masterTl.to(badge, {
          scale: 1,
          opacity: 1,
          duration: 0.48,
          ease: 'back.out(2)',
        })
        // 2. White checkmark draws itself
        .to(check, {
          strokeDashoffset: 0,
          duration: 0.38,
          ease: 'power2.out',
        }, '-=0.2')
        // 3. Subtle particles radiate outward
        .to(particles, {
          scale: 1,
          opacity: 1,
          duration: 0.42,
          ease: 'back.out(2)',
        }, '<0.05')
        // 4. Circle stroke completes
        .to(circle, {
          strokeDashoffset: 0,
          duration: 0.35,
          ease: 'power2.out',
        }, '-=0.3')
        // 5. Gentle expanding pulse
        .fromTo(pulse,
          { scale: 0.85, opacity: 0.75 },
          { scale: 2.2, opacity: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.25'
        );

        // Hold completed success symbol briefly (0.4s)
        masterTl.to({}, { duration: 0.4 });

        // Smoothly shrink and transition upwards into header position
        masterTl.to(badge, {
          scale: 0.58,
          y: -24,
          duration: 0.55,
          ease: 'power3.inOut',
        });

        if (particles) {
          masterTl.to(particles, {
            scale: 0.4,
            opacity: 0,
            duration: 0.32,
            ease: 'power2.in',
          }, '<');
        }

        // Fade in Heading, Subtitle & Copyable Order ID Pill
        if (heroHeader) {
          gsap.set(heroHeader, { y: 25, opacity: 0 });
          masterTl.to(heroHeader, {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
          }, '-=0.35');
        }
      }

      // -----------------------------------------------------------------------
      // 2. 3D EARTHGLAZE GIFT BOX ENTERS (Moves gently into position)
      // Box arrives CLOSED with connected lid and soft contact shadows
      // -----------------------------------------------------------------------
      if (boxWrapper) {
        gsap.set(boxWrapper, { y: 55, scale: 0.88, opacity: 0 });
        masterTl.to(boxWrapper, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: 'back.out(1.25)',
        }, '-=0.25');
      }

      // -----------------------------------------------------------------------
      // 3. GOLD RIBBON & LID OPEN NATURALLY AROUND PHYSICAL BACK HINGE
      // Connected lid and base during the opening animation!
      // -----------------------------------------------------------------------
      if (lid) {
        masterTl.to(lid, {
          rotateX: -110,
          y: -18,
          duration: 0.95,
          ease: 'power2.inOut',
        }, '+=0.15');
      }

      // Soft natural interior light illuminates the cavity
      if (glow) {
        masterTl.fromTo(glow,
          { scale: 0.5, opacity: 0 },
          { scale: 1.3, opacity: 0.85, duration: 0.5, ease: 'power2.out' },
          '-=0.7'
        )
        .to(glow, {
          opacity: 0.25,
          duration: 0.6,
          ease: 'power1.inOut',
        }, '+=0.1');
      }

      // -----------------------------------------------------------------------
      // 4. PURCHASED PRODUCTS GENTLY RISE INTO SHOWCASE ARRANGEMENT
      // Products start inside, rise naturally over front wall, settle in front!
      // -----------------------------------------------------------------------
      if (productUnits.length > 0) {
        gsap.set(productUnits, {
          y: 40,
          scale: 0.65,
          opacity: 0,
        });

        // Step 1: Rise vertically out of the box cavity, clearing the front wall
        masterTl.to(productUnits, {
          y: (i) => (displayProducts.length === 1 ? -95 : i === 1 ? -105 : -95),
          scale: 1.05,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'back.out(1.4)',
        }, '-=0.6');

        // Step 2: Settle gently into presentation arrangement in golden tissue
        masterTl.to(productUnits, {
          y: (i) => (displayProducts.length === 1 ? -46 : i === 1 ? -52 : -46),
          scale: 1.0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power2.inOut',
        }, '+=0.05');
      }

      // -----------------------------------------------------------------------
      // 5. SUBTLE ORGANIC FLOATING MOTION
      // Box remains open behind products with continuous subtle hover
      // -----------------------------------------------------------------------
      masterTl.add(() => {
        if (boxWrapper) {
          gsap.to(boxWrapper, {
            y: '-=6px',
            duration: 2.8,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        }
      });

      // -----------------------------------------------------------------------
      // 6. ACTION BUTTONS APPEAR (Track Your Order & Continue Shopping)
      // -----------------------------------------------------------------------
      if (buttons) {
        masterTl.fromTo(buttons,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          '-=0.2'
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, [activeOrderNum, items]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none pt-2 sm:pt-4 pb-2"
      style={{ perspective: '1200px' }}
    >

      {/* =====================================================================
          1. FIRST ANIMATION: CLEAN ATTRACTIVE GREEN SUCCESS CIRCLE & TICK
          - Clean green circular success indicator
          - Animated white checkmark drawing via SVG stroke
          - Subtle green glow and small outward particle sparkles
          - Smooth scale-in & bounce effect (Flipkart / Amazon standard)
          - Holds briefly, then glides upward into header position
          ===================================================================== */}
      <div
        ref={stage1WrapperRef}
        className="relative flex flex-col items-center justify-center z-30"
      >
        {/* Subtle Outward Green Pulse Ring */}
        <div
          ref={pulseRef}
          className="absolute w-22 h-22 rounded-full border-2 border-[#16A34A] pointer-events-none opacity-0"
          style={{
            boxShadow: '0 0 16px rgba(22, 163, 74, 0.4)',
          }}
        />

        {/* Radiating Green Success Rays (Exact match to Reference 1 & 2) */}
        <div
          ref={particlesRef}
          className="absolute w-28 sm:w-32 h-28 sm:h-32 flex items-center justify-center pointer-events-none"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <div
              key={idx}
              className="absolute w-[3px] h-3 rounded-full bg-[#16A34A]"
              style={{
                boxShadow: '0 0 6px rgba(22, 163, 74, 0.65)',
                transformOrigin: 'center center',
                transform: `rotate(${angle}deg) translateY(-32px)`,
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
            boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35), 0 0 16px rgba(74, 222, 128, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.55)',
          }}
        >
          <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 64 64" fill="none">
            <circle
              ref={checkmarkCircleRef}
              cx="32"
              cy="32"
              r="27"
              stroke="rgba(255, 255, 255, 0.45)"
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
          2. HEADER: ORDER PLACED SUCCESSFULLY & ORDER ID PILL
          Forest-green typography (#103321), clean Outfit font, 1-click copy
          ===================================================================== */}
      <div
        ref={heroHeaderRef}
        className="flex flex-col items-center text-center mt-2 sm:mt-3 z-20 space-y-2 max-w-lg px-4 opacity-0"
      >
        <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#103321] tracking-tight leading-[1.15]">
          Order Placed Successfully!
        </h1>

        <p className="text-xs sm:text-sm text-[#57534E] font-sans font-medium leading-relaxed">
          Thank you for choosing EarthGlaze.
        </p>

        {/* Copyable Order ID Pill */}
        <div className="pt-0.5">
          <span className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold text-[#103321] bg-[#EFEAE1] hover:bg-[#EAE4D9] transition-colors px-3.5 py-1.5 rounded-full border border-[#DDD5C7] shadow-xs">
            <span>Order ID: <strong className="font-mono text-[#103321]">#{activeOrderNum}</strong></span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="text-[#57534E] hover:text-[#103321] transition-colors p-0.5 rounded focus:outline-none cursor-pointer"
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
          3. PREMIUM 3D EARTHGLAZE GIFT BOX & REAL PRODUCT SHOWCASE
          - Forest-green premium rigid gift-box material
          - Gold foil EarthGlaze logo and filigree
          - Separate 3D hinged lid connected at the back
          - Golden crumpled tissue paper cushion inside cavity
          - Products start inside, rise over front wall, settle in front
          - Soft natural contact shadow underneath (ZERO gray polygons!)
          ===================================================================== */}
      <div
        ref={boxWrapperRef}
        className="relative z-20 flex flex-col items-center justify-center w-full max-w-[620px] px-2 sm:px-4 mt-10 sm:mt-12 opacity-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(8deg)',
        }}
      >
        {/* Soft Natural Studio Contact Shadow beneath Box (ZERO gray polygons) */}
        <div
          className="absolute -bottom-6 w-[85%] h-12 rounded-[100%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16, 51, 33, 0.38) 0%, rgba(40, 30, 15, 0.18) 45%, transparent 75%)',
            filter: 'blur(14px)',
            transform: 'rotateX(75deg)',
          }}
        />

        {/* Left Curling Gold Satin Ribbon (Matching Reference 2) */}
        <div className="absolute -left-12 sm:-left-20 -bottom-2 w-28 sm:w-36 h-20 pointer-events-none z-10 opacity-90">
          <svg viewBox="0 0 120 70" fill="none" className="w-full h-full drop-shadow-md">
            <path
              d="M115 35 C85 35 65 10 35 22 C15 30 5 55 22 62 C38 68 50 48 68 42"
              stroke="url(#goldRibbonGradL)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="goldRibbonGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C9A45C" />
                <stop offset="45%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#96681E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Right Curling Gold Satin Ribbon (Matching Reference 2) */}
        <div className="absolute -right-12 sm:-right-20 -bottom-2 w-28 sm:w-36 h-20 pointer-events-none z-10 opacity-90">
          <svg viewBox="0 0 120 70" fill="none" className="w-full h-full drop-shadow-md">
            <path
              d="M5 35 C35 35 55 10 85 22 C105 30 115 55 98 62 C82 68 70 48 52 42"
              stroke="url(#goldRibbonGradR)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="goldRibbonGradR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C9A45C" />
                <stop offset="45%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#96681E" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* -------------------------------------------------------------------
            3D GIFT BOX BODY & CONNECTED LID
            ------------------------------------------------------------------- */}
        <div
          className="relative w-full max-w-[480px] h-36 sm:h-44 rounded-2xl"
          style={{
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(145deg, #16482B 0%, #0D3520 50%, #072514 100%)',
            boxShadow: '0 25px 45px -12px rgba(10, 35, 20, 0.4), inset 0 1px 0 rgba(212, 175, 55, 0.35)',
          }}
        >
          {/* Subtle Metallic Gold Edge Trim */}
          <div className="absolute inset-1 rounded-xl border border-[#D4AF37]/35 pointer-events-none" />

          {/* Golden Interior Radiance (emerges when lid rotates open) */}
          <div
            ref={glowRef}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-36 rounded-full pointer-events-none opacity-0 z-10"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(254, 240, 138, 0.9) 0%, rgba(212, 175, 55, 0.45) 45%, transparent 75%)',
              filter: 'blur(16px)',
            }}
          />

          {/* Golden Crumpled Tissue Paper Bed inside Box Cavity */}
          <div
            className="absolute inset-x-2 top-2 h-20 sm:h-24 rounded-xl pointer-events-none z-10 overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #F0D597 0%, #DEB050 55%, #C29334 100%)',
              boxShadow: 'inset 0 4px 10px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Crinkle Paper Texture Lines */}
            <div className="w-full h-full opacity-35 bg-[radial-gradient(#96681E_1px,transparent_1px)] [background-size:12px_12px]" />
          </div>

          {/* Center Vertical Gold Satin Ribbon Band */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-9 pointer-events-none z-25"
            style={{
              background: 'linear-gradient(90deg, #A8812D 0%, #FDE047 50%, #A8812D 100%)',
              boxShadow: '0 0 6px rgba(0, 0, 0, 0.25)',
            }}
          />

          {/* Authentic EarthGlaze Gold Foil Logo & Filigree on Front Face */}
          <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 flex flex-col items-center justify-center z-25 pointer-events-none text-center px-4">
            {/* Botanical Leaf Silhouette */}
            <svg className="w-5 h-5 text-[#FDE047] mb-0.5 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8 6 4 10 4 15a8 8 0 0 0 16 0c0-5-4-9-8-13zm0 18a6 6 0 0 1-6-6c0-3.3 2.7-6.5 6-9.5 3.3 3 6 6.2 6 9.5a6 6 0 0 1-6 6z" />
            </svg>
            <span
              className="font-sans font-bold text-xs sm:text-sm tracking-[0.26em] uppercase text-[#FBF5D4]"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              EARTHGLAZE
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.22em] text-[#EAB308] uppercase font-sans mt-0.5">
              Natural Skincare
            </span>
          </div>

          {/* -----------------------------------------------------------------
              SEPARATE 3D HINGED LID (Properly connected at top-back edge!)
              Rotates backwards around back hinge (-110deg)
              ----------------------------------------------------------------- */}
          <div
            ref={lidRef}
            className="absolute -top-3 left-[-3px] right-[-3px] h-12 sm:h-14 rounded-t-2xl z-30"
            style={{
              transformOrigin: '50% 0%',
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(145deg, #1B5232 0%, #0D3520 60%, #072514 100%)',
              boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(254, 240, 138, 0.6)',
            }}
          >
            {/* Gold Rim Bevel along Bottom Lip */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#A8812D] via-[#FDE047] to-[#A8812D] rounded-b-xs" />

            {/* Lid Vertical Gold Satin Ribbon */}
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-9"
              style={{
                background: 'linear-gradient(90deg, #A8812D 0%, #FDE047 50%, #A8812D 100%)',
              }}
            />

            {/* 3D Gold Ribbon Bow Ornament in Center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center drop-shadow-md">
              <div className="w-7 h-4 bg-gradient-to-r from-[#B8860B] via-[#FDE047] to-[#B8860B] rounded-full border border-[#D4AF37] rotate-[-15deg] -mr-1" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FDE047] border border-[#B8860B] shadow-sm z-10" />
              <div className="w-7 h-4 bg-gradient-to-r from-[#B8860B] via-[#FDE047] to-[#B8860B] rounded-full border border-[#D4AF37] rotate-[15deg] -ml-1" />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            REAL PRODUCT PRESENTATION (Only products actually purchased!)
            Uses original EarthGlaze packaging PNGs with natural proportions
            ------------------------------------------------------------------- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {displayProducts.map((prod, idx) => {
            const count = displayProducts.length;
            let xOffset = 0;
            let rot = 0;
            let zIndex = 20;

            if (count === 1) {
              xOffset = 0;
              rot = 0;
              zIndex = 22;
            } else if (count === 2) {
              xOffset = idx === 0 ? -90 : 90;
              rot = idx === 0 ? -5 : 5;
              zIndex = idx === 0 ? 21 : 22;
            } else if (count === 3) {
              xOffset = idx === 0 ? -125 : idx === 1 ? 0 : 125;
              rot = idx === 0 ? -7 : idx === 1 ? 0 : 7;
              zIndex = idx === 1 ? 24 : 21;
            }

            return (
              <div
                key={prod.id || idx}
                className="absolute flex flex-col items-center pointer-events-none"
                style={{
                  transform: `translateX(${xOffset}px) rotate(${rot}deg)`,
                  zIndex,
                }}
              >
                <div className="purchased-product-unit flex flex-col items-center">
                  {/* Authentic Packaging Product Image */}
                  <div className="relative w-28 sm:w-36 h-28 sm:h-36 flex items-center justify-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain select-none"
                      style={{
                        filter: 'drop-shadow(0 14px 22px rgba(10, 30, 15, 0.45))',
                      }}
                    />
                  </div>

                  {/* Elegant Frosted Formulation Pill Tag */}
                  <div className="mt-1 px-3 py-1 rounded-full bg-[#103321]/92 backdrop-blur-md border border-[#D4AF37]/60 shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-sans font-bold text-[10px] sm:text-xs text-[#FAF7F2] truncate max-w-[170px]">
                      {prod.qty}× {prod.name}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#FDE047] shrink-0">
                      • ₹{prod.price}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* =====================================================================
          4. ACTION BUTTONS: TRACK YOUR ORDER & CONTINUE SHOPPING
          Deep forest-green CTA (#103321) & refined ivory secondary button
          ===================================================================== */}
      <div
        ref={actionButtonsRef}
        className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md z-30 px-4 opacity-0"
      >
        <Link
          href={`/track-order?order_number=${activeOrderNum}`}
          className="flex-1 min-w-[180px] px-6 py-3.5 bg-[#103321] hover:bg-[#173F2B] text-[#FAF7F2] font-bold text-xs sm:text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group active:scale-95 cursor-pointer border border-[#173F2B]"
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

        <Link
          href="/shop"
          className="flex-1 min-w-[170px] px-6 py-3.5 bg-[#FAF7F2] hover:bg-white text-[#103321] font-semibold text-xs sm:text-sm rounded-full transition-all duration-200 border border-[#D6CEBF] shadow-xs hover:shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
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
