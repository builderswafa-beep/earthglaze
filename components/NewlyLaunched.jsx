'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useSiteContent } from '../hooks/useSiteContent';

export default function NewlyLaunched() {
  const { getSection } = useSiteContent();
  const newlyData = getSection('home', 'newly_launched');
  const [isOpen, setIsOpen] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart, openMiniCart } = useCart();

  // Add Beetroot Lip Balm to Cart
  const handleAddToBag = async () => {
    setAdded(true);
    try {
      await addToCart(3, 1, {
        productInfo: {
          name: newlyData.title || 'Beetroot Lip Balm',
          image: newlyData.image_open || '/assets/lipbalmopenbox.png',
          price: newlyData.price || 249,
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
      className="py-6 sm:py-8 lg:py-10 bg-[#FAF7F2] relative overflow-hidden" 
      aria-label="Newly Launched Beetroot Lip Balm"
    >
      {/* Soft Ambient Warmth Layer Seamlessly Integrated with Page Canvas */}
      <div 
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-[radial-gradient(circle,_rgba(244,233,212,0.65)_0%,_rgba(250,247,242,0)_70%)] pointer-events-none -z-0 blur-3xl"
        aria-hidden="true" 
      />

      {/* Floating Botanical Leaf in Corner */}
      <img 
        src={newlyData.banner_image || "/assets/banner_newly_leaves.png"} 
        alt="" 
        className="absolute -top-6 -right-6 w-36 sm:w-48 lg:w-56 h-auto opacity-20 pointer-events-none select-none -z-0 transform rotate-12"
        aria-hidden="true" 
      />

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* =========================================================================
            TOP HEADER BAR: Left Tag & Right Pill Switcher (Open Balm | Sealed Jar)
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 relative z-20">
          
          {/* Left: NEWLY LAUNCHED Badge & Batch Detail */}
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEE5] border border-[#C6DEC9] text-[11px] font-bold text-[#1E3B2B] tracking-wider uppercase font-sans shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B3E] animate-pulse"></span>
              {newlyData.eyebrow || 'Newly Launched • Small-Batch 15 g'}
            </span>
          </div>

          {/* Right: Functional Pill Switcher (Open Balm | Sealed Jar) */}
          <div 
            className="inline-flex items-center p-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E0D5C1] shadow-2xs"
            role="tablist"
            aria-label="Balm Cap State Switcher"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isOpen}
              onClick={() => setIsOpen(true)}
              className={`px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
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
              className={`px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* ---------------------------------------------------------------------
              COLUMN 1: Typography, Description, 3 Pills, Price, CTAs (5 Cols)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-6 xl:col-span-5 text-left flex flex-col justify-center space-y-4">
            
            {/* Main Headline */}
            <div className="space-y-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173E2B] tracking-tight leading-[1.08]">
                {newlyData.title || (
                  <>
                    Beetroot{' '}
                    <span className="italic font-serif font-normal text-[#9C1D2A] relative inline-block">
                      Lip Balm
                    </span>
                  </>
                )}
              </h2>
              
              {/* Botanical Curved Underline SVG Accent */}
              <div className="w-20 sm:w-24 h-1.5">
                <svg viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M2 8 C35 14, 85 14, 118 4 C85 8, 35 8, 2 8 Z" fill="#5A8834" />
                </svg>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-[#404F44] leading-relaxed font-normal max-w-xl font-sans">
              {newlyData.subtitle || newlyData.description || 'A luscious, velvety lip balm made with slow-infused fresh organic beetroot extract. It deeply nourishes, restores natural color and keeps your lips soft, smooth and naturally healthy.'}
            </p>

            {/* 3 Pillar Feature Pills in a Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5">
              {(Array.isArray(newlyData.points) && newlyData.points.length > 0) ? (
                newlyData.points.map((pt, pIdx) => (
                  <div key={pt.id || pIdx} className="inline-flex items-center gap-1.5 bg-white/95 border border-[#E2D8C3] rounded-full px-3 sm:px-3.5 py-1.5 shadow-2xs text-xs font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                    <span className="text-sm leading-none">{pt.icon || '🌿'}</span>
                    <span>{pt.title || pt.text}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 bg-white/95 border border-[#E2D8C3] rounded-full px-3 sm:px-3.5 py-1.5 shadow-2xs text-xs font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                    <span className="text-sm leading-none">🍃</span>
                    <span>Deep Hydration</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/95 border border-[#E2D8C3] rounded-full px-3 sm:px-3.5 py-1.5 shadow-2xs text-xs font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                    <span className="text-sm leading-none text-amber-500">✨</span>
                    <span>Natural Tint</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/95 border border-[#E2D8C3] rounded-full px-3 sm:px-3.5 py-1.5 shadow-2xs text-xs font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                    <span className="text-sm leading-none">⚗️</span>
                    <span>Chemical Free</span>
                  </div>
                </>
              )}
            </div>

            {/* Pricing Row & Verified Review Rating */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#173E2B] tracking-tight">
                  ₹{newlyData.price || 249}
                </span>
                <span className="text-xs sm:text-sm text-stone-400 line-through font-normal">
                  ₹{newlyData.original_price || 299}
                </span>
              </div>

              {/* Scalloped Warm 15% OFF Badge */}
              <span className="px-2 py-0.5 rounded-md bg-[#F7E7CE] text-[#8C5E1E] text-xs font-bold tracking-wide">
                {newlyData.discount_label || '15% OFF'}
              </span>

              {/* Verified Customer Rating */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white/70 border border-[#E6DCB8] rounded-full px-2.5 py-0.5 shadow-2xs ml-auto sm:ml-3">
                <span className="text-amber-500 font-bold">{newlyData.rating || '★ 4.9'}</span>
              </div>
            </div>

            {/* CTA Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1.5">
              {/* Primary CTA */}
              <Link
                href={newlyData.cta_primary_link || "/shop"}
                className="btn-luxury-primary inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full text-white font-semibold text-xs sm:text-sm group cursor-pointer"
              >
                <span>{newlyData.cta_primary_label || "Explore the New Range"}</span>
                <span className="btn-arrow font-bold icon-hover-arrow">&rarr;</span>
              </Link>

              {/* Secondary CTA: Add to Bag */}
              <button
                type="button"
                onClick={handleAddToBag}
                className={`group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full font-semibold text-xs sm:text-sm border transition-all duration-300 cursor-pointer active:scale-95 shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
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
                    <svg className="w-3.5 h-3.5 icon-hover-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ---------------------------------------------------------------------
              COLUMN 2: COMPACT CLEAN PRODUCT OPEN & CLOSE VIEW
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center relative select-none py-2">
            
            {/* Interactive Card Component */}
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className={`product-interactive-card soap-animated-card balm-animated-card relative cursor-pointer w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[390px] transition-transform duration-500 hover:scale-[1.03] ${
                isOpen ? "soap-is-open is-active-center product-state-open" : ""
              }`}
              role="button"
              tabIndex="0"
              aria-label="EarthGlaze Beet Root Lip Balm - Click or hover to open"
            >
              {/* Compact Assembly Stage */}
              <div 
                className="product-assembly-stage soap-assembly-stage relative flex items-center justify-center"
                style={{ height: '220px', width: '100%' }}
              >
                
                {/* 1. Closed State Layer */}
                <div className="product-closed-layer soap-closed-layer w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img 
                    src={newlyData.image_closed || "/assets/lip_balm_closed_box.png"} 
                    alt="EARTHGLAZE Beet Root Lip Balm Sealed Jar" 
                    className="w-full h-auto max-h-[220px] object-contain pointer-events-none drop-shadow-lg" 
                    width="1536"
                    height="1024"
                  />
                </div>

                {/* 2. Opened State Layer */}
                <div className="product-open-layer soap-open-layer absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img 
                    src={newlyData.image_open || "/assets/lipbalmopenbox.png"} 
                    alt="EARTHGLAZE Beet Root Lip Balm Opened with Ruby Gloss Balm" 
                    className="w-full h-auto max-h-[220px] object-contain pointer-events-none drop-shadow-xl" 
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
