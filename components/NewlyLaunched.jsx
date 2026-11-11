'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function NewlyLaunched() {
  const [isOpen, setIsOpen] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart, openMiniCart } = useCart();

  // Add Beetroot Lip Balm to Cart
  const handleAddToBag = async () => {
    setAdded(true);
    try {
      await addToCart(3, 1, {
        productInfo: {
          name: 'Beetroot Lip Balm',
          image: '/assets/lipbalmopenbox.png',
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

  return (
    <section 
      id="newly-launched" 
      className="py-14 sm:py-20 lg:py-24 bg-[#FAF7F2] relative overflow-hidden" 
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12 relative z-20">
          
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
              aria-selected={isOpen}
              onClick={() => setIsOpen(true)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isOpen 
                  ? 'bg-[#0D3B23] text-white shadow-sm' 
                  : 'text-stone-600 hover:text-[#1E3B2B]'
              }`}
            >
              Open Balm
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={!isOpen}
              onClick={() => setIsOpen(false)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                !isOpen 
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

          {/* Column 2: CLEAN PRODUCT OPEN & CLOSE VIEW (No Golden Rings/Layer) */}
          <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center relative select-none py-6">
            
            {/* Interactive Card Component */}
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className={`product-interactive-card soap-animated-card balm-animated-card relative cursor-pointer w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] transition-transform duration-500 hover:scale-[1.03] ${
                isOpen ? "soap-is-open is-active-center product-state-open" : ""
              }`}
              role="button"
              tabIndex="0"
              aria-label="EarthGlaze Beet Root Lip Balm - Click or hover to open"
            >
              {/* Assembly Stage */}
              <div className="product-assembly-stage soap-assembly-stage relative flex items-center justify-center">
                
                {/* 1. Closed State Layer (100% Pure Transparent PNG, Zero Background Box) */}
                <div className="product-closed-layer soap-closed-layer w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img 
                    src="/assets/lip_balm_closed_box.png" 
                    alt="EARTHGLAZE Beet Root Lip Balm Sealed Jar" 
                    className="w-full h-auto object-contain pointer-events-none drop-shadow-xl" 
                    width="1536"
                    height="1024"
                  />
                </div>

                {/* 2. Opened State Layer (100% Pure Transparent PNG, Zero Background Box) */}
                <div className="product-open-layer soap-open-layer absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img 
                    src="/assets/lipbalmopenbox.png" 
                    alt="EARTHGLAZE Beet Root Lip Balm Opened with Ruby Gloss Balm" 
                    className="w-full h-auto object-contain pointer-events-none drop-shadow-2xl" 
                    width="1536"
                    height="1024"
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
