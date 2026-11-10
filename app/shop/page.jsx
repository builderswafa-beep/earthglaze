'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import api from '../../lib/api';

// Products matching reference image exactly with HD photography
const SHOP_PRODUCTS = [
  {
    id: 1,
    slug: 'manjistha-soap',
    name: 'Manjistha Soap',
    category: 'Soaps',
    price: 349,
    original_price: 399,
    rating: 4.9,
    reviews: 428,
    benefits: ['Brightening', 'Pore Cleansing'],
    image: '/assets/shop_card_manjistha_hd.png',
    tagline: 'Deeply purifies skin, clears blemishes, and restores natural radiance.',
    inStock: true
  },
  {
    id: 2,
    slug: 'goat-milk-soap',
    name: 'Goat Milk Soap',
    category: 'Soaps',
    price: 349,
    original_price: 399,
    rating: 4.8,
    reviews: 512,
    benefits: ['Nourishing', 'Moisturizing'],
    image: '/assets/shop_card_goatmilk_hd.png',
    tagline: 'Ultra-creamy nourishment with bio-compatible lactic acid and shea butter.',
    inStock: true
  },
  {
    id: 3,
    slug: 'beetroot-lip-balm',
    name: 'Beetroot Lip Balm',
    category: 'Lip Care',
    price: 249,
    original_price: 299,
    rating: 4.9,
    reviews: 396,
    benefits: ['Nourishing', 'Moisturizing', 'Brightening'],
    image: '/assets/shop_card_lipbalm_hd.png',
    tagline: 'Infused with pure beetroot extract for naturally tinted, supple lips.',
    inStock: true
  }
];

