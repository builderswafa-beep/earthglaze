'use client';

import React from 'react';
import { useSiteContent } from '../hooks/useSiteContent';

export default function TrustBadgeStrip() {
  const { getSection } = useSiteContent();
  const trustData = getSection('home', 'trust_strip');

  const defaultTrustFeatures = [
    {
      id: 'natural-ingredients',
      title: '100% Natural',
      subtitle: 'Ingredients',
      icon: (
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#163D26] transition-all duration-300 group-hover/badge:scale-115 group-hover/badge:-rotate-6 group-hover/badge:text-[#0E2C1B]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.9" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 4c-5-.5-10.5 2-13.5 5-3.5 3.5-4 8.5-2 11 2.5 2 7.5 1.5 11-2 3-3 5.5-8.5 5-13.5-.5-.5-.5-.5-.5-.5z" />
          <path d="M5.5 18.5c4-4 8.5-7 14-8.5" />
          <path d="M12 13c1.5 1.5 3 2.5 4.5 3" />
        </svg>
      ),
    },
    {
      id: 'handmade-care',
      title: 'Handmade',
      subtitle: 'with Care',
      icon: (
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#163D26] transition-all duration-300 group-hover/badge:scale-115 group-hover/badge:rotate-6 group-hover/badge:text-[#0E2C1B]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.9" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 11h16c0 4.8-2.6 8.5-8 8.5S4 15.8 4 11z" />
          <path d="M8.5 19.5h7" />
          <path d="M16.5 4.5 12 11" />
          <circle cx="16.5" cy="4.5" r="1.3" fill="currentColor" />
          <path d="M3 11h18" strokeWidth="2.2" />
        </svg>
      ),
    },
    {
      id: 'skin-friendly',
      title: 'Skin-Friendly',
      subtitle: 'Formulations',
      icon: (
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#163D26] transition-all duration-300 group-hover/badge:scale-115 group-hover/badge:-rotate-6 group-hover/badge:text-[#0E2C1B]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.9" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2.5C12 2.5 5.5 9.8 5.5 15A6.5 6.5 0 0 0 12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-5.2-6.5-12.5-6.5-12.5z" />
          <path d="M12 18v-5" />
          <path d="M12 15.5c-1.8-1.5-3.8-.8-4.2.8 1.8 1.5 3.8.8 4.2-.8z" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 14c1.8-1.5 3.8-.8 4.2.8-1.8 1.5-3.8.8-4.2-.8z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      ),
    },
    {
      id: 'nature-inspired',
      title: 'Nature-Inspired',
      subtitle: 'Products',
      icon: (
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#163D26] transition-all duration-500 group-hover/badge:scale-115 group-hover/badge:rotate-90 group-hover/badge:text-[#0E2C1B]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.9" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="2.8" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 3.5a1.8 1.8 0 0 1 1.8 1.8v1.6a1.8 1.8 0 0 1-3.6 0V5.3A1.8 1.8 0 0 1 12 3.5z" />
          <path d="M12 15.3a1.8 1.8 0 0 1 1.8 1.8v1.6a1.8 1.8 0 0 1-3.6 0v-1.6a1.8 1.8 0 0 1 1.8-1.8z" />
          <path d="M3.5 12a1.8 1.8 0 0 1 1.8-1.8h1.6a1.8 1.8 0 0 1 0 3.6H5.3A1.8 1.8 0 0 1 3.5 12z" />
          <path d="M15.3 12a1.8 1.8 0 0 1 1.8-1.8h1.6a1.8 1.8 0 0 1 0 3.6h-1.6a1.8 1.8 0 0 1-1.8-1.8z" />
          <path d="M6 6a1.8 1.8 0 0 1 2.5 0l1.1 1.1a1.8 1.8 0 0 1-2.5 2.5L6 8.5A1.8 1.8 0 0 1 6 6z" />
          <path d="M14.4 14.4a1.8 1.8 0 0 1 2.5 0l1.1 1.1a1.8 1.8 0 0 1-2.5 2.5L14.4 17a1.8 1.8 0 0 1 0-2.6z" />
          <path d="M16.9 6a1.8 1.8 0 0 1 0 2.5l-1.1 1.1a1.8 1.8 0 0 1-2.5-2.5L14.4 6a1.8 1.8 0 0 1 2.5 0z" />
          <path d="M8.5 14.4a1.8 1.8 0 0 1 0 2.5L7.4 18a1.8 1.8 0 0 1-2.5-2.5l1.1-1.1a1.8 1.8 0 0 1 2.5 0z" />
        </svg>
      ),
    },
  ];

  const trustFeatures = (Array.isArray(trustData.points) && trustData.points.length > 0)
    ? trustData.points.map((pt, idx) => ({
        id: `trust-pt-${pt.id || idx}`,
        title: pt.title || pt.text || '',
        subtitle: pt.subtitle || pt.desc || '',
        icon: defaultTrustFeatures[idx % defaultTrustFeatures.length]?.icon || (
          <span className="text-xl">{pt.icon || '🌿'}</span>
        ),
      }))
    : defaultTrustFeatures;

  return (
    <section 
      id="trust-strip" 
      className="w-full relative z-20 -mt-2 sm:-mt-3 pt-0 pb-3 sm:pb-5 bg-[#FAF7F2] select-none"
      aria-label="EarthGlaze Natural Skincare Commitments"
    >
      <div className="max-w-[1460px] mx-auto px-3 sm:px-6 lg:px-10">
        
        {/* Master Botanical Trust Ribbon Card */}
        <div className="group relative w-full overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-full border border-[#D0E3D3] bg-gradient-to-r from-[#EFF6EE] via-[#F6FAF4] to-[#EFF6EE] shadow-[0_6px_25px_-8px_rgba(22,61,38,0.12)] hover:shadow-[0_12px_35px_-8px_rgba(22,61,38,0.18)] transition-all duration-500 hover:-translate-y-0.5">
          
          {/* Subtle Organic Wavy Background Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden" aria-hidden="true">
            <svg className="w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none">
              <path d="M0,28 C250,55 450,10 700,38 C950,65 1100,20 1200,35 L1200,80 L0,80 Z" fill="#E2EFE4" />
              <path d="M0,45 C200,20 400,60 680,25 C920,60 1080,30 1200,50 L1200,80 L0,80 Z" fill="#D6E8D9" fillOpacity="0.4" />
            </svg>
          </div>

          {/* Left Decorative Fresh Botanical Leaves */}
          <div className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none z-10 w-14 sm:w-20 md:w-24 opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
            <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xs">
              <path d="M0 40 C 25 35, 45 15, 60 0 C 50 20, 45 35, 30 42 C 20 46, 10 44, 0 40 Z" fill="#4B8B3B" />
              <path d="M0 45 C 30 45, 55 55, 75 42 C 55 58, 40 65, 20 60 C 10 58, 0 52, 0 45 Z" fill="#3D7330" />
              <path d="M0 38 C 35 30, 65 25, 85 10 C 70 30, 50 42, 25 45 C 10 47, 0 42, 0 38 Z" fill="#67AA4F" fillOpacity="0.85" />
              <path d="M15 48 C 35 52, 50 68, 55 80 C 42 72, 32 62, 22 55 Z" fill="#52943A" />
            </svg>
          </div>

          {/* Right Decorative Fresh Botanical Leaves */}
          <div className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 pointer-events-none select-none z-10 w-14 sm:w-20 md:w-24 opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
            <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xs transform scale-x-[-1]">
              <path d="M0 40 C 25 35, 45 15, 60 0 C 50 20, 45 35, 30 42 C 20 46, 10 44, 0 40 Z" fill="#4B8B3B" />
              <path d="M0 45 C 30 45, 55 55, 75 42 C 55 58, 40 65, 20 60 C 10 58, 0 52, 0 45 Z" fill="#3D7330" />
              <path d="M0 38 C 35 30, 65 25, 85 10 C 70 30, 50 42, 25 45 C 10 47, 0 42, 0 38 Z" fill="#67AA4F" fillOpacity="0.85" />
              <path d="M15 48 C 35 52, 50 68, 55 80 C 42 72, 32 62, 22 55 Z" fill="#52943A" />
            </svg>
          </div>

          {/* 4 Interactive Badges in Horizontal Row */}
          <div className="relative z-20 py-3.5 sm:py-4 md:py-5 px-3 sm:px-8 md:px-16 flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3.5 gap-x-2">
            {trustFeatures.map((item, idx) => (
              <React.Fragment key={item.id}>
                {/* Badge Item with Staggered Entrance & Interactive Hover */}
                <div 
                  className={`group/badge flex-1 min-w-[125px] sm:min-w-[160px] md:min-w-0 flex items-center justify-center gap-2 sm:gap-3.5 px-1.5 sm:px-3 py-1.5 rounded-2xl sm:rounded-full hover:bg-white/80 transition-all duration-300 cursor-default stagger-${idx + 1}`}
                >
                  {/* Round Green Border Icon Container */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-[1.8px] border-[#163D26] bg-white flex items-center justify-center shrink-0 shadow-2xs transition-all duration-300 group-hover/badge:border-[#C28328] group-hover/badge:scale-108 group-hover/badge:shadow-[0_4px_16px_rgba(22,61,38,0.22)]">
                    {item.icon}
                  </div>

                  {/* Two-Line Bold Botanical Text */}
                  <div className="text-left leading-tight">
                    <div className="font-bold text-[12px] sm:text-[13px] md:text-[14px] text-[#163D26] tracking-tight group-hover/badge:text-[#0D2617] transition-colors whitespace-nowrap">
                      {item.title}
                    </div>
                    <div className="font-semibold text-[11px] sm:text-[12px] md:text-[13px] text-[#1F4930] tracking-tight group-hover/badge:text-[#0D2617] transition-colors whitespace-nowrap">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Vertical Divider Line between items (hidden on small wraps or last item) */}
                {idx < trustFeatures.length - 1 && (
                  <div 
                    className="hidden md:block w-[1px] h-8 bg-[#CBDED0] shrink-0" 
                    aria-hidden="true" 
                  />
                )}
              </React.Fragment>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
