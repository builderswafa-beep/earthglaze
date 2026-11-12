'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <section 
      id="about" 
      className="py-14 sm:py-18 lg:py-24 bg-[#FAF7F2] relative overflow-hidden select-none" 
      aria-label="About EarthGlaze Natural Skincare"
    >
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Arched Gateway Product Podium Visual (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="about-arch-frame w-full max-w-[460px] lg:max-w-[540px] xl:max-w-[580px] transition-transform duration-500 hover:scale-[1.015]">
              <img
                src="/assets/about-img.png" 
                alt="EarthGlaze Artisan Botanical Collection in Golden Arched Frame: Manjistha Soap, Goat Milk Soap, Beetroot Lip Balm and Natural Ingredients Seal" 
                className="w-full h-auto object-contain drop-shadow-[0_16px_36px_rgba(22,61,38,0.14)]"
              />
            </div>
          </div>

          {/* Right Column: About Copy, Formulation Card, 3 Pillars & Action Row (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 lg:space-y-6 text-left">
            
            {/* 1. Eyebrow: Centered with Flanking Horizontal Lines */}
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 sm:w-10 h-0.5 bg-[#163D26]/50 rounded-full" aria-hidden="true"></span>
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#163D26] uppercase">
                About Us
              </span>
              <span className="w-8 sm:w-10 h-0.5 bg-[#163D26]/50 rounded-full" aria-hidden="true"></span>
            </div>

            {/* 2. Main Heading: The Natural Choice for Healthier Skin */}
            <div className="space-y-0.5">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
                The Natural Choice <span className="font-serif italic font-normal text-[#C28328]">for</span>
              </h2>
              <div className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] font-normal text-[#C28328] leading-[1.12]">
                Healthier Skin
              </div>
            </div>

            {/* 3. Primary Introduction Paragraph */}
            <p className="text-sm sm:text-base lg:text-[16.5px] text-[#404F44] leading-relaxed font-normal max-w-3xl">
              EarthGlaze is a nature-inspired skincare brand that blends pure, skin-loving ingredients with modern care to keep your skin healthy, radiant and naturally beautiful.
            </p>

            {/* 4. Highlight Botanical Formulation Promise Card */}
            <div className="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-[#F2F7F2] border border-[#DEEADE] shadow-2xs flex items-start gap-3.5 sm:gap-4 transition-all duration-300 hover:border-[#1E3B2B]/30 hover:shadow-xs max-w-3xl">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 border border-[#D0E2D2] flex items-center justify-center shrink-0 text-emerald-700 shadow-2xs mt-0.5">
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <p className="text-xs sm:text-[13.5px] lg:text-[14px] text-[#1E3B2B] leading-relaxed font-medium">
                We craft gentle, effective formulations using botanical extracts, nourishing oils and time-tested natural ingredients, bringing you everyday skincare that is safe, kind and effective for all skin types.
              </p>
            </div>

            {/* 5. 3 Pillar Features in a Row with Dividers */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 py-1 max-w-3xl">
              
              {/* Pillar 1: Plant-Based Formulas */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-[130px] group/pillar">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#163D26]/40 bg-white flex items-center justify-center shrink-0 shadow-2xs group-hover/pillar:border-[#C28328] group-hover/pillar:scale-108 transition-all duration-300">
                  <svg className="w-5 h-5 text-[#163D26]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 4c-5-.5-10.5 2-13.5 5-3.5 3.5-4 8.5-2 11 2.5 2 7.5 1.5 11-2 3-3 5.5-8.5 5-13.5-.5-.5-.5-.5-.5-.5z" />
                    <path d="M5.5 18.5c4-4 8.5-7 14-8.5" />
                  </svg>
                </div>
                <div className="text-left leading-tight select-none">
                  <span className="block text-xs sm:text-[13px] font-bold text-[#163D26] tracking-tight">Plant-Based</span>
                  <span className="block text-xs sm:text-[13px] font-bold text-[#163D26] tracking-tight">Formulas</span>
                </div>
              </div>

              {/* Divider 1 */}
              <div className="hidden sm:block w-[1px] h-8 bg-stone-300/80 shrink-0" aria-hidden="true" />

              {/* Pillar 2: No Harsh Chemicals */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-[130px] group/pillar">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#163D26]/40 bg-white flex items-center justify-center shrink-0 shadow-2xs group-hover/pillar:border-[#C28328] group-hover/pillar:scale-108 transition-all duration-300">
                  <svg className="w-5 h-5 text-[#163D26]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v7.5L5 18a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3L14 9.5V2" />
                    <path d="M8.5 2h7" />
                    <path d="M7 16h10" />
                  </svg>
                </div>
                <div className="text-left leading-tight select-none">
                  <span className="block text-xs sm:text-[13px] font-bold text-[#163D26] tracking-tight">No Harsh</span>
                  <span className="block text-xs sm:text-[13px] font-bold text-[#163D26] tracking-tight">Chemicals</span>
                </div>
              </div>

              {/* Divider 2 */}
              <div className="hidden sm:block w-[1px] h-8 bg-stone-300/80 shrink-0" aria-hidden="true" />

              {/* Pillar 3: Skin-Friendly & Gentle */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-[130px] group/pillar">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#163D26]/40 bg-white flex items-center justify-center shrink-0 shadow-2xs group-hover/pillar:border-[#C28328] group-hover/pillar:scale-108 transition-all duration-300">
                  <svg className="w-5 h-5 text-[#163D26]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <div className="text-left leading-tight select-none">
                  <span className="block text-xs sm:text-[13px] font-bold text-[#163D26] tracking-tight">Skin-Friendly</span>
                  <span className="block text-xs sm:text-[13px] font-bold text-[#163D26] tracking-tight">&amp; Gentle</span>
                </div>
              </div>

            </div>

            {/* 6. Action Row: Know More Button & The EarthGlaze Story Pill */}
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4">
              
              {/* Know More Primary CTA Button */}
              <Link
                href="/about"
                id="about-know-more-btn"
                className="btn-luxury-primary px-8 py-3.5 rounded-full text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 shrink-0"
              >
                <span>Know More</span>
                <span className="btn-arrow font-bold">&rarr;</span>
              </Link>

              {/* The EarthGlaze Story Dedicated Pill */}
              <Link 
                href="/story" 
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/95 border border-stone-200/90 shadow-2xs text-xs sm:text-sm font-bold text-[#163D26] hover:text-[#C28328] hover:border-[#163D26]/30 hover:shadow-xs transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-emerald-700 text-sm">🍃</span>
                <span className="tracking-tight">The EarthGlaze Story</span>
                <span className="text-[#C28328] text-xs font-bold transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Flowing Pale-Green Wave Accent */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none select-none -z-0" aria-hidden="true">
        <svg 
          className="relative block w-full h-8 sm:h-12 md:h-16" 
          viewBox="0 0 1440 80" 
          preserveAspectRatio="none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,32 C320,65 640,10 960,42 C1200,66 1360,24 1440,36 L1440,80 L0,80 Z" fill="#E6EFE7" fillOpacity="0.6" />
        </svg>
      </div>

    </section>
  );
}
