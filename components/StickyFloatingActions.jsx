'use client';

import React, { useState, useEffect } from 'react';

export default function StickyFloatingActions() {
  const [mounted, setMounted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Trigger entrance spring animation after brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Monitor scroll position for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const whatsappMessage = encodeURIComponent(
    'Hi EarthGlaze! I would like to know more about your botanical skincare products.'
  );
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <div 
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-none select-none transition-all duration-700 ${
        mounted ? 'animate-floating-entrance' : 'opacity-0 translate-y-8 scale-75'
      }`}
      aria-label="Floating quick actions"
    >
      {/* 1. Back to Top Button with Smooth Arrow Bounce on Hover */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`back-to-top-btn pointer-events-auto group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#163D26] hover:bg-[#0F2B1B] text-white shadow-lg hover:shadow-2xl border border-[#D5C7B0]/40 flex items-center justify-center transition-all duration-300 transform cursor-pointer active:scale-95 ${
          showBackToTop 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
        }`}
        aria-label="Scroll back to top"
      >
        {/* Upward Arrow Icon with Hover Bounce */}
        <svg 
          className="arrow-icon w-5 h-5 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.4" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>

        {/* Hover Tooltip (Desktop) */}
        <span className="hidden sm:block absolute right-full mr-3 px-2.5 py-1 rounded-md bg-[#163D26] text-white text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Back to top
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-[#163D26]"></span>
        </span>
      </button>

      {/* 2. WhatsApp Sticky Floating Button with Entrance & Wiggle Hover */}
      <div className="relative pointer-events-auto group flex items-center">
        {/* Desktop Tooltip Bubble */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 absolute right-full mr-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#0D3B23] border border-[#CDE3D1] text-xs font-semibold shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>Chat with us</span>
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-white"></span>
        </a>

        {/* WhatsApp Circular Button with Wiggle Icon */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.65)] flex items-center justify-center transition-all duration-300 transform hover:scale-108 active:scale-95 cursor-pointer"
          aria-label="Chat with EarthGlaze support on WhatsApp"
        >
          {/* Subtle Pulse Animation Wave */}
          <span 
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" 
            style={{ animationDuration: '2.8s' }}
          />

          {/* Official WhatsApp SVG Icon with Wiggle Hover Animation */}
          <svg 
            className="whatsapp-icon w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform duration-300" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
