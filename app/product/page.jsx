'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import api from '../../lib/api';

const DEFAULT_PRODUCTS = {
  1: {
    id: 1,
    sku: 'EG-SOAP-MANJ',
    name: 'Manjistha Soap',
    slug: 'manjistha-soap',
    category_name: 'Soaps',
    price: 349,
    sale_price: 349,
    original_price: 399,
    weight: '100 g',
    stock_qty: 48,
    rating: 4.9,
    review_count: 428,
    tagline: 'Purifies skin, helps reduce blemishes and gives a natural glow.',
    description: 'A traditional Ayurvedic cleansing bar crafted with pure wild Manjistha (Rubia cordifolia), red sandalwood, and nourishing cold-pressed coconut oil. Naturally detoxifies the skin, diminishes uneven tone, and restores youthful radiance without stripping moisture.',
    benefits: 'Fades hyperpigmentation, purifies acne-prone skin, imparts an authentic herbal glow, and maintains dermal pH balance.',
    ingredients: 'Wild Manjistha (Rubia Cordifolia) Root Extract, Pure Cold-Pressed Coconut Oil, Mahua Oil, Red Sandalwood Extract, Castor Oil, Botanical Lye.',
    how_to_use: 'Work into a rich creamy lather with warm water. Gently massage over damp face and body in circular motions. Rinse thoroughly and pat dry with a soft towel.',
    image_closed: '/assets/manjistha_closed_box.png',
    image_open: '/assets/manjistha_open_box.png',
    image_photo: '/assets/bestseller_manjistha_photo_hd.png',
  },
  2: {
    id: 2,
    sku: 'EG-SOAP-GOAT',
    name: 'Goat Milk Soap',
    slug: 'goat-milk-soap',
    category_name: 'Soaps',
    price: 349,
    sale_price: 349,
    original_price: 399,
    weight: '100 g',
    stock_qty: 36,
    rating: 4.8,
    review_count: 512,
    tagline: 'Ultra-gentle deep hydration enriched with fresh goat milk and shea butter.',
    description: 'An indulgent, deeply hydrating cold-process bar crafted with fresh farm goat milk, rich unrefined shea butter, and sweet almond oil. Packed with lactic acid, vitamins A and E, it gently micro-exfoliates and restores the natural moisture barrier of dry, sensitive skin.',
    benefits: 'Soothes dry and irritated skin, micro-exfoliates dead epidermal layers gently, and provides deep cellular hydration.',
    ingredients: 'Fresh Farm Goat Milk, Pure Cold-Pressed Coconut Oil, Raw Organic Shea Butter, Sweet Almond Oil, Extra Virgin Olive Oil, Botanical Lye.',
    how_to_use: 'Lather between wet palms until a rich milky foam appears. Gently apply all over body or face. Leave on for 30 seconds for maximum absorption of nutrients, then rinse with cool water.',
    image_closed: '/assets/goat_milk_closed_box.png',
    image_open: '/assets/goat_milk_open_box.png',
    image_photo: '/assets/bestseller_goatmilk_photo_hd.png',
  },
  3: {
    id: 3,
    sku: 'EG-BALM-BEET',
    name: 'Beetroot Lip Balm',
    slug: 'beetroot-lip-balm',
    category_name: 'Lip Care',
    price: 249,
    sale_price: 249,
    original_price: 299,
    weight: '10 g',
    stock_qty: 55,
    rating: 4.9,
    review_count: 396,
    tagline: 'Naturally tinted, ultra-softening lip butter infused with pure beetroot extract.',
    description: 'An all-natural, antioxidant-packed lip butter handcrafted with sun-dried beetroot extract, golden beeswax, organic shea butter, and cold-pressed sweet almond oil. Deeply repairs chapped lips while lending a healthy, subtle rosy tint without artificial pigments.',
    benefits: 'Heals dry and cracked lips, locks in deep moisture for 12 hours, and gives a natural rosy tint with regular use.',
    ingredients: 'Pure Beetroot (Beta Vulgaris) Extract, Golden Honeycomb Beeswax, Unrefined Shea Butter, Cold-Pressed Almond Oil, Vitamin E Oil, Pure Rose Damascena Oil.',
    how_to_use: 'Take a small amount onto your clean fingertip. Smooth evenly across dry or chapped lips. Apply whenever needed or before bed as an intensive overnight lip sleeping mask.',
    image_closed: '/assets/lipbalm_box.png',
    image_open: '/assets/bestseller_lipbalm_photo_hd.png',
    image_photo: '/assets/bestseller_lipbalm_photo_hd.png',
  }
};

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const idOrSlug = searchParams.get('id') || searchParams.get('slug') || '1';

  const [product, setProduct] = useState(DEFAULT_PRODUCTS[1]);
  const [activeImage, setActiveImage] = useState('/assets/bestseller_manjistha_photo_hd.png');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await api.products.getByIdOrSlug(idOrSlug);
        if (res.success && res.product) {
          setProduct(res.product);
          setActiveImage(res.product.image_photo || res.product.image_closed || '/assets/bestseller_manjistha_photo_hd.png');
        } else {
          // fallback to matching default
          const found = Object.values(DEFAULT_PRODUCTS).find(
            p => String(p.id) === String(idOrSlug) || p.slug === idOrSlug
          ) || DEFAULT_PRODUCTS[1];
          setProduct(found);
          setActiveImage(found.image_photo || found.image_closed);
        }
      } catch (err) {
        const found = Object.values(DEFAULT_PRODUCTS).find(
          p => String(p.id) === String(idOrSlug) || p.slug === idOrSlug
        ) || DEFAULT_PRODUCTS[1];
        setProduct(found);
        setActiveImage(found.image_photo || found.image_closed);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    setQuantity(1);
  }, [idOrSlug]);

  const discountPercent = product.original_price && product.original_price > product.sale_price
    ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
    : null;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const res = await addToCart(product.id, quantity);
    setAddingToCart(false);
    if (res.success) {
      setToastMessage(`Added ${quantity} × ${product.name} to Cart`);
    } else {
      setToastMessage(res.message || 'Added to cart');
    }
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
    router.push('/cart');
  };

  const galleryImages = [
    product.image_photo,
    product.image_closed,
    product.image_open,
  ].filter(Boolean);

  const relatedList = Object.values(DEFAULT_PRODUCTS).filter(p => p.id !== product.id);

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#1E3B2B] font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D2D1C] text-white px-5 py-3 rounded-full shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-fadeIn">
          <span className="w-6 h-6 rounded-full bg-[#235327] flex items-center justify-center text-xs font-bold">✓</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <Link href="/cart" className="ml-2 text-xs font-bold text-amber-300 underline underline-offset-2 hover:text-white">
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link href="/" className="hover:text-emerald-900 transition">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-emerald-900 transition">Shop</Link>
          <span>›</span>
          <span className="text-stone-800 font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Detail View */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage */}
            <div className="w-full aspect-[4/3] bg-white rounded-3xl p-6 sm:p-10 flex items-center justify-center shadow-sm border border-[#E8DEC8] relative overflow-hidden group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-xl"
              />
              <span className="absolute top-4 left-4 bg-[#1E3B2B] text-amber-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
                {product.category_name || 'Ayurvedic Skincare'}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl bg-white border-2 p-2 flex items-center justify-center transition shrink-0 cursor-pointer ${
                    activeImage === img ? 'border-[#1E3B2B] shadow-md ring-2 ring-[#1E3B2B]/20' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details & Cart Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-emerald-800 block mb-1">
                {product.weight ? `${product.weight} • Pure Botanical Formulation` : 'Pure Botanical Formulation'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E3B2B] tracking-tight">
                {product.name}
              </h1>
              
              {/* Reviews Rating Header */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500 text-sm">★★★★★</div>
                <span className="text-xs font-bold text-stone-700">{product.rating || 4.9}</span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500">({product.review_count || 420} Customer Reviews)</span>
              </div>
            </div>

            {/* Pricing Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-bold text-[#1E3B2B]">
                ₹{product.sale_price || product.price}
              </span>
              {product.original_price && (
                <span className="text-base text-stone-400 line-through">
                  ₹{product.original_price}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              {product.tagline}
            </p>

            {/* Botanical Trust Pills */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3 rounded-2xl border border-[#E8DEC8] text-center">
                <span className="text-lg block mb-0.5">🌿</span>
                <span className="text-[11px] font-bold text-[#1E3B2B] block">Herbal Care</span>
                <span className="text-[10px] text-stone-500">100% Ayurvedic</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#E8DEC8] text-center">
                <span className="text-lg block mb-0.5">💧</span>
                <span className="text-[11px] font-bold text-[#1E3B2B] block">Gentle & Safe</span>
                <span className="text-[10px] text-stone-500">Daily Cleansing</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#E8DEC8] text-center">
                <span className="text-lg block mb-0.5">🧪</span>
                <span className="text-[11px] font-bold text-[#1E3B2B] block">No Harsh Chem</span>
                <span className="text-[10px] text-stone-500">Sulfate Free</span>
              </div>
            </div>

            {/* Quantity & Add to Cart Controls */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                
                {/* Quantity Counter */}
                <div className="flex items-center bg-white border border-stone-300 rounded-2xl shadow-sm overflow-hidden">
                  <button 
                    type="button" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-lg font-bold" 
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-stone-900 select-none">
                    {quantity}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(q => Math.min(product.stock_qty || 10, q + 1))}
                    className="w-11 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-lg font-bold" 
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button 
                  type="button" 
                  onClick={handleAddToCart}
                  disabled={addingToCart || (product.stock_qty <= 0)}
                  className="flex-1 min-w-[160px] h-12 bg-[#1E3B2B] hover:bg-[#14291E] text-white font-bold text-sm rounded-2xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <span>{addingToCart ? 'Adding...' : 'Add to Bag'}</span>
                </button>

                {/* Buy Now Button */}
                <button 
                  type="button" 
                  onClick={handleBuyNow}
                  disabled={addingToCart || (product.stock_qty <= 0)}
                  className="flex-1 min-w-[160px] h-12 bg-[#C28328] hover:bg-[#a66f21] text-white font-bold text-sm rounded-2xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <span>Buy Now →</span>
                </button>
              </div>

              {/* Stock and Delivery Assurance */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {(product.stock_qty > 0) ? `In Stock (${product.stock_qty} available)` : 'Temporarily Out of Stock'}
                </span>
                <span>Free Express Pan-India Delivery</span>
              </div>
            </div>

            {/* Tabbed Information */}
            <div className="pt-6">
              <div className="flex items-center border-b border-stone-200 gap-6 text-sm font-semibold">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'desc' ? 'border-[#1E3B2B] text-[#1E3B2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Description
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('ing')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'ing' ? 'border-[#1E3B2B] text-[#1E3B2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Ingredients
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('use')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'use' ? 'border-[#1E3B2B] text-[#1E3B2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  How to Use
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('rev')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'rev' ? 'border-[#1E3B2B] text-[#1E3B2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Customer Reviews
                </button>
              </div>

              <div className="pt-4 text-xs sm:text-sm text-stone-600 leading-relaxed min-h-[140px]">
                {activeTab === 'desc' && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <strong className="text-stone-800 block mb-1">Key Botanical Benefits:</strong>
                      <p>{product.benefits}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'ing' && (
                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                    <strong className="text-[#1E3B2B] block">100% Pure Botanical Actives:</strong>
                    <p>{product.ingredients}</p>
                  </div>
                )}

                {activeTab === 'use' && (
                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                    <strong className="text-[#1E3B2B] block">Ayurvedic Daily Application:</strong>
                    <p>{product.how_to_use}</p>
                  </div>
                )}

                {activeTab === 'rev' && (
                  <div className="space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-800">Ayesha N.</span>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-xs text-stone-600">The formulation is truly remarkable. Keeps my skin soft, glowing, and radiant with no tightness.</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-800">Rohit K.</span>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-xs text-stone-600">100% natural and gentle. My whole family has switched to EarthGlaze!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        <section className="mt-16 pt-12 border-t border-[#E8DEC8]">
          <h2 className="text-2xl font-serif font-bold text-[#1E3B2B] mb-6">Complete Your Natural Skincare Routine</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {relatedList.map((rel) => (
              <Link 
                key={rel.id} 
                href={`/product?id=${rel.id}`}
                className="bg-white p-5 rounded-3xl border border-[#E8DEC8] hover:shadow-lg transition flex items-center gap-4 group"
              >
                <div className="w-20 h-20 bg-[#FAF7F2] rounded-2xl p-2 flex items-center justify-center shrink-0">
                  <img src={rel.image_photo || rel.image_closed} alt={rel.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1E3B2B] group-hover:text-emerald-800 transition">{rel.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{rel.tagline}</p>
                  <span className="font-bold text-sm text-[#1E3B2B] block mt-1.5">₹{rel.sale_price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-semibold text-stone-500">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
