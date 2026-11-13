'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function NotFound() {
  const { addToCart, addingProductId } = useCart();

  const curatedProducts = [
    {
      id: 1,
      slug: 'manjistha-soap',
      name: 'Manjistha Soap',
      tagline: 'Deep purification & dermal radiance',
      price: 349,
      original_price: 399,
      image: '/assets/favourites_manjistha_soap_hd.png',
      badge: 'Bestseller',
    },
    {
      id: 2,
      slug: 'goat-milk-soap',
      name: 'Goat Milk Soap',
      tagline: 'Lactic acid nourishment & barrier repair',
      price: 349,
      original_price: 399,
      image: '/assets/favourites_goat_milk_soap_hd.png',
      badge: 'Gentle Care',
    },
    {
      id: 3,
      slug: 'beetroot-lip-balm',
      name: 'Beetroot Lip Balm',
      tagline: 'Pure botanical tint & 24h moisture',
      price: 249,
      original_price: 299,
      image: '/assets/favourites_lip_balm_hd.png',
      badge: 'Lip Care',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1E3B2B] font-sans selection:bg-[#235327] selection:text-white overflow-hidden">
      
      {/* =========================================================================
          HERO SECTION: 404 BOTANICAL SANCTUARY
          ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-[#E8DEC8]/60 overflow-hidden">
        {/* Soft Ambient Radial Background Glows */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] rounded-full bg-radial from-[#235327]/10 via-[#235327]/3 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute bottom-0 right-10 w-72 h-72 rounded-full bg-[#C28328]/10 blur-2xl pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF3EC] border border-[#235327]/20 text-[#235327] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 shadow-xs animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#235327] animate-ping" />
              <span>404 • Botanical Path Not Found</span>
            </div>

            {/* Giant Stylized 404 Display */}
            <div className="relative my-2 sm:my-4 flex items-center justify-center select-none">
              <span className="text-[100px] sm:text-[150px] md:text-[190px] font-serif font-black text-[#1E3B2B]/10 tracking-widest leading-none pointer-events-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img 
                  src="/assets/hero_mortar_prop_transparent.png" 
                  alt="EarthGlaze Stone Mortar & Botanical Herbs" 
                  className="w-28 sm:w-36 md:w-44 h-auto object-contain drop-shadow-[0_12px_24px_rgba(22,61,38,0.2)] transform -rotate-6 transition-transform hover:rotate-0 duration-500"
                />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1E3B2B] tracking-tight leading-tight sm:leading-tight mb-4">
              Lost in the Botanical Sanctuary?
            </h1>

            {/* Subtitle */}
            <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 font-normal">
              The herbal formulation or page you are seeking may have dissolved like pure cold-pressed oils into the earth, been renamed, or never existed. Let us guide you back to nourishment.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#235327] hover:bg-[#1b431f] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#235327]/20 hover:shadow-xl hover:shadow-[#235327]/30 transition-all duration-300 active:scale-95 group cursor-pointer"
              >
                <span>Return to Home Sanctuary</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-stone-50 text-[#1E3B2B] border border-stone-300 hover:border-[#235327] font-semibold text-sm tracking-wide shadow-xs transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <span>Explore Artisanal Shop</span>
                <span className="text-stone-400 group-hover:text-[#235327]">🛍️</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          HELPFUL PATHWAYS & QUICK NAVIGATION
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white/60 border-b border-[#E8DEC8]/50">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C28328]">
              Where would you like to go?
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3B2B] mt-1">
              Popular Botanical Destinations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Artisanal Soaps */}
            <Link
              href="/shop"
              className="p-6 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#235327] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="w-12 h-12 rounded-xl bg-[#EAF3EC] text-[#235327] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  🧼
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1E3B2B] group-hover:text-[#235327] transition-colors">
                  Artisanal Cleansers
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Cold-pressed Manjistha & Goat Milk soaps for glowing, revitalized skin.
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-[#235327] gap-1 group-hover:gap-2 transition-all">
                <span>View All Products</span>
                <span>→</span>
              </div>
            </Link>

            {/* Card 2: Our Story */}
            <Link
              href="/about"
              className="p-6 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#235327] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="w-12 h-12 rounded-xl bg-[#FAF0E6] text-[#C28328] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  🌿
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1E3B2B] group-hover:text-[#235327] transition-colors">
                  Our Natural Story
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Discover our pure Ayurvedic heritage, sustainable sourcing and handcrafted methods.
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-[#235327] gap-1 group-hover:gap-2 transition-all">
                <span>Read About Us</span>
                <span>→</span>
              </div>
            </Link>

            {/* Card 3: Botanical Blog */}
            <Link
              href="/blog"
              className="p-6 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#235327] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="w-12 h-12 rounded-xl bg-[#EAF3EC] text-[#235327] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  📖
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1E3B2B] group-hover:text-[#235327] transition-colors">
                  Botanical Journal
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Explore self-care rituals, ayurvedic beauty secrets, and clean skincare tips.
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-[#235327] gap-1 group-hover:gap-2 transition-all">
                <span>Browse Articles</span>
                <span>→</span>
              </div>
            </Link>

            {/* Card 4: Order Tracking & Support */}
            <Link
              href="/track-order"
              className="p-6 rounded-2xl bg-white border border-[#E8DEC8] hover:border-[#235327] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="w-12 h-12 rounded-xl bg-[#F0EBE1] text-stone-700 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  📦
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1E3B2B] group-hover:text-[#235327] transition-colors">
                  Track Your Order
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Looking for an existing parcel? Check live status and tracking updates right away.
                </p>
              </div>
              <div className="mt-5 flex items-center text-xs font-bold text-[#235327] gap-1 group-hover:gap-2 transition-all">
                <span>Track Package</span>
                <span>→</span>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* =========================================================================
          FEATURED SIGNATURE FORMULATIONS (DISCOVER WHILE YOU'RE HERE)
          ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#C28328]">
                Artisanal Favourites
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1E3B2B] mt-1">
                Handcrafted Formulations You’ll Adore
              </h2>
            </div>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#235327] hover:text-[#183d1c] transition-colors"
            >
              <span>View Full Shop Catalog</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {curatedProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-[#E8DEC8] hover:border-[#235327]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Card Image Banner */}
                <div className="relative p-6 sm:p-8 bg-[#FAF7F2]/60 flex items-center justify-center min-h-[220px] overflow-hidden">
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 border border-stone-200 text-[#235327] font-semibold text-[11px] shadow-xs">
                    {product.badge}
                  </span>
                  
                  <Link href={`/product?slug=${product.slug}`} className="cursor-pointer">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-36 sm:w-44 h-auto object-contain drop-shadow-[0_8px_16px_rgba(30,59,43,0.12)] group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>

                {/* Content & Actions */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#1E3B2B] group-hover:text-[#235327] transition-colors">
                      <Link href={`/product?slug=${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-4">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-stone-400 line-through mr-1.5">
                        ₹{product.original_price}
                      </span>
                      <span className="text-lg font-bold text-[#1E3B2B]">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product.id, 1)}
                      disabled={addingProductId === product.id}
                      className="px-4 py-2.5 rounded-full bg-[#235327] hover:bg-[#19401d] text-white text-xs font-bold tracking-wide transition shadow-sm hover:shadow active:scale-95 cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      <span>{addingProductId === product.id ? 'Adding...' : 'Add to Bag'}</span>
                      <span>+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          BOTANICAL VALUES ASSURANCE STRIP
          ========================================================================= */}
      <section className="py-8 bg-[#EAF3EC] border-t border-[#235327]/10">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🌿</span>
              <span className="text-xs sm:text-sm font-semibold text-[#1E3B2B]">100% Ayurvedic</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🥥</span>
              <span className="text-xs sm:text-sm font-semibold text-[#1E3B2B]">Cold-Pressed Oils</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">✨</span>
              <span className="text-xs sm:text-sm font-semibold text-[#1E3B2B]">No Harsh Chemicals</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🐰</span>
              <span className="text-xs sm:text-sm font-semibold text-[#1E3B2B]">Cruelty-Free Always</span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
