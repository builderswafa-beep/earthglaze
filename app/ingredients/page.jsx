'use client';

import React from 'react';
import Link from 'next/link';

export default function IngredientsPage() {
  return (
    <div className="w-full min-h-screen">


  {/* Banner */}
  <section className="bg-gradient-to-b from-[#F3EDE2] to-[#FAF7F2] py-12 border-b border-[#E8DEC8] text-center">
    <div className="max-w-[1440px] mx-auto px-4">
      <span className="text-xs uppercase font-bold tracking-[0.25em] text-emerald-800">Raw & Unrefined Actives</span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E3B2B] tracking-tight mt-1 mb-3">Our Ingredients</h1>
      <p className="max-w-2xl mx-auto text-stone-600 text-sm sm:text-base font-serif italic">Nature's Best for Your Skin. Sustainably harvested botanicals that work in harmony with your dermal biome.</p>
    </div>
  </section>

  {/* 4 Botanical Cards matching Portfolio Reference */}
  <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Card 1: Manjistha */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8DEC8] flex flex-col justify-between text-center group hover:shadow-xl transition-all">
        <div>
          <div className="w-full aspect-square bg-[#FAF7F2] rounded-2xl p-4 flex items-center justify-center mb-4 overflow-hidden border border-stone-100">
            <img src="/assets/bestseller_manjistha_photo_hd.png" alt="Manjistha" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1E3B2B]">Manjistha</h3>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Purifies & Brightens</p>
          <p className="text-xs text-stone-500 leading-relaxed mt-2">Revered in Ayurveda as a supreme pitta-pacifier that diminishes dark spots and restores clarity.</p>
        </div>
        <div className="pt-5 border-t border-stone-100 mt-5">
          <a href="product.html?id=manjistha-soap" className="inline-block w-full py-2.5 bg-[#FAF7F2] hover:bg-[#1E3B2B] text-stone-800 hover:text-white font-bold text-xs rounded-xl border border-stone-200 transition">
            Explore Product →
          </a>
        </div>
      </div>

      {/* Card 2: Goat Milk */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8DEC8] flex flex-col justify-between text-center group hover:shadow-xl transition-all">
        <div>
          <div className="w-full aspect-square bg-[#FAF7F2] rounded-2xl p-4 flex items-center justify-center mb-4 overflow-hidden border border-stone-100">
            <img src="/assets/bestseller_goat_photo_hd.png" alt="Goat Milk" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1E3B2B]">Goat Milk</h3>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Nourishes & Softens</p>
          <p className="text-xs text-stone-500 leading-relaxed mt-2">Naturally rich in lactic acid and essential fatty acids that rebuild delicate moisture barriers.</p>
        </div>
        <div className="pt-5 border-t border-stone-100 mt-5">
          <a href="product.html?id=goat-milk-soap" className="inline-block w-full py-2.5 bg-[#FAF7F2] hover:bg-[#1E3B2B] text-stone-800 hover:text-white font-bold text-xs rounded-xl border border-stone-200 transition">
            Explore Product →
          </a>
        </div>
      </div>

      {/* Card 3: Neem */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8DEC8] flex flex-col justify-between text-center group hover:shadow-xl transition-all">
        <div>
          <div className="w-full aspect-square bg-[#FAF7F2] rounded-2xl p-4 flex items-center justify-center mb-4 overflow-hidden border border-stone-100">
            <img src="/assets/bestseller_aloe_soap_photo_hd.png" alt="Neem" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1E3B2B]">Neem</h3>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Cleanses & Protects</p>
          <p className="text-xs text-stone-500 leading-relaxed mt-2">A potent purifying botanical with natural antibacterial compounds to calm inflammation and breakouts.</p>
        </div>
        <div className="pt-5 border-t border-stone-100 mt-5">
          <a href="product.html?id=neem-soap" className="inline-block w-full py-2.5 bg-[#FAF7F2] hover:bg-[#1E3B2B] text-stone-800 hover:text-white font-bold text-xs rounded-xl border border-stone-200 transition">
            Explore Product →
          </a>
        </div>
      </div>

      {/* Card 4: Beetroot */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8DEC8] flex flex-col justify-between text-center group hover:shadow-xl transition-all">
        <div>
          <div className="w-full aspect-square bg-[#FAF7F2] rounded-2xl p-4 flex items-center justify-center mb-4 overflow-hidden border border-stone-100">
            <img src="/assets/bestseller_balm_photo_hd.png" alt="Beetroot" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1E3B2B]">Beetroot</h3>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Hydrates & Adds Tint</p>
          <p className="text-xs text-stone-500 leading-relaxed mt-2">Loaded with vibrant antioxidant betalains that nourish thin lip skin while granting a natural ruby glow.</p>
        </div>
        <div className="pt-5 border-t border-stone-100 mt-5">
          <a href="product.html?id=beetroot-lip-balm" className="inline-block w-full py-2.5 bg-[#FAF7F2] hover:bg-[#1E3B2B] text-stone-800 hover:text-white font-bold text-xs rounded-xl border border-stone-200 transition">
            Explore Product →
          </a>
        </div>
      </div>

    </div>
  </main>

  {/* Footer */}
    {/* ========================================================================
       EXACT EARTHGLAZE FOOTER SECTION (Matches Reference Image)
       ======================================================================== */}
  
    </div>
  );
}
