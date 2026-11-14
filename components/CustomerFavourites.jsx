'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useSiteContent } from '../hooks/useSiteContent';
import styles from './CustomerFavourites.module.css';

const FAVOURITES_PRODUCTS = [
  {
    id: 1,
    slug: 'manjistha-soap',
    name: 'Manjistha Soap',
    badge: {
      text: 'Bestseller',
      icon: '👑',
      style: 'bg-[#FEF6E4] border-[#F0D9A3] text-[#8E5906]',
    },
    weight: '100 g',
    filterTag: 'glow',
    closedImage: '/assets/manjistha_closed_box.png',
    openImage: '/assets/manjistha_open_box.png',
    benefit: 'Purifies skin & gives a natural radiant glow.',
    keyIngredients: ['Manjistha Root', 'Red Sandalwood'],
    ingredientsFull:
      'Wild Manjistha (Rubia Cordifolia) Root Extract, Pure Cold-Pressed Coconut Oil, Mahua Oil, Red Sandalwood Extract, Castor Oil, Botanical Lye.',
    benefitsDetail:
      'Fades hyperpigmentation, purifies acne-prone skin, imparts an authentic herbal glow, and maintains dermal pH balance.',
    howToUse:
      'Work into a rich creamy lather with warm water. Gently massage over damp face and body in circular motions, rinse, and pat dry.',
    rating: 4.9,
    reviews: 428,
    price: 349,
    originalPrice: 399,
    category: 'Soaps',
    highlightBorder: false,
  },
  {
    id: 2,
    slug: 'goat-milk-soap',
    name: 'Goat Milk Soap',
    badge: {
      text: 'Top Rated',
      icon: '★',
      style: 'bg-[#FEF6E4] border-[#F0D9A3] text-[#8E5906]',
    },
    weight: '100 g',
    filterTag: 'hydration',
    closedImage: '/assets/goatmilksoap_close_box.png',
    openImage: '/assets/goatmilksoap_open_box.png',
    benefit: 'Nourishes & deeply moisturizes sensitive skin.',
    keyIngredients: ['Fresh Goat Milk', 'Organic Shea'],
    ingredientsFull:
      'Fresh Farm Goat Milk, Pure Cold-Pressed Coconut Oil, Raw Organic Shea Butter, Sweet Almond Oil, Extra Virgin Olive Oil, Botanical Lye.',
    benefitsDetail:
      'Soothes dry and irritated skin, micro-exfoliates dead epidermal layers gently with natural lactic acid, and provides lasting hydration.',
    howToUse:
      'Lather between wet palms into a creamy milky foam. Leave on skin for 30 seconds for deep nutrient absorption, then rinse cool.',
    rating: 4.8,
    reviews: 512,
    price: 349,
    originalPrice: 399,
    category: 'Soaps',
    highlightBorder: true,
  },
  {
    id: 3,
    slug: 'beetroot-lip-balm',
    name: 'Beet Root Lip Balm',
    badge: {
      text: 'Highly Loved',
      icon: '♡',
      style: 'bg-[#FFF0F4] border-[#F7C7D6] text-[#A8244A]',
    },
    weight: '10 g',
    filterTag: 'lipcare',
    closedImage: '/assets/lip_balm_closed_box.png',
    openImage: '/assets/lipbalmopenbox.png',
    benefit: 'Keeps lips soft, smooth & naturally tinted.',
    keyIngredients: ['Beetroot Extract', 'Honey Beeswax'],
    ingredientsFull:
      'Pure Beetroot (Beta Vulgaris) Extract, Golden Honeycomb Beeswax, Unrefined Shea Butter, Cold-Pressed Almond Oil, Vitamin E, Pure Rose Damascena Oil.',
    benefitsDetail:
      'Heals dry and cracked lips, locks in moisture for 12 hours, and lends a soft natural rosy tint with daily use.',
    howToUse:
      'Smooth a small amount across dry lips as needed during the day, or apply a generous layer before sleep as a lip mask.',
    rating: 4.9,
    reviews: 396,
    price: 249,
    originalPrice: 299,
    category: 'Lip Care',
    highlightBorder: false,
  },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Favourites', count: 3 },
  { id: 'glow', label: 'Glow & Detox', count: 1 },
  { id: 'hydration', label: 'Sensitive & Dry', count: 1 },
  { id: 'lipcare', label: 'Lip Care', count: 1 },
];

