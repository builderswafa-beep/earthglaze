/**
 * EarthGlaze — Natural Skincare
 * Production Frontend Architecture
 * Built to Zammil Production Web Engineering Standards
 */

(function () {
  'use strict';

  // State Management
  const state = {
    activeCardIndex: 2, // 2 is center card (Hydrating Face Cream)
    wishlistCount: 0,
    isWishlisted: false,
    promoDiscount: 0,
    promoCodeApplied: '',
    cart: [
      {
        id: 'manjistha-soap',
        title: 'Manjistha Soap',
        subtitle: '100 g',
        price: 149,
        qty: 1,
        image: 'assets/bestseller_manjistha_photo.png',
      },
    ],
  };

  window.EarthGlazeState = state;

  // Hero Featured Products: All 4 Created Artisan Skincare Products
  const heroProducts = [
    {
      id: 'goat-milk-soap',
      name: 'EARTHGLAZE Goat Milk Soap',
      volume: '100 g',
      price: 149,
      badgeText: 'Nourishes & deeply moisturizes skin',
      actives: 'Goat Milk, Shea Butter & Coconut Oil',
      image: 'assets/goatmilksoap_close_box.png',
      className: 'arc-card-center',
    },
    {
      id: 'manjistha-soap',
      name: 'EARTHGLAZE Manjistha Soap',
      volume: '100 g',
      price: 149,
      badgeText: 'Purifies skin & gives a natural glow',
      actives: 'Pure Manjistha, Bark Extracts & Essential Oils',
      image: 'assets/manjistha_closed_box.png',
      className: 'arc-card-center',
    },
    {
      id: 'neem-soap',
      name: 'EARTHGLAZE Neem Soap',
      volume: '100 g',
      price: 149,
      badgeText: 'Purifying Botanical Neem Cleansing',
      actives: 'Organic Neem Leaf, Tea Tree & Basil Extract',
      image: 'assets/neem_soap_closed_box.png',
      className: 'arc-card-center',
    },
    {
      id: 'beetroot-lip-balm',
      name: 'EARTHGLAZE Beet Root Lip Balm',
      volume: '10 g',
      price: 199,
      badgeText: 'Keeps lips soft, smooth & naturally tinted',
      actives: 'Organic Beetroot Extract, Almond Oil & Beeswax',
      image: 'assets/lip_balm_closed_box.png',
      className: 'arc-card-center',
    },
  ];

  // Additional Extended Products (Artisan Soaps, Combos & Skincare Catalog)
  const extraProducts = [
    {
      id: 'goat-milk-soap',
      name: 'Goat Milk Soap',
      volume: '100 g',
      price: 149,
      badgeText: 'Nourishes & deeply moisturizes skin',
      actives: 'Goat Milk, Shea Butter & Coconut Oil',
      image: 'assets/bestseller_goat_photo.png',
    },
    {
      id: 'manjistha-soap',
      name: 'Manjistha Soap',
      volume: '100 g',
      price: 149,
      badgeText: 'Purifies skin & gives a natural glow',
      actives: 'Pure Manjistha, Bark Extracts & Essential Oils',
      image: 'assets/bestseller_manjistha_photo.png',
    },
    {
      id: 'neem-soap',
      name: 'EARTHGLAZE Neem Soap',
      volume: '100 g',
      price: 149,
      badgeText: 'Purifying Botanical Neem Cleansing',
      actives: 'Organic Neem Leaf, Tea Tree & Basil Extract',
      image: 'assets/neem_soap_closed_box.png',
    },
    {
      id: 'beetroot-lip-balm',
      name: 'Beet Root Lip Balm',
      volume: '10 g',
      price: 199,
      badgeText: 'Keeps lips soft, smooth & naturally tinted',
      actives: 'Organic Beetroot Extract, Almond Oil & Beeswax',
      image: 'assets/bestseller_balm_photo.png',
    },
    {
      id: 'aloe-soap',
      name: 'Aloe Vera Soap',
      volume: '100 g',
      price: 149,
      badgeText: 'Soothes, hydrates & refreshes skin',
      actives: 'Pure Aloe Vera, Cucumber & Herbal Extracts',
      image: 'assets/bestseller_aloe_soap_photo.png',
    },
    {
      id: 'vitaminc-serum',
      name: 'Vitamin C Face Serum',
      volume: '30 ml',
      price: 899,
      badgeText: '15% Bio-Fermented Vitamin C',
      actives: 'Marine Kelp & Australian Kakadu Plum',
      image: 'assets/retina-exact-card-vitaminc.png',
    },
    {
      id: 'gentle-cleanser',
      name: 'Gentle Face Cleanser',
      volume: '120 ml',
      price: 599,
      badgeText: 'Gentle Acid Mantle Balance',
      actives: 'Cold-Pressed Camellia Seed & Green Tea',
      image: 'assets/retina-exact-card-cleanser.png',
    },
    {
      id: 'aloe-gel',
      name: 'Aloe Vera Gel',
      volume: '100 g',
      price: 499,
      badgeText: '99% Pure Cold-Pressed Soothing',
      actives: 'Organic Aloe Barbadensis & Cucumber',
      image: 'assets/retina-exact-card-aloe.png',
    },
    {
      id: 'sunscreen-dew',
      name: 'Sunscreen SPF 50+ PA++++',
      volume: '50 ml',
      price: 649,
      badgeText: 'Invisible Broad Spectrum Shield',
      actives: 'Non-Nano Zinc Oxide & Niacinamide',
      image: 'assets/retina-exact-card-sunscreen.png',
    },
    {
      id: 'hydrating-cream',
      name: 'Hydrating Face Cream',
      volume: '50 g',
      price: 799,
      badgeText: 'Cashmere Lipid Barrier Shield',
      actives: 'Skin-Identical Ceramide NP & Marula Oil',
      image: 'assets/bestseller_cream_photo.png',
    },
    {
      id: 'starter-combo',
      name: 'Combo Offer: Complete Natural Care Set',
      volume: 'Manjistha Soap + Goat Milk Soap + Beet Root Lip Balm',
      price: 799,
      badgeText: 'Combo Offer (18% OFF)',
      actives: 'Manjistha Bark, Pure Goat Milk & Organic Beetroot',
      image: 'assets/combo-offer.png',
    },
    {
      id: 'pomegranate-soap',
      name: 'Ruby Pomegranate Natural Soap',
      volume: '125 g',
      price: 299,
      badgeText: 'Antioxidant Fruit Extract',
      actives: 'Pomegranate & Cold-Pressed Coconut',
      image: 'assets/banner_flavour_soaps.png',
    },
    {
      id: 'turmeric-soap',
      name: 'Golden Turmeric Herbal Soap',
      volume: '125 g',
      price: 299,
      badgeText: 'Pure Kasturi Manjal Glow',
      actives: 'Turmeric & Sandalwood Extract',
      image: 'assets/banner_flavour_soaps.png',
    },
    {
      id: 'aloe-soap',
      name: 'Aloe & Jasmine Natural Soap',
      volume: '125 g',
      price: 299,
      badgeText: 'Soothing Moisture Bar',
      actives: 'Organic Aloe & Jasmine Blossom',
      image: 'assets/banner_flavour_soaps.png',
    },
  ];

  // Combined Catalog Lookup
  const allProductsCatalog = [...heroProducts, ...extraProducts];

  function formatPrice(val) {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  // DOM Elements
  const header = document.querySelector('.header-nav');
  const dynamicWordEl = document.getElementById('dynamic-rotating-word');
  const dynamicWrapper = document.querySelector('.dynamic-text-wrapper');
  const leafUnderlineSvg = document.querySelector('.leaf-underline-svg');
  const productArcTrack = document.querySelector('.product-arc-track');
  const stepCards = document.querySelectorAll('.step-card[data-card-index]');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const heroSection = document.getElementById('hero-section');
  const heroArcContainer = document.querySelector('.hero-arc-container');
  const pedestalGlow = document.querySelector('.hero-center-pedestal-glow');

  // Utility Elements
  const cartBtn = document.getElementById('cart-btn');
  const cartBadge = document.getElementById('cart-badge');
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const freeShippingBar = document.getElementById('free-shipping-progress');
  const freeShippingText = document.getElementById('free-shipping-text');
  const promoInput = document.getElementById('promo-code-input');
  const promoApplyBtn = document.getElementById('promo-apply-btn');
  const promoMessage = document.getElementById('promo-message');

  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchModalBackdrop = document.getElementById('search-modal-backdrop');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results-list');

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  const wishlistBtn = document.getElementById('wishlist-btn');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  const exploreRangeBtn = document.getElementById('explore-range-btn');
  const ourStoryBtn = document.getElementById('our-story-btn');

  // --------------------------------------------------------------------------
  // 1. Dynamic Text Changing Effect ("Personal.")
  // --------------------------------------------------------------------------
  const rotatingWords = [
    'Personal.',
    'Radiant.',
    'Pure.',
    'Luminous.',
    'Effortless.',
    'Natural.',
  ];

  let currentWordIndex = 0;
  let wordRotateTimer = null;
  let isWordHovered = false;

  function cycleDynamicText() {
    if (isWordHovered || !dynamicWordEl) return;

    // Step 1: Slide out
    dynamicWordEl.classList.remove('word-active', 'word-enter');
    dynamicWordEl.classList.add('word-exit');

    // Subtle underline scale pulse
    if (leafUnderlineSvg) {
      leafUnderlineSvg.style.transform = 'scaleX(0.85) scaleY(0.9)';
    }

    setTimeout(() => {
      // Step 2: Swap word
      currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
      dynamicWordEl.textContent = rotatingWords[currentWordIndex];

      // Prepare from top
      dynamicWordEl.classList.remove('word-exit');
      dynamicWordEl.classList.add('word-enter');

      // Trigger reflow
      void dynamicWordEl.offsetWidth;

      // Step 3: Slide in
      dynamicWordEl.classList.remove('word-enter');
      dynamicWordEl.classList.add('word-active');

      if (leafUnderlineSvg) {
        leafUnderlineSvg.style.transform = 'scaleX(1) scaleY(1)';
      }
    }, 320);
  }

  function startTextRotation() {
    clearInterval(wordRotateTimer);
    wordRotateTimer = setInterval(cycleDynamicText, 2800);
  }

  if (dynamicWrapper) {
    dynamicWrapper.addEventListener('mouseenter', () => {
      isWordHovered = true;
    });
    dynamicWrapper.addEventListener('mouseleave', () => {
      isWordHovered = false;
    });
    startTextRotation();
  }

    // --------------------------------------------------------------------------
  // 2. Interactive 3D Hero Product Carousel & Soap Levitation Animation Controller
  // --------------------------------------------------------------------------
  const heroStage = document.getElementById('hero-curved-stage');
  const heroCurvedCards = Array.from(document.querySelectorAll('.hero-curved-card'));
  const heroCarouselDots = Array.from(document.querySelectorAll('.hero-carousel-dots .carousel-dot-btn'));
  const heroPrevBtn = document.getElementById('hero-carousel-prev');
  const heroNextBtn = document.getElementById('hero-carousel-next');

  // Track coordinates for 4 orbital positions: [center, right-1, far-right/back, left-1]
  function getResponsiveOrbitOffsets() {
    const w = window.innerWidth;
    if (w < 480) {
      return [
        { x: 0, y: 0, scale: 1.02, rot: 0, z: 40, op: 1 },           // Center Front (Active)
        { x: 100, y: -6, scale: 0.60, rot: -2, z: 25, op: 0.95 },   // Right Flank
        { x: 0, y: -16, scale: 0.42, rot: 0, z: 10, op: 0.75 },     // Center Back
        { x: -100, y: -6, scale: 0.60, rot: 2, z: 25, op: 0.95 }    // Left Flank
      ];
    } else if (w < 640) {
      return [
        { x: 0, y: 0, scale: 1.08, rot: 0, z: 40, op: 1 },
        { x: 130, y: -8, scale: 0.66, rot: -2.5, z: 25, op: 0.98 },
        { x: 0, y: -18, scale: 0.46, rot: 0, z: 10, op: 0.80 },
        { x: -130, y: -8, scale: 0.66, rot: 2.5, z: 25, op: 0.98 }
      ];
    } else if (w < 1024) {
      return [
        { x: 0, y: 0, scale: 1.15, rot: 0, z: 40, op: 1 },
        { x: 180, y: -10, scale: 0.72, rot: -3, z: 25, op: 1 },
        { x: 0, y: -22, scale: 0.50, rot: 0, z: 10, op: 0.82 },
        { x: -180, y: -10, scale: 0.72, rot: 3, z: 25, op: 1 }
      ];
    } else {
      return [
        { x: 0, y: 0, scale: 1.22, rot: 0, z: 40, op: 1 },           // Center Front (Active)
        { x: 235, y: -12, scale: 0.78, rot: -3, z: 25, op: 1 },     // Right Flank
        { x: 0, y: -26, scale: 0.55, rot: 0, z: 10, op: 0.85 },     // Center Back
        { x: -235, y: -12, scale: 0.78, rot: 3, z: 25, op: 1 }      // Left Flank
      ];
    }
  }

  let heroActiveIndex = 0;
  let heroAutoPlayTimer = null;
  const HERO_COUNT = 4;

  function updateSteppedCarousel(activeIndex, userInitiated = false) {
    heroActiveIndex = ((activeIndex % HERO_COUNT) + HERO_COUNT) % HERO_COUNT;
    state.activeCardIndex = heroActiveIndex;

    const offsets = getResponsiveOrbitOffsets();

    heroCurvedCards.forEach((card) => {
      const cardIdx = parseInt(card.getAttribute('data-card-index'), 10);
      // Normalized circular position: 0 = Center, 1 = Right, 2 = Back, 3 = Left
      const posIndex = ((cardIdx - heroActiveIndex) % HERO_COUNT + HERO_COUNT) % HERO_COUNT;
      const cfg = offsets[posIndex];

      // Smooth orbital glide along the 3D oval track
      card.style.position = 'absolute';
      card.style.left = '50%';
      card.style.top = '50%';
      card.style.margin = '0';
      card.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease, filter 0.45s ease';
      card.style.transform = `translate(-50%, -50%) translate3d(${cfg.x}px, ${cfg.y}px, 0px) scale(${cfg.scale}) rotate(${cfg.rot}deg)`;
      card.style.zIndex = cfg.z;
      card.style.opacity = cfg.op;

      if (posIndex === 0) {
        // Center Active Card: Open packaging view with levitation & ambient glow
        card.classList.add('is-active-center', 'soap-is-open', 'product-state-open');
        card.setAttribute('aria-selected', 'true');
        card.setAttribute('tabindex', '0');
      } else {
        // Flank/Back Cards: Closed packaging view
        card.classList.remove('is-active-center', 'soap-is-open', 'product-state-open');
        card.setAttribute('aria-selected', 'false');
        card.setAttribute('tabindex', '-1');
      }
    });

    // Synchronize Pagination Dots
    heroCarouselDots.forEach((dot, dotIdx) => {
      if (dotIdx === heroActiveIndex) {
        dot.classList.add('bg-[#173D2B]', 'scale-125');
        dot.classList.remove('bg-stone-300', 'hover:bg-stone-400');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('bg-[#173D2B]', 'scale-125');
        dot.classList.add('bg-stone-300', 'hover:bg-stone-400');
        dot.removeAttribute('aria-current');
      }
    });
  }

  // Click any of the 4 cards: smoothly orbits to center!
  heroCurvedCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-card-index'), 10);
      updateSteppedCarousel(idx, true);
      const prod = heroProducts[idx];
      if (prod) {
        showToast(`Selected "${prod.name}" • ₹${prod.price}`, '🌿');
      }
      resetAutoPlay();
    });
  });

  // Next / Prev Arrow Navigation Buttons
  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSteppedCarousel(heroActiveIndex + 1, true);
      resetAutoPlay();
    });
  }

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSteppedCarousel(heroActiveIndex - 1, true);
      resetAutoPlay();
    });
  }

  // Carousel Pagination Dots Click
  heroCarouselDots.forEach((dot, dotIdx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSteppedCarousel(dotIdx, true);
      resetAutoPlay();
    });
  });

  // Automatic Rotation Carousel (Every 4.5 seconds)
  function startAutoPlay() {
    stopAutoPlay();
    heroAutoPlayTimer = setInterval(() => {
      updateSteppedCarousel(heroActiveIndex + 1);
    }, 4500);
  }

  function stopAutoPlay() {
    if (heroAutoPlayTimer) {
      clearInterval(heroAutoPlayTimer);
      heroAutoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause on hover so user can inspect product details
  if (heroStage) {
    heroStage.addEventListener('mouseenter', stopAutoPlay);
    heroStage.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe handling for mobile devices
    let touchStartX = 0;
    heroStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    heroStage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX < 0) updateSteppedCarousel(heroActiveIndex + 1, true);
        else updateSteppedCarousel(heroActiveIndex - 1, true);
      }
      startAutoPlay();
    }, { passive: true });
  }

  // Window resize listener to recompute responsive positions
  window.addEventListener('resize', () => {
    updateSteppedCarousel(heroActiveIndex);
  });

  // Initialize initial center state immediately
  updateSteppedCarousel(0);

  // Start auto-play on initial page load
  startAutoPlay();

  // Expose controller for global access
  window.EarthGlazeCarousel = {
    updateSteppedCarousel: updateSteppedCarousel,
    select: (idx) => updateSteppedCarousel(idx, true),
    openProduct: (idx) => updateSteppedCarousel(idx, true),
    next: () => { updateSteppedCarousel(heroActiveIndex + 1, true); resetAutoPlay(); },
    prev: () => { updateSteppedCarousel(heroActiveIndex - 1, true); resetAutoPlay(); },
    pause: stopAutoPlay,
    resume: startAutoPlay,
    getActiveIndex: () => heroActiveIndex,
  };
  window.EarthGlazeStoryboard = window.EarthGlazeCarousel;

  // --------------------------------------------------------------------------
  // 3. Scroll Animations (Page Scroll Depth Parallax on Header & Hero)
  // --------------------------------------------------------------------------

  // B) Page Scroll Depth Parallax on the Hero Cards & Header Elevation
  function handleScrollAnimations() {
    const scrollY = window.scrollY;

    // Header elevation
    if (header) {
      if (scrollY > 25) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    // Parallax levitation on the active middle card
    if (scrollY < 900) {
      const activeCard = document.querySelector('.step-card.step-0');
      if (activeCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (scrollY > 5) {
          const floatShift = -8 - Math.min(18, scrollY * 0.04);
          activeCard.style.transform = `scale(1.16) translateY(${floatShift}px) rotate(0deg)`;
        } else {
          activeCard.style.transform = '';
        }
      }
    }
  }
  window.addEventListener('scroll', handleScrollAnimations, { passive: true });

  // --------------------------------------------------------------------------
  // 5. Toast Notifications
  // --------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message, iconSvg = '🌿') {
    if (!toastNotice) return;
    clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    const iconEl = toastNotice.querySelector('.toast-icon');
    if (iconEl) iconEl.textContent = iconSvg;

    toastNotice.classList.add('show');
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }
  window.EarthGlazeToast = showToast;

  // --------------------------------------------------------------------------
  // 6. Shopping Bag Management
  // --------------------------------------------------------------------------
  function updateCartBadge() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.remove('badge-bounce');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('badge-bounce');
    }
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <p class="font-medium text-stone-900 mb-1">Your bag is empty</p>
          <p class="text-xs text-stone-500 mb-6">Experience our signature botanical formulations.</p>
          <button id="cart-empty-explore-btn" class="px-5 py-2.5 rounded-full bg-[#235327] text-white text-xs font-semibold hover:bg-[#173e23] transition shadow-sm">
            Discover Bestsellers
          </button>
        </div>
      `;
      const exploreBtn = document.getElementById('cart-empty-explore-btn');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          toggleCart(false);
          const pSec = document.getElementById('products');
          if (pSec) pSec.scrollIntoView({ behavior: 'smooth' });
        });
      }
    } else {
      cartItemsContainer.innerHTML = state.cart
        .map(
          (item) => `
        <div class="flex gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm transition hover:border-emerald-100">
          <div class="w-20 h-20 rounded-xl bg-stone-50 p-2 flex items-center justify-center shrink-0 border border-stone-100">
            <img src="${item.image}" alt="${item.title}" class="max-h-full max-w-full object-contain">
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4 class="text-sm font-semibold text-stone-900 truncate">${item.title}</h4>
              <button data-action="remove" data-id="${item.id}" class="text-stone-400 hover:text-rose-500 text-xs p-1 transition" title="Remove item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
            <p class="text-xs text-stone-500 mb-2">${item.subtitle}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center border border-stone-200 rounded-full bg-stone-50/50">
                <button data-action="decrease" data-id="${item.id}" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 text-xs font-bold transition rounded-full hover:bg-stone-100">−</button>
                <span class="px-2 text-xs font-semibold text-stone-800">${item.qty}</span>
                <button data-action="increase" data-id="${item.id}" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 text-xs font-bold transition rounded-full hover:bg-stone-100">+</button>
              </div>
              <span class="text-sm font-bold text-[#173D2B]">${formatPrice(item.price * item.qty)}</span>
            </div>
          </div>
        </div>
      `
        )
        .join('');
    }

    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = subtotal * state.promoDiscount;
    const total = Math.max(0, subtotal - discount);

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);

    const freeShippingThreshold = 999.0;
    if (freeShippingBar && freeShippingText) {
      if (subtotal >= freeShippingThreshold) {
        freeShippingBar.style.width = '100%';
        freeShippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked Free Botanical Express Shipping.`;
      } else {
        const remaining = freeShippingThreshold - subtotal;
        const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
        freeShippingBar.style.width = `${progress}%`;
        freeShippingText.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more to unlock <strong>Free Express Shipping</strong>`;
      }
    }

    updateCartBadge();
  }

  function addToCart(productId) {
    const product = allProductsCatalog.find((p) => p.id === productId) || heroProducts[state.activeCardIndex];
    if (!product) return;

    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: product.id,
        title: product.name,
        subtitle: product.volume,
        price: product.price,
        qty: 1,
        image: product.image || 'assets/retina-exact-card-cream.png',
      });
    }

    renderCart();
    showToast(`Added "${product.name}" to your bag!`, '🛍️');
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      const item = state.cart.find((i) => i.id === id);

      if (action === 'increase' && item) {
        item.qty += 1;
        renderCart();
      } else if (action === 'decrease' && item) {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          state.cart = state.cart.filter((i) => i.id !== id);
        }
        renderCart();
      } else if (action === 'remove' && item) {
        state.cart = state.cart.filter((i) => i.id !== id);
        renderCart();
        showToast('Item removed from bag.', '🗑️');
      }
    });
  }

  if (promoApplyBtn && promoInput) {
    promoApplyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'EARTHGLAZE15' || code === 'FREEDEW') {
        state.promoDiscount = 0.15;
        state.promoCodeApplied = code;
        promoMessage.textContent = `Applied! 15% VIP Botanical discount added.`;
        promoMessage.className = 'text-xs text-emerald-700 mt-1.5 font-medium';
        renderCart();
        showToast('Promo code applied: 15% OFF!', '✨');
      } else if (code === '') {
        promoMessage.textContent = 'Please enter a coupon code.';
        promoMessage.className = 'text-xs text-amber-600 mt-1.5';
      } else {
        promoMessage.textContent = 'Invalid promo code. Try "EARTHGLAZE15".';
        promoMessage.className = 'text-xs text-rose-500 mt-1.5';
      }
    });
  }

  function toggleCart(open) {
    if (!cartDrawer || !cartDrawerBackdrop) return;
    if (open) {
      cartDrawerBackdrop.classList.add('is-active');
      cartDrawer.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      renderCart();
    } else {
      cartDrawerBackdrop.classList.remove('is-active');
      cartDrawer.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (cartBtn) cartBtn.addEventListener('click', () => toggleCart(true));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
  if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener('click', () => toggleCart(false));

  // Primary Explore Range CTA
  if (exploreRangeBtn) {
    exploreRangeBtn.addEventListener('click', () => {
      const activeProd = heroProducts[state.activeCardIndex];
      addToCart(activeProd.id);
      toggleCart(true);
    });
  }

  // Secondary Story CTA
  if (ourStoryBtn) {
    ourStoryBtn.addEventListener('click', () => {
      const storySec = document.getElementById('our-story');
      if (storySec) {
        storySec.scrollIntoView({ behavior: 'smooth' });
      }
      showToast('Discovering EarthGlaze cold-pressed botanical origin...', '📖');
    });
  }

  // Catalog Add button delegation
  document.addEventListener('click', (e) => {
    const catalogBtn = e.target.closest('.catalog-add-btn');
    if (catalogBtn) {
      const pid = catalogBtn.getAttribute('data-product-id');
      if (pid) {
        addToCart(pid);
        toggleCart(true);
      }
    }
  });

  // --------------------------------------------------------------------------
  // 7. Wishlist Handling
  // --------------------------------------------------------------------------
  function toggleWishlist() {
    state.isWishlisted = !state.isWishlisted;
    if (state.isWishlisted) {
      state.wishlistCount += 1;
      showToast('Saved to your botanical wishlist!', '❤️');
    } else {
      state.wishlistCount = Math.max(0, state.wishlistCount - 1);
      showToast('Removed from your wishlist.', '🤍');
    }

    if (wishlistBadge) {
      wishlistBadge.textContent = state.wishlistCount;
      wishlistBadge.style.display = state.wishlistCount > 0 ? 'flex' : 'none';
      wishlistBadge.classList.add('badge-bounce');
      setTimeout(() => wishlistBadge.classList.remove('badge-bounce'), 400);
    }
  }

  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      toggleWishlist();
    });
  }

  // --------------------------------------------------------------------------
  // 8. Search Modal
  // --------------------------------------------------------------------------
  function toggleSearch(open) {
    if (!searchModal || !searchModalBackdrop) return;
    if (open) {
      searchModalBackdrop.classList.add('is-active');
      searchModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 80);
      }
      renderSearchResults('');
    } else {
      searchModalBackdrop.classList.remove('is-active');
      searchModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    const filtered = q
      ? heroProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.badgeText.toLowerCase().includes(q) ||
            p.actives.toLowerCase().includes(q)
        )
      : heroProducts;

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div class="py-12 text-center text-stone-500">
          <p class="text-sm">No botanicals found for "<span class="text-stone-800 font-semibold">${query}</span>"</p>
          <p class="text-xs text-stone-400 mt-1">Try searching "vitamin c", "cleanser", or "cream"</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = filtered
      .map(
        (p) => `
      <div class="flex items-center justify-between p-3.5 hover:bg-stone-50/80 rounded-2xl transition border border-transparent hover:border-stone-100 cursor-pointer search-item-row" data-id="${p.id}">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 bg-white rounded-xl p-1.5 border border-stone-100 flex items-center justify-center shrink-0">
            <img src="${p.image}" alt="${p.name}" class="max-h-full max-w-full object-contain">
          </div>
          <div>
            <h5 class="text-sm font-semibold text-stone-900">${p.name}</h5>
            <p class="text-xs text-stone-500">${p.badgeText}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-[#173D2B]">${formatPrice(p.price)}</span>
          <button class="px-3 py-1.5 rounded-full bg-[#235327] text-white text-xs font-semibold hover:bg-[#173e23] transition">Add</button>
        </div>
      </div>
    `
      )
      .join('');

    searchResults.querySelectorAll('.search-item-row').forEach((row) => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-id');
        addToCart(id);
        toggleSearch(false);
        toggleCart(true);
      });
    });
  }

  if (searchBtn) searchBtn.addEventListener('click', () => toggleSearch(true));
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', () => toggleSearch(false));
  if (searchModalBackdrop) searchModalBackdrop.addEventListener('click', () => toggleSearch(false));

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K for search, Escape for closing
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearch(true);
    }
    if (e.key === 'Escape') {
      toggleSearch(false);
      toggleCart(false);
      toggleMobileMenu(false);
      toggleSoapsModal(false);
    }
  });

  document.querySelectorAll('.search-tag-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag') || chip.textContent.trim();
      if (searchInput) {
        searchInput.value = tag;
        renderSearchResults(tag);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Mobile Drawer
  // --------------------------------------------------------------------------
  function toggleMobileMenu(open) {
    if (!mobileDrawer || !mobileDrawerBackdrop) return;
    if (open) {
      mobileDrawerBackdrop.classList.add('is-active');
      mobileDrawer.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawerBackdrop.classList.remove('is-active');
      mobileDrawer.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', () => toggleMobileMenu(false));

  // --------------------------------------------------------------------------
  // 10. Live Countdown Timer (Limited Time Offer: Starter Combo)
  // --------------------------------------------------------------------------
  function startCountdownTimer() {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-mins');
    if (!daysEl || !hoursEl || !minsEl) return;

    let target = localStorage.getItem('earthglaze_offer_target');
    if (!target || isNaN(parseInt(target, 10)) || parseInt(target, 10) < Date.now()) {
      target = Date.now() + (2 * 24 * 3600 + 14 * 3600 + 36 * 60) * 1000;
      localStorage.setItem('earthglaze_offer_target', target.toString());
    } else {
      target = parseInt(target, 10);
    }

    function updateClock() {
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / (24 * 3600 * 1000));
      diff %= (24 * 3600 * 1000);
      const hours = Math.floor(diff / (3600 * 1000));
      diff %= (3600 * 1000);
      const mins = Math.floor(diff / (60 * 1000));

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // --------------------------------------------------------------------------
  // 11. Combo Offer — Buy Combo CTA
  // --------------------------------------------------------------------------
  const grabOfferBtn = document.getElementById('grab-offer-btn');
  if (grabOfferBtn) {
    grabOfferBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart('starter-combo');
      toggleCart(true);
      showToast('🌿 Combo Offer: Complete Natural Care Set added to your cart!', '✨');
    });
  }

  // --------------------------------------------------------------------------
  // 12. About Us & Our Story Interactive Revealer
  // ("our story should be work only after click know more or else hide it")
  // --------------------------------------------------------------------------
  function revealOurStory(andScroll = true) {
    const storySec = document.getElementById('our-story');
    if (!storySec) return;

    if (storySec.classList.contains('hidden')) {
      storySec.classList.remove('hidden');
      storySec.classList.add('animate-fadeIn');
      showToast('📖 Welcome to The EarthGlaze Story', '🍃');
    }

    if (andScroll) {
      setTimeout(() => {
        storySec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }

  // Bind Know More Button in Section 2 (About Us)
  const knowMoreBtn = document.getElementById('about-know-more-btn');
  if (knowMoreBtn) {
    knowMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      revealOurStory(true);
    });
  }

  // Bind "The EarthGlaze Story" teaser pill in Section 2
  const storyTeaserTrigger = document.getElementById('story-teaser-trigger');
  if (storyTeaserTrigger) {
    storyTeaserTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      revealOurStory(true);
    });
  }

  // Bind all nav links pointing to #our-story (Desktop Nav, Mobile Menu)
  document.querySelectorAll('a[href="#our-story"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      revealOurStory(true);
      toggleMobileMenu(false);
    });
  });

  if (ourStoryBtn) {
    ourStoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      revealOurStory(true);
    });
  }

  // Journey Button inside Our Story: Scrolls to Bestsellers Catalog
  const journeyBtn = document.getElementById('story-journey-btn');
  if (journeyBtn) {
    journeyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = document.getElementById('products');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Discover our EarthGlaze Favourites', '🌿');
    });
  }

  // --------------------------------------------------------------------------
  // 14. Artisan Nature's Flavour Soaps Modal
  // --------------------------------------------------------------------------
  const exploreSoapsBtn = document.getElementById('explore-soaps-btn');
  const soapsModal = document.getElementById('soaps-modal');
  const soapsBackdrop = document.getElementById('soaps-modal-backdrop');
  const soapsCloseBtn = document.getElementById('soaps-close-btn');

  function toggleSoapsModal(open) {
    if (!soapsModal || !soapsBackdrop) return;
    if (open) {
      soapsBackdrop.classList.remove('hidden');
      soapsModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      soapsBackdrop.classList.add('hidden');
      soapsModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (exploreSoapsBtn) exploreSoapsBtn.addEventListener('click', () => toggleSoapsModal(true));
  if (soapsCloseBtn) soapsCloseBtn.addEventListener('click', () => toggleSoapsModal(false));
  if (soapsBackdrop) soapsBackdrop.addEventListener('click', () => toggleSoapsModal(false));

  // --------------------------------------------------------------------------
  // 15. View All Products CTA
  // --------------------------------------------------------------------------
  const viewAllBtn = document.getElementById('view-all-products-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      const sec = document.getElementById('products');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 16. Newsletter Form
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById('footer-newsletter-form');
  const newsletterInput = document.getElementById('footer-email-input');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterInput ? newsletterInput.value.trim() : '';
      if (email) {
        showToast('🌿 Thank you for subscribing! Welcome to EarthGlaze.', '✨');
        if (newsletterInput) newsletterInput.value = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 17. Customer Reviews Carousel
  // --------------------------------------------------------------------------
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewDots = document.querySelectorAll('.review-dot');
  const reviewsPrevBtn = document.getElementById('reviews-prev-btn');
  const reviewsNextBtn = document.getElementById('reviews-next-btn');
  let currentReviewIdx = 1; // Default to Rizwan K. (idx 1) as in reference visual

  function setReviewActive(idx) {
    if (!reviewCards.length) return;
    currentReviewIdx = (idx + reviewCards.length) % reviewCards.length;
    
    reviewCards.forEach((card, i) => {
      if (i === currentReviewIdx) {
        card.classList.add('active-review-card', 'border-2', 'border-amber-200/80', 'ring-2', 'ring-amber-100/50', 'shadow-md', 'lg:-translate-y-2');
        card.classList.remove('border-stone-200/60', 'shadow-sm');
      } else {
        card.classList.remove('active-review-card', 'border-2', 'border-amber-200/80', 'ring-2', 'ring-amber-100/50', 'shadow-md', 'lg:-translate-y-2');
        card.classList.add('border-stone-200/60', 'shadow-sm');
      }
    });

    reviewDots.forEach((dot, i) => {
      if (i === currentReviewIdx) {
        dot.classList.remove('bg-[#C8D6C9]');
        dot.classList.add('bg-[#1E3B2B]');
      } else {
        dot.classList.remove('bg-[#1E3B2B]');
        dot.classList.add('bg-[#C8D6C9]');
      }
    });
  }

  if (reviewsPrevBtn) {
    reviewsPrevBtn.addEventListener('click', () => setReviewActive(currentReviewIdx - 1));
  }
  if (reviewsNextBtn) {
    reviewsNextBtn.addEventListener('click', () => setReviewActive(currentReviewIdx + 1));
  }
  reviewDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index') || '0', 10);
      setReviewActive(idx);
    });
  });
  reviewCards.forEach((card, i) => {
    card.addEventListener('click', () => setReviewActive(i));
  });

  setReviewActive(1);

  // Initialize
  updateSteppedCarousel(0);
  renderCart();
  handleScrollAnimations();
  startCountdownTimer();
})();
