'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <>
<section id="about" className="py-16 sm:py-24 bg-[#FAF7F2] relative overflow-hidden" aria-label="About Us">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Arched Product Collection Visual (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="about-arch-frame w-full max-w-[420px] lg:max-w-[460px]">
              <img
                src="/assets/about-img.png" 
                alt="EarthGlaze Artisan Collection in Botanical Arched Frame: Manjistha Soap, Goat Milk Soap, Beetroot Lip Balm with Natural Ingredients Seal" 
                className="w-full h-auto object-contain transform hover:scale-102 transition duration-700 "
               />
            </div>
          </div>

          {/* Right: About Copy, 3 Pillars, Signature Range & Know More (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow: Exact Hero Setup with Flanking Dividers */}
            <div className="flex items-center gap-3.5 mb-2.5">
              <span className="eyebrow-divider" aria-hidden="true"></span>
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#3e5444] uppercase">
                About Us
              </span>
              <span className="eyebrow-divider" aria-hidden="true"></span>
            </div>

            {/* Main Heading: Exact Hero Headline Setup */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
              The Natural Choice <span className="text-[#C28328] italic font-serif font-normal">for Healthier Skin</span>
            </h2>

            {/* Paragraph: Exact Hero Subtext Setup */}
            <p className="text-base sm:text-lg text-[#404F44] leading-relaxed font-normal max-w-2xl">
              EarthGlaze is a nature-inspired skincare brand that blends pure, skin-loving ingredients with modern care to keep your skin healthy, radiant and naturally beautiful.
            </p>

            {/* 3 Pillar Feature Pills in a Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/90 border border-stone-200/70 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#eaf4e6] flex items-center justify-center text-sm shrink-0">🍃</div>
                <span className="text-xs font-bold text-[#173D2B] leading-tight">Plant-Based<br />Formulas</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/90 border border-stone-200/70 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#eaf4e6] flex items-center justify-center text-sm shrink-0">🧪</div>
                <span className="text-xs font-bold text-[#173D2B] leading-tight">No Harsh<br />Chemicals</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/90 border border-stone-200/70 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#eaf4e6] flex items-center justify-center text-sm shrink-0">💚</div>
                <span className="text-xs font-bold text-[#173D2B] leading-tight">Skin-Friendly<br />& Gentle</span>
              </div>
            </div>

            {/* Subdivider: Our Signature Range */}
            <div className="pt-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px flex-1 bg-stone-200"></span>
                <span className="text-xs font-bold text-[#173D2B] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🍃</span> Our Signature Range <span>🍃</span>
                </span>
                <span className="h-px flex-1 bg-stone-200"></span>
              </div>

              {/* 3 Signature Product Mini-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Mini Card 1: Manjistha Soap */}
                <div className="p-3 bg-white/95 rounded-2xl border border-stone-200/70 shadow-xs flex items-center gap-3 group hover:border-[#173D2B]/30 transition">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 shrink-0 border border-stone-100">
                    <img src="/assets/bestseller_manjistha_photo_hd.png" alt="Manjistha Soap" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#173D2B] truncate">Manjistha Soap</h4>
                    <p className="text-[10px] text-stone-500 truncate">Herbal Care for Clear Skin</p>
                  </div>
                  <a href="/#products" className="w-7 h-7 rounded-full bg-[#173D2B] hover:bg-[#235327] text-white flex items-center justify-center text-xs shrink-0 transition" aria-label="View Manjistha Soap">&rarr;</a>
                </div>

                {/* Mini Card 2: Goat Milk Soap */}
                <div className="p-3 bg-white/95 rounded-2xl border border-stone-200/70 shadow-xs flex items-center gap-3 group hover:border-[#173D2B]/30 transition">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 shrink-0 border border-stone-100">
                    <img src="/assets/bestseller_goat_photo_hd.png" alt="Goat Milk Soap" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#173D2B] truncate">Goat Milk Soap</h4>
                    <p className="text-[10px] text-stone-500 truncate">Gentle Cleanse & Nourishment</p>
                  </div>
                  <a href="/#products" className="w-7 h-7 rounded-full bg-[#173D2B] hover:bg-[#235327] text-white flex items-center justify-center text-xs shrink-0 transition" aria-label="View Goat Milk Soap">&rarr;</a>
                </div>

                {/* Mini Card 3: Beetroot Lip Balm */}
                <div className="p-3 bg-white/95 rounded-2xl border border-stone-200/70 shadow-xs flex items-center gap-3 group hover:border-[#173D2B]/30 transition">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 shrink-0 border border-stone-100">
                    <img src="/assets/bestseller_balm_photo_hd.png" alt="Beetroot Lip Balm" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#173D2B] truncate">Beetroot Lip Balm</h4>
                    <p className="text-[10px] text-stone-500 truncate">Nourishing Care for Soft Lips</p>
                  </div>
                  <a href="/#soaps" className="w-7 h-7 rounded-full bg-[#173D2B] hover:bg-[#235327] text-white flex items-center justify-center text-xs shrink-0 transition" aria-label="View Beetroot Lip Balm">&rarr;</a>
                </div>

              </div>
            </div>

            {/* Bottom Row: Know More Button & Story Teaser Card */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-4">
              <button 
                id="about-know-more-btn" 
                type="button" 
                className="px-8 py-3.5 rounded-full bg-[#173D2B] hover:bg-[#235327] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group cursor-pointer active:scale-95 shrink-0"
              >
                <span>Know More</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>

              <div 
                id="story-teaser-trigger" 
                role="button" 
                tabIndex="0"
                className="flex-1 p-3 px-4 rounded-2xl bg-white/90 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-2.5 text-left cursor-pointer hover:border-emerald-600/40 transition group"
              >
                <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-[#173D2B]">
                  <span>🍃</span> The EarthGlaze Story
                </div>
                <span className="hidden sm:inline-block h-4 w-px bg-stone-300"></span>
                <p className="text-[11px] sm:text-xs text-stone-600 leading-snug line-clamp-2">
                  Born from a love for nature, EarthGlaze creates simple, effective skincare using pure, natural ingredients.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
    </>
  );
}
