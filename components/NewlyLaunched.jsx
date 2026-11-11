'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function NewlyLaunched() {
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'sealed'
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
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  }, []);

  // When cursor is hovered over product, show open balm view with 3D motion; otherwise follow tab
  const isCurrentlyOpen = isHovered ? true : activeTab === 'open';

  // Add Beetroot Lip Balm to Cart
  const handleAddToBag = async () => {
    setAdded(true);
    try {
      await addToCart(3, 1, {
        productInfo: {
          name: 'Beetroot Lip Balm',
          image: '/assets/newly_launched_stage_open.png',
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

  // 3D Parallax Tilt Transforms
  const tiltX = isHovered ? mousePos.y * -12 : 0;
  const tiltY = isHovered ? mousePos.x * 16 : 0;
  const liftZ = isHovered ? -8 : 0;

  return (
    <section 
      id="newly-launched" 
      className="py-14 sm:py-20 lg:py-28 bg-[#FAF7F2] relative overflow-hidden" 
      aria-label="Newly Launched Beetroot Lip Balm"
    >
      {/* Soft Ambient Warmth Layer Seamlessly Integrated with Page Canvas */}
      <div 
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-[radial-gradient(circle,_rgba(244,233,212,0.65)_0%,_rgba(250,247,242,0)_70%)] pointer-events-none -z-0 blur-3xl"
        aria-hidden="true" 
      />

      {/* Floating Botanical Leaf in Corner */}
      <img 
        src="/assets/banner_newly_leaves.png" 
        alt="" 
        className="absolute -top-6 -right-6 w-44 sm:w-60 lg:w-72 h-auto opacity-25 pointer-events-none select-none -z-0 transform rotate-12"
        aria-hidden="true" 
      />

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* =========================================================================
            TOP HEADER BAR: Left Tag & Right Pill Switcher (Open Balm | Sealed Jar)
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12 lg:mb-14 relative z-20">
          
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

          {/* Right: Functional Pill Switcher (Open Balm | Sealed Jar) */}
          <div 
            className="inline-flex items-center p-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E0D5C1] shadow-2xs"
            role="tablist"
            aria-label="Balm Cap State Switcher"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'open'}
              onClick={() => setActiveTab('open')}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'open' 
                  ? 'bg-[#0D3B23] text-white shadow-sm' 
                  : 'text-stone-600 hover:text-[#1E3B2B]'
              }`}
            >
              Open Balm
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sealed'}
              onClick={() => setActiveTab('sealed')}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'sealed' 
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center relative z-10">
          
          {/* ---------------------------------------------------------------------
              COLUMN 1: Typography, Description, 3 Pills, Price, CTAs (5 Cols)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-6 xl:col-span-5 text-left flex flex-col justify-center space-y-6">
            
            {/* Main Headline: Beetroot (Green Serif) + Lip Balm (Crimson Italic Serif) */}
            <div className="space-y-2">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-bold text-[#173E2B] tracking-tight leading-[1.06]">
                Beetroot{' '}
                <span className="italic font-serif font-normal text-[#9C1D2A] relative inline-block">
                  Lip Balm
                </span>
              </h2>
              
              {/* Botanical Curved Underline SVG Accent */}
              <div className="w-24 sm:w-28 h-2">
                <svg viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M2 8 C35 14, 85 14, 118 4 C85 8, 35 8, 2 8 Z" fill="#5A8834" />
                </svg>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-[#404F44] leading-relaxed font-normal max-w-xl font-sans">
              A luscious, velvety lip balm made with slow-infused fresh organic beetroot extract. 
              It deeply nourishes, restores natural color and keeps your lips soft, smooth and naturally healthy.
            </p>

            {/* 3 Pillar Feature Pills in a Row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              {/* Pill 1: Deep Hydration */}
              <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                <span className="text-base leading-none">🍃</span>
                <span>Deep Hydration</span>
              </div>

              {/* Pill 2: Natural Tint */}
              <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                <span className="text-base leading-none text-amber-500">✨</span>
                <span>Natural Tint</span>
              </div>

              {/* Pill 3: Chemical Free */}
              <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
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

              {/* Scalloped Warm 15% OFF Badge */}
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
              COLUMN 2: ONLY Transparent Product PNGs with Cap Opening & Motion (7 Cols)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center relative select-none">
            
            {/* Interactive 3D Product Stage (NO Background Boxes, Only Transparent PNG) */}
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[700px] xl:max-w-[760px] mx-auto cursor-pointer"
              style={{
                perspective: '1200px',
              }}
            >
              
              {/* Motion Floating Wrapper with 3D Gyroscope Perspective */}
              <div 
                className="relative w-full transition-transform duration-500 ease-out"
                style={{
                  transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${liftZ}px) scale(${isHovered ? 1.03 : 1})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                
                {/* Soft Natural Ambient Light Halo */}
                <div 
                  className={`absolute inset-0 rounded-full transition-opacity duration-700 pointer-events-none blur-3xl ${
                    isCurrentlyOpen 
                      ? 'opacity-70 bg-[radial-gradient(circle_at_55%_50%,_rgba(240,175,130,0.35)_0%,_transparent_70%)]' 
                      : 'opacity-40 bg-[radial-gradient(circle_at_55%_50%,_rgba(240,175,130,0.2)_0%,_transparent_70%)]'
                  }`}
                  aria-hidden="true"
                />

                {/* Pure Transparent Product Stage Container (Aspect Ratio 4/3) */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                  
                  {/* 1. Open Balm Transparent PNG (Active when Open Balm selected or cursor hovers) */}
                  <img
                    src="/assets/newly_launched_stage_open.png"
                    alt="EarthGlaze Beetroot Lip Balm Open on Sandstone Pedestal with Beetroot Slice and Leaf"
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-all duration-500 ease-in-out drop-shadow-[0_16px_36px_rgba(30,59,43,0.14)] ${
                      isCurrentlyOpen 
                        ? 'opacity-100 scale-100 z-10' 
                        : 'opacity-0 scale-95 z-0 pointer-events-none'
                    }`}
                    loading="eager"
                    width="800"
                    height="600"
                  />

                  {/* 2. Sealed Jar Transparent PNG (Active when Sealed Jar selected) */}
                  <img
                    src="/assets/newly_launched_stage_sealed.png"
                    alt="EarthGlaze Beetroot Lip Balm Sealed on Sandstone Pedestal with Beetroot Slice and Leaf"
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-all duration-500 ease-in-out drop-shadow-[0_16px_36px_rgba(30,59,43,0.14)] ${
                      !isCurrentlyOpen 
                        ? 'opacity-100 scale-100 z-10' 
                        : 'opacity-0 scale-95 z-0 pointer-events-none'
                    }`}
                    loading="eager"
                    width="800"
                    height="600"
                  />

                </div>

                {/* Floating Guide Pill on Hover */}
                <div 
                  className={`absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 pointer-events-none ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B23]/90 backdrop-blur-sm text-white text-[11px] font-semibold shadow-md">
                    <span>✨</span>
                    <span>{isCurrentlyOpen ? 'Open Balm View • 3D Motion' : 'Sealed Jar View'}</span>
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
