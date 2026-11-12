'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAF7F2] font-sans text-[#1E3B2B] overflow-hidden selection:bg-[#235327] selection:text-white">

      {/* =========================================================================
          SECTION 1: HERO BANNER (The EarthGlanze Story)
          Sandstone slab pedestal, luxury rolled white towels & hanging eucalyptus branch
          Full-bleed seamless artwork blending 100% naturally into #FAF7F2
          ========================================================================= */}
      <section className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center overflow-hidden bg-[#FAF7F2] border-b border-[#E8DEC8]/50">
        
        {/* Full-bleed seamless background banner image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 hidden sm:block">
          <img 
            src="/assets/about_hero_seamless_hd.png" 
            alt="EarthGlaze Natural Skincare - Sandstone slab pedestal with luxury organic towels and botanical eucalyptus leaves" 
            className="w-full h-full object-cover object-right"
            loading="eager"
            width="1376"
            height="768"
          />
        </div>

        {/* Organic Emerald Green Bottom-Left Wave Sweep (Properly Aligned & Harmoniously Layered) */}
        <svg 
          className="absolute bottom-0 left-0 w-72 sm:w-96 md:w-[460px] lg:w-[560px] xl:w-[680px] h-auto pointer-events-none select-none z-10" 
          viewBox="0 0 700 130" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="aboutWaveGrad" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#2E6B3E" />
              <stop offset="55%" stopColor="#1E4D2B" />
              <stop offset="100%" stopColor="#12331C" />
            </linearGradient>
            <linearGradient id="aboutWaveBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#163C25" />
              <stop offset="100%" stopColor="#0A2213" />
            </linearGradient>
          </defs>

          {/* Background Depth Layer (Aligned organic contour, smooth baseline taper) */}
          <path 
            d="M 0 130 C 80 115 150 48 270 48 C 390 48 490 102 640 130 L 0 130 Z" 
            fill="url(#aboutWaveBack)" 
            opacity="0.45" 
          />

          {/* Foreground Main Layer (Rich botanical emerald sweep, smoothly aligned with depth layer) */}
          <path 
            d="M 0 130 C 75 119 145 62 265 62 C 380 62 470 108 590 130 L 0 130 Z" 
            fill="url(#aboutWaveGrad)" 
            opacity="0.95" 
          />

          {/* Fine Botanical Gold Highlight Filament along crest */}
          <path 
            d="M 10 128 C 80 117 150 61 265 61 C 375 61 465 106 580 128" 
            stroke="#D4AF37" 
            strokeWidth="1.5" 
            strokeOpacity="0.65" 
            strokeLinecap="round"
            fill="none" 
          />
        </svg>

        {/* Foreground Content Container */}
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-20 py-8 sm:py-12 lg:py-14">
          <div className="max-w-xl space-y-4 sm:space-y-6 text-left">
            
            {/* Eyebrow with Dividers */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#1E3B2B]/40" aria-hidden="true"></span>
              <span className="text-xs font-bold tracking-[0.22em] text-[#1E3B2B] uppercase font-sans">
                About Us
              </span>
              <span className="w-8 h-px bg-[#1E3B2B]/40" aria-hidden="true"></span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold text-[#1E3B2B] tracking-tight leading-[1.08] font-serif">
                The EarthGlanze
                <span className="block mt-1 sm:mt-1.5 font-serif font-bold text-[#1E3B2B]">
                  <span className="italic font-normal text-[#C28328]">Story</span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed max-w-lg font-sans">
              A natural skincare brand inspired by the power of nature, crafted for healthy and radiant skin.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a 
                href="#our-story-details" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-2.5 sm:py-3 px-6 sm:px-7 rounded-full bg-[#0D2D1C] hover:bg-[#1a4628] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <span>Our Journey</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
              </a>
            </div>

            {/* Mobile-only responsive visual */}
            <div className="sm:hidden pt-4">
              <img 
                src="/assets/about_hero_seamless_hd.png" 
                alt="EarthGlaze Natural Skincare - Towels on pedestal" 
                className="w-full h-auto rounded-2xl shadow-sm"
                loading="eager"
              />
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: CORE STORY (Mortar & Pestle Grinding Fresh Botanicals)
          ========================================================================= */}
      <section id="our-story-details" className="py-6 sm:py-9 bg-[#FAF7F2] relative">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left: Arched Image Frame with Mortar & Pestle in 4:3 Aspect Ratio */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group max-w-[360px] sm:max-w-[380px] w-full">
                {/* Outer Arched Frame with Golden Accent Border */}
                <div className="relative overflow-hidden rounded-[36px] sm:rounded-[48px] bg-[#EDE5D8] border-2 border-[#D4AF37]/60 shadow-[0_12px_36px_rgba(23,61,43,0.08)] transition-transform duration-500 group-hover:scale-[1.015] aspect-[4/3]">
                  <img 
                    src="/assets/about_hands_mortar_perfect.png" 
                    alt="Handcrafting pure herbal skincare using traditional stone mortar and fresh botanicals" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width="800"
                    height="600"
                  />
                </div>

                {/* Floating Leaf Icon Badge on Bottom-Right */}
                <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-[#FAF6EE] border-2 border-white shadow-lg flex items-center justify-center text-[#2E6B3E] z-20">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12 5-2 1.5-3 3.5-3 3.5 3 0 7-4 7-9z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Story Text & Brand Mission */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#1E3B2B]">
                  Our Story
                </span>
                <span className="w-12 h-0.5 bg-[#1E3B2B]/40 rounded-full"></span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1E3B2B] leading-[1.18]">
                The EarthGlanze <span className="italic font-normal text-[#C28328]">Story</span>
              </h2>

              {/* Description Body */}
              <p className="text-[#404F44] text-sm sm:text-base lg:text-lg leading-relaxed font-normal pt-1 font-sans">
                EarthGlanze was born from a simple belief &mdash; that skincare should be natural, safe and effective. We combine the goodness of traditional ingredients with modern care to create everyday skincare that truly works.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 4-PILLARS / CORE VALUES FLOATING CAPSULE BAR
          ========================================================================= */}
      <section className="py-3 sm:py-4 bg-[#FAF7F2]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="bg-[#FAF5ED] rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 border border-[#E8DEC8] shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-center divide-y md:divide-y-0 md:divide-x divide-stone-200/80 text-center">
              
              {/* Pillar 1: Nature-Powered Formulas */}
              <div className="flex flex-col items-center justify-center p-2 group cursor-pointer transition-all">
                <div className="text-[#2E6B3E] mb-2.5 transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 7c2.5 0 4.5 2 4.5 4.5S14.5 16 12 16" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1E3B2B] tracking-tight group-hover:text-[#2E6B3E] transition-colors">
                  Nature-Powered Formulas
                </h3>
              </div>

              {/* Pillar 2: No Harsh Chemicals */}
              <div className="flex flex-col items-center justify-center p-2 group cursor-pointer transition-all pt-4 md:pt-2">
                <div className="text-[#2E6B3E] mb-2.5 transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1E3B2B] tracking-tight group-hover:text-[#2E6B3E] transition-colors">
                  No Harsh Chemicals
                </h3>
              </div>

              {/* Pillar 3: Gentle on All Skin Types */}
              <div className="flex flex-col items-center justify-center p-2 group cursor-pointer transition-all pt-4 md:pt-2">
                <div className="text-[#2E6B3E] mb-2.5 transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1E3B2B] tracking-tight group-hover:text-[#2E6B3E] transition-colors">
                  Gentle on All Skin Types
                </h3>
              </div>

              {/* Pillar 4: Ethically Sourced */}
              <div className="flex flex-col items-center justify-center p-2 group cursor-pointer transition-all pt-4 md:pt-2">
                <div className="text-[#2E6B3E] mb-2.5 transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8m0 0a5 5 0 01-5-5c0-2.5 2-4 5-4s5 1.5 5 4a5 5 0 01-5 5z"/>
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1E3B2B] tracking-tight group-hover:text-[#2E6B3E] transition-colors">
                  Ethically Sourced
                </h3>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OUR MISSION & VISION
          ========================================================================= */}
      <section className="py-5 sm:py-7 bg-[#FAF7F2]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Section Header: Our Mission & Vision */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="inline-flex items-center justify-center gap-3.5 mb-2">
              <span className="w-8 sm:w-16 h-px bg-[#1E3B2B]/30" aria-hidden="true" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1E3B2B]">
                Our <span className="italic font-normal text-[#C28328]">Mission &amp; Vision</span>
              </h2>
              <span className="w-8 sm:w-16 h-px bg-[#1E3B2B]/30" aria-hidden="true" />
            </div>
          </div>

          {/* Cards Grid: Mission (Left) + Vision (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Card 1: Our Mission */}
            <div className="group relative bg-gradient-to-r from-[#EAF4EB] via-[#F6FAF5] to-white rounded-[20px] p-4 sm:p-5 border border-emerald-100/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden flex items-start gap-4 sm:gap-5">
              {/* Corner leaves on right */}
              <img 
                src="/assets/contact_card_leaves.png" 
                alt="" 
                className="absolute -top-3 -right-3 w-32 h-auto opacity-70 pointer-events-none select-none transition-transform duration-500 group-hover:scale-110" 
                aria-hidden="true" 
              />

              {/* Icon */}
              <div className="shrink-0 text-[#2E6B3E] mt-0.5">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </div>

              {/* Text */}
              <div className="space-y-1.5 relative z-10 max-w-sm">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B]">
                  Our Mission
                </h3>
                <p className="text-[#404F44] text-xs sm:text-sm leading-relaxed font-normal">
                  To bring the purity of nature into daily skincare through safe, effective and eco-conscious products.
                </p>
              </div>
            </div>

            {/* Card 2: Our Vision */}
            <div className="group relative bg-gradient-to-r from-[#FAF5EC] via-[#F8F9F3] to-white rounded-[20px] p-4 sm:p-5 border border-amber-100/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden flex items-start gap-4 sm:gap-5">
              {/* Corner leaves on right */}
              <img 
                src="/assets/contact_card_leaves.png" 
                alt="" 
                className="absolute -top-3 -right-3 w-32 h-auto opacity-70 pointer-events-none select-none transition-transform duration-500 group-hover:scale-110" 
                aria-hidden="true" 
              />

              {/* Icon */}
              <div className="shrink-0 text-[#2E6B3E] mt-0.5">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>

              {/* Text */}
              <div className="space-y-1.5 relative z-10 max-w-sm">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B]">
                  Our Vision
                </h3>
                <p className="text-[#404F44] text-xs sm:text-sm leading-relaxed font-normal">
                  To be a trusted natural skincare brand that promotes healthier skin and a more mindful, sustainable lifestyle.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: OUR PROMISE WIDE BANNER
          ========================================================================= */}
      <section className="py-3 sm:py-4 bg-[#FAF7F2]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="group relative rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-[#124322] via-[#174D27] to-[#12381F] text-white p-6 sm:p-10 lg:p-12 shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-900/40">
            
            {/* Seamless Dewdrop Leaves on the Right */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-[58%] h-full pointer-events-none select-none overflow-hidden">
              <img 
                src="/assets/about_promise_leaves_flawless.png" 
                alt="" 
                className="w-full h-full object-cover object-right transform transition-transform duration-700 group-hover:scale-105" 
                aria-hidden="true" 
              />
            </div>

            {/* Left Content */}
            <div className="flex items-center gap-4 sm:gap-6 relative z-10 max-w-xl">
              
              {/* Circular Recycle / Renewal Icon */}
              <div className="shrink-0 w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-[#D4AF37]/80 flex items-center justify-center text-[#E5BA68] transition-transform duration-500 group-hover:rotate-180">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-12 bg-white/20 hidden sm:block" aria-hidden="true"></div>

              {/* Text */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-white">
                  Our <span className="italic font-normal text-[#E5BA68]">Promise</span>
                </h3>
                <p className="text-[#D8E6DB] text-xs sm:text-sm lg:text-base leading-relaxed font-normal font-sans">
                  Pure ingredients, honest formulations and care for your skin and the planet.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: DISCOVER OUR NATURAL CARE (CTA BANNER)
          ========================================================================= */}
      <section className="py-5 sm:py-8 bg-[#FAF7F2]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="relative rounded-[20px] sm:rounded-[24px] bg-[#FAF5ED] p-5 sm:p-8 text-center border border-[#E8DEC8] shadow-sm overflow-hidden group">
            
            {/* Left Decorative Botanical Leaves */}
            <img 
              src="/assets/contact_card_leaves.png" 
              alt="" 
              className="absolute -bottom-4 -left-4 w-36 sm:w-48 h-auto pointer-events-none select-none transform scale-x-[-1] transition-transform duration-500 group-hover:scale-[-1.05]" 
              aria-hidden="true" 
            />

            {/* Right Decorative Botanical Leaves */}
            <img 
              src="/assets/contact_card_leaves.png" 
              alt="" 
              className="absolute -top-4 -right-4 w-36 sm:w-48 h-auto pointer-events-none select-none transition-transform duration-500 group-hover:scale-105" 
              aria-hidden="true" 
            />

            <div className="relative z-10 max-w-xl mx-auto space-y-3">
              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1E3B2B]">
                Discover Our <span className="italic font-normal text-[#C28328]">Natural Care</span>
              </h2>

              {/* Subtitle */}
              <p className="text-[#404F44] text-xs sm:text-sm lg:text-base leading-relaxed font-normal font-sans">
                Explore a range of nature-powered skincare, crafted for healthy and radiant skin.
              </p>

              {/* CTA Action Button */}
              <div className="pt-3">
                <Link 
                  href="/shop" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-[#0D2D1C] hover:bg-[#1a4628] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <span>Shop Our Collection</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
