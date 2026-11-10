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
  const boxStageRef = useRef(null);
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
      if (checkmarkBadgeRef.current) gsap.set(checkmarkBadgeRef.current, { scale: 0.55, y: -22, opacity: 1 });
      if (heroHeaderRef.current) gsap.set(heroHeaderRef.current, { y: 0, opacity: 1 });
      if (boxStageRef.current) gsap.set(boxStageRef.current, { y: 0, opacity: 1, scale: 1 });
      if (actionButtonsRef.current) gsap.set(actionButtonsRef.current, { y: 0, opacity: 1 });
      
      const productUnits = containerRef.current?.querySelectorAll('.floating-product-unit');
      if (productUnits) {
        productUnits.forEach((unit, i) => {
          const count = displayProducts.length;
          let targetY = -35;
          let targetX = 0;
          let rot = 0;
          if (count === 3) {
            targetX = i === 0 ? -10 : i === 1 ? 0 : 10;
            targetY = i === 1 ? -45 : -35;
            rot = i === 0 ? -3 : i === 1 ? 0 : 3;
          } else if (count === 2) {
            targetX = i === 0 ? -12 : 12;
            targetY = -40;
            rot = i === 0 ? -3 : 3;
          } else if (count === 1) {
            targetX = 0;
            targetY = -45;
            rot = 0;
          }
          gsap.set(unit, { y: targetY, x: targetX, rotation: rot, scale: 1.0, zIndex: 40 + i });
          const shadow = unit.querySelector('.product-shadow');
          if (shadow) gsap.set(shadow, { opacity: 0.75, scale: 1 });
          const tag = unit.querySelector('.product-tag');
          if (tag) gsap.set(tag, { opacity: 1, y: 0 });
        });
      }
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
      const boxStage = boxStageRef.current;
      const buttons = actionButtonsRef.current;
      const productUnits = containerRef.current?.querySelectorAll('.floating-product-unit');

      // -----------------------------------------------------------------------
      // 1. OPENING SUCCESS ANIMATION
      // - Clean green circular success indicator
      // - Animated white tick mark drawing itself via SVG stroke animation
      // - 8 radiating green tick rays
      // - Gentle expanding pulse ring
      // - Smooth scale-in and elastic pop
      // - Holds briefly, then glides up into header position
      // -----------------------------------------------------------------------
      if (badge && circle && check) {
        const circleLength = circle.getTotalLength ? circle.getTotalLength() : 200;
        const checkLength = check.getTotalLength ? check.getTotalLength() : 50;

        gsap.set(circle, { strokeDasharray: circleLength, strokeDashoffset: circleLength });
        gsap.set(check, { strokeDasharray: checkLength, strokeDashoffset: checkLength });
        gsap.set(badge, { scale: 0.15, opacity: 0 });

        if (particles) gsap.set(particles, { scale: 0.4, opacity: 0 });
        if (pulse) gsap.set(pulse, { scale: 0.8, opacity: 0 });

        masterTl
          .to(badge, {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(2)',
          })
          .to(check, {
            strokeDashoffset: 0,
            duration: 0.35,
            ease: 'power2.out',
          }, '-=0.18')
          .to(particles, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(2)',
          }, '<0.05')
          .to(circle, {
            strokeDashoffset: 0,
            duration: 0.3,
            ease: 'power2.out',
          }, '-=0.25')
          .fromTo(pulse,
            { scale: 0.85, opacity: 0.75 },
            { scale: 2.0, opacity: 0, duration: 0.65, ease: 'power2.out' },
            '-=0.2'
          );

        // Hold completed success symbol briefly
        masterTl.to({}, { duration: 0.35 });

        // Smoothly shrink and glide upwards into header position
        masterTl.to(badge, {
          scale: 0.55,
          y: -22,
          duration: 0.5,
          ease: 'power3.inOut',
        });

        if (particles) {
          masterTl.to(particles, {
            scale: 0.55,
            y: -22,
            opacity: 0.9,
            duration: 0.5,
            ease: 'power3.inOut',
          }, '<');
        }

        // Reveal Heading, Subtitle & Order ID Pill
        if (heroHeader) {
          gsap.set(heroHeader, { y: 20, opacity: 0 });
          masterTl.to(heroHeader, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
          }, '-=0.3');
        }
      }

      // -----------------------------------------------------------------------
      // 2. LUXURY EARTHGLAZE OPEN GIFT BOX ENTRANCE
      // - The newly provided EarthGlaze box appears smoothly in center
      // - The purchased products start neatly INSIDE the open box cavity!
      // - The front lip overlay (z-30) covers their lower portions naturally
      // -----------------------------------------------------------------------
      if (boxStage) {
        gsap.set(boxStage, { y: 35, scale: 0.92, opacity: 0 });
        masterTl.to(boxStage, {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.65,
          ease: 'back.out(1.2)',
        }, '-=0.2');
      }

      // Pause briefly so customer sees the products nested neatly inside the open box
      masterTl.to({}, { duration: 0.35 });

      // -----------------------------------------------------------------------
      // 3. PRODUCTS FLOAT OUT OF THE BOX ONE BY ONE!
      // - Starts neatly inside the open box cavity
      // - Smoothly floats vertically UP out of cavity, clearing the front rim
      // - Elevates z-index to 40 in mid-air
      // - Floats forward and settles into aligned showcase formation in front of cavity
      // - Realistic contact drop shadow fades in beneath each product
      // - Frosted formulation tag reveals
      // - Next product floats out sequenced one by one!
      // -----------------------------------------------------------------------
      if (productUnits && productUnits.length > 0) {
        const count = displayProducts.length;

        productUnits.forEach((unit, idx) => {
          const shadow = unit.querySelector('.product-shadow');
          const tag = unit.querySelector('.product-tag');

          // Destination landing position: hovering gracefully in showcase alignment
          let targetX = 0;
          let targetY = -35;
          let targetRot = 0;

          if (count === 3) {
            targetX = idx === 0 ? -10 : idx === 1 ? 0 : 10;
            targetY = idx === 1 ? -45 : -35;
            targetRot = idx === 0 ? -3 : idx === 1 ? 0 : 3;
          } else if (count === 2) {
            targetX = idx === 0 ? -12 : 12;
            targetY = -40;
            targetRot = idx === 0 ? -3 : 3;
          } else if (count === 1) {
            targetX = 0;
            targetY = -45;
            targetRot = 0;
          }

          // Initial inside-box state: start tucked inside cavity behind front wall
          gsap.set(unit, {
            y: 0,
            x: 0,
            scale: 1.0,
            zIndex: 20 + idx, // behind front lip (z-30)
          });
          if (shadow) gsap.set(shadow, { opacity: 0, scale: 0.4 });
          if (tag) gsap.set(tag, { opacity: 0, y: 10 });

          // Product timeline: floats out one by one
          const prodTl = gsap.timeline();

          // Phase A: Float vertically UP out of cavity, clearing front gold rim
          prodTl.to(unit, {
            y: -75,
            scale: 1.05,
            duration: 0.50,
            ease: 'power2.out',
          })
          // Phase B: Elevate z-index to 40+ so it is now in front of the box front wall
          .call(() => {
            unit.style.zIndex = `${40 + idx}`;
          })
          // Phase C: Float gracefully forward & settle into aligned showcase position
          .to(unit, {
            y: targetY,
            x: targetX,
            rotation: targetRot,
            scale: 1.0,
            duration: 0.55,
            ease: 'power2.inOut',
          })
          // Phase D: Realistic contact shadow fades in underneath
          .to(shadow, {
            opacity: 0.75,
            scale: 1.0,
            duration: 0.35,
            ease: 'power2.out',
          }, '-=0.25')
          // Phase E: Formulation tag reveals
          .to(tag, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
          }, '-=0.2');

          // Sequence each product float-out one by one!
          masterTl.add(prodTl, idx === 0 ? '+=0.05' : '-=0.2');
        });
      }

      // -----------------------------------------------------------------------
      // 4. CONTINUOUS ORGANIC BREATHING HOVER
      // Products gently float in mid-air once settled
      // -----------------------------------------------------------------------
      masterTl.add(() => {
        if (productUnits && productUnits.length > 0) {
          productUnits.forEach((unit, idx) => {
            const shadow = unit.querySelector('.product-shadow');
            gsap.to(unit, {
              y: '-=6px',
              duration: 2.8 + idx * 0.25,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
              delay: idx * 0.15,
            });
            if (shadow) {
              gsap.to(shadow, {
                scale: 0.88,
                opacity: 0.55,
                duration: 2.8 + idx * 0.25,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
                delay: idx * 0.15,
              });
            }
          });
        }
      });

      // -----------------------------------------------------------------------
      // 5. ACTION BUTTONS APPEAR (Track Your Order & Continue Shopping)
      // -----------------------------------------------------------------------
      if (buttons) {
        masterTl.fromTo(buttons,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          '-=0.05'
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, [activeOrderNum, items]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none pt-2 sm:pt-4 pb-2"
    >
      {/* =====================================================================
          1. FIRST ANIMATION: CLEAN ATTRACTIVE GREEN SUCCESS CIRCLE & TICK
          - Clean green circular success indicator
          - Animated white checkmark drawing via SVG stroke
          - 8 radiating green rays matching Reference 1 & 2
          - Subtle expanding pulse ring
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
          3. NEW LUXURY EARTHGLAZE OPEN GIFT BOX STAGE
          - Uses the newly provided official EarthGlaze gift box image exactly
          - Preserves all colors, logo, leaves, icons and 3D proportions
          - Products start neatly INSIDE the open box cavity
          - Products smoothly float out one by one with realistic contact shadows
          - Staggered, aligned showcase formation with zero overlapping
          ===================================================================== */}
      <div
        ref={boxStageRef}
        className="relative z-20 w-full max-w-[440px] sm:max-w-[500px] aspect-[662/649] mx-auto mt-6 sm:mt-8 opacity-0"
      >
        {/* Soft Ambient Contact Studio Shadow beneath Box */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[88%] h-10 rounded-[100%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16, 51, 33, 0.42) 0%, rgba(30, 20, 10, 0.18) 50%, transparent 75%)',
            filter: 'blur(14px)',
          }}
        />

        {/* Layer 1: Base Open Box (Lid upright + Champagne Interior Cavity + Box Base) */}
        <img
          src="/assets/earthglaze_luxury_box_crop.png"
          alt="EarthGlaze Luxury Gift Box"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10 drop-shadow-md"
        />

        {/* Layer 2: Products Layer (Starts inside cavity, floats out one-by-one) */}
        <div className="absolute inset-0 pointer-events-none">
          {displayProducts.map((prod, idx) => {
            const count = displayProducts.length;

            // Inside-box starting coordinates (percentage of 662x649 box)
            let startLeft = '38%';
            let startTop = '34%';
            let startWidth = '27%';
            let startRot = 0;

            if (count === 3) {
              if (idx === 0) {
                startLeft = '22%';
                startTop = '40%';
                startWidth = '24%';
                startRot = -3;
              } else if (idx === 1) {
                startLeft = '43%';
                startTop = '38%';
                startWidth = '25%';
                startRot = 0;
              } else if (idx === 2) {
                startLeft = '64%';
                startTop = '40%';
                startWidth = '21%';
                startRot = 3;
              }
            } else if (count === 2) {
              if (idx === 0) {
                startLeft = '28%';
                startTop = '39%';
                startWidth = '25%';
                startRot = -2;
              } else if (idx === 1) {
                startLeft = '52%';
                startTop = '39%';
                startWidth = '25%';
                startRot = 2;
              }
            } else if (count === 1) {
              startLeft = '39%';
              startTop = '39%';
              startWidth = '26%';
              startRot = 0;
            }

            return (
              <div
                key={prod.id || idx}
                className="floating-product-unit absolute flex flex-col items-center pointer-events-none"
                style={{
                  left: startLeft,
                  top: startTop,
                  width: startWidth,
                  transform: `rotate(${startRot}deg)`,
                  zIndex: 20 + idx, // initially inside cavity, behind front wall (z-30)
                }}
              >
                {/* Packshot Image Container */}
                <div className="relative w-full aspect-square flex items-center justify-center">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain select-none drop-shadow-[0_8px_16px_rgba(10,30,15,0.35)]"
                  />
                </div>

                {/* Realistic Oval Contact Drop Shadow beneath settled product */}
                <div
                  className="product-shadow w-[85%] h-3 rounded-[100%] pointer-events-none mt-1 opacity-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(16, 51, 33, 0.45) 0%, rgba(30, 20, 10, 0.2) 50%, transparent 75%)',
                    filter: 'blur(4px)',
                  }}
                />

                {/* Elegant Frosted Formulation Pill Tag */}
                <div className="product-tag mt-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#103321]/95 backdrop-blur-md border border-[#D4AF37]/70 shadow-md flex items-center gap-1 sm:gap-1.5 whitespace-nowrap opacity-0">
                  <span className="font-sans font-bold text-[9px] sm:text-xs text-[#FAF7F2] truncate max-w-[90px] sm:max-w-[150px]">
                    {prod.qty}× {prod.name}
                  </span>
                  <span className="text-[9px] sm:text-xs font-bold text-[#FDE047] shrink-0">
                    • ₹{prod.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 3: Foreground Box Front Lip & Right Side Wall */}
        {/* Occludes the bottom of products while they are inside the box! */}
        <img
          src="/assets/earthglaze_luxury_box_front_crop.png"
          alt="EarthGlaze Box Front Lip"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-30"
        />
      </div>

      {/* =====================================================================
          4. ACTION BUTTONS: TRACK YOUR ORDER & CONTINUE SHOPPING
          Deep forest-green CTA (#103321) & refined ivory secondary button
          ===================================================================== */}
      <div
        ref={actionButtonsRef}
        className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md z-30 px-4 opacity-0"
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
