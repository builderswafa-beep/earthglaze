'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function ComboOffer() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const products = [
    {
      num: '01',
      id: 1,
      name: 'Manjistha Soap',
      weight: '100 g',
      benefit: 'Purifies & brightens skin',
      tag: 'Detoxifying Bar',
    },
    {
      num: '02',
      id: 2,
      name: 'Goat Milk Soap',
      weight: '100 g',
      benefit: 'Deep creamy nourishment',
      tag: 'Moisturizing Bar',
    },
    {
      num: '03',
      id: 3,
      name: 'Beet Root Lip Balm',
      weight: '10 g',
      benefit: 'Soft glossy rosy tint',
      tag: 'Hydrating Tint',
    },
  ];

  return (
    <section id="offer" className="py-6 sm:py-8 lg:py-10 bg-[#FAF7F2] overflow-hidden" aria-label="Botanical Combo Offer">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Master Botanical Combo Banner Card */}
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#E7DEC8] bg-gradient-to-r from-[#FAF6EE] via-[#F8F2E7] to-[#F5ECE0] shadow-[0_10px_35px_-12px_rgba(140,110,60,0.12)]">
          
          <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
            
            {/* Left Content Column */}
            <div className="w-full lg:w-[50%] xl:w-[48%] p-6 sm:p-9 lg:p-11 xl:p-12 space-y-4 sm:space-y-5 text-left flex flex-col justify-center shrink-0">
              
              {/* Top Tag: SIGNATURE GIFT TRIO */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4E8] border border-[#EADBBD] text-[#8C6C38] text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6C38]"></span>
                  <span>SIGNATURE GIFT TRIO</span>
                </div>
              </div>

              {/* Main Headline: The Botanical Combo Offer */}
              <div className="space-y-0.5">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[48px] font-bold text-[#163D26] tracking-tight leading-[1.12]">
                  The Botanical Combo
                </h2>
                <div className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[48px] font-normal text-[#C28328] leading-[1.12]">
                  Offer
                </div>
              </div>

              {/* Paragraph Description */}
              <p className="text-stone-600 text-xs sm:text-sm lg:text-[14px] leading-relaxed max-w-lg">
                Complete Natural Care Set — Pure botanical formulations crafted for daily glow, softness, and care.
              </p>

              {/* Inside The Ritual - 3 Inspection Cards */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] font-bold tracking-[0.16em] uppercase">
                  <span className="text-stone-500">INSIDE THE RITUAL</span>
                  <span className="text-stone-400 font-medium tracking-[0.14em]">TAP TO INSPECT</span>
                </div>

                {/* 3 Item Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {products.map((item) => {
                    const isSelected = selectedProduct === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedProduct(isSelected ? null : item.id)}
                        className={`group relative p-3 rounded-xl border transition-all duration-300 cursor-pointer select-none text-left ${
                          isSelected 
                            ? 'bg-white border-[#163D26] shadow-sm ring-1 ring-[#163D26]/20' 
                            : 'bg-white/80 hover:bg-white border-[#E9DFCE] hover:border-[#163D26]/40 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 mb-1">
                          <span className="group-hover:text-[#163D26] transition-colors">{item.num}</span>
                          <span className="text-stone-400 text-[10.5px]">{item.weight}</span>
                        </div>
                        <h4 className="font-bold text-stone-800 text-xs sm:text-[13px] leading-snug group-hover:text-[#163D26] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[10.5px] text-stone-500 leading-tight mt-0.5">
                          {item.benefit}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & CTA Button Row */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E8DEC8]/60">
                {/* Price Cluster */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-[#163D26] tracking-tight">
                      ₹799
                    </span>
                    <span className="text-sm sm:text-base text-stone-400 line-through font-normal">
                      ₹898
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E3EFE5] text-[#1E6B35] border border-[#CFE5D4] text-[11px] font-bold tracking-tight">
                      Save ₹99 (11% OFF)
                    </span>
                  </div>
                  <div className="text-[10.5px] sm:text-[11px] font-medium text-stone-500 tracking-tight flex items-center gap-1.5 flex-wrap">
                    <span>Herbal Care</span>
                    <span className="text-stone-300">•</span>
                    <span>Gentle &amp; Safe</span>
                    <span className="text-stone-300">•</span>
                    <span>No Harsh Chemicals</span>
                  </div>
                </div>

                {/* Buy Combo Now CTA Button */}
                <button
                  id="grab-offer-btn"
                  type="button"
                  onClick={handleBuyCombo}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 sm:px-7 rounded-full bg-[#163D26] hover:bg-[#112F1D] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer disabled:opacity-75 whitespace-nowrap shrink-0"
                  aria-label="Buy Combo Now for ₹799"
                >
                  {/* Shopping Bag Icon */}
                  <svg className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{loading ? 'Adding Combo...' : 'Buy Combo Now'}</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </button>
              </div>

            </div>

            {/* Right Product Showcase Visual Column */}
            <div className="w-full lg:w-[50%] xl:w-[52%] flex items-center justify-center lg:justify-end relative select-none">
              <div className="relative w-full h-full flex items-center justify-center lg:justify-end">
                <img
                  src="/assets/botanical_combo_hero_trio.png"
                  alt="EarthGlaze Botanical Combo Offer - Manjistha Soap, Goat Milk Soap and Beet Root Lip Balm on luxury ribbon pedestal"
                  className="w-full h-auto max-h-[360px] sm:max-h-[420px] lg:max-h-[480px] xl:max-h-[520px] object-contain object-right transform hover:scale-[1.015] transition-transform duration-500 drop-shadow-sm pointer-events-none"
                  loading="eager"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
