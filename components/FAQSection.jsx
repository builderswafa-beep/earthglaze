'use client';

import React from 'react';
import Link from 'next/link';

export default function FAQSection() {
  return (
    <>
      <section id="faq" className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2] relative overflow-hidden border-t border-stone-200/40" aria-label="Frequently Asked Questions">
        
        {/* Subtle Ambient Decorative Botanical Accent */}
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            
            {/* Eyebrow: Exact Hero Setup with Flanking Dividers */}
            <div className="flex items-center justify-center gap-3.5 mb-2.5">
              <span className="w-8 h-0.5 bg-[#235327]/60 rounded-full" aria-hidden="true"></span>
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#3e5444] uppercase">
                Got Questions?
              </span>
              <span className="w-8 h-0.5 bg-[#235327]/60 rounded-full" aria-hidden="true"></span>
            </div>

            {/* Main Title with Amber Italic Serif Accent */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-[#1E3B2B] tracking-tight leading-[1.12]">
            Frequently Asked <span className="text-[#C28328] italic font-serif font-normal">Questions</span>
          </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#404F44] leading-relaxed font-normal mt-3 max-w-xl mx-auto">
              Everything you need to know about our handcrafted ayurvedic botanicals, ingredients, orders, and delivery.
            </p>
          </div>

          {/* 2-Column Responsive Layout: Left (Questions 1–4) | Right (Questions 5–8) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-[1600px] mx-auto items-start">
            
            {/* ================================================================
                 LEFT COLUMN: Products & Ingredients (Questions 1–4)
                 ================================================================ */}
            <div className="space-y-4 text-left">
              
              {/* Category Header Badge */}
              <div className="flex items-center gap-3 pb-2.5 mb-2 border-b border-[#1E3B2B]/15">
                <span className="w-9 h-9 rounded-full bg-[#EAF4E6] flex items-center justify-center text-base shrink-0 shadow-sm">🍃</span>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] tracking-tight">Products &amp; Ingredients</h3>
                  <span className="text-xs font-semibold text-[#5A8834]">Questions 1–4 • Handcrafted Botanicals</span>
                </div>
              </div>

              {/* Q1 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20" open>
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#8DA685] shrink-0">01.</span>
                    <span>What makes EarthGlaze soaps different from commercial soaps?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#EAF4E6] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  EarthGlaze soaps are handcrafted in small batches using traditional cold-process methods with 100% natural plant oils, pure herbal extracts, and therapeutic botanicals. Unlike commercial soap bars, we never use sulfates (SLS/SLES), parabens, phthalates, synthetic detergents, or chemical hardeners. All natural glycerin is retained for intense, long-lasting moisture.
                </div>
              </details>

              {/* Q2 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20">
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#8DA685] shrink-0">02.</span>
                    <span>Is EarthGlaze Goat Milk Soap suitable for sensitive skin and eczema?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#EAF4E6] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  Yes, absolutely! Farm-fresh goat milk is naturally packed with gentle lactic acid, essential fatty acids, and vitamins A, B6, B12, and E. It has a pH closely matching human skin, helping calm irritation, relieve dryness, and strengthen the epidermal barrier. It is hypoallergenic and highly recommended for sensitive, inflamed, or eczema-prone skin.
                </div>
              </details>

              {/* Q3 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20">
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#8DA685] shrink-0">03.</span>
                    <span>How does Manjistha Soap help improve skin tone and fade spots?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#EAF4E6] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  Manjistha (<em>Rubia cordifolia</em>) is a revered Ayurvedic blood-purifying and complexion-enhancing herb. Rich in natural bioactive alizarin and rubiadin, it actively detoxifies sluggish pores, calms redness, helps regulate melanin production, and accelerates the fading of post-acne pigmentation, dark spots, and sun tanning.
                </div>
              </details>

              {/* Q4 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20">
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#8DA685] shrink-0">04.</span>
                    <span>Can I use EarthGlaze soaps safely on both face and body?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#EAF4E6] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  Yes! Because our soaps are crafted with organic cold-pressed plant oils (virgin coconut, olive, and shea butter), they produce a gentle, creamy lather that thoroughly cleanses without stripping facial lipids. They are completely safe and nurturing for daily face washes as well as full-body baths.
                </div>
              </details>

            </div>

            {/* ================================================================
                 RIGHT COLUMN: Orders, Payments & Delivery (Questions 5–8)
                 ================================================================ */}
            <div className="space-y-4 text-left">
              
              {/* Category Header Badge */}
              <div className="flex items-center gap-3 pb-2.5 mb-2 border-b border-[#1E3B2B]/15">
                <span className="w-9 h-9 rounded-full bg-[#FFF3E3] flex items-center justify-center text-base shrink-0 shadow-sm">📦</span>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] tracking-tight">Orders, Payments &amp; Delivery</h3>
                  <span className="text-xs font-semibold text-[#C28328]">Questions 5–8 • Shipping &amp; Support</span>
                </div>
              </div>

              {/* Q5 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20" open>
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#C28328] shrink-0">05.</span>
                    <span>What payment methods are accepted on EarthGlaze?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#FFF3E3] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  We provide 100% secure, 256-bit SSL encrypted checkout. We accept all major Indian payment methods, including UPI (Google Pay, PhonePe, Paytm, BHIM), Debit &amp; Credit Cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and Cash on Delivery (COD).
                </div>
              </details>

              {/* Q6 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20">
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#C28328] shrink-0">06.</span>
                    <span>How many days does standard delivery take to my location?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#FFF3E3] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  All orders are dispatched from our facility within 24 hours. For Tier-1 metro cities (Mumbai, Delhi-NCR, Bengaluru, Chennai, Hyderabad, Kolkata), delivery takes 2 to 4 business days. For other regions and rural pin codes, delivery typically takes 4 to 6 business days via air express courier partners.
                </div>
              </details>

              {/* Q7 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20">
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#C28328] shrink-0">07.</span>
                    <span>Is Cash on Delivery (COD) available across India?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#FFF3E3] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  Yes, Cash on Delivery is available across 19,000+ pin codes in India for all cart totals up to ₹2,500. A nominal COD handling fee of ₹40 is applied at checkout to cover courier cash-collection fees. Prepaid orders via UPI/Card enjoy completely waived handling fees!
                </div>
              </details>

              {/* Q8 */}
              <details className="faq-item group bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:border-[#1E3B2B]/40 hover:shadow transition-all duration-300 open:border-[#1E3B2B]/50 open:ring-1 open:ring-[#1E3B2B]/20">
                <summary className="flex items-center justify-between font-serif font-bold text-sm sm:text-base text-[#1E3B2B] cursor-pointer list-none select-none gap-3">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold font-sans text-[#C28328] shrink-0">08.</span>
                    <span>How can I track my order once it has been dispatched?</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-[#FFF3E3] flex items-center justify-center text-stone-500 group-hover:text-[#1E3B2B] transition-all duration-300 shrink-0 group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </summary>
                <div className="faq-answer text-xs sm:text-sm text-[#404F44] leading-relaxed font-normal pt-3 border-t border-stone-100 mt-3 font-sans">
                  As soon as your package leaves our warehouse, you will automatically receive an SMS, WhatsApp update, and email with your Airway Bill (AWB) tracking number and direct courier tracking link (BlueDart, Delhivery, or Xpressbees). You can check live status anytime.
                </div>
              </details>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}
