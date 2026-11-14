/**
 * EarthGlaze Natural Skincare - Master Site Content Store
 * Provides default CMS data and local synchronization for dynamic editing
 * of all pages, sections, bullet points, text, and imagery via Admin Dashboard.
 */

export const DEFAULT_SITE_CONTENT = {
  home: {
    hero: {
      eyebrow: 'Natural Skincare',
      title: 'Skincare That Feels',
      rotating_words: ['Artisanal.', 'Natural.', 'Pure.', 'Radiant.', 'Personal.'],
      subtitle: 'Nature-powered skincare crafted with pure ingredients for healthy, glowing skin — made just for you.',
      cta_primary_label: 'Explore Our Range',
      cta_primary_link: '/shop',
      cta_secondary_label: 'Our Story',
      cta_secondary_link: '/story',
      bg_image: '/assets/hero_apothecary_stage_backdrop.jpg',
      mortar_image: '/assets/hero_mortar_prop_transparent.png',
      bottle_image: '/assets/hero_bottle_prop_transparent.png',
      points: [
        { id: 1, text: '100% Ayurvedic & Herbal Formulations', icon: '🌿' },
        { id: 2, text: 'Cold-Pressed Actives without Fillers', icon: '🥥' },
        { id: 3, text: 'Zero Sulfates, Parabens or Toxins', icon: '✨' },
        { id: 4, text: 'Ethically Handcrafted in Small Batches', icon: '🏺' }
      ]
    },
    trust_strip: {
      badge_text: 'Clean Skincare Guarantee',
      points: [
        { id: 1, title: '100% Natural', subtitle: 'Wild-harvested herbal botanicals', icon: '🌿' },
        { id: 2, title: 'Ayurvedic Formulation', subtitle: 'Centuries of classical wisdom', icon: '🍃' },
        { id: 3, title: 'No Harsh Chemicals', subtitle: 'Zero sulfates, silicones or parabens', icon: '✨' },
        { id: 4, title: 'Cruelty Free', subtitle: 'Never tested on animals', icon: '🐰' }
      ]
    },
    combo: {
      eyebrow: 'SIGNATURE GIFT TRIO',
      title: 'The Botanical Combo Offer',
      subtitle: 'Complete Natural Care Set — Pure botanical formulations crafted for daily glow, softness, and care.',
      price: 799,
      original_price: 898,
      discount_label: 'Save ₹99 (11% OFF)',
      image_closed: '/assets/botanical_combo_original_soaps_closed.png',
      image_open: '/assets/botanical_combo_original_soaps_open.png',
      cta_primary_label: 'Buy Combo Now',
      cta_primary_link: '#combo',
      points: [
        { id: 1, text: '1x Manjistha Brightening Soap (100g)', icon: '🌿' },
        { id: 2, text: '1x Ultra-Nourishing Goat Milk Soap (100g)', icon: '🥛' },
        { id: 3, text: '1x Ruby Tint Beetroot Lip Butter (15g)', icon: '💄' },
        { id: 4, text: 'Exclusive Keepsake Luxury Gift Box included', icon: '🎁' }
      ]
    },
    about: {
      eyebrow: 'About Us',
      title: 'The Natural Choice for Healthier Skin',
      description: 'EarthGlaze is a nature-inspired skincare brand that blends pure, skin-loving ingredients with modern care to keep your skin healthy, radiant and naturally beautiful.',
      promise: 'Crafted without synthetic fillers, microplastics, or artificial dyes. Every single batch is lovingly cured and tested.',
      image: '/assets/about-img.png',
      cta_primary_label: 'Learn More',
      cta_primary_link: '/about',
      points: [
        { id: 1, title: 'Pure Ingredients', desc: 'Sourced directly from organic farms', icon: '🌿' },
        { id: 2, title: 'Handcrafted With Care', desc: 'Cold-processed to retain bio-actives', icon: '🏺' },
        { id: 3, title: 'Gentle on All Skin', desc: 'Dermatologically balanced for daily harmony', icon: '💧' }
      ]
    },
    favourites: {
      eyebrow: 'Pure Botanical Formulation',
      title: 'Customer Favourites',
      subtitle: 'Handcrafted in small batches with cold-pressed oils & pure herbs — hover or tap a card to unbox.',
      points: [
        { id: 1, title: 'Bestseller Manjistha', desc: 'Purifies skin & gives an authentic herbal glow', icon: '👑' },
        { id: 2, title: 'Top Rated Goat Milk', desc: 'Deeply nourishes & soothes delicate skin barriers', icon: '★' },
        { id: 3, title: 'Ruby Beetroot Balm', desc: 'Naturally tinted, ultra-supple moisturizing balm', icon: '💄' }
      ]
    },
    newly_launched: {
      eyebrow: 'Newly Launched • Small-Batch 15g',
      title: 'Beetroot Lip Balm',
      subtitle: 'A luscious, velvety lip balm made with slow-infused fresh organic beetroot extract. It deeply nourishes, restores natural color and keeps your lips soft, smooth and naturally healthy.',
      price: 249,
      original_price: 299,
      discount_label: '15% OFF',
      rating: '★ 4.9 (334 reviews)',
      banner_image: '/assets/banner_newly_leaves.png',
      image_closed: '/assets/lip_balm_closed_box.png',
      image_open: '/assets/lipbalmopenbox.png',
      cta_primary_label: 'Explore the New Range',
      cta_primary_link: '/shop',
      points: [
        { id: 1, title: 'Deep Hydration', desc: 'Infused with cold-pressed botanical oils', icon: '🍃' },
        { id: 2, title: 'Natural Tint', desc: 'Fresh beetroot extract provides a ruby glow', icon: '✨' },
        { id: 3, title: 'Chemical Free', desc: 'Zero synthetic dyes, petroleum, or parabens', icon: '⚗️' }
      ]
    },
    reviews: {
      eyebrow: 'Customer Reviews',
      title: 'Loved by Our Customers',
      subtitle: 'Real feedback from verified customers who love EarthGlaze botanical formulations.',
      points: [
        { id: 1, name: 'Ayesha N.', rating: 5, product: 'Goat Milk Soap', comment: 'My skin feels so clean and naturally soft after using the Goat Milk Soap!', icon: '⭐' },
        { id: 2, name: 'Rizwan K.', rating: 5, product: 'Manjistha Soap', comment: 'The Manjistha Soap really improved my skin tone. Totally love it!', icon: '⭐' },
        { id: 3, name: 'Hiba S.', rating: 5, product: 'Beet Root Lip Balm', comment: 'The Beet Root Lip Balm keeps my lips soft, smooth and naturally pink.', icon: '⭐' },
        { id: 4, name: 'Faizal M.', rating: 5, product: 'Herbal Daily Care', comment: 'Gentle, herbal and perfect for daily use. Highly recommended!', icon: '⭐' },
        { id: 5, name: 'Pooja R.', rating: 5, product: 'Neem Soap', comment: 'The Neem Soap completely calmed my breakouts and redness. It feels deeply detoxifying yet never dries out my skin.', icon: '⭐' },
        { id: 6, name: 'Zainab M.', rating: 5, product: 'The Botanical Combo', comment: 'Ordered the Botanical Combo gift set for my sister. The packaging, artisanal finish, and herbal aroma are pure luxury!', icon: '⭐' },
        { id: 7, name: 'Karthik S.', rating: 5, product: 'Beet Root Lip Balm', comment: 'Authentic natural formulation without harsh chemicals. The beetroot tint is subtle, hydrating, and lasts all day.', icon: '⭐' }
      ]
    },
    faq: {
      eyebrow: 'Got Questions?',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our handcrafted ayurvedic botanicals, ingredients, orders, and delivery.',
      points: [
        { id: 1, title: 'What makes EarthGlaze soaps different from commercial soaps?', desc: 'Unlike mass-manufactured soaps that strip skin with detergents and synthetic lathering agents, our soaps are 100% cold-processed using organic cold-pressed plant oils and traditional Ayurvedic herbal decoctions.' },
        { id: 2, title: 'Are EarthGlaze products suitable for sensitive skin?', desc: 'Yes, our Goat Milk Soap and Beetroot Balm are specifically formulated with hypoallergenic, gentle botanicals without synthetic fragrance.' },
        { id: 3, title: 'How long does one artisanal soap bar last?', desc: 'Because our soaps are cold-processed and cured for 4 weeks, one bar typically lasts 3 to 4 weeks with daily use when kept on a draining soap dish.' },
        { id: 4, title: 'Do you use palm oil or chemical hardeners?', desc: 'No. We do not use palm oil, animal tallow, or chemical hardeners. Our firmness comes naturally from coconut oil, shea butter, and extensive air-curing.' },
        { id: 5, title: 'How do I track my order after purchasing?', desc: 'You will receive an instant SMS and email with your tracking number, and you can also track your parcel in real-time on our Track Order page.' }
      ]
    }
  },
  about: {
    hero: {
      eyebrow: 'Our Roots',
      title: 'The EarthGlaze Story',
      subtitle: 'Born from an unyielding belief that real skincare should be as honest, pure, and grounded as the earth beneath our feet.',
      bg_image: '/assets/about_hero_seamless_hd.png'
    },
    philosophy: {
      eyebrow: 'Our Philosophy',
      title: 'Handcrafted in Kasaragod, Made for Everyone',
      description: 'Every bar and balm begins in our boutique workshop where time-tested Ayurvedic herbs are blended by hand with unrefined oils.',
      image: '/assets/about_hands_mortar_perfect.png',
      points: [
        { id: 1, title: 'Ethical Sourcing', desc: 'Supporting local tribal and organic farmers', icon: '🌱' },
        { id: 2, title: 'Cold Process Method', desc: 'Preserving raw enzymes and botanical potency', icon: '❄️' },
        { id: 3, title: 'Earth Conscious', desc: '100% biodegradable, plastic-free packaging', icon: '♻️' }
      ]
    },
    values: {
      eyebrow: 'Our Four Pillars',
      title: 'The Principles That Guide Every Formulation',
      points: [
        { id: 1, title: 'Transparency', desc: 'Every ingredient is clearly disclosed without hidden chemical names', icon: '🔍' },
        { id: 2, title: 'Purity First', desc: 'Never diluted with water, silicones, or synthetic foaming agents', icon: '💧' },
        { id: 3, title: 'Ancient Wisdom', desc: 'Formulated in accordance with classical Ayurvedic balance', icon: '📜' },
        { id: 4, title: 'Cruelty-Free', desc: 'Tested on human skincare lovers, never on animals', icon: '🐰' }
      ]
    }
  },
  story: {
    hero: {
      eyebrow: 'Artisanal Heritage',
      title: 'Our Heritage & Journey',
      subtitle: 'How an ancient family recipe became Kerala’s most cherished botanical skincare ritual.',
      image: '/assets/about-img.png',
      points: [
        { id: 1, title: '2022', desc: 'First experimental batch made in a family kitchen' },
        { id: 2, title: '2024', desc: 'Artisanal workshop established in Kasaragod' },
        { id: 3, title: '2026', desc: 'Over 10,000 satisfied skincare devotees across India' }
      ]
    }
  },
  shop: {
    hero: {
      eyebrow: 'Store Catalog',
      title: 'Shop Our Natural Skincare Range',
      subtitle: 'Pure, plant-based essentials crafted for healthy, radiant skin.',
      banner_image: '/assets/banner_offer_top_leaves.png',
      promo_banner: 'Free Express Shipping across India on orders above ₹499',
      points: [
        { id: 1, title: 'Safe & Secure Checkout', desc: 'UPI, Cards, NetBanking and Cash on Delivery', icon: '🔒' },
        { id: 2, title: 'Fast Dispatches', desc: 'Packed and shipped within 24 hours of order receipt', icon: '⚡' },
        { id: 3, title: 'Freshly Handcrafted', desc: 'Small batch formulation guarantees peak bioactivity', icon: '✨' }
      ]
    }
  },
  contact: {
    hero: {
      eyebrow: 'Direct Assistance',
      title: 'Contact Us',
      subtitle: "Have a question about our products, orders or skincare? Get in touch with our team. We'd love to hear from you!",
      bg_image: '/assets/contact_hero_seamless_hd.png',
      image: '/assets/contact_hero_seamless_hd.png'
    },
    info: {
      phone: '+91 98765 43210',
      email: 'support@earthglaze.in',
      address: 'EarthGlaze Botanical Studio, Vidyanagar, Kasaragod, Kerala - 671123',
      timings: 'Mon – Sat: 9:00 AM – 6:00 PM (Sunday Closed)',
      whatsapp: '+91 98765 43210',
      points: [
        { id: 1, title: 'Direct Phone & WhatsApp', desc: '+91 98765 43210 — Instant order or product assistance', icon: '💬' },
        { id: 2, title: 'Email Assistance', desc: 'support@earthglaze.in — Response within 4 business hours', icon: '✉️' },
        { id: 3, title: 'Artisanal Studio', desc: 'Vidyanagar, Kasaragod, Kerala - 671123', icon: '📍' }
      ]
    }
  },
  faq: {
    hero: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Everything You Need to Know',
      subtitle: 'Transparent answers to how our soaps are made, shipping times, and how to preserve your bars.',
      image: '/assets/about-img.png'
    },
    questions: {
      points: [
        { id: 1, title: 'Are EarthGlaze products suitable for sensitive skin?', desc: 'Yes, our Goat Milk Soap and Beetroot Balm are specifically formulated with hypoallergenic, gentle botanicals without synthetic fragrance.' },
        { id: 2, title: 'How long does one artisanal soap bar last?', desc: 'Because our soaps are cold-processed and cured for 4 weeks, one bar typically lasts 3 to 4 weeks with daily use when kept on a draining soap dish.' },
        { id: 3, title: 'Do you use palm oil or chemical hardeners?', desc: 'No. We do not use palm oil, animal tallow, or chemical hardeners. Our firmness comes naturally from coconut oil, shea butter, and extensive air-curing.' },
        { id: 4, title: 'How do I track my order after purchasing?', desc: 'You will receive an instant SMS and email with your tracking number, and you can also track your parcel in real-time on our Track Order page.' }
      ]
    }
  },
  footer: {
    brand: {
      tagline: 'Nature-powered skincare for healthier, glowing skin.',
      logo: '/assets/earthglaze-logo-hd.png',
      copyright: '© 2026 EarthGlaze Natural Skincare. All rights reserved.'
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'support@earthglaze.in',
      address: 'EarthGlaze Botanical Studio, Kasaragod, Kerala – 671123'
    },
    socials: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      pinterest: 'https://pinterest.com'
    }
  },
  navbar: {
    announcement: {
      text: '🌿 Pure Botanical Rituals: Free Express Shipping across India on orders above ₹499!',
      link: '/shop',
      active: 'true'
    }
  }
};

