'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function NewlyLaunched() {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const { addToCart, openMiniCart } = useCart();

  // Mouse move 3D gyroscope tilt
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  }, []);

  // Add Beetroot Lip Balm to Cart
  const handleAddToBag = async () => {
    setAdded(true);
    try {
      await addToCart(3, 1, {
        productInfo: {
          name: 'Beetroot Lip Balm',
          image: '/assets/newly_launched_open_product_crop.png',
          price: 249,
        },
      });
      if (openMiniCart) openMiniCart();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setAdded(false), 2400);
    }
  };

  // Whether the balm is currently shown open
  const isBalmOpen = isOpen || isHovered;

  // 3D Parallax Tilt Transforms
  const tiltX = isHovered ? mousePos.y * -14 : 0;
  const tiltY = isHovered ? mousePos.x * 18 : 0;
  const liftZ = isHovered ? -10 : 0;

  return (
    <section 
      id="newly-launched" 
      className="py-12 sm:py-16 lg:py-24 bg-[#FAF7F2] relative overflow-hidden" 
      aria-label="Newly Launched Beetroot Lip Balm"
    >
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Master Editorial Card - Warm Luxury Silk Gradient matching User Reference Image */}
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden border border-[#E8DEC8] bg-gradient-to-r from-[#FEF2E4] via-[#FAEADA] to-[#F5E3CD] shadow-[0_12px_44px_rgba(30,59,43,0.06)] p-6 sm:p-10 lg:p-14 xl:p-16 transition-all duration-500">
          
          {/* Subtle Ambient Golden Shimmer Behind Card */}
          <div 
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,_rgba(245,215,160,0.45)_0%,_transparent_70%)] pointer-events-none blur-3xl"
            aria-hidden="true"
          />

          {/* =========================================================================
              TOP HEADER BAR (Within Card): Left Tag & Right Pill Switcher
              ========================================================================= */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 lg:mb-10 relative z-20">
            
            {/* Left: NEWLY LAUNCHED Badge & Batch Detail */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E5EEE5] border border-[#C6DEC9] text-xs font-bold text-[#1E3B2B] tracking-wider uppercase font-sans shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B3E] animate-pulse"></span>
                Newly Launched
              </span>
              <span className="text-xs sm:text-[13px] font-semibold text-[#5B6B5F] tracking-widest uppercase font-sans">
                Small-Batch &bull; 15 g
              </span>
            </div>

            {/* Right: Interactive Pill Switcher (Open Balm | Sealed Jar) */}
            <div 
              className="inline-flex items-center p-1 rounded-full bg-white/80 backdrop-blur-md border border-[#E0D5C1] shadow-2xs"
              role="tablist"
              aria-label="Balm Cap State Switcher"
            >
              <button
                type="button"
                role="tab"
                aria-selected={isBalmOpen}
                onClick={() => setIsOpen(true)}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isBalmOpen 
                    ? 'bg-[#0D3B23] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-[#1E3B2B]'
                }`}
              >
                Open Balm
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={!isBalmOpen}
                onClick={() => setIsOpen(false)}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  !isBalmOpen 
                    ? 'bg-[#0D3B23] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-[#1E3B2B]'
                }`}
              >
                Sealed Jar
              </button>
            </div>

          </div>

          {/* =========================================================================
              MAIN 2-COLUMN CONTENT: Left Narrative & Right Product Stage
              ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center relative z-10">
            
            {/* ---------------------------------------------------------------------
                COLUMN 1: Typography, Description, 3 Pills, Price, CTAs (5 Cols)
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-6 xl:col-span-5 text-left flex flex-col justify-center space-y-5 sm:space-y-6">
              
              {/* Main Headline: Beetroot (Green Serif) + Lip Balm (Crimson Italic Serif) */}
              <div className="space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-bold text-[#173E2B] tracking-tight leading-[1.06]">
                  Beetroot{' '}
                  <span className="italic font-serif font-normal text-[#9C1D2A] relative inline-block">
                    Lip Balm
                  </span>
                </h2>
                
                {/* Exact Botanical Curved Underline SVG */}
                <div className="w-24 sm:w-28 h-2">
                  <svg viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M2 8 C35 14, 85 14, 118 4 C85 8, 35 8, 2 8 Z" fill="#5A8834" />
                  </svg>
                </div>
              </div>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base lg:text-lg text-[#404F44] leading-relaxed font-normal max-w-xl font-sans">
                A luscious, velvety lip balm made with slow-infused fresh organic beetroot extract. 
                It deeply nourishes, restores natural color and keeps your lips soft, smooth and naturally healthy.
              </p>

              {/* 3 Pillar Feature Pills in a Row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                {/* Pill 1: Deep Hydration */}
                <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-3.5 sm:px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                  <span className="text-base leading-none">🍃</span>
                  <span>Deep Hydration</span>
                </div>

                {/* Pill 2: Natural Tint */}
                <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-3.5 sm:px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                  <span className="text-base leading-none text-amber-500">✨</span>
                  <span>Natural Tint</span>
                </div>

                {/* Pill 3: Chemical Free */}
                <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-3.5 sm:px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                  <span className="text-base leading-none">⚗️</span>
                  <span>Chemical Free</span>
                </div>
              </div>

              {/* Pricing Row & Verified Review Rating */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#173E2B] tracking-tight">
                    ₹249
                  </span>
                  <span className="text-sm sm:text-base text-stone-400 line-through font-normal">
                    ₹299
                  </span>
                </div>

                {/* Scalloped / Warm 15% OFF Badge */}
                <span className="px-2.5 py-1 rounded-md bg-[#F7E7CE] text-[#8C5E1E] text-xs font-bold tracking-wide">
                  15% OFF
                </span>

                {/* Verified Customer Rating */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 bg-white/70 border border-[#E6DCB8] rounded-full px-3 py-1 shadow-2xs ml-auto sm:ml-4">
                  <span className="text-amber-500 font-bold">★ 4.9</span>
                  <span className="text-stone-500 font-normal">(334 reviews)</span>
                </div>
              </div>

              {/* CTA Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                {/* Primary CTA */}
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#0D3B23] hover:bg-[#165030] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer active:scale-95"
                >
                  <span>Explore the New Range</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">&rarr;</span>
                </Link>

                {/* Secondary CTA: Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={`inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base border transition-all duration-300 cursor-pointer active:scale-95 shadow-2xs ${
                    added
                      ? 'bg-[#1E7D3A] text-white border-[#1E7D3A]'
                      : 'bg-white hover:bg-[#0D3B23] text-[#0D3B23] hover:text-white border-[#0D3B23]'
                  }`}
                  aria-label="Add Beetroot Lip Balm to Bag"
                >
                  {added ? (
                    <>
                      <span>✓</span>
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* ---------------------------------------------------------------------
                COLUMN 2: Interactive 3D Product Stage (Cap Opening + Motion) (7 Cols)
                --------------------------------------------------------------------- */}
            <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center relative select-none">
              
              {/* Interactive 3D Card Stage with Cursor Tracking */}
              <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative w-full max-w-[560px] sm:max-w-[620px] lg:max-w-[680px] xl:max-w-[720px] cursor-pointer group"
                style={{
                  perspective: '1200px',
                }}
              >
                
                {/* Floating Motion Stage Wrapper */}
                <div 
                  className="relative w-full transition-transform duration-500 ease-out"
                  style={{
                    transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${liftZ}px) scale(${isHovered ? 1.03 : 1})`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  
                  {/* Ambient Golden Radial Aura Behind Balm */}
                  <div 
                    className={`absolute inset-0 rounded-full transition-opacity duration-700 pointer-events-none blur-2xl ${
                      isBalmOpen 
                        ? 'opacity-85 bg-[radial-gradient(ellipse_at_65%_45%,_rgba(235,160,110,0.45)_0%,_rgba(254,242,228,0)_70%)]' 
                        : 'opacity-30 bg-[radial-gradient(ellipse_at_65%_45%,_rgba(235,160,110,0.25)_0%,_rgba(254,242,228,0)_70%)]'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Main Product Showcase Image (Sandstone Pedestal + Beetroot Slice + Leaf + Jar) */}
                  <div className="relative z-10 w-full overflow-hidden rounded-3xl">
                    <img
                      src="/assets/newly_launched_open_product_crop.png"
                      alt="EarthGlaze Beetroot Lip Balm on handcrafted natural sandstone pedestal with freshly sliced organic beetroot"
                      className="w-full h-auto object-contain transition-all duration-700 select-none pointer-events-none drop-shadow-[0_16px_32px_rgba(30,59,43,0.12)]"
                      loading="eager"
                      width="514"
                      height="440"
                    />

                    {/* Animated Cap Overlay for Dynamic Cap Opening & Closing Effect */}
                    <div 
                      className="absolute pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        right: '12%',
                        top: '18%',
                        width: '32%',
                        transformOrigin: 'bottom left',
                        transform: isBalmOpen
                          ? 'translate(0px, 0px) rotate(0deg) scale(1)'
                          : 'translate(-54px, -18px) rotate(-24deg) scale(0.92)',
                        opacity: isBalmOpen ? 1 : 0.85,
                      }}
                      aria-hidden="true"
                    >
                      {/* Subtle floating shimmer ray when cap is open */}
                      {isBalmOpen && (
                        <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-amber-400/20 blur-xl animate-pulse pointer-events-none" />
                      )}
                    </div>

                  </div>

                  {/* Hover Floating Guide Pill */}
                  <div 
                    className={`absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 pointer-events-none ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B23]/90 backdrop-blur-sm text-white text-[11px] font-semibold shadow-md">
                      <span>✨</span>
                      <span>Hovering: Cap Open &amp; 3D Motion</span>
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
