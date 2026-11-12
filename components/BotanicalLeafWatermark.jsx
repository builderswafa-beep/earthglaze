'use client';

import React from 'react';

/**
 * BotanicalLeafWatermark:
 * Delicate 2D botanical leaf silhouette watermarks with low transparency (8-14%)
 * placed in between sections to give an organic luxury Ayurvedic spa atmosphere.
 */
export default function BotanicalLeafWatermark({ position = 'left', className = '' }) {
  const isRight = position === 'right';

  return (
    <div 
      className={`relative w-full max-w-[1600px] mx-auto h-0 pointer-events-none select-none z-0 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <div 
        className={`absolute -top-12 sm:-top-16 ${
          isRight ? 'right-0 sm:right-2 md:right-6 lg:right-10' : 'left-0 sm:left-2 md:left-6 lg:left-10'
        } opacity-[0.09] sm:opacity-[0.12] transition-opacity duration-700 text-[#163D26]`}
      >
        <svg 
          className={`w-28 sm:w-40 md:w-52 lg:w-64 h-auto drop-shadow-2xs ${isRight ? 'scale-x-[-1]' : ''}`} 
          viewBox="0 0 180 240" 
          fill="currentColor"
        >
          {/* Elegant 2D curved botanical branch */}
          <path 
            d="M20,230 Q65,160 130,30" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* Terminal top leaf */}
          <path d="M130,30 C155,10 170,0 170,0 C170,0 155,25 135,45 C125,35 128,25 130,30 Z" />
          {/* Leaf pair 1 */}
          <path d="M105,75 C140,55 160,50 160,50 C160,50 138,78 110,85 C102,78 103,72 105,75 Z" />
          <path d="M85,115 C50,95 35,85 35,85 C35,85 60,110 82,125 C88,118 86,114 85,115 Z" />
          {/* Leaf pair 2 */}
          <path d="M68,155 C100,145 120,145 120,145 C120,145 95,168 68,165 C64,158 66,155 68,155 Z" />
          <path d="M48,185 C20,175 10,170 10,170 C10,170 32,190 48,195 C50,188 48,185 48,185 Z" />
          {/* Delicate leaf accents */}
          <circle cx="115" cy="55" r="1.5" />
          <circle cx="60" cy="135" r="1.5" />
        </svg>
      </div>
    </div>
  );
}