/**
 * Storage Helpers
 */
export function getStoredContent() {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    const val = localStorage.getItem('earthglaze_site_content');
    if (!val) {
      localStorage.setItem('earthglaze_site_content', JSON.stringify(DEFAULT_SITE_CONTENT));
      return DEFAULT_SITE_CONTENT;
    }
    const parsed = JSON.parse(val);
    
    // Deep merge with defaults so that all pages and sections are always guaranteed
    const merged = {};
    for (const pageKey of Object.keys(DEFAULT_SITE_CONTENT)) {
      merged[pageKey] = {};
      for (const secKey of Object.keys(DEFAULT_SITE_CONTENT[pageKey])) {
        merged[pageKey][secKey] = {
          ...DEFAULT_SITE_CONTENT[pageKey][secKey],
          ...(parsed?.[pageKey]?.[secKey] || {})
        };
      }
    }
    return merged;
  } catch (e) {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveStoredContent(updatedContent) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('earthglaze_site_content', JSON.stringify(updatedContent));
    window.dispatchEvent(new CustomEvent('earthglaze:content-updated', { detail: updatedContent }));
  } catch (e) {}
}

export function resetStoredContent() {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    localStorage.setItem('earthglaze_site_content', JSON.stringify(DEFAULT_SITE_CONTENT));
    window.dispatchEvent(new CustomEvent('earthglaze:content-updated', { detail: DEFAULT_SITE_CONTENT }));
    return DEFAULT_SITE_CONTENT;
  } catch (e) {
    return DEFAULT_SITE_CONTENT;
  }
}
