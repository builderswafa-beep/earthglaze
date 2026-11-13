/**
 * EarthGlaze Natural Skincare - Master Site Content Store
 * Provides default CMS data and local synchronization for dynamic editing
 * of all pages, sections, bullet points, text, and imagery via Admin Dashboard.
 */

export const DEFAULT_SITE_CONTENT = {
  home: {
    hero: {
      eyebrow: 'Ayurvedic Skincare',
      title_prefix: 'Skincare That Feels',
      rotating_words: ['Artisanal.', 'Natural.', 'Pure.', 'Radiant.', 'Personal.'],
      subtitle: 'Pure botanical formulations handcrafted with Ayurvedic herbs, cold-pressed oils, and zero compromises for your skin barrier.',
      cta_primary_label: 'Order Now',
      cta_primary_link: '#combo',
      cta_secondary_label: 'Explore Products',
      cta_secondary_link: '/shop',
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
      eyebrow: 'Special Limited Ritual',
      title: 'The Daily Botanical Trio',
      subtitle: 'Complete skincare synergy: Manjistha brightening bar, Goat Milk moisture bar, and ruby Beetroot lip butter.',
      price: 799,
      original_price: 898,
      discount_label: 'Save ₹99',
      image_closed: '/assets/botanical_combo_original_soaps_closed.png',
      image_open: '/assets/botanical_combo_original_soaps_open.png',
      points: [
        { id: 1, text: '1x Manjistha Brightening Soap (100g)' },
        { id: 2, text: '1x Ultra-Nourishing Goat Milk Soap (100g)' },
        { id: 3, text: '1x Ruby Tint Beetroot Lip Butter (15g)' },
        { id: 4, text: 'Exclusive Keepsake Luxury Gift Box included' }
      ]
    },
    about: {
      eyebrow: 'About Us',
      title: 'The Natural Choice for Healthier Skin',
      description: 'EarthGlaze is a nature-inspired skincare brand that blends pure, skin-loving ingredients with modern care to keep your skin healthy, radiant and naturally beautiful.',
      promise: 'Crafted without synthetic fillers, microplastics, or artificial dyes. Every single batch is lovingly cured and tested.',
      image: '/assets/about-img.png',
      points: [
        { id: 1, title: 'Pure Ingredients', desc: 'Sourced directly from organic farms', icon: '🌿' },
        { id: 2, title: 'Handcrafted With Care', desc: 'Cold-processed to retain bio-actives', icon: '🏺' },
        { id: 3, title: 'Gentle on All Skin', desc: 'Dermatologically balanced for daily harmony', icon: '💧' }
      ]
    },
    newly_launched: {
      eyebrow: 'Fresh From The Workshop',
      title: 'Artisanal Herbal Formulations',
      subtitle: 'Experience the touch of untamed botanicals and therapeutic plant extracts.',
      banner_image: '/assets/banner_newly_leaves.png',
      points: [
        { id: 1, title: 'Cold-Pressed Technique', desc: 'Slow-cured for 4 weeks for silky lather' },
        { id: 2, title: 'Ayurvedic Actives', desc: 'Authentic Manjistha, Neem & Raw Goat Milk' },
        { id: 3, title: 'Zero Synthetic Fragrances', desc: 'Scented purely by nature’s essential oils' }
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
      title: 'The Artisanal Collection',
      subtitle: 'Explore pure botanical bars, silky balms, and luxury gift sets crafted with unrefined ingredients.',
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
      title: 'Get in Touch With Us',
      subtitle: 'Have questions about your skincare routine or want custom ritual advice? Our herbal experts are here for you.'
    },
    info: {
      phone: '+91 98765 43210',
      email: 'support@earthglaze.in',
      address: 'EarthGlaze Botanical Studio, Vidyanagar, Kasaragod, Kerala - 671123',
      timings: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
      points: [
        { id: 1, title: 'Instant WhatsApp Support', desc: 'Reach out to us directly for order or product questions', icon: '💬' },
        { id: 2, title: 'Custom Gifting Consultations', desc: 'Bulk and wedding botanical gift hamper customization', icon: '🎁' },
        { id: 3, title: 'Dermatological Inquiries', desc: 'Guidance on choosing between Manjistha and Goat Milk bars', icon: '🌿' }
      ]
    }
  },
  faq: {
    hero: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Everything You Need to Know',
      subtitle: 'Transparent answers to how our soaps are made, shipping times, and how to preserve your bars.'
    },
    questions: {
      points: [
        { id: 1, title: 'Are EarthGlaze products suitable for sensitive skin?', desc: 'Yes, our Goat Milk Soap and Beetroot Balm are specifically formulated with hypoallergenic, gentle botanicals without synthetic fragrance.' },
        { id: 2, title: 'How long does one artisanal soap bar last?', desc: 'Because our soaps are cold-processed and cured for 4 weeks, one bar typically lasts 3 to 4 weeks with daily use when kept on a draining soap dish.' },
        { id: 3, title: 'Do you use palm oil or chemical hardeners?', desc: 'No. We do not use palm oil, animal tallow, or chemical hardeners. Our firmness comes naturally from coconut oil, shea butter, and extensive air-curing.' },
        { id: 4, title: 'How do I track my order after purchasing?', desc: 'You will receive an instant SMS and email with your tracking number, and you can also track your parcel in real-time on our Track Order page.' }
      ]
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
    // Deep merge with defaults to ensure all keys exist
    return {
      home: { ...DEFAULT_SITE_CONTENT.home, ...(parsed.home || {}) },
      about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
      story: { ...DEFAULT_SITE_CONTENT.story, ...(parsed.story || {}) },
      shop: { ...DEFAULT_SITE_CONTENT.shop, ...(parsed.shop || {}) },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
      faq: { ...DEFAULT_SITE_CONTENT.faq, ...(parsed.faq || {}) },
    };
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