export default function ShopPage() {
  const { addToCart } = useCart();
  const [dbProducts, setDbProducts] = useState(SHOP_PRODUCTS);
  const [activeTab, setActiveTab] = useState('All Products');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [maxPrice, setMaxPrice] = useState(400);
  const [minPrice, setMinPrice] = useState(120);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  
  // Requirement: Hide left filter sidebar by default, toggle on button click
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadDbProducts() {
      try {
        const res = await api.products.getAll();
        if (res.success && Array.isArray(res.products) && res.products.length > 0) {
          const formatted = res.products.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category?.name || p.category_name || 'Soaps',
            price: Number(p.sale_price || p.price),
            original_price: Number(p.original_price || p.price + 50),
            rating: Number(p.rating || 4.8),
            reviews: p.review_count || 120,
            benefits: p.benefits ? p.benefits.split(',').map(s => s.trim()) : ['Natural Care'],
            image: p.slug.includes('goat')
              ? '/assets/shop_card_goatmilk_hd.png'
              : p.slug.includes('balm')
              ? '/assets/shop_card_lipbalm_hd.png'
              : '/assets/shop_card_manjistha_hd.png',
            tagline: p.tagline || p.description,
            inStock: (p.stock_qty ?? 1) > 0
          }));
          setDbProducts(formatted);
        }
      } catch (err) {
        console.error('Failed to load products from database, using cached:', err);
      }
    }
    loadDbProducts();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('filters') === 'open' || params.get('filters') === 'true' || params.get('filter') === '1') {
        setShowFilters(true);
      }
    }
  }, []);

  // Wishlist toggle
  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const nextState = !prev[id];
      setToastMessage(nextState ? 'Added to Wishlist' : 'Removed from Wishlist');
      setTimeout(() => setToastMessage(''), 2200);
      return { ...prev, [id]: nextState };
    });
  };

  // Add to cart handler with reactive context
  const handleAddToCart = async (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const res = await addToCart(product.id, 1);
    if (res.success) {
      setToastMessage(`Added ${product.name} to Cart`);
    } else {
      setToastMessage(res.message || 'Added to cart');
    }
    setTimeout(() => setToastMessage(''), 2600);
  };

  // Active filter count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBenefits.length > 0) count += selectedBenefits.length;
    if (maxPrice < 400 || minPrice > 120) count += 1;
    return count;
  }, [selectedCategories, selectedBenefits, minPrice, maxPrice]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBenefits([]);
    setMinPrice(120);
    setMaxPrice(400);
    setActiveTab('All Products');
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return dbProducts.filter(product => {
      // 1. Top tabs filter
      if (activeTab === 'Soaps' && product.category !== 'Soaps') return false;
      if (activeTab === 'Lip Care' && product.category !== 'Lip Care') return false;

      // 2. Sidebar category checkboxes
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // 3. Price range
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // 4. Skin benefits
      if (selectedBenefits.length > 0) {
        const hasBenefit = selectedBenefits.some(b => product.benefits?.includes(b));
        if (!hasBenefit) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [dbProducts, activeTab, selectedCategories, minPrice, maxPrice, selectedBenefits, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleBenefitChange = (benefit) => {
    setSelectedBenefits(prev => 
      prev.includes(benefit) ? prev.filter(b => b !== benefit) : [...prev, benefit]
    );
  };

  return (
    <div className="w-full bg-[#FAF7F2] font-sans text-[#1E3B2B] overflow-x-hidden selection:bg-[#235327] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D2D1C] text-white px-5 py-3 rounded-full shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-fadeIn">
          <span className="w-6 h-6 rounded-full bg-[#235327] flex items-center justify-center text-xs font-bold">✓</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <Link href="/cart" className="ml-2 text-xs font-bold text-amber-300 underline underline-offset-2 hover:text-white">
            View Cart
          </Link>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: HERO BANNER (Shop Our Natural Skincare Range)
          ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#FBF8F3] via-[#FAF5EE] to-[#F5ECE0] pt-6 sm:pt-10 pb-12 sm:pb-20 overflow-hidden border-b border-stone-200/40">
        
        {/* Right Corner Foliage Accent */}
        <img 
          src="/assets/banner_offer_top_leaves.png" 
          alt="" 
          className="absolute top-0 right-0 w-48 sm:w-64 lg:w-80 pointer-events-none select-none opacity-90 z-0" 
          aria-hidden="true" 
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6 font-sans">
            <Link href="/" className="hover:text-[#103B23] transition-colors">Home</Link>
            <span className="text-stone-400">&rsaquo;</span>
            <span className="text-[#1E3B2B] font-medium">Shop</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-4">
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-[#1E3B2B] leading-[1.15] tracking-tight">
                Shop Our <br />
                <span className="text-[#1E3B2B]">Natural </span>
                <span className="text-[#C28328] italic font-serif font-normal">Skincare Range</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#5C6B5E] max-w-lg leading-relaxed font-sans pt-1">
                Pure, plant-based essentials crafted for healthy, radiant skin.
              </p>

            </div>

            {/* Right Side Visual: High-Definition Product Trio on Pedestal */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-[560px] flex items-center justify-center">
                <img 
                  src="/assets/shop_natural_skincare_collection_showcase.png" alt="EarthGlanze Natural Skincare Collection - Manjistha Soap, Goat Milk Soap, Beetroot Lip Balm" className="w-full h-auto object-contain select-none pointer-events-none transform hover:scale-[1.02] transition-transform duration-500" width="1024" height="682" />
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Smooth Green Curve */}
        <div className="w-full overflow-hidden leading-none absolute bottom-0 left-0 right-0 pointer-events-none z-10">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-5 sm:h-8 block" preserveAspectRatio="none">
            <path d="M0,0 C160,25 320,38 520,32 C740,26 980,10 1440,24 L1440,40 L0,40 Z" fill="#FAF7F2" />
          </svg>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: CATEGORY FILTER PILLS, TOGGLE BUTTON & SORTING BAR
          ========================================================================= */}
      <section className="py-6 sm:py-8 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Category Tabs (Capsule Pill Buttons) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              
              {/* Tab 1: All Products */}
              <button
                type="button"
                onClick={() => { setActiveTab('All Products'); setSelectedCategories([]); }}
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-2xs cursor-pointer ${
                  activeTab === 'All Products'
                    ? 'bg-[#103B23] text-white shadow-sm'
                    : 'bg-[#F3EFE6] text-[#1E3B2B] hover:bg-white border border-[#E8DEC8]/80'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
                </svg>
                <span>All Products</span>
              </button>

              {/* Tab 2: Soaps */}
              <button
                type="button"
                onClick={() => { setActiveTab('Soaps'); setSelectedCategories([]); }}
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-2xs cursor-pointer ${
                  activeTab === 'Soaps'
                    ? 'bg-[#103B23] text-white shadow-sm'
                    : 'bg-[#F3EFE6] text-[#1E3B2B] hover:bg-white border border-[#E8DEC8]/80'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="6" width="18" height="12" rx="3"/>
                  <path d="M7 10h10M7 14h6"/>
                </svg>
                <span>Soaps</span>
              </button>

              {/* Tab 3: Lip Care */}
              <button
                type="button"
                onClick={() => { setActiveTab('Lip Care'); setSelectedCategories([]); }}
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-2xs cursor-pointer ${
                  activeTab === 'Lip Care'
                    ? 'bg-[#103B23] text-white shadow-sm'
                    : 'bg-[#F3EFE6] text-[#1E3B2B] hover:bg-white border border-[#E8DEC8]/80'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9c0-2-2-4-5-4s-3 2-4 2-1-2-4-2-5 2-5 4a9 9 0 0 0 9 9z"/>
                </svg>
                <span>Lip Care</span>
              </button>

            </div>

            {/* Right Controls: Filter Toggle Button + Sort By Dropdown */}
            <div className="flex items-center gap-3 self-end md:self-center">
              
              {/* FILTERS TOGGLE BUTTON (Requirement: Hidden by default, smooth toggle, expands full-width when collapsed) */}
              <button
                type="button"
                onClick={() => setShowFilters(prev => !prev)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-2xs border cursor-pointer ${
                  showFilters
                    ? 'bg-[#103B23] text-white border-[#103B23] shadow-sm'
                    : 'bg-white text-[#1E3B2B] border-[#E8DEC8] hover:bg-[#FAF5ED]'
                }`}
                aria-expanded={showFilters}
                aria-label="Toggle filter sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C28328] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-stone-500 font-medium whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-[#E8DEC8] rounded-full px-4 py-2 pr-9 text-xs sm:text-sm font-semibold text-[#1E3B2B] hover:border-[#103B23] focus:outline-none focus:ring-1 focus:ring-[#103B23] cursor-pointer shadow-2xs transition"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MAIN PRODUCTS BODY (Collapsible Sidebar + Fluid Full-Width Grid)
          ========================================================================= */}
      <section className="pb-16 sm:pb-24 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col lg:flex-row gap-8 items-start relative transition-all duration-500 ease-in-out">
            
            {/* -------------------------------------------------------------------
                LEFT SIDEBAR: Categories, Price Range, Skin Benefits
                (Collapsible: Hidden by default, smooth slide/expansion when toggled)
                ------------------------------------------------------------------- */}
            <aside 
              className={`transition-all duration-500 ease-in-out shrink-0 overflow-hidden ${
                showFilters 
                  ? 'w-full lg:w-[280px] max-h-[1400px] opacity-100 transform translate-x-0 mb-6 lg:mb-0' 
                  : 'w-0 max-h-0 opacity-0 pointer-events-none transform -translate-x-6 lg:-translate-x-8'
              }`}
            >
              <div className="w-full lg:w-[280px] bg-white rounded-[24px] p-6 border border-[#E8DEC8] shadow-2xs space-y-6">
                
                {/* Header with Clear button */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]/80">
                  <h3 className="font-serif font-bold text-lg text-[#1E3B2B] tracking-tight">
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button 
                      type="button" 
                      onClick={resetFilters}
                      className="text-xs font-semibold text-[#C28328] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Filter 1: Categories */}
                <div className="space-y-3 pb-5 border-b border-[#E8DEC8]/80">
                  <h4 className="font-semibold text-sm text-[#1E3B2B]">
                    Categories
                  </h4>
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between text-xs sm:text-sm text-stone-600 hover:text-[#103B23] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes('Soaps')}
                          onChange={() => handleCategoryChange('Soaps')}
                          className="w-4 h-4 rounded border-[#D8CEBA] text-[#103B23] focus:ring-[#103B23] cursor-pointer accent-[#103B23]"
                        />
                        <span>Soaps</span>
                      </div>
                      <span className="text-xs text-stone-400 font-medium">(2)</span>
                    </label>

                    <label className="flex items-center justify-between text-xs sm:text-sm text-stone-600 hover:text-[#103B23] cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes('Lip Care')}
                          onChange={() => handleCategoryChange('Lip Care')}
                          className="w-4 h-4 rounded border-[#D8CEBA] text-[#103B23] focus:ring-[#103B23] cursor-pointer accent-[#103B23]"
                        />
                        <span>Lip Care</span>
                      </div>
                      <span className="text-xs text-stone-400 font-medium">(1)</span>
                    </label>
                  </div>
                </div>

                {/* Filter 2: Price Range Slider */}
                <div className="space-y-3 pb-5 border-b border-[#E8DEC8]/80">
                  <h4 className="font-semibold text-sm text-[#1E3B2B]">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <input 
                      type="range" 
                      min="120" 
                      max="400" 
                      step="10"
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#103B23] cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-xs font-semibold text-[#1E3B2B]">
                      <span>₹120</span>
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF5ED] border border-[#E8DEC8]">
                        ₹{minPrice} &ndash; ₹{maxPrice}
                      </span>
                      <span>₹400</span>
                    </div>
                  </div>
                </div>

                {/* Filter 3: Skin Benefit Checkboxes */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-[#1E3B2B]">
                    Skin Benefit
                  </h4>
                  <div className="space-y-2.5">
                    {['Brightening', 'Nourishing', 'Pore Cleansing', 'Moisturizing'].map(benefit => (
                      <label key={benefit} className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-600 hover:text-[#103B23] cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBenefits.includes(benefit)}
                          onChange={() => handleBenefitChange(benefit)}
                          className="w-4 h-4 rounded border-[#D8CEBA] text-[#103B23] focus:ring-[#103B23] cursor-pointer accent-[#103B23]"
                        />
                        <span>{benefit}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </aside>

            {/* -------------------------------------------------------------------
                RIGHT / FULL-WIDTH: Product Grid Area
                (When filters collapsed, spans 100% full-width with 3 large luxury cards)
                ------------------------------------------------------------------- */}
            <div className="flex-1 w-full transition-all duration-500 ease-in-out">
              
              {/* Heading: Our Products (3) */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1E3B2B] tracking-tight">
                  Our Products <span className="text-[#5C6B5E] text-lg font-normal">({filteredProducts.length})</span>
                </h2>

                {/* Filter indicator pill if filters collapsed but active */}
                {!showFilters && activeFiltersCount > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setShowFilters(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#C28328]/40 text-[#C28328] text-xs font-semibold hover:bg-white cursor-pointer"
                  >
                    <span>{activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}</span>
                    <span className="text-[10px]">&rarr;</span>
                  </button>
                )}
              </div>

              {/* Product Cards Grid */}
              {filteredProducts.length === 0 ? (
                <div className="w-full bg-white rounded-[24px] p-12 text-center border border-[#E8DEC8] space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5ED] flex items-center justify-center text-stone-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#1E3B2B]">No products found</h3>
                  <p className="text-sm text-stone-500 max-w-md mx-auto">
                    Try adjusting your category or price filters to see more of our natural skincare essentials.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#103B23] text-white text-xs font-semibold hover:bg-[#194E31] transition shadow-sm cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 sm:gap-8 transition-all duration-500 ${
                  showFilters
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {filteredProducts.map((product) => {
                    const isWishlisted = !!wishlist[product.id];
                    return (
                      <div 
                        key={product.id}
                        className="bg-white rounded-[24px] overflow-hidden border border-[#E8DEC8]/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1 relative"
                      >
                        
                        {/* Image Container with Wishlist Heart */}
                        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#FAF5EE] to-[#F3ECE0] overflow-hidden">
                          <Link href={`/product?id=${product.id}`} className="block w-full h-full">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                              width="741"
                              height="556"
                            />
                          </Link>

                          {/* Heart Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs flex items-center justify-center transition shadow-2xs cursor-pointer group/heart z-10"
                            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                          >
                            <svg 
                              className={`w-4 h-4 transition-colors ${
                                isWishlisted 
                                  ? 'fill-rose-500 text-rose-500 scale-110' 
                                  : 'fill-none text-stone-700 group-hover/heart:text-rose-500'
                              }`} 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                          
                          <div className="space-y-1.5">
                            
                            {/* Product Title */}
                            <Link href={`/product?id=${product.id}`}>
                              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] leading-snug group-hover:text-[#103B23] transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center gap-1.5 text-xs text-[#5C6B5E] font-medium">
                              <span className="text-[#C28328]">★</span>
                              <span className="font-semibold text-stone-800">{product.rating}</span>
                              <span className="text-stone-400">({product.reviews} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="pt-1">
                              <span className="font-bold text-xl sm:text-2xl text-[#103B23]">
                                ₹{product.price}
                              </span>
                            </div>

                          </div>

                          {/* Action Buttons: Cart Quick Icon + Add to Cart Pill Button */}
                          <div className="pt-2 flex items-center gap-2.5">
                            
                            {/* Quick Cart Icon Button */}
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(product, e)}
                              className="w-10 h-10 rounded-full bg-[#EBF3EA] hover:bg-[#DCEBDB] text-[#103B23] flex items-center justify-center transition-all duration-300 shadow-2xs active:scale-95 cursor-pointer shrink-0"
                              aria-label={`Add ${product.name} to Cart`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                              </svg>
                            </button>

                            {/* Main Add to Cart Pill Button */}
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(product, e)}
                              className="flex-1 py-2.5 px-4 rounded-full bg-[#103B23] hover:bg-[#194E31] active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer text-center"
                            >
                              Add to Cart
                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PROMOTIONAL BANNER ("Why EarthGlanze?" & "Nature's Care")
          ========================================================================= */}
      <section className="py-8 sm:py-12 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Card: Why EarthGlanze? */}
            <div className="lg:col-span-4 bg-[#EAF3E8] rounded-[24px] p-6 sm:p-8 border border-[#D5E6D2] flex flex-col justify-between shadow-2xs relative overflow-hidden">
              
              <div className="space-y-4 relative z-10">
                {/* Botanical leaf icon */}
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#103B23]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9c0-2-2-4-5-4s-3 2-4 2-1-2-4-2-5 2-5 4a9 9 0 0 0 9 9z"/>
                  </svg>
                </div>

                <h3 className="font-serif font-bold text-2xl text-[#1E3B2B] leading-tight">
                  Why <br />EarthGlanze?
                </h3>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-[#1E3B2B] font-medium font-sans">
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#103B23] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Natural Ingredients</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#103B23] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>No Harsh Chemicals</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#103B23] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Gentle on All Skin Types</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#103B23] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Ethically Sourced</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Banner Card: Nature's Care for Your Skin */}
            <div className="lg:col-span-8 bg-[#FAF5ED] rounded-[24px] p-6 sm:p-10 border border-[#E8DEC8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs relative overflow-hidden">
              
              <div className="space-y-4 max-w-md relative z-10 text-left">
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E3B2B] leading-snug">
                  Nature&apos;s Care <br />
                  <span className="text-[#C28328] italic font-serif font-normal">for Your Skin</span>
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-[#5C6B5E] leading-relaxed font-sans">
                  Explore our plant-powered soaps and lip care essentials.
                </p>

                <div className="pt-2">
                  <a 
                    href="#top"
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#103B23] hover:bg-[#194E31] text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm active:scale-95 group/btn cursor-pointer"
                  >
                    <span>Shop the Collection</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Promo Image: Trio on pedestal smoothly feathered into #FAF5ED */}
              <div className="relative w-full md:w-1/2 flex justify-center md:justify-end z-0">
                <img 
                  src="/assets/shop_natural_skincare_collection_showcase.png" alt="EarthGlanze Natural Skincare Collection - Manjistha Soap, Goat Milk Soap, Beetroot Lip Balm" className="w-full max-w-[360px] sm:max-w-[420px] object-contain select-none pointer-events-none transform hover:scale-[1.02] transition-transform duration-500" loading="lazy" width="1024" height="682" />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: BOTTOM TRUST PILL BADGES
          ========================================================================= */}
      <section className="pb-16 sm:pb-20 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="bg-white rounded-[24px] py-6 px-6 sm:px-10 border border-[#E8DEC8] shadow-2xs grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EBF3EA] flex items-center justify-center text-[#103B23] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9c0-2-2-4-5-4s-3 2-4 2-1-2-4-2-5 2-5 4a9 9 0 0 0 9 9z"/>
                </svg>
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#1E3B2B]">100%</span>
                <span className="text-xs text-[#5C6B5E]">Natural Ingredients</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EBF3EA] flex items-center justify-center text-[#103B23] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#1E3B2B]">No Harsh</span>
                <span className="text-xs text-[#5C6B5E]">Chemicals</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EBF3EA] flex items-center justify-center text-[#103B23] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#1E3B2B]">Gentle on</span>
                <span className="text-xs text-[#5C6B5E]">All Skin Types</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EBF3EA] flex items-center justify-center text-[#103B23] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#1E3B2B]">Eco-Conscious</span>
                <span className="text-xs text-[#5C6B5E]">Care</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
