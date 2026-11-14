'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Ayesha N.',
    rating: 5,
    product: 'Goat Milk Soap',
    comment: 'My skin feels so clean and naturally soft after using the Goat Milk Soap!',
    featured: false,
  },
  {
    id: 2,
    name: 'Rizwan K.',
    rating: 5,
    product: 'Manjistha Soap',
    comment: 'The Manjistha Soap really improved my skin tone. Totally love it!',
    featured: true,
  },
  {
    id: 3,
    name: 'Hiba S.',
    rating: 5,
    product: 'Beet Root Lip Balm',
    comment: 'The Beet Root Lip Balm keeps my lips soft, smooth and naturally pink.',
    featured: false,
  },
  {
    id: 4,
    name: 'Faizal M.',
    rating: 5,
    product: 'Herbal Daily Care',
    comment: 'Gentle, herbal and perfect for daily use. Highly recommended!',
    featured: false,
  },
  {
    id: 5,
    name: 'Pooja R.',
    rating: 5,
    product: 'Neem Soap',
    comment: 'The Neem Soap completely calmed my breakouts and redness. It feels deeply detoxifying yet never dries out my skin.',
    featured: false,
  },
  {
    id: 6,
    name: 'Zainab M.',
    rating: 5,
    product: 'The Botanical Combo',
    comment: 'Ordered the Botanical Combo gift set for my sister. The packaging, artisanal finish, and herbal aroma are pure luxury!',
    featured: false,
  },
  {
    id: 7,
    name: 'Karthik S.',
    rating: 5,
    product: 'Beet Root Lip Balm',
    comment: 'Authentic natural formulation without harsh chemicals. The beetroot tint is subtle, hydrating, and lasts all day.',
    featured: false,
  },
];

export default function CustomerReviews() {
  const { getSection } = useSiteContent();
  const reviewsData = getSection('home', 'reviews');
  const reviewsList = (Array.isArray(reviewsData?.points) && reviewsData.points.length > 0)
    ? reviewsData.points
    : DEFAULT_REVIEWS;

  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-scrolling animation loop (smooth auto-scroll with pause on hover)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const card = container.querySelector('.review-card-item');
      const cardWidth = card ? card.offsetWidth : 340;
      const gap = 20;
      const step = cardWidth + gap;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setActiveIdx(0);
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
        const nextIdx = Math.round((container.scrollLeft + step) / step);
        setActiveIdx(nextIdx % reviewsList.length);
      }
    }, 3400);

    return () => clearInterval(interval);
  }, [isPaused, reviewsList.length]);

  // Sync active dot on manual scroll
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector('.review-card-item');
    const cardWidth = card ? card.offsetWidth : 340;
    const step = cardWidth + 20;
    const currentIndex = Math.round(container.scrollLeft / step);
    setActiveIdx(Math.min(currentIndex, reviewsList.length - 1));
  };

  const scrollPrev = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector('.review-card-item');
    const step = (card ? card.offsetWidth : 340) + 20;
    container.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const scrollNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector('.review-card-item');
    const step = (card ? card.offsetWidth : 340) + 20;
    container.scrollBy({ left: step, behavior: 'smooth' });
  };

  const scrollToReview = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector('.review-card-item');
    const step = (card ? card.offsetWidth : 340) + 20;
    container.scrollTo({ left: index * step, behavior: 'smooth' });
    setActiveIdx(index);
  };

  return (
    <section 
      id="reviews" 
      className="py-14 sm:py-18 lg:py-20 bg-[#FAF5EE] relative overflow-hidden border-t border-stone-200/40 select-none" 
      aria-label="Customer Reviews"
    >
      {/* Subtle Ambient Warm Background Overlay */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0]" 
        aria-hidden="true"
      />

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header: Eyebrow & Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3.5 mb-2 sm:mb-2.5">
            <span className="eyebrow-divider" aria-hidden="true"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#3e5444] uppercase font-sans">
              {reviewsData.eyebrow || 'Customer Reviews'}
            </span>
            <span className="eyebrow-divider" aria-hidden="true"></span>
          </div>

          {/* Main Title with Amber Serif Italic Accent */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
            {reviewsData.title || (
              <>Loved by Our <span className="text-[#C28328] italic font-serif font-normal">Customers</span></>
            )}
          </h2>

          {reviewsData.subtitle && (
            <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              {reviewsData.subtitle}
            </p>
          )}

        </div>

        {/* Carousel Container with Smooth Scrolling Animation Track & Navigation Arrows */}
        <div 
          className="relative max-w-[1600px] mx-auto px-2 sm:px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Previous Button */}
          <button 
            id="reviews-prev-btn" 
            type="button" 
            onClick={scrollPrev}
            className="absolute -left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1E3B2B] shadow-md hover:shadow-xl border border-stone-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer"
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
            onClick={scrollNext}
            className="absolute -right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#1E3B2B] shadow-md hover:shadow-xl border border-stone-200/80 flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="Next Reviews"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Horizontal Smooth Auto-Scrolling Reviews Track */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex items-stretch gap-4 sm:gap-5 lg:gap-6 overflow-x-auto scroll-smooth py-3 px-1 no-scrollbar cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {reviewsList.map((review, idx) => (
              <div 
                key={review.id || idx}
                className={`review-card-item w-[290px] sm:w-[330px] lg:w-[350px] shrink-0 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1.5 ${
                  review.featured 
                    ? 'border-2 border-amber-300/80 ring-2 ring-amber-100/60 shadow-md' 
                    : 'border-stone-200/60'
                }`}
                data-review-idx={idx}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-[#1E3B2B] leading-tight">
                        {review.name || review.title}
                      </h4>
                      
                      {/* 5 Golden Stars */}
                      <div className="flex items-center gap-0.5 mt-1.5 text-[#F5A623]">
                        {[...Array(Number(review.rating) || 5)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Elegant Quote Symbol Accent */}
                    <div className="w-8 h-8 rounded-full bg-[#FAF5EE] border border-[#EADBBD]/80 flex items-center justify-center text-[#2D6A4F] shrink-0">
                      <svg className="w-4 h-4 text-[#8DA685] fill-current" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-[13.5px] text-[#404F44] leading-relaxed font-normal font-sans pt-1">
                    &ldquo;{review.comment || review.desc || review.text}&rdquo;
                  </p>
                </div>

                {/* Card Footer: Verified Customer & Product Tag */}
                <div className="pt-3.5 flex items-center justify-between border-t border-stone-100/90 mt-4 text-[11px]">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#2D6A4F] bg-[#EBF5EE] px-2.5 py-0.5 rounded-full">
                    <svg className="w-3 h-3 fill-current text-[#2D6A4F]" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Verified Customer
                  </span>
                  <span className="text-stone-400 font-medium">
                    {review.product || 'Artisanal Care'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            {reviewsList.map((_, i) => (
              <button 
                key={i}
                type="button" 
                onClick={() => scrollToReview(i)}
                className={`review-dot h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIdx === i 
                    ? 'w-6 bg-[#1E3B2B]' 
                    : 'w-2 bg-[#C8D6C9] hover:bg-[#8DA685]'
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
