'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteContent } from '../hooks/useSiteContent';

const DEFAULT_FAQ_POINTS = [
  {
    id: 1,
    title: 'What makes EarthGlaze soaps different from commercial soaps?',
    desc: 'EarthGlaze soaps are handcrafted in small batches using traditional cold-process methods with 100% natural plant oils, pure herbal extracts, and therapeutic botanicals. Unlike commercial soap bars, we never use sulfates (SLS/SLES), parabens, phthalates, synthetic detergents, or chemical hardeners.'
  },
  {
    id: 2,
    title: 'Is EarthGlaze Goat Milk Soap suitable for sensitive skin and eczema?',
    desc: 'Yes, absolutely! Farm-fresh goat milk is naturally packed with gentle lactic acid, essential fatty acids, and vitamins A, B6, B12, and E. It has a pH closely matching human skin, helping calm irritation, relieve dryness, and strengthen the epidermal barrier.'
  },
  {
    id: 3,
    title: 'How does Manjistha Soap help improve skin tone and fade spots?',
    desc: 'Manjistha (Rubia cordifolia) is a revered Ayurvedic blood-purifying and complexion-enhancing herb. Rich in natural bioactive alizarin and rubiadin, it actively detoxifies sluggish pores, calms redness, helps regulate melanin production, and accelerates the fading of post-acne pigmentation.'
  },
  {
    id: 4,
    title: 'How long does an artisanal cold-processed soap bar last with daily use?',
    desc: 'With daily full-body use, a 100g EarthGlaze soap bar typically lasts 3 to 4 weeks. Because our soaps are naturally rich in moisture-retaining plant glycerin and contain no synthetic petro-hardeners, we recommend keeping your bar on a well-drained wooden or ceramic soap dish.'
  },
  {
    id: 5,
    title: 'Are all EarthGlaze products 100% cruelty-free and vegetarian?',
    desc: 'Yes, 100%! We never test any of our formulations or raw ingredients on animals. All of our herbal and botanical ingredients are ethically sourced directly from organic farmers in Kerala and sustainable Indian agricultural cooperatives.'
  },
  {
    id: 6,
    title: 'How many days does standard delivery take to my location?',
    desc: 'All orders are dispatched from our facility within 24 hours. For Tier-1 metro cities (Mumbai, Delhi-NCR, Bengaluru, Chennai, Hyderabad, Kolkata), delivery takes 2 to 4 business days. For other regions, delivery takes 4 to 6 business days via air express courier partners.'
  },
  {
    id: 7,
    title: 'Is Cash on Delivery (COD) available across India?',
    desc: 'Yes, Cash on Delivery is available across 19,000+ pin codes in India for all cart totals up to ₹2,500. A nominal COD handling fee of ₹40 is applied at checkout to cover courier cash-collection fees. Prepaid orders via UPI/Card enjoy completely waived handling fees!'
  },
  {
    id: 8,
    title: 'How can I track my order once it has been dispatched?',
    desc: 'As soon as your package leaves our warehouse, you will automatically receive an SMS, WhatsApp update, and email with your Airway Bill (AWB) tracking number and direct courier tracking link. You can check live status anytime.'
  }
];

export default function FAQSection() {
  const { getSection } = useSiteContent();
  const faqData = getSection('home', 'faq');
  const points = (Array.isArray(faqData?.points) && faqData.points.length > 0)
    ? faqData.points
    : DEFAULT_FAQ_POINTS;

  // Split into left & right columns
  const half = Math.ceil(points.length / 2);
  const leftCol = points.slice(0, half);
  const rightCol = points.slice(half);

  return (
    <>
      <section id="faq" className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2] relative overflow-hidden border-t border-stone-200/40" aria-label="Frequently Asked Questions">
        
        {/* Subtle Ambient Decorative Botanical Accent */}
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3.5 mb-2.5">
              <span className="w-8 h-0.5 bg-[#235327]/60 rounded-full" aria-hidden="true"></span>
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#3e5444] uppercase">
                {faqData.eyebrow || 'Got Questions?'}
              </span>
              <span className="w-8 h-0.5 bg-[#235327]/60 rounded-full" aria-hidden="true"></span>
            </div>

            {/* Main Title with Amber Italic Serif Accent */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
              {faqData.title || (
                <>Frequently Asked <span className="text-[#C28328] italic font-serif font-normal">Questions</span></>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#404F44] leading-relaxed font-normal mt-3 max-w-xl mx-auto">
              {faqData.subtitle || 'Everything you need to know about our handcrafted ayurvedic botanicals, ingredients, orders, and delivery.'}
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-[1600px] mx-auto items-start">
            
            {/* Left Column */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 pb-2.5 mb-2 border-b border-[#1E3B2B]/15">
                <span className="w-9 h-9 rounded-full bg-[#EAF4E6] flex items-center justify-center text-base shrink-0 shadow-sm">🍃</span>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] tracking-tight">Products &amp; Ingredients</h3>
                  <span className="text-xs font-semibold text-[#5A8834]">Handcrafted Botanicals</span>
                </div>
              </div>

              {leftCol.map((item, idx) => (
                <details key={item.id || idx} className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20" open={idx === 0}>
                  <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold font-sans text-[#8DA685] shrink-0">0{idx + 1}.</span>
                      <span>{item.title || item.q || item.question}</span>
                    </span>
                    <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#EAF4E6] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </summary>
                  <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                    {item.desc || item.a || item.answer}
                  </div>
                </details>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 pb-2.5 mb-2 border-b border-[#1E3B2B]/15">
                <span className="w-9 h-9 rounded-full bg-[#FFF5E8] flex items-center justify-center text-base shrink-0 shadow-sm">📦</span>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] tracking-tight">Orders, Shipping &amp; Care</h3>
                  <span className="text-xs font-semibold text-[#C28328]">Delivery &amp; Ritual Guidance</span>
                </div>
              </div>

              {rightCol.map((item, idx) => (
                <details key={item.id || idx} className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20">
                  <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold font-sans text-[#C28328] shrink-0">0{half + idx + 1}.</span>
                      <span>{item.title || item.q || item.question}</span>
                    </span>
                    <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#FFF3E3] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </summary>
                  <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                    {item.desc || item.a || item.answer}
                  </div>
                </details>
              ))}
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
