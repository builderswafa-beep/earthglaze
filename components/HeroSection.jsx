'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const ROTATING_WORDS = ['Personal.', 'Pure.', 'Natural.', 'Radiant.', 'Artisanal.'];
const HERO_COUNT = 4;

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const autoPlayRef = useRef(null);

  // Dynamic rotating words timer
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(wordTimer);
  }, []);

  // Track window resize
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Orbit offset configurations
  function getOffsets() {
    const w = windowWidth;
    if (w < 480) {
      return [
        { x: 0, y: 0, scale: 1.02, rot: 0, z: 40, op: 1 },           // Center Front (Active)
        { x: 100, y: -6, scale: 0.60, rot: -2, z: 25, op: 0.95 },   // Right Flank
        { x: 0, y: -16, scale: 0.42, rot: 0, z: 10, op: 0.75 },     // Center Back
        { x: -100, y: -6, scale: 0.60, rot: 2, z: 25, op: 0.95 }    // Left Flank
      ];
    } else if (w < 640) {
      return [
        { x: 0, y: 0, scale: 1.08, rot: 0, z: 40, op: 1 },
        { x: 130, y: -8, scale: 0.66, rot: -2.5, z: 25, op: 0.98 },
        { x: 0, y: -18, scale: 0.46, rot: 0, z: 10, op: 0.80 },
        { x: -130, y: -8, scale: 0.66, rot: 2.5, z: 25, op: 0.98 }
      ];
    } else if (w < 1024) {
      return [
        { x: 0, y: 0, scale: 1.15, rot: 0, z: 40, op: 1 },
        { x: 180, y: -10, scale: 0.72, rot: -3, z: 25, op: 1 },
        { x: 0, y: -22, scale: 0.50, rot: 0, z: 10, op: 0.82 },
        { x: -180, y: -10, scale: 0.72, rot: 3, z: 25, op: 1 }
      ];
    } else {
      return [
        { x: 0, y: 0, scale: 1.22, rot: 0, z: 40, op: 1 },           // Center Front (Active)
        { x: 235, y: -12, scale: 0.78, rot: -3, z: 25, op: 1 },     // Right Flank
        { x: 0, y: -26, scale: 0.55, rot: 0, z: 10, op: 0.85 },     // Center Back
        { x: -235, y: -12, scale: 0.78, rot: 3, z: 25, op: 1 }      // Left Flank
      ];
    }
  }

  // Autoplay loop (every 4.5 seconds)
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % HERO_COUNT);
    }, 4500);
    return () => clearInterval(autoPlayRef.current);
  }, []);

  const resetTimer = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % HERO_COUNT);
    }, 4500);
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % HERO_COUNT);
    resetTimer();
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + HERO_COUNT) % HERO_COUNT);
    resetTimer();
  };

  const selectCard = (idx) => {
    setActiveIndex(idx);
    resetTimer();
  };

  const offsets = getOffsets();

  // Helper to get transform style for each card index
  const getCardStyle = (cardIdx) => {
    const posIndex = ((cardIdx - activeIndex) % HERO_COUNT + HERO_COUNT) % HERO_COUNT;
    const cfg = offsets[posIndex];
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      margin: 0,
      transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease, filter 0.45s ease',
      transform: `translate(-50%, -50%) translate3d(${cfg.x}px, ${cfg.y}px, 0px) scale(${cfg.scale}) rotate(${cfg.rot}deg)`,
      zIndex: cfg.z,
      opacity: cfg.op,
    };
  };

  const isCardActive = (cardIdx) => {
    return ((cardIdx - activeIndex) % HERO_COUNT + HERO_COUNT) % HERO_COUNT === 0;
  };

  return (
<section id="hero-section" className="relative pt-6 pb-20 sm:pb-28 md:pb-36 overflow-hidden bg-[#FAF7F2]">
      
      {/* Seamlessly Blended Natural Stage Backdrop with Pristine Sandstone Rock Pedestal */}
      <div className="hero-stage-backdrop-wrap absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        <img src="/assets/hero_natural_stage_backdrop.jpg" alt="" className="w-full h-full object-cover object-bottom pointer-events-none" />
        {/* Natural Water-to-Cream Environmental Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 md:h-64 bg-gradient-to-b from-transparent via-[#FAF7F2]/30 via-70% to-[#FAF7F2] pointer-events-none" aria-hidden="true"></div>
      </div>

      {/* Central Ambient Warm Halos */}
      <div className="hero-center-pedestal-glow" aria-hidden="true"></div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 text-center relative z-10">
        
        {/* 1. Eyebrow: Centered with Flanking Horizontal Lines */}
        <div className="animate-entrance-eyebrow flex items-center justify-center gap-3.5 mb-4 sm:mb-6">
          <span className="eyebrow-divider" aria-hidden="true"></span>
          <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#3e5444] uppercase">
            Natural Skincare
          </span>
          <span className="eyebrow-divider" aria-hidden="true"></span>
        </div>

        {/* 2. Main Headline with DYNAMIC CHANGING TEXT ("Personal.") & Botanical Underline */}
        <div className="animate-entrance-headline max-w-4xl mx-auto mb-4 sm:mb-6">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
            Skincare That Feels
            <span className="block mt-1 sm:mt-2">
              <span className="dynamic-text-wrapper cursor-pointer" title="Hover to pause rotation">
                {/* Dynamic rotating word */}
                <span id="dynamic-rotating-word" className="dynamic-word word-active">{ROTATING_WORDS[wordIndex]}</span>
                {/* Exact Botanical Curved Leaf Underline SVG */}
                <svg className="leaf-underline-svg" viewBox="0 0 240 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M 12 18 C 65 30 175 30 228 14 C 180 23 80 23 12 18 Z" fill="#5A8834"/>
                </svg>
              </span>
            </span>
          </h1>
        </div>

        {/* 3. Sub-description Paragraph */}
        <div className="animate-entrance-subtext max-w-xl mx-auto mb-8 sm:mb-10">
          <p className="text-base sm:text-lg text-[#404F44] leading-relaxed font-normal">
            Nature-powered skincare crafted with pure ingredients for healthy, glowing skin — made just for you.
          </p>
        </div>

        {/* 4. CTA Buttons Row with Micro-Interactions */}
        <div className="animate-entrance-cta flex items-center justify-center gap-4 sm:gap-5 mb-6 sm:mb-8">
          
          {/* Primary CTA Button */}
          <button 
            id="explore-range-btn" 
            type="button" 
            className="btn-primary-explore px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base tracking-wide flex items-center gap-2 group cursor-pointer"
          >
            <span>Explore Our Range</span>
            <span className="btn-arrow inline-block text-lg font-bold">&rarr;</span>
          </button>

          {/* Secondary CTA Button */}
          <button 
            id="our-story-btn" 
            type="button" 
            className="btn-secondary-story px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base tracking-wide flex items-center gap-2.5 cursor-pointer"
          >
            {/* Play icon inside circle */}
            <svg className="play-icon w-4 h-4 text-[#235327]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Our Story</span>
          </button>

        </div>

        {/* 5. Interactive 3D Curved Product Carousel */}
        <div className="hero-carousel-section animate-entrance-cards w-full max-w-6xl mx-auto relative mt-1 sm:mt-2 mb-2 select-none" id="hero-carousel-root">
          
          {/* Subtle Ambient Curved Glow Beneath the Arc */}
          <div className="hero-curve-ambient-glow pointer-events-none" aria-hidden="true"></div>

          {/* Soft Edge Vignette Fades (Left & Right) */}
          <div className="hero-scroll-vignette hero-scroll-vignette-left pointer-events-none" aria-hidden="true"></div>
          <div className="hero-scroll-vignette hero-scroll-vignette-right pointer-events-none" aria-hidden="true"></div>

          {/* Left / Right Carousel Navigation Arrow Controls */}
          <button 
            id="hero-carousel-prev" onClick={handlePrev} 
            type="button" 
            className="hero-carousel-nav-btn hero-carousel-prev-btn absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#173D2B] shadow-md hover:shadow-lg border border-stone-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer" 
            aria-label="Previous product"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <button 
            id="hero-carousel-next" onClick={handleNext} 
            type="button" 
            className="hero-carousel-nav-btn hero-carousel-next-btn absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#173D2B] shadow-md hover:shadow-lg border border-stone-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer" 
            aria-label="Next product"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7"/></svg>
          </button>

{/* 3D Curved Carousel Stage Container */}
          <div className="hero-curved-carousel-stage relative w-full overflow-visible" id="hero-curved-stage">
            
            {/* Unified Golden Oval Orbit Track Stage */}
            <div className="hero-stage-oval-track pointer-events-none select-none" aria-hidden="true">
              <svg viewBox="0 0 640 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <radialGradient id="stageOvalGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FCE198" stopOpacity="0.45"/>
                    <stop offset="50%" stopColor="#EBA734" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#FAF4EE" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                {/* Floor Ambient Ellipse */}
                <ellipse cx="320" cy="80" rx="290" ry="54" fill="url(#stageOvalGlow)"/>
                {/* Outer Dotted Oval Orbit Track */}
                <ellipse cx="320" cy="80" rx="240" ry="46" stroke="#E5BA68" strokeWidth="1.6" strokeDasharray="8 6" opacity="0.6"/>
                {/* Inner Soft Oval Ring */}
                <ellipse cx="320" cy="80" rx="185" ry="34" stroke="#F4BC46" strokeWidth="1.2" opacity="0.35"/>
              </svg>
            </div>

            {/* Product 0: EARTHGLAZE Goat Milk Soap (Initial Center Active Product) */}
            <div 
              data-card-index="0" 
              style={getCardStyle(0)} 
              onClick={() => selectCard(0)} 
              className={`hero-curved-card hero-scroll-card product-interactive-card soap-animated-card absolute cursor-pointer ${isCardActive(0) ? "soap-is-open is-active-center product-state-open" : ""}`}
              data-product-id="goat-milk-soap"
              data-product-name="EARTHGLAZE Goat Milk Soap"
              data-product-price="₹349"
              data-product-desc="Creamy Moisture Bar with Pure Goat Milk"
              tabIndex="0"
              role="button"
              aria-label="EARTHGLAZE Goat Milk Soap - Click to bring to centre and open"
            >
              <div className="product-pedestal-rings soap-pedestal-rings glow-goat" aria-hidden="true">
                <img src="/assets/pedestal-glow-rings.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-light-rays soap-light-rays glow-goat" aria-hidden="true">
                <img src="/assets/cream-light-rays.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-lift-arrows soap-lift-arrows" aria-hidden="true">
                <img src="/assets/cap-lift-arrows.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-assembly-stage soap-assembly-stage hero-mini-stage relative flex items-center justify-center">
                {/* Soft Golden Glow for Selected Card */}
                <div className="champagne-gold-glow pointer-events-none" aria-hidden="true"></div>

                {/* A few delicate tiny sparkles */}
                <div className="champagne-sparkles-wrap pointer-events-none select-none" aria-hidden="true">
                  <span className="c-sparkle c-sparkle-1">✦</span>
                  <span className="c-sparkle c-sparkle-2">✧</span>
                  <span className="c-sparkle c-sparkle-3">✦</span>
                  <span className="c-sparkle c-sparkle-4">✧</span>
                </div>

                <div className="product-closed-layer soap-closed-layer w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/goatmilksoap_close_box.png" alt="EARTHGLAZE Goat Milk Soap (Closed Packaging)" className="w-full h-auto object-contain pointer-events-none drop-shadow-md" />
                </div>
                <div className="product-open-layer soap-open-layer absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/goatmilksoap_open_box.png" alt="EARTHGLAZE Goat Milk Soap - Opened View with Creamy Bar" className="w-full h-auto object-contain pointer-events-none drop-shadow-xl" />
                </div>
                <div className="soap-inner-glow glow-goat" aria-hidden="true"></div>
              </div>
            </div>

            {/* Product 1: EARTHGLAZE Manjistha Soap */}
            <div 
              data-card-index="1" 
              style={getCardStyle(1)} 
              onClick={() => selectCard(1)} 
              className={`hero-curved-card hero-scroll-card product-interactive-card soap-animated-card absolute cursor-pointer ${isCardActive(1) ? "soap-is-open is-active-center product-state-open" : ""}`}
              data-product-id="manjistha-soap"
              data-product-name="EARTHGLAZE Manjistha Soap"
              data-product-price="₹349"
              data-product-desc="Herbal Cleansing for Healthy Radiant Skin"
              tabIndex="0"
              role="button"
              aria-label="EARTHGLAZE Manjistha Soap - Click to bring to centre and open"
            >
              <div className="product-pedestal-rings soap-pedestal-rings glow-manjistha" aria-hidden="true">
                <img src="/assets/pedestal-glow-rings.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-light-rays soap-light-rays glow-manjistha" aria-hidden="true">
                <img src="/assets/cream-light-rays.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-lift-arrows soap-lift-arrows" aria-hidden="true">
                <img src="/assets/cap-lift-arrows.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-assembly-stage soap-assembly-stage hero-mini-stage relative flex items-center justify-center">
                {/* Soft Golden Glow for Selected Card */}
                <div className="champagne-gold-glow pointer-events-none" aria-hidden="true"></div>

                {/* A few delicate tiny sparkles */}
                <div className="champagne-sparkles-wrap pointer-events-none select-none" aria-hidden="true">
                  <span className="c-sparkle c-sparkle-1">✦</span>
                  <span className="c-sparkle c-sparkle-2">✧</span>
                  <span className="c-sparkle c-sparkle-3">✦</span>
                  <span className="c-sparkle c-sparkle-4">✧</span>
                </div>

                <div className="product-closed-layer soap-closed-layer w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/manjistha_closed_box.png" alt="EARTHGLAZE Manjistha Soap (Closed Packaging)" className="w-full h-auto object-contain pointer-events-none drop-shadow-md" />
                </div>
                <div className="product-open-layer soap-open-layer absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/manjistha_open_box.png" alt="EARTHGLAZE Manjistha Soap - Opened View with Amber Bar" className="w-full h-auto object-contain pointer-events-none drop-shadow-xl" />
                </div>
                <div className="soap-inner-glow glow-manjistha" aria-hidden="true"></div>
              </div>
            </div>

            {/* Product 2: EARTHGLAZE Neem Soap */}
            <div 
              data-card-index="2" 
              style={getCardStyle(2)} 
              onClick={() => selectCard(2)} 
              className={`hero-curved-card hero-scroll-card product-interactive-card soap-animated-card absolute cursor-pointer ${isCardActive(2) ? "soap-is-open is-active-center product-state-open" : ""}`}
              data-product-id="neem-soap"
              data-product-name="EARTHGLAZE Neem Soap"
              data-product-price="₹329"
              data-product-desc="Purifying Botanical Neem Cleansing"
              tabIndex="0"
              role="button"
              aria-label="EARTHGLAZE Neem Soap - Click to bring to centre and open"
            >
              <div className="product-pedestal-rings soap-pedestal-rings glow-neem" aria-hidden="true">
                <img src="/assets/pedestal-glow-rings.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-light-rays soap-light-rays glow-neem" aria-hidden="true">
                <img src="/assets/cream-light-rays.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-lift-arrows soap-lift-arrows" aria-hidden="true">
                <img src="/assets/cap-lift-arrows.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-assembly-stage soap-assembly-stage hero-mini-stage relative flex items-center justify-center">
                {/* Soft Golden Glow for Selected Card */}
                <div className="champagne-gold-glow pointer-events-none" aria-hidden="true"></div>

                {/* A few delicate tiny sparkles */}
                <div className="champagne-sparkles-wrap pointer-events-none select-none" aria-hidden="true">
                  <span className="c-sparkle c-sparkle-1">✦</span>
                  <span className="c-sparkle c-sparkle-2">✧</span>
                  <span className="c-sparkle c-sparkle-3">✦</span>
                  <span className="c-sparkle c-sparkle-4">✧</span>
                </div>

                <div className="product-closed-layer soap-closed-layer w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/neem_soap_closed_box.png" alt="EARTHGLAZE Neem Soap (Closed Packaging)" className="w-full h-auto object-contain pointer-events-none drop-shadow-md" />
                </div>
                <div className="product-open-layer soap-open-layer absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/neemopenbox.png" alt="EARTHGLAZE Neem Soap - Opened View with Botanical Bar" className="w-full h-auto object-contain pointer-events-none drop-shadow-xl" />
                </div>
                <div className="soap-inner-glow glow-neem" aria-hidden="true"></div>
              </div>
            </div>

            {/* Product 3: EARTHGLAZE Beet Root Lip Balm */}
            <div 
              data-card-index="3" 
              style={getCardStyle(3)} 
              onClick={() => selectCard(3)} 
              className={`hero-curved-card hero-scroll-card product-interactive-card soap-animated-card balm-animated-card absolute cursor-pointer ${isCardActive(3) ? "soap-is-open is-active-center product-state-open" : ""}`}
              data-product-id="beetroot-lip-balm"
              data-product-name="EARTHGLAZE Beet Root Lip Balm"
              data-product-price="₹249"
              data-product-desc="Deep Tinted Hydration & Nourishing Care"
              tabIndex="0"
              role="button"
              aria-label="EARTHGLAZE Beet Root Lip Balm - Click to bring to centre and open"
            >
              <div className="product-pedestal-rings soap-pedestal-rings glow-balm" aria-hidden="true">
                <img src="/assets/pedestal-glow-rings.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-light-rays soap-light-rays glow-balm" aria-hidden="true">
                <img src="/assets/cream-light-rays.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-lift-arrows soap-lift-arrows" aria-hidden="true">
                <img src="/assets/cap-lift-arrows.svg" alt="" className="w-full h-full object-contain pointer-events-none" />
              </div>
              <div className="product-assembly-stage soap-assembly-stage hero-mini-stage relative flex items-center justify-center">
                {/* Soft Golden Glow for Selected Card */}
                <div className="champagne-gold-glow pointer-events-none" aria-hidden="true"></div>

                {/* A few delicate tiny sparkles */}
                <div className="champagne-sparkles-wrap pointer-events-none select-none" aria-hidden="true">
                  <span className="c-sparkle c-sparkle-1">✦</span>
                  <span className="c-sparkle c-sparkle-2">✧</span>
                  <span className="c-sparkle c-sparkle-3">✦</span>
                  <span className="c-sparkle c-sparkle-4">✧</span>
                </div>

                <div className="product-closed-layer soap-closed-layer w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/lip_balm_closed_box.png" alt="EARTHGLAZE Beet Root Lip Balm (Closed Packaging)" className="w-full h-auto object-contain pointer-events-none drop-shadow-md" />
                </div>
                <div className="product-open-layer soap-open-layer absolute inset-0 w-full h-full flex items-center justify-center select-none pointer-events-none">
                  <img src="/assets/lipbalmopenbox.png" alt="EARTHGLAZE Beet Root Lip Balm - Opened View with Ruby Gloss Balm" className="w-full h-auto object-contain pointer-events-none drop-shadow-xl" />
                </div>
                <div className="soap-inner-glow glow-balm" aria-hidden="true"></div>
              </div>
            </div>

          </div>
{/* Carousel Dots Navigation (4 Products) */}
          <div className="hero-carousel-dots flex items-center justify-center gap-2.5 mt-2 sm:mt-3" id="hero-carousel-dots">
            <button type="button" className="carousel-dot-btn w-2.5 h-2.5 rounded-full bg-[#173D2B] transition-all duration-300 scale-125" data-index="0" aria-label="Go to Goat Milk Soap"></button>
            <button type="button" className="carousel-dot-btn w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-stone-400 transition-all duration-300" data-index="1" aria-label="Go to Manjistha Soap"></button>
            <button type="button" className="carousel-dot-btn w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-stone-400 transition-all duration-300" data-index="2" aria-label="Go to Neem Soap"></button>
            <button type="button" className="carousel-dot-btn w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-stone-400 transition-all duration-300" data-index="3" aria-label="Go to Beet Root Lip Balm"></button>
          </div>

          {/* Subtle Helper Indicator Below Track */}
          <div className="flex items-center justify-center mt-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200/50 shadow-sm text-stone-700 text-[11px] sm:text-xs font-medium tracking-wide">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E18232] animate-pulse shrink-0"></span>
              <span className="hidden sm:inline">Click any product to bring to center &amp; reveal artisan packaging</span><span className="inline sm:hidden">Tap product to reveal packaging</span>
            </div>
          </div>

        </div>

      </div>

        {/* Subtle Curved Cream and Pale-Green Decorative Waves (Removes Hard Horizontal Boundary) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none select-none z-10" aria-hidden="true">
          <svg 
            className="relative block w-full h-14 sm:h-20 md:h-24 lg:h-28" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Subtle Pale-Green Wave 1 */}
            <path d="M 0,42 C 320,82 560,12 820,50 C 1080,88 1280,26 1440,56 L 1440,120 L 0,120 Z" fill="#D5E9DA" fillOpacity="0.55" />
            {/* Soft Pale-Green Wave 2 */}
            <path d="M 0,62 C 260,26 540,76 860,36 C 1140,82 1320,42 1440,60 L 1440,120 L 0,120 Z" fill="#E2EFE5" fillOpacity="0.75" />
            {/* Smooth Warm Cream Base Wave */}
            <path d="M 0,76 C 360,42 680,86 1020,52 C 1220,70 1360,62 1440,66 L 1440,120 L 0,120 Z" fill="#FAF7F2" />
          </svg>
        </div>
      </section>
  );
}
