'use client';

import React from 'react';
import Link from 'next/link';

export default function CustomerReviews() {
  return (
    <>
<section id="reviews" className="py-16 sm:py-20 lg:py-24 bg-[#FAF5EE] relative overflow-hidden border-t border-stone-200/40" aria-label="Customer Reviews">
      
      {/* Subtle Ambient Warm Silk Background Overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0]" aria-hidden="true"></div>

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header (Centered with Eyebrow and Botanical Curved Swoosh Underline) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          
          {/* EarthGlaze Brand Accent */}
          <div className="flex items-center justify-center mb-3">
            <img src="/assets/earthglaze-logo-hd.png" alt="EarthGlaze" className="h-6 sm:h-7 w-auto object-contain opacity-90 transition-transform duration-300 hover:scale-105" />
          </div>

          {/* Eyebrow: Exact Hero Setup with Flanking Dividers */}
          <div className="flex items-center justify-center gap-3.5 mb-2.5 sm:mb-3">
            <span className="eyebrow-divider" aria-hidden="true"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#3e5444] uppercase font-sans">
              Customer Reviews
            </span>
            <span className="eyebrow-divider" aria-hidden="true"></span>
          </div>

          {/* Main Title with Amber Serif Italic Accent & Brush Underline */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
              Loved by Our <span className="text-[#C28328] italic font-serif font-normal">Customers</span>
            </h2>

        </div>

        {/* Carousel Container with Navigation Arrows */}
        <div className="relative max-w-[1600px] mx-auto px-2 sm:px-6">
          
          {/* Previous Button */}
          <button 
            id="reviews-prev-btn" 
            type="button" 
            className="absolute -left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1E3B2B] shadow-md hover:shadow-lg border border-stone-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="Previous Reviews"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          {/* Next Button */}
          <button 
            id="reviews-next-btn" 
            type="button" 
            className="absolute -right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1E3B2B] shadow-md hover:shadow-lg border border-stone-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="Next Reviews"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* 4-Card Grid / Scrollable Track matching the exact Ratio in Reference Visual */}
          <div id="reviews-track" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch">
            
            {/* Review Card 1: Ayesha N. */}
            <div className="review-card bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/60 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer" data-review-idx="0">
              <div>
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img src="/assets/review_avatar_ayesha.png" alt="Ayesha N." className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border border-stone-100 shadow-2xs shrink-0 ring-2 ring-[#FAF4EE]" />
                  <div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#1E3B2B]">Ayesha N.</h4>
                    <div className="flex items-center gap-0.5 mt-1">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  </div>
                </div>
                <div className="text-left flex items-start gap-2.5 pt-1">
                  <svg className="w-5 h-5 text-[#8DA685] shrink-0 fill-current mt-0.5" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
                  <p className="text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal font-sans">
                    My skin feels so clean and naturally soft after using the Goat Milk Soap!
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-stone-100/80 mt-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] bg-[#EBF5EE] px-2 py-0.5 rounded-full"><svg className="w-3 h-3 fill-current text-[#2D6A4F]" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Verified Customer</span>
              </div>
            </div>

            {/* Review Card 2: Rizwan K. (Active / Highlighted in Reference Visual) */}
            <div className="review-card active-review-card bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-amber-200/80 ring-2 ring-amber-100/50 flex flex-col justify-between transition-all duration-300 lg:-translate-y-2 hover:shadow-lg cursor-pointer" data-review-idx="1">
              <div>
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img src="/assets/review_avatar_rizwan.png" alt="Rizwan K." className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-300/70 shadow-xs shrink-0 ring-2 ring-amber-100" />
                  <div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#1E3B2B]">Rizwan K.</h4>
                    <div className="flex items-center gap-0.5 mt-1">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  </div>
                </div>
                <div className="text-left flex items-start gap-2.5 pt-1">
                  <svg className="w-5 h-5 text-[#8DA685] shrink-0 fill-current mt-0.5" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
                  <p className="text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal font-sans">
                    The Manjistha Soap really improved my skin tone. Totally love it!
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-amber-100/60 mt-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] bg-[#EBF5EE] px-2 py-0.5 rounded-full"><svg className="w-3 h-3 fill-current text-[#2D6A4F]" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Verified Customer</span>
              </div>
            </div>

            {/* Review Card 3: Hiba S. */}
            <div className="review-card bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/60 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer" data-review-idx="2">
              <div>
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img src="/assets/review_avatar_hiba.png" alt="Hiba S." className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border border-stone-100 shadow-2xs shrink-0 ring-2 ring-[#FAF4EE]" />
                  <div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#1E3B2B]">Hiba S.</h4>
                    <div className="flex items-center gap-0.5 mt-1">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  </div>
                </div>
                <div className="text-left flex items-start gap-2.5 pt-1">
                  <svg className="w-5 h-5 text-[#8DA685] shrink-0 fill-current mt-0.5" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
                  <p className="text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal font-sans">
                    The Beet Root Lip Balm keeps my lips soft, smooth and naturally pink.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-stone-100/80 mt-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] bg-[#EBF5EE] px-2 py-0.5 rounded-full"><svg className="w-3 h-3 fill-current text-[#2D6A4F]" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Verified Customer</span>
              </div>
            </div>

            {/* Review Card 4: Faizal M. */}
            <div className="review-card bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/60 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer" data-review-idx="3">
              <div>
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img src="/assets/review_avatar_faizal.png" alt="Faizal M." className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border border-stone-100 shadow-2xs shrink-0 ring-2 ring-[#FAF4EE]" />
                  <div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-[#1E3B2B]">Faizal M.</h4>
                    <div className="flex items-center gap-0.5 mt-1">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5A623] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  </div>
                </div>
                <div className="text-left flex items-start gap-2.5 pt-1">
                  <svg className="w-5 h-5 text-[#8DA685] shrink-0 fill-current mt-0.5" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
                  <p className="text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal font-sans">
                    Gentle, herbal and perfect for daily use. Highly recommended!
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-stone-100/80 mt-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] bg-[#EBF5EE] px-2 py-0.5 rounded-full"><svg className="w-3 h-3 fill-current text-[#2D6A4F]" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Verified Customer</span>
              </div>
            </div>

          </div>

          {/* Pagination Indicator Dots (Exact matching reference: active dot dark green, others muted) */}
          <div className="flex items-center justify-center gap-2.5 mt-8 sm:mt-10">
            <button type="button" className="review-dot w-2.5 h-2.5 rounded-full transition-all duration-300 bg-[#1E3B2B]" data-index="0" aria-label="Review 1"></button>
            <button type="button" className="review-dot w-2.5 h-2.5 rounded-full transition-all duration-300 bg-[#C8D6C9] hover:bg-[#8DA685]" data-index="1" aria-label="Review 2"></button>
            <button type="button" className="review-dot w-2.5 h-2.5 rounded-full transition-all duration-300 bg-[#C8D6C9] hover:bg-[#8DA685]" data-index="2" aria-label="Review 3"></button>
            <button type="button" className="review-dot w-2.5 h-2.5 rounded-full transition-all duration-300 bg-[#C8D6C9] hover:bg-[#8DA685]" data-index="3" aria-label="Review 4"></button>
          </div>

        </div>

      </div>
    </section>
    </>
  );
}
