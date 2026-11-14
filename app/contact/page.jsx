'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { useSiteContent } from '../../hooks/useSiteContent';

export default function ContactPage() {
  const { getSection } = useSiteContent();
  const heroData = getSection('contact', 'hero');
  const infoData = getSection('contact', 'info');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.contact.submitMessage(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        alert(res.message || 'Error sending message.');
      }
    } catch (err) {
      alert('Unable to send message right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen text-[#1E3B2B]">
      
      {/* ========================================================================
          HERO SECTION: Contact Us • We're Here for You
          ======================================================================== */}
      <section className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center overflow-hidden bg-[#FAF7F2] border-b border-[#E8DEC8]/50">
        
        {/* Full-bleed seamless background banner image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 hidden sm:block">
          <img 
            src={heroData.bg_image || heroData.image || "/assets/contact_hero_seamless_hd.png"} 
            alt="EarthGlaze Natural Skincare - Botanical mortar with herbal leaves, handmade soap on sandstone, and golden oil bottle" 
            className="w-full h-full object-cover object-right"
            loading="eager"
            width="1600"
            height="680"
          />
        </div>

        {/* Soft Ambient Radial Lighting */}
        <div 
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-[radial-gradient(circle,_rgba(244,233,212,0.7)_0%,_rgba(250,247,242,0)_70%)] pointer-events-none -z-0 blur-3xl opacity-80" 
          aria-hidden="true" 
        />

        {/* Organic Emerald Green Bottom-Left Wave Sweep (Properly Aligned & Harmoniously Layered) */}
        <svg 
          className="absolute -bottom-[1px] left-0 w-72 sm:w-96 md:w-[520px] lg:w-[640px] pointer-events-none select-none z-10 block" 
          viewBox="0 0 640 140" 
          preserveAspectRatio="xMinYMax meet"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="contactWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E6B3E" />
              <stop offset="60%" stopColor="#1E4D2B" />
              <stop offset="100%" stopColor="#0D2D1C" />
            </linearGradient>
            <linearGradient id="contactWaveBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B4D2E" />
              <stop offset="100%" stopColor="#081F12" />
            </linearGradient>
          </defs>

          {/* Background Depth Layer - subtly peeking higher, smoothly tapering into the baseline */}
          <path 
            d="M 0 145 L 0 85 C 70 65, 150 25, 260 25 C 380 25, 480 75, 560 115 C 600 132, 625 139, 640 140 L 640 145 Z" 
            fill="url(#contactWaveBack)" 
            opacity="0.4" 
          />

          {/* Foreground Main Layer - rich organic curve with graceful smooth landing onto baseline */}
          <path 
            d="M 0 145 L 0 98 C 65 80, 140 42, 250 42 C 365 42, 455 88, 530 122 C 568 135, 595 139, 610 140 L 610 145 Z" 
            fill="url(#contactWaveGrad)" 
            opacity="0.95" 
          />

          {/* Fine Botanical Gold Highlight Filament along the crest */}
          <path 
            d="M 0 98 C 65 80, 140 42, 250 42 C 365 42, 455 88, 530 122 C 568 135, 595 139, 610 140" 
            stroke="#D4AF37" 
            strokeWidth="1.5" 
            strokeOpacity="0.75" 
            strokeLinecap="round"
            fill="none" 
          />
        </svg>

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-20 py-8 sm:py-12 lg:py-14">
          <div className="max-w-xl space-y-4 sm:space-y-6 text-left">
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#5C6B5E] font-medium">
              <Link href="/" className="hover:text-[#1E3B2B] transition-colors">Home</Link>
              <span className="text-stone-400 font-normal">&gt;</span>
              <span className="text-[#1E3B2B] font-semibold">Contact Us</span>
            </nav>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-bold text-[#1E3B2B] tracking-tight leading-[1.08] font-serif">
                {heroData.title || (
                  <>
                    Contact Us
                    <span className="block italic font-normal text-[#C28328] mt-1 sm:mt-1.5 font-serif">
                      We're Here for You
                    </span>
                  </>
                )}
              </h1>
            </div>

            {/* Subtitle Copy */}
            <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed max-w-lg font-sans">
              {heroData.subtitle || "Have a question about our products, orders or skincare? Get in touch with our team. We'd love to hear from you!"}
            </p>

            {/* Mobile-only responsive visual */}
            <div className="sm:hidden pt-4">
              <img 
                src="/assets/contact_hero_mobile_hd.png" 
                alt="EarthGlaze Natural Skincare - Botanical Still Life" 
                className="w-full h-auto rounded-2xl shadow-sm"
                loading="eager"
              />
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================
          MAIN CONTENT: 4 Info Cards (Left) + Send Us a Message Form (Right)
          ======================================================================== */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#FAF7F2] relative overflow-hidden" aria-label="Contact Methods and Enquiry Form">
        
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ------------------------------------------------------------------
                LEFT COLUMN: 4 Stacked Contact Cards (~40% on Desktop)
                ------------------------------------------------------------------ */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              
              {/* Card 1: Call Us */}
              <div className="bg-[#FAF6EE] hover:bg-white border border-[#E8DEC8]/90 hover:border-[#1E3B2B]/40 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 group stagger-1 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#EAF2EC] text-[#2E6B3E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 icon-hover-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] leading-snug">
                    Call Us
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6B5E] mt-0.5 leading-relaxed">
                    Have a query? Talk to our support team.
                  </p>
                  <a 
                    href={`tel:${infoData.phone?.replace(/\s+/g, '') || '+919876543210'}`} 
                    className="inline-block mt-2 font-bold text-base sm:text-lg text-[#1E3B2B] hover:text-[#2E6B3E] transition-colors"
                  >
                    {infoData.phone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              {/* Card 2: Email Us */}
              <div className="bg-[#FAF6EE] hover:bg-white border border-[#E8DEC8]/90 hover:border-[#1E3B2B]/40 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 group stagger-2 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#EAF2EC] text-[#2E6B3E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 icon-hover-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] leading-snug">
                    Email Us
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6B5E] mt-0.5 leading-relaxed">
                    Drop us an email anytime.
                  </p>
                  <a 
                    href={`mailto:${infoData.email || 'support@earthglaze.in'}`} 
                    className="inline-block mt-2 font-bold text-base sm:text-lg text-[#1E3B2B] hover:text-[#2E6B3E] transition-colors break-all"
                  >
                    {infoData.email || 'support@earthglaze.in'}
                  </a>
                </div>
              </div>

              {/* Card 3: Our Location */}
              <div className="bg-[#FAF6EE] hover:bg-white border border-[#E8DEC8]/90 hover:border-[#1E3B2B]/40 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 group stagger-3 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#EAF2EC] text-[#2E6B3E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 icon-hover-lift" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] leading-snug">
                    Our Location
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6B5E] mt-1 leading-relaxed">
                    {infoData.address || 'EarthGlaze Natural Skincare, Kasaragod, Kerala – 671123'}
                  </p>
                </div>
              </div>

              {/* Card 4: Business Hours */}
              <div className="bg-[#FAF6EE] hover:bg-white border border-[#E8DEC8]/90 hover:border-[#1E3B2B]/40 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex items-start gap-4 group stagger-4 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#EAF2EC] text-[#2E6B3E] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 icon-hover-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] leading-snug">
                    Business Hours
                  </h3>
                  <div className="text-xs sm:text-sm text-[#5C6B5E] mt-1 space-y-0.5 leading-relaxed">
                    <p className="font-medium text-[#1E3B2B]">{infoData.timings || 'Mon – Sat: 9:00 AM – 6:00 PM (Sunday Closed)'}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ------------------------------------------------------------------
                RIGHT COLUMN: Send Us a Message Card (~60% on Desktop)
                ------------------------------------------------------------------ */}
            <div className="lg:col-span-7 bg-white rounded-[28px] sm:rounded-[36px] border border-[#E8DEC8] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
              
              {/* Subtle Botanical Leaf Accent in Corner */}
              <img 
                src="/assets/contact_card_leaves.png" 
                alt="" 
                className="absolute top-0 right-0 w-32 sm:w-44 lg:w-48 h-auto pointer-events-none select-none z-0" 
                aria-hidden="true" 
              />

              <div className="relative z-10 space-y-6">
                
                {/* Form Title & Subtitle */}
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3B2B] tracking-tight font-serif leading-tight">
                    Send Us a{' '}
                    <span className="italic font-normal text-[#C28328]">Message</span>
                  </h2>
                  <p className="text-sm text-[#5C6B5E] mt-1.5 font-sans">
                    Fill in the details below, and we'll get back to you soon.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 text-center bg-[#EAF2EC] rounded-2xl border border-[#C6DEC9] space-y-3 animate-fadeIn">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#1E3B2B] text-white flex items-center justify-center text-2xl shadow-md">
                      ✓
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#1E3B2B]">Thank you for reaching out!</h3>
                    <p className="text-sm text-[#404F44] max-w-md mx-auto">
                      Your message has been sent successfully. Our natural skincare team will review your query and reply within 24 business hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-full bg-[#1E3B2B] text-white text-xs font-semibold hover:bg-[#14291E] transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    
                    {/* Row 1: Your Name + Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Your Name */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3B2B]">
                          <svg className="w-3.5 h-3.5 text-[#2E6B3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          <span>Your Name <span className="text-[#E0245E]">*</span></span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your name"
                          className="w-full text-sm px-4 py-3 bg-[#FAF8F5] rounded-full border border-[#E2D8C3] focus:border-[#1E3B2B] focus:bg-white focus:outline-none transition-all placeholder:text-stone-400"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3B2B]">
                          <svg className="w-3.5 h-3.5 text-[#2E6B3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          <span>Email Address <span className="text-[#E0245E]">*</span></span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter your email"
                          className="w-full text-sm px-4 py-3 bg-[#FAF8F5] rounded-full border border-[#E2D8C3] focus:border-[#1E3B2B] focus:bg-white focus:outline-none transition-all placeholder:text-stone-400"
                        />
                      </div>

                    </div>

                    {/* Row 2: Phone Number + Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3B2B]">
                          <svg className="w-3.5 h-3.5 text-[#2E6B3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                          </svg>
                          <span>Phone Number</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          className="w-full text-sm px-4 py-3 bg-[#FAF8F5] rounded-full border border-[#E2D8C3] focus:border-[#1E3B2B] focus:bg-white focus:outline-none transition-all placeholder:text-stone-400"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3B2B]">
                          <svg className="w-3.5 h-3.5 text-[#2E6B3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                          </svg>
                          <span>Subject <span className="text-[#E0245E]">*</span></span>
                        </label>
                        <div className="relative">
                          <select
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full text-sm px-4 py-3 bg-[#FAF8F5] rounded-full border border-[#E2D8C3] focus:border-[#1E3B2B] focus:bg-white focus:outline-none transition-all text-[#1E3B2B] appearance-none cursor-pointer pr-10"
                          >
                            <option value="">Select a subject</option>
                            <option value="Product Consultation">Product Question & Consultation</option>
                            <option value="Order Tracking">Order Status & Tracking</option>
                            <option value="Shipping & Delivery">Shipping & Delivery</option>
                            <option value="Wholesale / Bulk">Bulk & Artisan Gifting</option>
                            <option value="Feedback">Feedback & Suggestions</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Row 3: Your Message */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3B2B]">
                        <svg className="w-3.5 h-3.5 text-[#2E6B3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <span>Your Message <span className="text-[#E0245E]">*</span></span>
                      </label>
                      <textarea
                        required
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Type your message here..."
                        className="w-full text-sm px-4 py-3 bg-[#FAF8F5] rounded-2xl border border-[#E2D8C3] focus:border-[#1E3B2B] focus:bg-white focus:outline-none transition-all placeholder:text-stone-400 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-8 sm:px-9 rounded-full bg-[#0D2D1C] hover:bg-[#1a4628] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer disabled:opacity-75"
                      >
                        <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                        <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                      </button>
                    </div>

                  </form>
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================
          SECTION 3: KASARAGOD, KERALA LOCATION MAP CARD
          ======================================================================== */}
      <section className="py-6 sm:py-8 bg-[#FAF7F2]" aria-label="Interactive Location Map">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#E2D8C3] shadow-md bg-[#E9F3E8] group">
            
            {/* Live Interactive Original Google Maps iframe Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62325.26620573752!2d74.95475149301036!3d12.512638848773976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba4825d1945f47f%3A0xc6cb1e8b2848c1f0!2sKasaragod%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="EarthGlaze Natural Skincare - Kasaragod, Kerala Live Location Map"
              className="w-full h-[360px] sm:h-[400px] md:h-[450px] lg:h-[480px] border-0 block"
            />

            {/* Floating Botanical Location Pin Overlay (Matching Design Attachment) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-10 flex flex-col items-center">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 px-4 sm:px-6 shadow-[0_12px_32px_rgba(22,61,38,0.22)] border border-[#C6DEC9]/80 flex items-center gap-3 sm:gap-4 transition-transform duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EAF2EC] flex items-center justify-center shrink-0 text-[#2E6B3E] shadow-xs">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 4c-5-.5-10.5 2-13.5 5-3.5 3.5-4 8.5-2 11 2.5 2 7.5 1.5 11-2 3-3 5.5-8.5 5-13.5-.5-.5-.5-.5-.5-.5z"/>
                    <path d="M5.5 18.5c4-4 8.5-7 14-8.5"/>
                    <path d="M12 13c1.5 1.5 3 2.5 4.5 3"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#1E3B2B] leading-tight">
                    EarthGlaze
                  </h4>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#2E6B3E] tracking-wide">
                    Natural Skincare
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#5C6B5E] mt-0.5">
                    Kasaragod, Kerala – 671xxx
                  </p>
                </div>
              </div>

              {/* Glowing Green Map Pin Teardrop with Anchor Dot */}
              <div className="relative -mt-1 flex flex-col items-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#1E4D2B] drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 8 14 1-1 8-8.75 8-14 0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
                <div className="w-3 h-1.5 rounded-full bg-black/25 blur-[1.5px] -mt-1"></div>
              </div>
            </div>

            {/* Floating Live Google Maps Shortcut Button */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Kasaragod+Kerala+EarthGlaze" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 z-20 px-4 py-2.5 rounded-full bg-[#0D2D1C]/90 hover:bg-[#0D2D1C] text-white text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group/link cursor-pointer"
              aria-label="Open EarthGlaze in Google Maps"
            >
              <span>View on Google Maps</span>
              <span className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200">↗</span>
            </a>

          </div>

        </div>
      </section>

      {/* ========================================================================
          SECTION 4: "STILL HAVE QUESTIONS?" BANNER
          ======================================================================== */}
      <section className="py-10 sm:py-14 md:py-16 bg-[#FAF7F2]" aria-label="Frequently Asked Questions Link">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="bg-gradient-to-r from-[#F0F5EC] via-[#FAF6EE] to-[#F5ECE0] border border-[#DEE8DB] rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs relative overflow-hidden group">
            {/* Left Decorative Botanical Leaves */}
            <img 
              src="/assets/contact_card_leaves.png" 
              alt="" 
              className="absolute -bottom-4 -left-4 w-32 sm:w-40 h-auto pointer-events-none select-none transform scale-x-[-1] opacity-75 z-0" 
              aria-hidden="true" 
            />
            
            {/* Background Botanical Leaf Glow Accent */}
            <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-[#2E6B3E]/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
            
            {/* Left: Natural Ingredients Icon Badge */}
            <div className="flex items-center gap-6 shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-[#C6DEC9] flex items-center justify-center text-[#2E6B3E] shrink-0">
                  <svg className="w-6 h-6 text-[#2E6B3E] fill-current" viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12 5-2 1.5-3 3.5-3 3.5 3 0 7-4 7-9z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm sm:text-base text-[#1E3B2B] leading-tight">
                    Natural Ingredients
                  </span>
                  <span className="text-xs text-[#5C6B5E]">100% Pure & Ayurvedic</span>
                </div>
              </div>

              {/* Vertical Divider (Hidden on small mobile) */}
              <div className="hidden sm:block h-12 w-px bg-stone-300/80" aria-hidden="true" />
            </div>

            {/* Middle: Question Copy */}
            <div className="flex-1 text-center md:text-left space-y-1">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1E3B2B] tracking-tight">
                Still Have Questions?
              </h2>
              <p className="text-xs sm:text-sm text-[#5C6B5E] max-w-xl">
                Check out our FAQs for quick answers about products, orders and more.
              </p>
            </div>

            {/* Right: View FAQs CTA Button */}
            <div className="shrink-0 w-full md:w-auto flex justify-center md:justify-end">
              <Link 
                href="/#faq" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-[#1E3B2B] bg-white/60 hover:bg-[#1E3B2B] text-[#1E3B2B] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer group/btn"
              >
                <span>View FAQs</span>
                <span className="group-hover/btn:translate-x-1 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
