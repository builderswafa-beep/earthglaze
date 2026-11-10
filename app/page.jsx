'use client';

import React from 'react';
import HeroSection from '../components/HeroSection';
import ComboOffer from '../components/ComboOffer';
import AboutUs from '../components/AboutUs';
import CustomerFavourites from '../components/CustomerFavourites';
import NewlyLaunched from '../components/NewlyLaunched';
import CustomerReviews from '../components/CustomerReviews';
import FAQSection from '../components/FAQSection';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden bg-[#FAF7F2]">
      <HeroSection />
      <ComboOffer />
      <AboutUs />
      <CustomerFavourites />
      <NewlyLaunched />
      <CustomerReviews />
      <FAQSection />
    </div>
  );
}
