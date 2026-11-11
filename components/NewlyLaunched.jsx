'use client';

import React from 'react';
import Link from 'next/link';

export default function NewlyLaunched() {
  return (
    <section 
      id="soaps" 
      className="py-16 sm:py-20 lg:py-28 bg-[#FAF7F2] relative overflow-hidden" 
      aria-label="Newly Launched Beetroot Lip Balm"
    >
      {/* Soft Ambient Radial Warmth for Natural Editorial Depth */}
      <div 
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-[radial-gradient(circle,_rgba(244,233,212,0.65)_0%,_rgba(250,247,242,0)_70%)] pointer-events-none -z-0 blur-3xl" 
        aria-hidden="true" 
      />

      {/* Subtle Floating Botanical Leaf Branch in Background Corner */}
      <img 
        src="/assets/banner_newly_leaves.png" 
        alt="" 
        className="absolute -top-6 -right-6 w-44 sm:w-60 lg:w-72 h-auto opacity-30 pointer-events-none select-none -z-0 transform rotate-12"
        aria-hidden="true" 
      />

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Seamless 2-Column Responsive Layout - Natural Background Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Column 1: Typography, Benefits, CTA (5 cols on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-5 text-left flex flex-col justify-center space-y-6">
            
            {/* Eyebrow Pill: NEWLY LAUNCHED with Leaf Icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2EC] border border-[#C6DEC9] shadow-2xs backdrop-blur-xs w-fit">
              <span className="w-2 h-2 rounded-full bg-[#2E6B3E] animate-pulse"></span>
              <svg className="w-3.5 h-3.5 text-[#1E3B2B] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12 5-2 1.5-3 3.5-3 3.5 3 0 7-4 7-9z"/>
              </svg>
              <span className="text-xs font-bold tracking-[0.18em] text-[#1E3B2B] uppercase font-sans">
                Newly Launched
              </span>
            </div>

            {/* Main Heading: Beetroot (Green Serif) + Lip Balm (Amber Italic Serif with Gold Swoosh) */}
            <div className="space-y-1">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-bold text-[#1E3B2B] tracking-tight leading-[1.06]">
              Beetroot <span className="text-[#C28328] italic font-serif font-normal">Lip Balm</span>
            </h2>
            </div>

            {/* Description Copy */}
            <p className="text-base sm:text-lg text-[#404F44] leading-relaxed font-normal max-w-lg font-sans">
              Nourishing lip care with the natural goodness of beetroot. Keeps your lips soft, smooth and naturally tinted.
            </p>

            {/* 3 Benefit Badges / Pills Row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              {/* Natural Tint */}
              <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                <svg className="w-3.5 h-3.5 text-[#E0245E] fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 2.5c-.8 1.1-4 5.7-4 8.5 0 2.2 1.8 4 4 4s4-1.8 4-4c0-2.8-3.2-7.4-4-8.5z" clipRule="evenodd"/>
                </svg>
                <span>Natural Tint</span>
              </div>

              {/* Deep Moisturization */}
              <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                <svg className="w-3.5 h-3.5 text-[#0EA5E9] fill-current shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 2.5c-.8 1.1-4 5.7-4 8.5 0 2.2 1.8 4 4 4s4-1.8 4-4c0-2.8-3.2-7.4-4-8.5z" clipRule="evenodd"/>
                </svg>
                <span>Deep Moisturization</span>
              </div>

              {/* Chemical Free */}
              <div className="inline-flex items-center gap-2 bg-white/95 border border-[#E2D8C3] rounded-full px-4 py-2 shadow-2xs text-xs sm:text-[13px] font-semibold text-[#1E3B2B] hover:border-[#1E3B2B]/40 hover:shadow-xs transition-all">
                <svg className="w-3.5 h-3.5 text-[#C28328] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                <span>Chemical Free</span>
              </div>
            </div>

            {/* CTA Explore Button & Trust Micro Details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3">
              <Link 
                id="explore-soaps-btn" 
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-4 px-8 sm:px-9 rounded-full bg-[#0D2D1C] hover:bg-[#1b4520] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                aria-label="Explore the New Beetroot Lip Balm Range"
              >
                <span>Explore the New Range</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
              </Link>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#5C6B5E]">
                <span className="font-bold text-[#1E3B2B] text-base">₹250</span>
                <span className="text-[#8A9A8C]">•</span>
                <span className="text-[#C28328]">★ 4.8</span>
                <span className="text-[#8A9A8C]">(108 reviews)</span>
              </div>
            </div>

          </div>

          {/* Column 2: Right Product Showcase Visual (7 cols on Desktop, Seamlessly Sits in Background) */}
          <div className="lg:col-span-6 xl:col-span-7 flex items-center justify-center lg:justify-end relative">
            <Link 
              href="/shop" 
              className="block relative group cursor-pointer select-none"
              aria-label="View Beetroot Lip Balm on Shop"
            >
              <img 
                src="/assets/newly_launched_product_isolated_transparent.png" 
                alt="EarthGlaze Beetroot Lip Balm on natural sandstone pedestal with freshly sliced beetroot and leafy bulb" 
                className="w-full max-w-[560px] sm:max-w-[640px] lg:max-w-[700px] xl:max-w-[760px] h-auto object-contain transform transition-transform duration-700 group-hover:scale-[1.03]"
                loading="eager"
                width="1086"
                height="615"
              />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}