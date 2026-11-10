'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ type: 'loading', text: 'Subscribing...' });
    const res = await api.contact.subscribeNewsletter(email);
    if (res.success) {
      setStatus({ type: 'success', text: res.message || 'Subscribed successfully!' });
      setEmail('');
    } else {
      setStatus({ type: 'error', text: res.message || 'Failed to subscribe.' });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <footer className="relative bg-[#FAF7F2] text-[#1E3B2B] pt-12 sm:pt-16 pb-4 overflow-hidden font-sans border-t border-stone-200/50">
      
      {/* Top Left Organic Sage Curved Ribbon */}
      <div className="absolute top-0 left-0 w-full sm:w-3/5 h-36 sm:h-48 pointer-events-none opacity-50 z-0">
        <svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,0 C180,70 320,130 520,100 C680,75 740,30 800,0 L0,0 Z" fill="#E8F2EA" />
          <path d="M0,10 C190,80 330,140 530,110 C690,85 750,40 800,10" stroke="white" strokeWidth="2.5" opacity="0.7" fill="none" />
        </svg>
      </div>

      {/* Top Right Lush Botanical Leaves Framing */}
      <div 
        className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 pointer-events-none opacity-85 bg-no-repeat bg-contain bg-right-top z-0"
        style={{ backgroundImage: "url('/assets/banner_offer_top_leaves.png')" }}
      />

      {/* Bottom Left Lush Botanical Leaves Framing */}
      <div 
        className="absolute bottom-6 left-0 w-40 sm:w-56 h-40 sm:h-56 pointer-events-none opacity-75 bg-no-repeat bg-contain bg-left-bottom z-0"
        style={{ backgroundImage: "url('/assets/story_corner_leaves.png')" }}
      />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 items-start">
          
          {/* ================================================================
              COLUMN 1: BRAND INFO & SOCIAL ICONS (Col-span 3)
              ================================================================ */}
          <div className="lg:col-span-3 space-y-4">
            {/* Logo */}
            <div>
              <Link href="/" className="inline-block group focus-visible:outline-none">
                <img 
                  src="/assets/earthglaze-logo-hd.png" 
                  alt="EarthGlaze • Natural Skincare" 
                  className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            {/* Tagline */}
            <p className="text-stone-700 text-sm leading-relaxed max-w-xs font-normal">
              Nature-powered skincare for healthier, glowing skin.
            </p>

            {/* 4 Circular Social Icon Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/90 border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-700 hover:text-[#235327] hover:border-[#235327] hover:bg-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/90 border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-700 hover:text-[#235327] hover:border-[#235327] hover:bg-white transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/90 border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-700 hover:text-[#235327] hover:border-[#235327] hover:bg-white transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Pinterest */}
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Pinterest"
                className="w-9 h-9 rounded-full bg-white/90 border border-stone-200/90 shadow-2xs flex items-center justify-center text-stone-700 hover:text-[#235327] hover:border-[#235327] hover:bg-white transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.99-.1-2.52.02-3.61l.73-3.1s-.18-.37-.18-.92c0-.87.5-1.51 1.13-1.51.53 0 .79.4.79.88 0 .54-.34 1.34-.52 2.08-.15.62.31 1.13.92 1.13 1.1 0 1.95-1.16 1.95-2.84 0-1.48-1.07-2.52-2.59-2.52-1.77 0-2.8 1.32-2.8 2.69 0 .53.21 1.1.46 1.41.05.06.06.12.04.18l-.17.72c-.03.11-.1.15-.22.1-1-.46-1.62-1.92-1.62-3.09 0-2.51 1.83-4.82 5.27-4.82 2.77 0 4.92 1.97 4.92 4.61 0 2.75-1.73 4.96-4.14 4.96-.81 0-1.57-.42-1.83-.92l-.5 1.9c-.18.7-.67 1.57-1 2.11A11.98 11.98 0 1 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ================================================================
              COLUMN 2: QUICK LINKS (Col-span 3) - Clean without outer box
              ================================================================ */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-8 h-8 rounded-lg bg-[#EAF3EC] border border-[#235327]/15 flex items-center justify-center text-[#235327] text-sm shrink-0">
                🔗
              </span>
              <h4 className="font-sans font-bold text-base text-stone-900 tracking-tight">Quick Links</h4>
            </div>
            {/* Green underline accent */}
            <div className="w-10 h-0.5 bg-[#235327] mb-4 rounded-full"></div>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/shop" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Shop</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/ingredients" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Ingredients</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ================================================================
              COLUMN 3: CUSTOMER SUPPORT (Col-span 3) - Clean without outer box
              ================================================================ */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-8 h-8 rounded-lg bg-[#EAF3EC] border border-[#235327]/15 flex items-center justify-center text-[#235327] text-sm shrink-0">
                🎧
              </span>
              <h4 className="font-sans font-bold text-base text-stone-900 tracking-tight">Customer Support</h4>
            </div>
            {/* Green underline accent */}
            <div className="w-10 h-0.5 bg-[#235327] mb-4 rounded-full"></div>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#faq" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Help &amp; FAQs</span>
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Shipping &amp; Delivery</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Returns &amp; Refunds</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-flex items-center gap-2 text-stone-700 hover:text-[#235327] transition-colors group">
                  <span className="text-[#235327] font-bold text-xs group-hover:translate-x-0.5 transition-transform">&gt;</span>
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ================================================================
              COLUMN 4: STAY IN THE LOOP (Col-span 3) - Elegant Frosted Card
              ================================================================ */}
          <div className="lg:col-span-3 relative bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-emerald-100/90 shadow-[0_8px_30px_rgba(23,61,43,0.04)] overflow-hidden flex flex-col justify-between">
            
            {/* Card Corner Botanical Accent */}
            <div 
              className="absolute right-0 top-0 w-28 h-28 pointer-events-none opacity-40 bg-no-repeat bg-contain bg-right-top"
              style={{ backgroundImage: "url('/assets/banner_offer_top_leaves.png')" }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-lg bg-[#EAF3EC] border border-[#235327]/15 flex items-center justify-center text-[#235327] text-sm shrink-0">
                  ✉️
                </span>
                <h4 className="font-sans font-bold text-base text-stone-900 tracking-tight flex items-center gap-1.5">
                  Stay in the Loop <span className="text-amber-500 text-sm">✨</span>
                </h4>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                Get skincare tips, new launches and exclusive offers.
              </p>
            </div>

            {/* Newsletter Subscription Input Capsule */}
            <form onSubmit={handleSubscribe} className="relative z-10 flex items-center bg-white rounded-full border border-stone-200/90 p-1 pl-3.5 shadow-sm focus-within:border-[#235327] focus-within:ring-2 focus-within:ring-[#235327]/10 transition-all">
              <svg className="w-4 h-4 text-stone-400 shrink-0 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none pr-2"
              />
              <button 
                type="submit" 
                disabled={status?.type === 'loading'}
                className="shrink-0 bg-[#0D2D1C] hover:bg-[#1b4520] active:scale-95 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 inline-flex items-center gap-1.5 shadow-sm disabled:opacity-70"
              >
                <span>{status?.type === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                <span>&rarr;</span>
              </button>
            </form>
            {status && (
              <p className={`text-xs mt-2 font-medium ${status.type === 'success' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {status.text}
              </p>
            )}

          </div>

        </div>

        {/* ====================================================================
            FLOATING TRUST BADGES CAPSULE PILL BAR
            ==================================================================== */}
        <div className="mb-8 sm:mb-10">
          <div className="bg-[#FAF5ED]/95 backdrop-blur-md rounded-full shadow-[0_4px_24px_rgba(23,61,43,0.03)] border border-stone-200/80 py-3.5 sm:py-4 px-6 sm:px-12 max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-stone-800">
              
              {/* Badge 1: 100% Natural */}
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <svg className="w-5 h-5 text-[#235327] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 1-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9a9 9 0 0 1-9 9zm0-18v18m0-9c-2.5 0-4.5-2-4.5-4.5S9.5 5 12 5"/>
                </svg>
                <span>100% Natural</span>
              </div>

              <span className="text-stone-300 hidden sm:inline">|</span>

              {/* Badge 2: Ayurvedic Formulation */}
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <svg className="w-5 h-5 text-[#235327] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a7 7 0 01-7 7m7-7a7 7 0 00-7-7m-7 7a7 7 0 007 7m-7-7a7 7 0 017-7m7 14v4m-4-2h8"/>
                </svg>
                <span>Ayurvedic Formulation</span>
              </div>

              <span className="text-stone-300 hidden sm:inline">|</span>

              {/* Badge 3: No Harsh Chemicals */}
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <svg className="w-5 h-5 text-[#235327] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                <span>No Harsh Chemicals</span>
              </div>

              <span className="text-stone-300 hidden sm:inline">|</span>

              {/* Badge 4: Cruelty Free */}
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <svg className="w-5 h-5 text-[#235327] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span>Cruelty Free</span>
              </div>

            </div>
          </div>
        </div>

        {/* ====================================================================
            COPYRIGHT BAR WITH HORIZONTAL ACCENT DIVIDERS
            ==================================================================== */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs text-stone-500 font-medium py-3 text-center">
          <span className="w-8 sm:w-16 h-px bg-stone-300/80 rounded-full"></span>
          <span>&copy; 2025 EarthGlaze. All Rights Reserved.</span>
          <span className="w-8 sm:w-16 h-px bg-stone-300/80 rounded-full"></span>
        </div>

      </div>

      {/* Very subtle soft bottom green organic blur */}
      <div className="w-full overflow-hidden leading-none pointer-events-none mt-1 opacity-40">
        <svg viewBox="0 0 1440 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-3 sm:h-5" preserveAspectRatio="none">
          <path d="M0,20 C420,5 1020,5 1440,20 L1440,20 L0,20 Z" fill="#E8F2EA" />
        </svg>
      </div>

    </footer>
  );
}
