'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CustomerFavourites() {
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();

  const favourites = [
    {
      id: 1,
      slug: 'manjistha-soap',
      name: 'Manjistha Soap',
      badge: { text: 'Bestseller', icon: '👑', style: 'bg-[#FEF6E4] border-[#F5E2B3] text-[#9A6208]' },
      weight: '100 g',
      image: '/assets/favourites_manjistha_soap_hd.png',
      benefit: 'Purifies skin & gives a natural radiant glow.',
      rating: 5,
      reviews: 428,
      price: 349,
      originalPrice: 399,
      category: 'Soaps',
      highlightBorder: false
    },
    {
      id: 2,
      slug: 'goat-milk-soap',
      name: 'Goat Milk Soap',
      badge: { text: 'Top Rated', icon: '★', style: 'bg-[#FEF6E4] border-[#F5E2B3] text-[#9A6208]' },
      weight: '100 g',
      image: '/assets/favourites_goat_milk_soap_hd.png',
      benefit: 'Nourishes & deeply moisturizes sensitive skin.',
      rating: 5,
      reviews: 512,
      price: 349,
      originalPrice: 399,
      category: 'Soaps',
      highlightBorder: true
    },
    {
      id: 3,
      slug: 'beetroot-lip-balm',
      name: 'Beet Root Lip Balm',
      badge: { text: 'Highly Loved', icon: '♡', style: 'bg-[#FFF0F4] border-[#FDD0DC] text-[#B82B54]' },
      weight: '10 g',
      image: '/assets/favourites_beetroot_lip_balm_hd.png',
      benefit: 'Keeps lips soft, smooth & naturally tinted.',
      rating: 5,
      reviews: 396,
      price: 249,
      originalPrice: 299,
      category: 'Lip Care',
      highlightBorder: false
    }
  ];

  const handleAddToCart = async (product) => {
    setAddedId(product.id);
    await addToCart(product.id, 1);
    setTimeout(() => {
      setAddedId(null);
    }, 2000);
  };

  return (
    <section className="relative w-full bg-[#FAF7F2] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1300px] mx-auto">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-xs uppercase font-bold tracking-[0.25em] text-[#2E6B3E] mb-3">
            Pure Botanical Formulation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E3B2B] tracking-tight leading-tight">
            Customer <span className="italic font-normal text-[#8A6A32]">Favourites</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#5A685D] leading-relaxed font-sans">
            Handcrafted in small batches with cold-pressed natural oils, organic herbs, and time-honored Ayurvedic wisdom.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {favourites.map((product) => {
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className={`group relative bg-white rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between border ${
                  product.highlightBorder
                    ? 'border-[#D4AF37]/50 shadow-md ring-1 ring-[#D4AF37]/30'
                    : 'border-[#EAE3D5]'
                }`}
              >
                {/* Top Badge & Weight */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-xs ${product.badge.style}`}>
                    <span>{product.badge.icon}</span>
                    <span>{product.badge.text}</span>
                  </span>
                  <span className="text-xs font-semibold text-[#7D8C80] font-sans">
                    {product.weight}
                  </span>
                </div>

                {/* Product Image Stage */}
                <Link
                  href={`/product?id=${product.id}`}
                  className="relative block w-full aspect-square rounded-2xl bg-[#FAF7F2] p-6 overflow-hidden flex items-center justify-center cursor-pointer group-hover:bg-[#F5EFE4] transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                  />
                </Link>

                {/* Content */}
                <div className="mt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product?id=${product.id}`}>
                      <h3 className="font-serif font-bold text-xl sm:text-[22px] text-[#1E3B2B] group-hover:text-[#2E6B3E] transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-[13px] text-[#55665A] leading-relaxed line-clamp-1 font-sans mt-1">
                      {product.benefit}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-xs mt-3">
                    <div className="flex text-[#E5A823] tracking-tighter" aria-label="5 out of 5 stars">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <span className="text-[#66776A] font-medium text-xs ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Price & Add to Cart Action Row */}
                <div className="flex items-center justify-between pt-4 mt-5 border-t border-[#F2ECE1]">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-bold text-[#1E3B2B] tracking-tight">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-95 ${
                      isAdded
                        ? 'bg-[#1E7D3A] text-white shadow-md'
                        : 'bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white hover:shadow-md'
                    }`}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {isAdded ? (
                      <>
                        <span className="text-sm">✓</span>
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#1E3B2B] text-[#1E3B2B] font-semibold text-sm hover:bg-[#1E3B2B] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
          >
            <span>View All Products</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
