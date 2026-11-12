'use client';

import React from 'react';
import HeroSection from '../components/HeroSection';
import TrustBadgeStrip from '../components/TrustBadgeStrip';
import ComboOffer from '../components/ComboOffer';
import AboutUs from '../components/AboutUs';
import CustomerFavourites from '../components/CustomerFavourites';
import NewlyLaunched from '../components/NewlyLaunched';
import CustomerReviews from '../components/CustomerReviews';
import FAQSection from '../components/FAQSection';
import ScrollRevealSection from '../components/ScrollRevealSection';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden bg-[#FAF7F2]">
      <HeroSection />
      
      <ScrollRevealSection delay={40}>
        <TrustBadgeStrip />
      </ScrollRevealSection>

      <ScrollRevealSection delay={60}>
        <ComboOffer />
      </ScrollRevealSection>

      <ScrollRevealSection delay={60}>
        <AboutUs />
      </ScrollRevealSection>

      <ScrollRevealSection delay={60}>
        <CustomerFavourites />
      </ScrollRevealSection>

      <ScrollRevealSection delay={60}>
        <NewlyLaunched />
      </ScrollRevealSection>

      <ScrollRevealSection delay={60}>
        <CustomerReviews />
      </ScrollRevealSection>

      <ScrollRevealSection delay={60}>
        <FAQSection />
      </ScrollRevealSection>
    </div>
  );
}
