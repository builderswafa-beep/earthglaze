'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BlogPostDetail({ params }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E3B2B] font-sans overflow-x-hidden selection:bg-[#235327] selection:text-white relative">
      
      {/* Decorative Corner Foliage Accents */}
      <img 
        src="/assets/banner_offer_top_leaves.png" 
        alt="" 
        className="absolute top-0 right-0 w-44 sm:w-64 lg:w-72 pointer-events-none select-none opacity-85 z-0" 
        aria-hidden="true" 
      />
      <img 
        src="/assets/contact_card_leaves.png" 
        alt="" 
        className="absolute bottom-4 right-0 w-48 sm:w-72 lg:w-80 pointer-events-none select-none opacity-85 z-0" 
        aria-hidden="true" 
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 relative z-10">
        
        {/* =========================================================================
            BREADCRUMBS
            ========================================================================= */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6 font-sans">
          <Link href="/" className="hover:text-[#235327] transition-colors">Home</Link>
          <span className="text-stone-400">&rsaquo;</span>
          <Link href="/blog" className="hover:text-[#235327] transition-colors">Blog</Link>
          <span className="text-stone-400">&rsaquo;</span>
          <span className="text-[#1E3B2B] font-medium truncate max-w-[220px] sm:max-w-md">
            A Natural Skincare Routine with EarthGlanze Essentials
          </span>
        </nav>

        {/* =========================================================================
            MAIN 2-COLUMN EDITORIAL GRID
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: MAIN ARTICLE (65% width / 8 cols)
              ========================================================================= */}
          <article className="lg:col-span-8 space-y-6">
            
            {/* Category Pill Tag */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF4EB] text-[#235327] text-xs sm:text-sm font-semibold tracking-wide">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12 5-2 1.5-3 3.5-3 3.5 3 0 7-4 7-9z"/>
                </svg>
                <span>Skincare Routine</span>
              </div>
            </div>

            {/* Article Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-bold text-[#1E3B2B] tracking-tight leading-[1.14]">
                A Natural Skincare Routine <br className="hidden sm:inline" />
                with <span className="italic font-normal text-[#C28328]">EarthGlanze Essentials</span>
              </h1>
            </div>

            {/* Subtitle / Excerpt */}
            <p className="text-base sm:text-lg text-[#404F44] leading-relaxed max-w-2xl font-sans">
              A simple, natural routine using our Manjistha Soap, Goat Milk Soap and Beetroot Lip Balm for clean, nourished and healthy skin.
            </p>

            {/* Meta Bar: Date & Read Time */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-500 font-sans pb-2">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Jun 10, 2025</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>5 min read</span>
              </div>
            </div>

            {/* Main Hero Photograph Card */}
            <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#E8DEC8]/80 shadow-[0_8px_30px_rgba(23,61,43,0.06)] bg-[#EDE5D8] group">
              <img 
                src="/assets/blog_detail_trio_hero_hd.png" 
                alt="EarthGlanze Natural Skincare Essentials - Manjistha Soap, Goat Milk Soap and Beetroot Lip Balm stacked on textured sandstone pedestal" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                width="960"
                height="572"
              />
            </div>

            {/* Intro Narrative */}
            <p className="text-[#374151] text-sm sm:text-base lg:text-[17px] leading-relaxed font-normal pt-2">
              Healthy, radiant skin doesn&apos;t always need a complicated routine. With the right natural care, you can keep your skin clean, nourished and protected. Here&apos;s a simple daily routine using EarthGlanze&apos;s three natural essentials.
            </p>

            {/* Section Sub-heading with Divider */}
            <div className="flex items-center gap-4 pt-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3B2B] whitespace-nowrap">
                Your Everyday <span className="italic font-normal text-[#C28328]">Natural Routine</span>
              </h2>
              <span className="w-16 sm:w-28 h-px bg-[#1E3B2B]/30 rounded-full" aria-hidden="true" />
            </div>

            {/* 3-Step Routine Columns (Cleanse, Nourish, Protect) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-2">
              
              {/* Step 1: Cleanse */}
              <div className="flex flex-col items-center text-center p-4 group cursor-default">
                <div className="w-15 h-15 rounded-full bg-[#E8F3E8] flex items-center justify-center text-[#1E3B2B] mb-3 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0l3 3m-3-3l-3 3"/>
                    <circle cx="9" cy="9" r="1.2" fill="currentColor"/>
                    <circle cx="15" cy="15" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-[#1E3B2B] mb-1.5 font-sans">Cleanse</h3>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed max-w-[200px]">
                  Deeply cleanse and purify with Manjistha Soap.
                </p>
              </div>

              {/* Step 2: Nourish */}
              <div className="flex flex-col items-center text-center p-4 group cursor-default">
                <div className="w-15 h-15 rounded-full bg-[#E8F3E8] flex items-center justify-center text-[#1E3B2B] mb-3 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-[#1E3B2B] mb-1.5 font-sans">Nourish</h3>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed max-w-[200px]">
                  Keep your skin soft and hydrated with Goat Milk Soap.
                </p>
              </div>

              {/* Step 3: Protect */}
              <div className="flex flex-col items-center text-center p-4 group cursor-default">
                <div className="w-15 h-15 rounded-full bg-[#E8F3E8] flex items-center justify-center text-[#1E3B2B] mb-3 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2.5-3 6-5 9-5s6.5 2 9 5c-2.5 3-6 5-9 5s-6.5-2-9-5z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12c3 1.5 5 2 7.5 2s4.5-.5 7.5-2"/>
                  </svg>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-[#1E3B2B] mb-1.5 font-sans">Protect</h3>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed max-w-[200px]">
                  Lock in moisture and keep your lips naturally healthy with Beetroot Lip Balm.
                </p>
              </div>

            </div>

            {/* Inline Promotional Banner: Shop Our Natural Essentials */}
            <div className="rounded-[24px] sm:rounded-[32px] bg-[#FAF5ED] border border-[#E8DEC8] p-6 sm:p-8 shadow-sm overflow-hidden relative group">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-7 space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3B2B] leading-tight">
                    Shop Our <span className="italic font-normal text-[#C28328]">Natural Essentials</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                    Explore EarthGlaze&apos;s natural skincare range, crafted for healthy, glowing skin.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0D2D1C] hover:bg-[#1a4628] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-300"
                    >
                      <span>Shop Now</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>

                <div className="sm:col-span-5 flex justify-center sm:justify-end">
                  <img
                    src="/assets/blog_detail_banner_trio_hd.png"
                    alt="EarthGlaze Natural Essentials Trio"
                    className="w-full max-w-[320px] h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Article Tags Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-stone-200/60 font-sans">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3B2B] mr-1">
                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                <span>Tags:</span>
              </div>
              {['Natural Skincare', 'Daily Routine', 'EarthGlanze', 'Skin Care Tips'].map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs font-medium text-[#1E3B2B] bg-[#FAF5ED] border border-[#E8DEC8] px-3.5 py-1.5 rounded-full hover:bg-[#EAF4EB] hover:border-emerald-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

          </article>

          {/* =========================================================================
              RIGHT COLUMN: SIDEBAR (35% width / 4 cols)
              ========================================================================= */}
          <aside className="lg:col-span-4 space-y-8 lg:pl-2">
            
            {/* Widget 1: Search */}
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog articles..."
                className="w-full bg-white rounded-full border border-stone-200/90 pl-5 pr-12 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#235327] shadow-sm font-sans"
              />
              <button 
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0D2D1C] hover:bg-[#1a4628] active:scale-95 text-white flex items-center justify-center transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>

            {/* Widget 2: Related Articles */}
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1E3B2B] mb-5">
                Related Articles
              </h3>
              
              <div className="space-y-4">
                
                {/* Related Article 1 */}
                <Link 
                  href="/blog/why-choose-natural-soaps" 
                  className="flex items-center gap-3.5 group cursor-pointer"
                >
                  <img 
                    src="/assets/blog_rel_soaps_perfect.png" 
                    alt="Why Choose Natural Soaps" 
                    className="w-20 h-16 sm:w-22 sm:h-16 rounded-2xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#1E3B2B] group-hover:text-[#2E6B3E] transition leading-snug font-sans">
                      Why Choose Natural Soaps for Your Skin?
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>May 28, 2025</span>
                    </div>
                  </div>
                </Link>

                {/* Related Article 2 */}
                <Link 
                  href="/blog/beetroot-radiant-lips" 
                  className="flex items-center gap-3.5 group cursor-pointer"
                >
                  <img 
                    src="/assets/blog_rel_beetroot_perfect.png" 
                    alt="The Skincare Benefits of Beetroot" 
                    className="w-20 h-16 sm:w-22 sm:h-16 rounded-2xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#1E3B2B] group-hover:text-[#2E6B3E] transition leading-snug font-sans">
                      The Skincare Benefits of Beetroot
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>May 20, 2025</span>
                    </div>
                  </div>
                </Link>

                {/* Related Article 3 */}
                <Link 
                  href="/blog/goat-milk-skin-benefits" 
                  className="flex items-center gap-3.5 group cursor-pointer"
                >
                  <img 
                    src="/assets/blog_rel_goatmilk_perfect.png" 
                    alt="How Goat Milk Nourishes Your Skin Naturally" 
                    className="w-20 h-16 sm:w-22 sm:h-16 rounded-2xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#1E3B2B] group-hover:text-[#2E6B3E] transition leading-snug font-sans">
                      How Goat Milk Nourishes Your Skin Naturally
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>May 12, 2025</span>
                    </div>
                  </div>
                </Link>

              </div>
            </div>

            {/* Widget 3: Stay Updated Newsletter Card */}
            <div className="rounded-[28px] bg-gradient-to-br from-[#1C4E2A] via-[#154122] to-[#0D2D1C] text-white p-6 sm:p-7 relative overflow-hidden shadow-md">
              {/* Corner leaf accent */}
              <img 
                src="/assets/contact_card_leaves.png" 
                alt="" 
                className="absolute -top-3 -right-3 w-28 h-auto opacity-50 pointer-events-none select-none"
                aria-hidden="true" 
              />

              <div className="relative z-10 space-y-3.5">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                    <line x1="16" y1="8" x2="2" y2="22"/>
                    <line x1="17.5" y1="15" x2="9" y2="15"/>
                  </svg>
                  <h3 className="font-serif italic text-2xl text-white font-normal">
                    Stay Updated ✨
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed font-sans">
                  Get skincare tips, natural care routines and exclusive updates from EarthGlaze.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-2.5 pt-1">
                  <div className="relative">
                    <svg className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-white text-stone-800 placeholder-stone-400 pl-11 pr-4 py-2.5 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#DDF2D1] via-[#E7F6DC] to-[#D4EDC6] hover:brightness-105 active:scale-98 text-[#12381F] font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {subscribed ? '✓ Subscribed!' : 'Subscribe →'}
                  </button>
                </form>
              </div>
            </div>

            {/* Widget 4: Our Products */}
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1E3B2B] mb-5">
                Our Products
              </h3>
              
              <div className="space-y-3">
                
                {/* Product 1: Manjistha Soap */}
                <Link 
                  href="/shop"
                  className="flex items-center justify-between py-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <img 
                      src="/assets/blog_prod_manjistha_bar_hd.png" 
                      alt="Manjistha Soap" 
                      className="w-14 h-11 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#1E3B2B] group-hover:text-[#235327] transition font-sans">
                        Manjistha Soap
                      </h4>
                      <p className="text-xs text-stone-500 font-sans">
                        Purifies and refreshes your skin naturally.
                      </p>
                    </div>
                  </div>
                  <span 
                    className="w-8 h-8 rounded-full bg-[#E5F0E6] group-hover:bg-[#0D2D1C] text-[#1E3B2B] group-hover:text-white flex items-center justify-center text-xs transition duration-300 shrink-0 ml-2"
                    aria-label="View Manjistha Soap in Shop"
                  >
                    &rarr;
                  </span>
                </Link>

                {/* Product 2: Goat Milk Soap */}
                <Link 
                  href="/shop"
                  className="flex items-center justify-between py-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <img 
                      src="/assets/blog_prod_goatmilk_bar_hd.png" 
                      alt="Goat Milk Soap" 
                      className="w-14 h-11 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#1E3B2B] group-hover:text-[#235327] transition font-sans">
                        Goat Milk Soap
                      </h4>
                      <p className="text-xs text-stone-500 font-sans">
                        Gently cleanses and keeps your skin soft and nourished.
                      </p>
                    </div>
                  </div>
                  <span 
                    className="w-8 h-8 rounded-full bg-[#E5F0E6] group-hover:bg-[#0D2D1C] text-[#1E3B2B] group-hover:text-white flex items-center justify-center text-xs transition duration-300 shrink-0 ml-2"
                    aria-label="View Goat Milk Soap in Shop"
                  >
                    &rarr;
                  </span>
                </Link>

                {/* Product 3: Beetroot Lip Balm */}
                <Link 
                  href="/shop"
                  className="flex items-center justify-between py-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <img 
                      src="/assets/blog_prod_lipbalm_tin_hd.png" 
                      alt="Beetroot Lip Balm" 
                      className="w-14 h-11 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#1E3B2B] group-hover:text-[#235327] transition font-sans">
                        Beetroot Lip Balm
                      </h4>
                      <p className="text-xs text-stone-500 font-sans">
                        Naturally nourishes and keeps your lips soft, smooth and healthy.
                      </p>
                    </div>
                  </div>
                  <span 
                    className="w-8 h-8 rounded-full bg-[#E5F0E6] group-hover:bg-[#0D2D1C] text-[#1E3B2B] group-hover:text-white flex items-center justify-center text-xs transition duration-300 shrink-0 ml-2"
                    aria-label="View Beetroot Lip Balm in Shop"
                  >
                    &rarr;
                  </span>
                </Link>

              </div>
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}
