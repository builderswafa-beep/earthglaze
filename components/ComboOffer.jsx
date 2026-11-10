'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function ComboOffer() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleBuyCombo = async () => {
    setLoading(true);
    try {
      await addToCart(1, 1);
      await addToCart(2, 1);
      await addToCart(3, 1);
      router.push('/cart');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="offer" className="pt-2 sm:pt-4 pb-8 sm:pb-12 bg-[#FAF7F2] overflow-hidden" aria-label="Combo Offer">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Master Combo Offer Banner Container */}
          <div className="offer-banner-container relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border border-[#E8DEC8] bg-gradient-to-r from-[#FAF4EB] via-[#FAF3EA] to-[#F5ECE0]">
            
            {/* Desktop 45% Left / 55% Right Proportional Layout */}
            <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
              
              {/* Column 1: Left Brand, Headings, Pillars & Pricing */}
              <div className="w-full lg:w-[46%] xl:w-[45%] p-6 sm:p-8 lg:p-10 xl:p-12 space-y-4 sm:space-y-5 text-left flex flex-col justify-center shrink-0">
                
                {/* Brand Header with Vertical Bar */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="w-[3.5px] h-8 sm:h-9 bg-[#1E3B2B] rounded-full shrink-0"></span>
                  <div className="leading-none">
                    <div className="font-bold text-[#1E3B2B] text-xl sm:text-2xl tracking-tight flex items-baseline">
                      EarthGlaze<span className="text-[11px] font-semibold ml-0.5">®</span>
                    </div>
                    <span className="block text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.2em] text-[#1E3B2B]/85 uppercase mt-1">Natural &amp; Ayurvedic Skincare</span>
                  </div>
                </div>

                {/* Main Heading & Subtitle */}
                <div className="space-y-1 sm:space-y-1.5 pt-0.5">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[46px] font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
                    Combo <span className="text-[#C28328] italic font-serif font-normal">Offer</span>
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-[#1E3B2B] tracking-tight pt-0.5">
                    Complete Natural Care Set (All 3 Artisanal Products)
                  </p>
                </div>

                {/* 3 Pillar Feature Badges */}
                <div className="flex items-center gap-3 sm:gap-4 py-1">
                  {/* Herbal Care */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[1.5px] border-[#1E3B2B] bg-white/50 flex items-center justify-center text-emerald-800 shadow-2xs">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3B2B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9 0 1.5-.37 2.92-1.02 4.18M12 21c4.97 0 9-4.03 9-9 0-1.5-.37-2.92-1.02-4.18M12 21V11m0 0l-3-3m3 3l3-3"></path>
                      </svg>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#1E3B2B] mt-1.5 leading-tight">Herbal<br />Care</span>
                  </div>

                  <span className="h-9 w-px bg-[#1E3B2B]/20 mx-1"></span>

                  {/* Gentle & Safe */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[1.5px] border-[#1E3B2B] bg-white/50 flex items-center justify-center text-emerald-800 shadow-2xs">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3B2B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#1E3B2B] mt-1.5 leading-tight">Gentle<br />&amp; Safe</span>
                  </div>

                  <span className="h-9 w-px bg-[#1E3B2B]/20 mx-1"></span>

                  {/* No Harsh Chemicals */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[1.5px] border-[#1E3B2B] bg-white/50 flex items-center justify-center text-emerald-800 shadow-2xs">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3B2B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#1E3B2B] mt-1.5 leading-tight">No Harsh<br />Chemicals</span>
                  </div>
                </div>

                {/* Price Pills Row with Floating Combo Badge */}
                <div className="pt-1 space-y-2.5">
                  <div className="flex items-center gap-3">
                    {/* Strikethrough Original Price */}
                    <div className="bg-[#FDF0E1] border border-[#F3DFC8] rounded-full px-4 sm:px-5 py-1.5 sm:py-2 flex items-center justify-center shadow-2xs">
                      <span className="font-bold text-base sm:text-lg text-stone-900 line-through decoration-red-600 decoration-2">₹947</span>
                    </div>

                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E3B2B] shrink-0"></span>

                    {/* Highlighted Combo Price with Floating Badge */}
                    <div className="relative">
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 bg-[#C28328] text-white text-[10px] sm:text-[11px] font-bold tracking-wide px-3 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                        Combo Price
                      </div>
                      <div className="bg-[#1E3B2B] text-white rounded-full px-6 sm:px-7 py-2 sm:py-2.5 flex items-center justify-center shadow-md">
                        <span className="font-bold text-xl sm:text-2xl text-white tracking-tight">₹799</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings Tag */}
                  <div className="inline-flex items-center gap-2 bg-[#E5F2DD] border border-[#CDE5C1] text-[#1E3B2B] rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-[13px] font-bold shadow-2xs">
                    <svg className="w-3.5 h-3.5 text-[#1E3B2B]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                    <span>You Save ₹148 (15% OFF)</span>
                  </div>
                </div>

                {/* CTA Buy Button */}
                <div className="pt-1.5">
                  <button 
                    id="grab-offer-btn" 
                    type="button" 
                    onClick={handleBuyCombo}
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-7 sm:px-8 rounded-full bg-[#1E3B2B] hover:bg-[#152B1F] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer disabled:opacity-75"
                    aria-label="Buy Combo Now for ₹799"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span>{loading ? 'Adding Combo to Bag...' : 'Buy Combo Now'}</span>
                    <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                  </button>
                </div>

              </div>

              {/* Column 2: Right Product Showcase Visual */}
              <div className="w-full lg:w-[54%] xl:w-[55%] flex items-center justify-center lg:justify-end relative px-4 sm:px-6 lg:px-8 pt-2 pb-10 sm:pb-12 lg:py-6">
                <img 
                  src="/assets/combo-offer.png" 
                  alt="EarthGlaze Combo Offer - Manjistha Soap, Goat Milk Soap tied with red ribbon bow & Beet Root Lip Balm" 
                  className="w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[700px] xl:max-w-[760px] h-auto object-contain transform hover:scale-[1.02] transition-transform duration-500 drop-shadow-lg select-none pointer-events-none"
                  loading="eager"
                 />
              </div>

            </div>

            {/* Bottom Botanical Wave Accent */}
            <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none select-none overflow-hidden z-0" style={{'height': '44px'}} aria-hidden="true">
              <svg className="w-full h-full" viewBox="0 0 1200 44" fill="none" preserveAspectRatio="none">
                <path d="M0,44 L1200,44 L1200,26 C1050,11 850,2 620,15 C400,28 200,36 0,38 Z" fill="#1E3B2B"></path>
                <path d="M0,38 C200,36 400,28 620,15 C850,2 1050,11 1200,26" stroke="#8CAE68" strokeWidth="2.5" fill="none"></path>
              </svg>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
