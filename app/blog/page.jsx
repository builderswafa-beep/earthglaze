'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const categories = [
    { id: 'All Posts', name: 'All Posts', icon: 'grid' },
    { id: 'Skincare Tips', name: 'Skincare Tips', icon: 'leaf' },
    { id: 'Ingredients', name: 'Ingredients', icon: 'flask' },
    { id: 'Product Care', name: 'Product Care', icon: 'heart' },
    { id: 'Natural Living', name: 'Natural Living', icon: 'eco' },
  ];

  const featuredArticle = {
    id: 'featured-aloe-vera',
    title: 'Aloe Vera for Healthy, Glowing Skin',
    category: 'Ingredients',
    date: 'Jun 15, 2025',
    readTime: '6 min read',
    excerpt: 'Discover how aloe vera soothes, hydrates and naturally nourishes your skin.',
    image: '/assets/blog_featured_aloe_clean.png',
    author: 'Dr. Ananya Rao • Ayurvedic Specialist',
    content: `
      Aloe Vera, often hailed as 'Kumari' in Ayurvedic pharmacology, has been an indispensable beauty elixir for over five millennia. Its translucent, nutrient-dense gel houses over 75 active constituents, including vitamins A, C, and E, active enzymes, and polysaccharides that deeply nourish without clogging pores.

      1. Intense, Weightless Hydration
      Unlike heavy petroleum-based creams that create an artificial seal, aloe vera is 99% pure botanical water bound with glucomannans. It penetrates down to the dermis four times faster than water, replenishing intracellular moisture reserves.

      2. Calming Inflammation & Sun Recovery
      Natural aloin and glycoproteins in fresh aloe vera accelerate epithelial cell regeneration, making it the supreme remedy for sunburn, redness, and sensitive barrier recovery.

      3. How We Use It at EarthGlaze
      In our handcrafted formulations, we utilize cold-pressed aloe vera juice directly from certified organic farms in southern India, ensuring raw enzymes remain thermally intact and biologically active.
    `
  };

  const articles = [
    {
      id: 'beetroot-radiant-lips',
      title: 'Beetroot for Naturally Radiant Lips',
      category: 'Ingredients',
      date: 'Jun 10, 2025',
      readTime: '4 min read',
      excerpt: 'How beetroot helps nourish, brighten and keep your lips healthy.',
      image: '/assets/blog_card_beetroot_hd.png',
      author: 'Pooja Sharma • Formulation Chemist',
      content: `
        Beetroot is nature's most vivid botanical pigment and a potent antioxidant powerhouse. Rich in betalains and vitamin C, it gently exfoliates dry lip skin while imparting a natural, rosy blush that synthetics can never replicate.

        Why Natural Beetroot Tint Lasts:
        Betanin molecules bind harmoniously with the lipid barrier of lip epidermis, providing a flush of tint while natural plant sterols lock in moisture. Combined with virgin cold-pressed coconut oil, it keeps chapping and discoloration at bay.
      `
    },
    {
      id: 'why-natural-soaps',
      title: 'Why Natural Soaps Are Better for Your Skin',
      category: 'Skincare Tips',
      date: 'Jun 06, 2025',
      readTime: '5 min read',
      excerpt: 'The benefits of choosing chemical-free, plant-based soaps for everyday care.',
      image: '/assets/blog_card_soap_hd.png',
      author: 'Dr. Ananya Rao • Ayurvedic Specialist',
      content: `
        Most commercial bars found on supermarket shelves are not soaps at all — they are synthetic detergent noodles stripped of natural glycerin to cut manufacturing costs. 

        Cold-Processed Micro-Batches:
        At EarthGlaze, each soap cures undisturbed on wooden racks for 28 days. This preserves the natural glycerin generated during saponification, which acts as a powerful humectant drawing environmental moisture into your skin during every bath.
      `
    },
    {
      id: 'goat-milk-skin-benefits',
      title: 'The Skin Benefits of Goat Milk',
      category: 'Ingredients',
      date: 'May 30, 2025',
      readTime: '6 min read',
      excerpt: 'A gentle, nourishing ingredient that keeps your skin soft and healthy.',
      image: '/assets/blog_card_goatmilk_hd.png',
      author: 'Kavita Menon • Holistic Aesthetician',
      content: `
        Goat milk is uniquely bio-compatible with human skin because its pH is remarkably close to our acid mantle (5.5). Packed with alpha-hydroxy acids (lactic acid) and caprylic acid, it gently breaks down dead surface cells while infusing selenium and vitamin A.

        Ideal for Eczema & Sensitive Skin:
        Unlike cow milk, the smaller lipid globules in goat milk penetrate effortlessly without irritation, providing deep comfort for dry skin conditions.
      `
    },
    {
      id: 'simple-daily-routine',
      title: 'A Simple Daily Skincare Routine',
      category: 'Natural Living',
      date: 'May 24, 2025',
      readTime: '4 min read',
      excerpt: 'Easy and effective steps for naturally healthy and glowing skin.',
      image: '/assets/blog_card_leaves_hd.png',
      author: 'Pooja Sharma • Formulation Chemist',
      content: `
        Modern skincare often pushes an overwhelming 10-step routine that compromises the skin's delicate moisture barrier. Our approach returns to the wisdom of nature: Cleanse gently, Tone with botanical hydrosols, and Moisturize with cold-pressed unrefined oils.

        Consistency Over Complexity:
        A 3-step ritual practiced mindfully morning and night delivers radiant, resilient skin without chemical overload.
      `
    },
    {
      id: 'manjistha-traditional-healer',
      title: 'Manjistha: A Traditional Skin Healer',
      category: 'Ingredients',
      date: 'May 18, 2025',
      readTime: '5 min read',
      excerpt: 'Learn how manjistha helps purify, brighten and support clear, healthy skin.',
      image: '/assets/blog_card_manjistha_hd.png',
      author: 'Dr. Ananya Rao • Ayurvedic Specialist',
      content: `
        Manjistha (Rubia cordifolia), revered in Ayurveda as the premier 'Varnya' (complexion-enhancing) herb, is celebrated for its remarkable blood-purifying properties. 

        Targets Hyperpigmentation:
        Bioactive anthraquinones in manjistha inhibit excessive tyrosinase enzyme activity, gently fading post-acne dark marks and sunspots while boosting micro-circulation.
      `
    },
    {
      id: 'power-of-natural-oils',
      title: 'The Power of Natural Oils in Skincare',
      category: 'Skincare Tips',
      date: 'May 12, 2025',
      readTime: '5 min read',
      excerpt: 'How plant-based oils lock in moisture and keep your skin nourished.',
      image: '/assets/blog_card_oils_hd.png',
      author: 'Kavita Menon • Holistic Aesthetician',
      content: `
        The myth that oils cause breakouts has been thoroughly debunked. Cold-pressed virgin oils rich in linoleic and oleic fatty acids mimic the skin's sebum structure, signaling your pores to regulate oil production naturally.

        Selecting Your Elixir:
        From golden olive oil to jojoba and cold-pressed castor oil, each seed offers unique fatty acid ratios crafted for deep nourishment.
      `
    }
  ];

  const filteredArticles = activeCategory === 'All Posts'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen text-[#1E3B2B]">
      
      {/* ========================================================================
          HERO SECTION: Skincare Insights & Natural Care Tips
          ======================================================================== */}
      <section className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center overflow-hidden bg-[#FAF7F2] border-b border-[#E8DEC8]/50">
        
        {/* Full-bleed seamless background banner image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 hidden sm:block">
          <img 
            src="/assets/blog_hero_manjistha_seamless.png"
            alt="EarthGlaze Natural Skincare - Handcrafted Manjistha soap lathering with botanical ingredients on sandstone" 
            className="w-full h-full object-cover object-right"
            loading="eager"
            width="1600"
            height="680"
          />
        </div>

        {/* Soft Ambient Radial Glow */}
        <div 
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-[radial-gradient(circle,_rgba(244,233,212,0.7)_0%,_rgba(250,247,242,0)_70%)] pointer-events-none -z-0 blur-3xl opacity-80" 
          aria-hidden="true" 
        />

        {/* Organic Emerald Green Bottom-Left Wave Sweep (Razor-Sharp Vector) */}
        <svg 
          className="absolute bottom-0 left-0 w-64 sm:w-80 md:w-96 lg:w-[480px] h-auto pointer-events-none select-none z-10" 
          viewBox="0 0 500 140" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path 
            d="M-20 140 C 100 130 180 60 460 120 L 460 140 L -20 140 Z" 
            fill="url(#blogWaveGrad)" 
            opacity="0.95" 
          />
          <path 
            d="M-20 140 C 130 110 230 90 490 140 L -20 140 Z" 
            fill="#163C25" 
            opacity="0.45" 
          />
          <defs>
            <linearGradient id="blogWaveGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#2E6B3E" />
              <stop offset="60%" stopColor="#1E4D2B" />
              <stop offset="100%" stopColor="#12331C" />
            </linearGradient>
          </defs>
        </svg>

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-20 py-8 sm:py-12 lg:py-14">
          <div className="max-w-xl space-y-4 sm:space-y-6 text-left">
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#5C6B5E] font-medium">
              <Link href="/" className="hover:text-[#1E3B2B] transition-colors">Home</Link>
              <span className="text-stone-400 font-normal">&gt;</span>
              <span className="text-[#1E3B2B] font-semibold">Blog</span>
            </nav>

            {/* Eyebrow with Dividers */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#1E3B2B]/40" aria-hidden="true"></span>
              <span className="text-xs font-bold tracking-[0.22em] text-[#1E3B2B] uppercase font-sans">
                Our Blog
              </span>
              <span className="w-8 h-px bg-[#1E3B2B]/40" aria-hidden="true"></span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-bold text-[#1E3B2B] tracking-tight leading-[1.08] font-serif">
                Skincare Insights
                <span className="block mt-1 sm:mt-1.5 font-serif font-bold text-[#1E3B2B]">
                  &amp; Natural{' '}
                  <span className="italic font-normal text-[#C28328]">Care Tips</span>
                </span>
              </h1>
            </div>

            {/* Subtitle Copy */}
            <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed max-w-lg font-sans">
              Expert advice, ingredient benefits and natural skincare tips from EarthGlanze.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a 
                href="#articles" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-7 rounded-full bg-[#0D2D1C] hover:bg-[#1a4628] active:scale-95 text-white font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <span>Explore Articles</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
              </a>
            </div>

            {/* Mobile-only responsive visual */}
            <div className="sm:hidden pt-4">
              <img 
                src="/assets/blog_hero_manjistha_mobile.png"
                alt="EarthGlaze Natural Skincare - Handcrafted Manjistha soap lathering" 
                className="w-full h-auto rounded-2xl shadow-sm"
                loading="eager"
              />
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================
          FEATURED ARTICLE BANNER (Exact Match with Reference Image)
          ======================================================================== */}
      <section className="py-10 sm:py-14 bg-[#FAF7F2]" aria-label="Featured Skincare Article">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="w-full bg-[#FAF6EE] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#E8DEC8] shadow-sm relative group flex flex-col md:flex-row items-stretch">
            
            {/* Left Side: Aloe Vera Gel Slices Photo with diagonal clip on desktop */}
            <div className="w-full md:w-[48%] lg:w-[46%] relative min-h-[280px] sm:min-h-[320px] md:min-h-[360px] overflow-hidden shrink-0 [mask-image:linear-gradient(to_right,black_70%,transparent_100%)] md:[mask-image:linear-gradient(to_right,black_75%,transparent_100%)]">
              <img 
                src="/assets/blog_featured_aloe_clean.png" 
                alt="Freshly sliced aloe vera leaves with dewy moisturizing gel" 
                className="w-full h-full object-cover select-none transform transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                width="1376"
                height="768"
              />
            </div>

            {/* Floating Leaf Icon Badge on Seam */}
            <div className="hidden md:flex absolute top-1/2 left-[44%] lg:left-[42%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FAF5EE] border-2 border-white shadow-md items-center justify-center text-[#2E6B3E] z-20">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12 5-2 1.5-3 3.5-3 3.5 3 0 7-4 7-9z"/>
              </svg>
            </div>

            {/* Right Side: Article Details & Read Button */}
            <div className="w-full md:w-[52%] lg:w-[54%] p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-4 relative z-10">
              
              {/* Corner Hanging Green Leaves */}
              <img 
                src="/assets/contact_card_leaves.png" 
                alt="" 
                className="absolute top-0 right-0 w-32 sm:w-44 h-auto pointer-events-none select-none z-0" 
                aria-hidden="true" 
              />

              {/* Bottom right subtle curved tint */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-[#E5EFE2] opacity-50 blur-2xl pointer-events-none" aria-hidden="true" />

              <div className="relative z-10 space-y-3 sm:space-y-4">
                
                {/* Eyebrow: FEATURED ARTICLE */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#C6DEC9] text-[#1E3B2B] text-xs font-bold uppercase tracking-wider w-fit">
                  <span className="text-[#C28328] text-sm">☆</span>
                  <span>Featured Article</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1E3B2B] tracking-tight leading-snug">
                  Aloe Vera for Healthy,{' '}
                  <span className="italic font-normal text-[#C28328]">Glowing Skin</span>
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#404F44] leading-relaxed max-w-md font-sans">
                  Discover how aloe vera soothes, hydrates and naturally nourishes your skin.
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link 
                    href="/blog/a-natural-skincare-routine-with-earthglanze-essentials"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0D2D1C] hover:bg-[#1a4628] active:scale-95 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 group/btn cursor-pointer"
                  >
                    <span>Read Full Article</span>
                    <span className="group-hover/btn:translate-x-1.5 transition-transform duration-300">&rarr;</span>
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================
          EXPLORE BY CATEGORY TABS
          ======================================================================== */}
      <section id="articles" className="pt-8 sm:pt-12 pb-6 bg-[#FAF7F2]" aria-label="Filter Articles by Category">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 text-center">
          
          {/* Section Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-12 sm:w-20 h-px bg-[#1E3B2B]/30" aria-hidden="true" />
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1E3B2B] tracking-tight">
              Explore by <span className="italic font-normal text-[#C28328]">Category</span>
            </h2>
            <span className="w-12 sm:w-20 h-px bg-[#1E3B2B]/30" aria-hidden="true" />
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            
            {/* All Posts */}
            <button
              type="button"
              onClick={() => setActiveCategory('All Posts')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === 'All Posts'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'bg-[#F5EFE6] hover:bg-white text-[#1E3B2B] border border-[#E8DEC8]/80'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
              </svg>
              <span>All Posts</span>
            </button>

            {/* Skincare Tips */}
            <button
              type="button"
              onClick={() => setActiveCategory('Skincare Tips')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === 'Skincare Tips'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'bg-[#F5EFE6] hover:bg-white text-[#1E3B2B] border border-[#E8DEC8]/80'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12 5-2 1.5-3 3.5-3 3.5 3 0 7-4 7-9z"/>
              </svg>
              <span>Skincare Tips</span>
            </button>

            {/* Ingredients */}
            <button
              type="button"
              onClick={() => setActiveCategory('Ingredients')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === 'Ingredients'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'bg-[#F5EFE6] hover:bg-white text-[#1E3B2B] border border-[#E8DEC8]/80'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
              <span>Ingredients</span>
            </button>

            {/* Product Care */}
            <button
              type="button"
              onClick={() => setActiveCategory('Product Care')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === 'Product Care'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'bg-[#F5EFE6] hover:bg-white text-[#1E3B2B] border border-[#E8DEC8]/80'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span>Product Care</span>
            </button>

            {/* Natural Living */}
            <button
              type="button"
              onClick={() => setActiveCategory('Natural Living')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === 'Natural Living'
                  ? 'bg-[#1E4D2B] text-white shadow-sm'
                  : 'bg-[#F5EFE6] hover:bg-white text-[#1E3B2B] border border-[#E8DEC8]/80'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>Natural Living</span>
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================================
          6 BLOG POSTS GRID
          ======================================================================== */}
      <section className="py-8 sm:py-12 bg-[#FAF7F2]" aria-label="Skincare Articles Grid">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {filteredArticles.map((article) => (
              <Link 
                key={article.id}
                href={article.id === 'simple-daily-routine' ? '/blog/a-natural-skincare-routine-with-earthglanze-essentials' : `/blog/${article.id}`}
                className="bg-white rounded-[22px] sm:rounded-[24px] overflow-hidden border border-[#E8DEC8]/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1 block no-underline"
              >
                {/* Article Card Image Header with Overlapping Category Pill */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-stone-100 shrink-0">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width="600"
                    height="285"
                  />
                  {/* Category Badge Pill Overlapping Image */}
                  <span className="absolute bottom-3 left-3 bg-[#FAF7EE] border border-[#E2D8C3] text-[#1E3B2B] text-xs font-bold px-3 py-1 rounded-full shadow-2xs z-10 font-sans">
                    {article.category}
                  </span>
                </div>

                {/* Article Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-2">
                    {/* Publication Date */}
                    <div className="flex items-center gap-1.5 text-xs text-[#5C6B5E] font-medium">
                      <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <span>{article.date}</span>
                    </div>

                    {/* Article Title */}
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1E3B2B] leading-snug group-hover:text-[#2E6B3E] transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-[#5C6B5E] leading-relaxed line-clamp-2 font-sans">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Arrow Action Button */}
                  <div className="pt-2 flex justify-end">
                    <span 
                      className="w-9 h-9 rounded-full bg-[#EAF2EC] text-[#1E3B2B] group-hover:bg-[#1E3B2B] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs text-sm font-bold"
                      aria-label="Read article"
                    >
                      &rarr;
                    </span>
                  </div>

                </div>

              </Link>
            ))}

          </div>

          {/* ========================================================================
              PAGINATION BAR
              ======================================================================== */}
          <div className="flex items-center justify-center gap-2 pt-10 sm:pt-14 pb-4">
            
            {/* Previous */}
            <button 
              type="button" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DEC8] flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-stone-400 transition-all text-sm font-bold shadow-2xs cursor-pointer"
              aria-label="Previous Page"
            >
              &lsaquo;
            </button>

            {/* Page 1 */}
            <button 
              type="button" 
              onClick={() => setCurrentPage(1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-2xs cursor-pointer ${
                currentPage === 1 
                  ? 'bg-[#1E4D2B] text-white shadow-sm' 
                  : 'bg-white border border-[#E8DEC8] text-stone-700 hover:bg-stone-50'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button 
              type="button" 
              onClick={() => setCurrentPage(2)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-2xs cursor-pointer ${
                currentPage === 2 
                  ? 'bg-[#1E4D2B] text-white shadow-sm' 
                  : 'bg-white border border-[#E8DEC8] text-stone-700 hover:bg-stone-50'
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button 
              type="button" 
              onClick={() => setCurrentPage(3)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-2xs cursor-pointer ${
                currentPage === 3 
                  ? 'bg-[#1E4D2B] text-white shadow-sm' 
                  : 'bg-white border border-[#E8DEC8] text-stone-700 hover:bg-stone-50'
              }`}
            >
              3
            </button>

            {/* Next */}
            <button 
              type="button" 
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className="w-9 h-9 rounded-full bg-white border border-[#E8DEC8] flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-stone-400 transition-all text-sm font-bold shadow-2xs cursor-pointer"
              aria-label="Next Page"
            >
              &rsaquo;
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================================
          "STAY IN THE LOOP!" NEWSLETTER BANNER (Exact Match with Reference Image)
          ======================================================================== */}
      <section className="py-8 sm:py-12 bg-[#FAF7F2]" aria-label="Skincare Newsletter">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="bg-gradient-to-r from-[#173E23] via-[#1E4D2B] to-[#12331C] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden group">
            
            {/* Background Fresh Green Leaves on Left Edge */}
            <div className="absolute top-0 left-0 h-full w-48 pointer-events-none select-none opacity-40 overflow-hidden">
              <img 
                src="/assets/blog_newsletter_leaves_clean.png" 
                alt="" 
                className="w-full h-full object-cover object-left" 
                aria-hidden="true" 
              />
            </div>

            {/* Left Content: Envelope Icon + Typography */}
            <div className="flex items-center gap-5 sm:gap-6 relative z-10 w-full lg:w-auto">
              
              {/* White Envelope Outline Icon */}
              <div className="shrink-0 text-white">
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>

              {/* Vertical Divider Line */}
              <div className="h-12 sm:h-14 w-px bg-white/20 shrink-0" aria-hidden="true" />

              {/* Typography */}
              <div className="space-y-0.5">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  Stay in the{' '}
                  <span className="italic font-normal text-[#E09F3E]">Loop!</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#D2E3D6] font-sans">
                  Get the latest skincare tips, new product updates and natural care insights.
                </p>
              </div>

            </div>

            {/* Right: Email Input + Subscribe Capsule */}
            <div className="relative z-10 w-full lg:w-auto max-w-md">
              {newsletterSubscribed ? (
                <div className="px-6 py-3 rounded-full bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex items-center bg-white rounded-full p-1.5 shadow-sm w-full">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-2 text-xs sm:text-sm text-[#1E3B2B] placeholder:text-stone-400 bg-transparent focus:outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#D6E38F] hover:bg-[#c8d879] active:scale-95 text-[#1E3B2B] font-bold text-xs sm:text-sm transition-all duration-200 shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <span>&rarr;</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================
          ARTICLE READER MODAL (Interactive Popup)
          ======================================================================== */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-[28px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DEC8] relative p-6 sm:p-10 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm transition-all"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Category */}
            <span className="inline-block px-3 py-1 rounded-full bg-[#EAF2EC] text-[#1E3B2B] text-xs font-bold uppercase tracking-wider">
              {selectedArticle.category}
            </span>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3B2B] leading-snug">
              {selectedArticle.title}
            </h2>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C6B5E] pb-3 border-b border-stone-200">
              <span className="font-semibold text-[#1E3B2B]">{selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Content */}
            <div className="text-sm sm:text-base text-[#404F44] leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {selectedArticle.content}
            </div>

            {/* Bottom Close Action */}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs font-semibold transition-all"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