function StarRow({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1.5 text-[11.5px]">
      <div className="flex text-[#E5A823] leading-none" aria-label={`${rating} out of 5 stars`}>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
      <span className="font-semibold text-[#1E3B2B]">{rating.toFixed(1)}</span>
      <span className="text-[#66776A]">({reviews})</span>
    </div>
  );
}

function ProductQuickViewModal({
  product,
  isSaved,
  onToggleSave,
  onClose,
  onAddQty,
}) {
  const [qty, setQty] = useState(1);
  const [showOpen, setShowOpen] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setQty(1);
    setShowOpen(true);
  }, [product?.id]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!product) return null;

  const savings = product.originalPrice - product.price;

  const handleAdd = async () => {
    setAdding(true);
    await onAddQty(product, qty);
    setAdding(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        className={`${styles.modalPanel} relative w-full max-w-[740px] max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF7F2] border border-[#E5DAC5] shadow-2xl p-5 sm:p-7`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/95 border border-[#E5DAC5] text-[#1E3B2B] hover:bg-[#1E3B2B] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Interactive Showcase Stage */}
          <div className="md:col-span-5">
            <div className="relative h-[220px] sm:h-[250px] rounded-2xl bg-[radial-gradient(ellipse_at_50%_55%,#FFFFFF_0%,#F6EFE2_75%,#EFE4D0_100%)] border border-[#EAE0CC] flex items-center justify-center p-4 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 w-[66%] h-4 rounded-full bg-[#1E3B2B]/10 blur-md"
              />
              <img
                src={showOpen ? product.openImage : product.closedImage}
                alt={`${product.name} ${showOpen ? 'open view' : 'packaging view'}`}
                className="relative z-10 max-h-[190px] w-auto object-contain transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowOpen((prev) => !prev)}
                className="absolute bottom-2.5 right-2.5 z-20 rounded-full bg-white/95 hover:bg-[#1E3B2B] text-[#1E3B2B] hover:text-white border border-[#DED2BC] px-3 py-1 text-[11px] font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {showOpen ? 'Show Box View' : 'Unbox Inside'}
              </button>
            </div>
          </div>

          {/* Product Metadata & Actions */}
          <div className="md:col-span-7 space-y-3 text-left">
            <div className="flex items-center justify-between gap-2 pr-6">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${product.badge.style}`}>
                <span>{product.badge.icon}</span>
                <span>{product.badge.text}</span>
              </span>
              <span className="text-xs font-semibold text-[#5E6E61]">Net Wt. {product.weight}</span>
            </div>

            <div>
              <h3 id="quick-view-title" className="font-serif text-2xl font-bold text-[#1E3B2B]">
                {product.name}
              </h3>
              <div className="mt-1 flex items-center gap-3">
                <StarRow rating={product.rating} reviews={product.reviews} />
                <span className="text-[11px] font-semibold text-[#216E39] bg-[#E8F5EC] px-2 py-0.5 rounded-full">
                  In Stock
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#4A5A4E] leading-relaxed">
              {product.benefitsDetail}
            </p>

            <div className="rounded-xl bg-white/85 border border-[#EAE0CE] p-3 space-y-1.5 text-xs">
              <div>
                <span className="font-bold text-[#1E3B2B]">Key Ingredients: </span>
                <span className="text-[#526256]">{product.ingredientsFull}</span>
              </div>
              <div>
                <span className="font-bold text-[#1E3B2B]">How to Use: </span>
                <span className="text-[#526256]">{product.howToUse}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1E3B2B]">₹{product.price}</span>
                <span className="text-xs text-stone-400 line-through">₹{product.originalPrice}</span>
                <span className="text-[11px] font-bold text-[#216E39] bg-[#E8F5EC] px-2 py-0.5 rounded-full">
                  Save ₹{savings}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onToggleSave(product.id)}
                aria-pressed={isSaved}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3B2B] hover:text-[#B82B54] cursor-pointer"
              >
                <span className={isSaved ? 'text-[#D6336C]' : ''}>{isSaved ? '♥' : '♡'}</span>
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center rounded-full border border-[#D7CCB8] bg-white px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 rounded-full text-[#1E3B2B] hover:bg-[#FAF7F2] font-bold cursor-pointer"
                >
                  −
                </button>
                <span className="w-7 text-center text-xs font-bold text-[#1E3B2B]">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-7 h-7 rounded-full text-[#1E3B2B] hover:bg-[#FAF7F2] font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={adding}
                className="flex-1 min-w-[160px] py-2.5 px-5 rounded-full bg-[#0D2D1C] hover:bg-[#1B4A2F] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {adding ? 'Adding...' : `Add to Cart — ₹${product.price * qty}`}
              </button>

              <Link
                href={`/product?id=${product.id}`}
                onClick={onClose}
                className="text-xs font-semibold text-[#1E3B2B] underline underline-offset-4 hover:text-[#8A6A32] px-2"
              >
                Full Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerFavourites() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [addedId, setAddedId] = useState(null);
  const [comboAdded, setComboAdded] = useState(false);
  const [comboLoading, setComboLoading] = useState(false);
  const [savedIds, setSavedIds] = useState({});
  const [peekedIds, setPeekedIds] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { addToCart } = useCart();
  const { getSection } = useSiteContent();
  const favData = getSection('home', 'favourites');

  const visibleProducts = useMemo(() => {
    if (activeFilter === 'all') return FAVOURITES_PRODUCTS;
    return FAVOURITES_PRODUCTS.filter((p) => p.filterTag === activeFilter);
  }, [activeFilter]);

  const handleAddToCart = useCallback(
    async (product, quantity = 1) => {
      setAddedId(product.id);
      await addToCart(product.id, quantity, {
        productInfo: {
          name: product.name,
          image: product.closedImage,
          price: product.price,
        },
      });
      setTimeout(() => {
        setAddedId((prev) => (prev === product.id ? null : prev));
      }, 2000);
    },
    [addToCart]
  );

  const handleAddCompleteCombo = useCallback(async () => {
    setComboLoading(true);
    try {
      for (const prod of FAVOURITES_PRODUCTS) {
        await addToCart(prod.id, 1, {
          showToast: prod.id === 3,
          productInfo: {
            name: 'Complete Natural Care Set (3-Piece Combo)',
            image: prod.closedImage,
            price: 799,
          },
        });
      }
      setComboAdded(true);
      setTimeout(() => setComboAdded(false), 2600);
    } finally {
      setComboLoading(false);
    }
  }, [addToCart]);

  const toggleSave = useCallback((id) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const togglePeek = useCallback((id) => {
    setPeekedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <section
      id="customer-favourites"
      className="relative w-full bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-x-clip"
      aria-label="Customer Favourites"
    >
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        {/* Compact Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-[0.22em] text-[#2E6B3E] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B3E]" aria-hidden="true" />
            {favData.eyebrow || 'Pure Botanical Formulation'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-[#1E3B2B] tracking-tight leading-tight">
            {favData.title || (
              <>Customer <span className="italic font-normal text-[#8A6A32]">Favourites</span></>
            )}
          </h2>
          <p className="mt-1 text-xs sm:text-[13.5px] text-[#556358] leading-relaxed font-sans">
            {favData.subtitle || 'Handcrafted in small batches with cold-pressed oils & pure herbs — hover or tap a card to unbox.'}
          </p>
        </div>

        {/* Interactive Skin-Concern Filter Pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-5"
          role="tablist"
          aria-label="Filter favourites by skincare benefit"
        >
          {FILTER_OPTIONS.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1E3B2B] text-white border-[#1E3B2B] shadow-sm'
                    : 'bg-white/90 text-[#2E4638] border-[#E4DAC7] hover:border-[#1E3B2B]/40 hover:bg-white'
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F4EEE2] text-[#617064]'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Seamless Product Cards Grid */}
        <div
          className={`grid gap-4 sm:gap-5 items-stretch mx-auto ${
            visibleProducts.length === 1
              ? 'grid-cols-1 max-w-[350px]'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {visibleProducts.map((product, idx) => {
            const isAdded = addedId === product.id;
            const isSaved = Boolean(savedIds[product.id]);
            const isPeekOpen = Boolean(peekedIds[product.id]);
            const savings = product.originalPrice - product.price;

            return (
              <article
                key={product.id}
                className={`group relative bg-white rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between border stagger-${idx + 1} ${
                  product.highlightBorder
                    ? 'border-[#D4AF37]/55 shadow-sm ring-1 ring-[#D4AF37]/25'
                    : 'border-[#EAE2D3]'
                }`}
              >
                {/* Header Row: Badge + Weight + Wishlist */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${product.badge.style}`}
                  >
                    <span>{product.badge.icon}</span>
                    <span>{product.badge.text}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#6F7E72] font-sans">
                      {product.weight}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSave(product.id)}
                      aria-pressed={isSaved}
                      aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm transition-all duration-300 cursor-pointer icon-hover-heart ${
                        isSaved
                          ? `${styles.heartPop} bg-[#FFF0F4] border-[#F4C2D1] text-[#D6336C]`
                          : 'bg-[#FAF7F2] border-[#E7DEC9] text-[#5B6B5F] hover:text-[#D6336C] hover:border-[#F4C2D1]'
                      }`}
                    >
                      {isSaved ? '♥' : '♡'}
                    </button>
                  </div>
                </div>

                {/* Seamless Transparent Product Stage (No Rectangular Seam!) */}
                <div className="relative h-[155px] sm:h-[168px] w-full rounded-xl bg-[radial-gradient(ellipse_at_50%_58%,#FFFFFF_0%,#F8F3E8_68%,#EFE6D4_100%)] border border-[#EFE7D6] overflow-hidden flex items-center justify-center px-4 py-2.5">
                  {/* Soft botanical ground shadow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[66%] h-3.5 rounded-full bg-[#1E3B2B]/[0.08] blur-[6px] transition-all duration-300 group-hover:w-[74%] group-hover:bg-[#1E3B2B]/[0.12]"
                  />

                  <Link
                    href={`/product?id=${product.id}`}
                    className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer"
                    aria-label={`View ${product.name} details`}
                  >
                    {/* Default Closed Box / Jar */}
                    <img
                      src={product.closedImage}
                      alt={product.name}
                      loading="eager"
                      decoding="async"
                      className={`max-h-[136px] sm:max-h-[144px] w-auto object-contain transition-all duration-500 ease-out ${
                        isPeekOpen
                          ? 'opacity-0 scale-95'
                          : 'opacity-100 group-hover:opacity-0 group-hover:scale-95'
                      }`}
                    />
                    {/* Reveal Open Box / Balm Texture on Hover or Toggle */}
                    <img
                      src={product.openImage}
                      alt={`${product.name} open view`}
                      loading="lazy"
                      decoding="async"
                      className={`pointer-events-none absolute inset-0 m-auto max-h-[136px] sm:max-h-[144px] w-auto object-contain transition-all duration-500 ease-out ${
                        isPeekOpen
                          ? 'opacity-100 scale-[1.03]'
                          : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-[1.03]'
                      }`}
                    />
                  </Link>

                  {/* Quick Engagement Actions Floating Bottom Bar */}
                  <div className="absolute bottom-1.5 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
                    <button
                      type="button"
                      onClick={() => togglePeek(product.id)}
                      aria-pressed={isPeekOpen}
                      aria-label={`Toggle inside view for ${product.name}`}
                      className="pointer-events-auto rounded-full bg-white/90 hover:bg-[#1E3B2B] text-[#1E3B2B] hover:text-white border border-[#E0D5BE] px-2 py-0.5 text-[10px] font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      {isPeekOpen ? 'Box View' : 'Unbox'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      aria-label={`Quick view ${product.name}`}
                      className="pointer-events-auto rounded-full bg-white/90 hover:bg-[#1E3B2B] text-[#1E3B2B] hover:text-white border border-[#E0D5BE] px-2.5 py-0.5 text-[10px] font-semibold shadow-2xs transition-colors cursor-pointer opacity-95 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Title, Benefit, Ingredients & Rating */}
                <div className="mt-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product?id=${product.id}`} className="group/title">
                        <h3 className="font-serif font-bold text-[17px] sm:text-[18.5px] text-[#1E3B2B] group-hover/title:text-[#2E6B3E] transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="shrink-0 text-[10px] font-bold text-[#216E39] bg-[#EAF5EC] px-2 py-0.5 rounded-full mt-0.5">
                        Save ₹{savings}
                      </span>
                    </div>

                    <p className="text-[11.5px] sm:text-xs text-[#55665A] leading-snug line-clamp-1 font-sans mt-0.5">
                      {product.benefit}
                    </p>

                    {/* Key Botanical Ingredient Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {product.keyIngredients.map((ing) => (
                        <span
                          key={ing}
                          className="inline-block text-[10px] font-medium text-[#355340] bg-[#F4EFE4] border border-[#E8DEC8] px-2 py-0.5 rounded-full"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <StarRow rating={product.rating} reviews={product.reviews} />
                  </div>
                </div>

                {/* Compact Price & Add to Cart Row */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#F1EBE0]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-bold text-[#1E3B2B] tracking-tight">
                      ₹{product.price}
                    </span>
                    <span className="text-[11px] text-stone-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product, 1)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full font-semibold text-xs shadow-xs transition-all duration-200 cursor-pointer active:scale-95 ${
                      isAdded
                        ? 'bg-[#1E7D3A] text-white'
                        : 'bg-[#0D2D1C] hover:bg-[#1A4B2F] text-white hover:shadow-sm'
                    }`}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {isAdded ? (
                      <>
                        <span>✓</span>
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 icon-hover-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Engaging Bottom Routine Combo Strip + View All CTA */}
        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#F4EDE0] via-[#FAF6EE] to-[#F4EDE0] border border-[#E4D9C4] px-4 sm:px-5 py-3 shadow-2xs">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span className="inline-flex items-center rounded-full bg-[#C28328] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Complete Ritual
            </span>
            <p className="text-xs sm:text-[13px] font-medium text-[#1E3B2B]">
              Get all 3 favourites in the <span className="font-bold">Natural Care Combo</span> for{' '}
              <span className="font-bold">₹799</span>{' '}
              <span className="text-[11px] text-stone-500 line-through">₹947</span>{' '}
              <span className="font-semibold text-[#216E39]">(Save ₹148)</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleAddCompleteCombo}
              disabled={comboLoading}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-xs ${
                comboAdded
                  ? 'bg-[#1E7D3A] text-white'
                  : 'bg-[#1E3B2B] hover:bg-[#2B533D] text-white'
              }`}
            >
              {comboLoading
                ? 'Adding Combo...'
                : comboAdded
                  ? '✓ 3-Piece Combo Added!'
                  : 'Add 3-Piece Combo — ₹799'}
            </button>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-[#1E3B2B]/70 text-[#1E3B2B] font-semibold text-xs hover:bg-[#1E3B2B] hover:text-white transition-all cursor-pointer"
            >
              <span>Shop All</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isSaved={quickViewProduct ? Boolean(savedIds[quickViewProduct.id]) : false}
        onToggleSave={toggleSave}
        onClose={() => setQuickViewProduct(null)}
        onAddQty={handleAddToCart}
      />
    </section>
  );
}
