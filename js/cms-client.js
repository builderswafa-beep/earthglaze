/**
 * EarthGlaze Natural Skincare - CMS Client Hydration Engine
 * Seamlessly hydrates index.html from CMS JSON / localStorage / API
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'earthglaze_site_content';

  function safeSetText(el, text) {
    if (el && text !== undefined && text !== null) {
      el.textContent = text;
    }
  }

  function safeSetHTML(el, html) {
    if (el && html !== undefined && html !== null) {
      el.innerHTML = html;
    }
  }

  function safeSetAttr(el, attr, val) {
    if (el && val !== undefined && val !== null) {
      el.setAttribute(attr, val);
    }
  }

  function applySiteContent(data) {
    if (!data || typeof data !== 'object') return;

    // 1. General & SEO
    if (data.general) {
      if (data.general.siteTitle) {
        document.title = data.general.siteTitle;
      }
      if (data.general.metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', data.general.metaDescription);
      }
      // Announcement Bar
      const annBar = document.querySelector('.announcement-bar');
      if (annBar && data.general.announcementBar) {
        if (data.general.announcementBar.enabled === false) {
          annBar.style.display = 'none';
        } else {
          annBar.style.display = '';
          const annText = annBar.querySelector('span') || annBar;
          if (data.general.announcementBar.text) {
            annText.textContent = data.general.announcementBar.text;
          }
          if (data.general.announcementBar.link) {
            const annLink = annBar.querySelector('a');
            if (annLink) annLink.setAttribute('href', data.general.announcementBar.link);
          }
        }
      }
    }

    // 2. Header
    if (data.header) {
      if (data.header.logo && data.header.logo.src) {
        document.querySelectorAll('header a[aria-label*="Home"] img, #mobile-drawer img').forEach(img => {
          img.src = data.header.logo.src;
          if (data.header.logo.alt) img.alt = data.header.logo.alt;
        });
      }
    }

    // 3. Hero Section
    if (data.hero) {
      const hero = document.getElementById('hero-section');
      if (hero) {
        const eyebrow = hero.querySelector('.hero-eyebrow span:not(.eyebrow-divider)') || hero.querySelector('[class*="tracking-[0.25em]"]');
        if (eyebrow && data.hero.eyebrow) eyebrow.textContent = data.hero.eyebrow;

        if (data.hero.titleLine1 || data.hero.titleAccent) {
          const h1 = hero.querySelector('h1');
          if (h1) {
            const accentSpan = h1.querySelector('.hero-title-accent') || h1.querySelector('span[class*="italic"]');
            if (accentSpan && data.hero.titleAccent) {
              accentSpan.textContent = data.hero.titleAccent;
            }
            if (data.hero.titleLine1) {
              // Update text node before accentSpan
              for (let node of h1.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                  node.textContent = data.hero.titleLine1 + ' ';
                  break;
                }
              }
            }
          }
        }

        const desc = hero.querySelector('p[class*="text-[#404F44]"]');
        if (desc && data.hero.description) desc.textContent = data.hero.description;

        // CTA buttons
        const ctaShop = document.getElementById('hero-cta-btn');
        if (ctaShop && data.hero.ctaPrimary) {
          if (data.hero.ctaPrimary.label) {
            const span = ctaShop.querySelector('span') || ctaShop;
            span.textContent = data.hero.ctaPrimary.label;
          }
          if (data.hero.ctaPrimary.href) ctaShop.setAttribute('href', data.hero.ctaPrimary.href);
        }

        const ctaExplore = document.getElementById('hero-explore-btn');
        if (ctaExplore && data.hero.ctaSecondary) {
          if (data.hero.ctaSecondary.label) {
            const span = ctaExplore.querySelector('span') || ctaExplore;
            span.textContent = data.hero.ctaSecondary.label;
          }
          if (data.hero.ctaSecondary.href) ctaExplore.setAttribute('href', data.hero.ctaSecondary.href);
        }

        // Hero slides / carousel
        if (Array.isArray(data.hero.slides)) {
          data.hero.slides.forEach((slide, idx) => {
            const card = document.querySelector(`.hero-curved-card[data-card-index="${idx}"]`);
            if (card) {
              if (slide.closedImage) {
                const closedImg = card.querySelector('.product-closed-layer img');
                if (closedImg) closedImg.src = slide.closedImage;
              }
              if (slide.openImage) {
                const openImg = card.querySelector('.product-open-layer img');
                if (openImg) openImg.src = slide.openImage;
              }
            }
          });
          if (window.heroProductsCatalog) {
            data.hero.slides.forEach((slide, idx) => {
              if (window.heroProductsCatalog[idx]) {
                Object.assign(window.heroProductsCatalog[idx], slide);
              }
            });
            if (window.EarthGlazeCarousel && typeof window.EarthGlazeCarousel.updateSteppedCarousel === 'function') {
              window.EarthGlazeCarousel.updateSteppedCarousel(window.EarthGlazeCarousel.getActiveIndex ? window.EarthGlazeCarousel.getActiveIndex() : 0);
            }
          }
        }
      }
    }

    // 4. Combo Offer Section
    if (data.comboOffer) {
      const offer = document.getElementById('offer');
      if (offer) {
        if (data.comboOffer.brandName) {
          const brandEl = offer.querySelector('.font-bold.text-\\[\\#1E3B2B\\]');
          if (brandEl) brandEl.innerHTML = `${data.comboOffer.brandName}<span class="text-[11px] font-semibold ml-0.5">®</span>`;
        }
        if (data.comboOffer.brandSub) {
          const subEl = offer.querySelector('[class*="tracking-[0.2em]"]');
          if (subEl) subEl.textContent = data.comboOffer.brandSub;
        }

        const h2 = offer.querySelector('h2');
        if (h2) {
          const accent = h2.querySelector('span');
          if (accent && data.comboOffer.titleAccent) accent.textContent = data.comboOffer.titleAccent;
          if (data.comboOffer.titleLine1) {
            for (let node of h2.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                node.textContent = data.comboOffer.titleLine1 + ' ';
                break;
              }
            }
          }
        }

        const subTitle = offer.querySelector('h2 + p');
        if (subTitle && data.comboOffer.subtitle) subTitle.textContent = data.comboOffer.subtitle;

        // Pricing
        const oldPriceEl = offer.querySelector('.line-through');
        if (oldPriceEl && data.comboOffer.originalPrice) oldPriceEl.textContent = data.comboOffer.originalPrice;

        const newPriceEl = offer.querySelector('.bg-\\[\\#1E3B2B\\] .text-white.tracking-tight');
        if (newPriceEl && data.comboOffer.comboPrice) newPriceEl.textContent = data.comboOffer.comboPrice;

        const savingsEl = offer.querySelector('.inline-flex.items-center.gap-2.bg-\\[\\#E5F2DD\\] span:last-child');
        if (savingsEl && data.comboOffer.savingsText) savingsEl.textContent = data.comboOffer.savingsText;

        const ctaBtn = document.getElementById('grab-offer-btn');
        if (ctaBtn && data.comboOffer.ctaText) {
          const ctaSpan = ctaBtn.querySelector('span:not(.sr-only)') || ctaBtn;
          ctaSpan.textContent = data.comboOffer.ctaText;
        }

        // Showcase image
        if (data.comboOffer.showcaseImage) {
          const img = offer.querySelector('img[src*="combo-offer"]') || offer.querySelector('img[src*="combo_offer_showcase"]');
          if (img) img.src = data.comboOffer.showcaseImage;
        }
      }
    }

    // 5. About Section
    if (data.about) {
      const about = document.getElementById('about');
      if (about) {
        const eyebrow = about.querySelector('[class*="tracking-[0.25em]"]');
        if (eyebrow && data.about.eyebrow) eyebrow.textContent = data.about.eyebrow;

        const h2 = about.querySelector('h2');
        if (h2) {
          const accent = h2.querySelector('span');
          if (accent && data.about.titleAccent) accent.textContent = data.about.titleAccent;
          if (data.about.titlePrefix) {
            for (let node of h2.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                node.textContent = data.about.titlePrefix + ' ';
                break;
              }
            }
          }
        }

        const desc = about.querySelector('p[class*="text-[#404F44]"]');
        if (desc && data.about.description) desc.textContent = data.about.description;

        if (data.about.archImage) {
          const arch = about.querySelector('img[src*="about-img"]') || about.querySelector('img[src*="about_arch"]') || about.querySelector('.about-arch-frame img');
          if (arch) arch.src = data.about.archImage;
        }

        if (Array.isArray(data.about.pillars)) {
          const pillarCards = about.querySelectorAll('.grid > div');
          data.about.pillars.forEach((p, idx) => {
            if (pillarCards[idx]) {
              const title = pillarCards[idx].querySelector('h3, h4');
              const text = pillarCards[idx].querySelector('p');
              if (title && p.title) title.textContent = p.title;
              if (text && p.desc) text.textContent = p.desc;
            }
          });
        }
      }
    }

    // 6. Our Story Section
    if (data.ourStory) {
      const story = document.getElementById('our-story');
      if (story) {
        const eyebrow = story.querySelector('[class*="tracking-[0.25em]"]');
        if (eyebrow && data.ourStory.eyebrow) eyebrow.textContent = data.ourStory.eyebrow;

        const h2 = story.querySelector('h2');
        if (h2) {
          const accent = h2.querySelector('span');
          if (accent && data.ourStory.titleAccent) accent.textContent = data.ourStory.titleAccent;
          if (data.ourStory.titlePrefix) {
            for (let node of h2.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                node.textContent = data.ourStory.titlePrefix + ' ';
                break;
              }
            }
          }
        }

        const paragraphs = story.querySelectorAll('.space-y-4 > p');
        if (paragraphs[0] && data.ourStory.paragraph1) paragraphs[0].textContent = data.ourStory.paragraph1;
        if (paragraphs[1] && data.ourStory.paragraph2) paragraphs[1].textContent = data.ourStory.paragraph2;

        if (data.ourStory.archImage) {
          const img = story.querySelector('img[src*="our_story_arch"]');
          if (img) img.src = data.ourStory.archImage;
        }

        if (Array.isArray(data.ourStory.stats)) {
          const statBlocks = story.querySelectorAll('.grid > div');
          data.ourStory.stats.forEach((s, idx) => {
            if (statBlocks[idx]) {
              const num = statBlocks[idx].querySelector('.font-bold');
              const label = statBlocks[idx].querySelector('.text-xs, .text-sm');
              if (num && s.number) num.textContent = s.number;
              if (label && s.label) label.textContent = s.label;
            }
          });
        }
      }
    }

    // 7. Products Section (Bestsellers)
    if (data.products) {
      const productsSec = document.getElementById('products');
      if (productsSec) {
        const eyebrow = productsSec.querySelector('[class*="tracking-[0.25em]"]');
        if (eyebrow && data.products.eyebrow) eyebrow.textContent = data.products.eyebrow;

        const h2 = productsSec.querySelector('h2');
        if (h2) {
          const accent = h2.querySelector('span');
          if (accent && data.products.titleAccent) accent.textContent = data.products.titleAccent;
          if (data.products.titlePrefix) {
            for (let node of h2.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                node.textContent = data.products.titlePrefix + ' ';
                break;
              }
            }
          }
        }

        const subTitle = productsSec.querySelector('h2 + p');
        if (subTitle && data.products.subtitle) subTitle.textContent = data.products.subtitle;

        // Master banner image
        if (data.products.bannerImage) {
          const bannerImg = productsSec.querySelector('img[src*="earth_glanze_favarite"]') || productsSec.querySelector('img[alt*="EarthGlaze Favourites"]');
          if (bannerImg) bannerImg.src = data.products.bannerImage;
        }

        // Bestseller cards
        if (Array.isArray(data.products.items)) {
          const cards = productsSec.querySelectorAll('.product-card');
          data.products.items.forEach((item, idx) => {
            if (cards[idx]) {
              const img = cards[idx].querySelector('img');
              if (img && item.image) img.src = item.image;

              const name = cards[idx].querySelector('h3');
              if (name && item.name) name.textContent = item.name;

              const cat = cards[idx].querySelector('.text-xs.uppercase, .text-xs.font-semibold');
              if (cat && item.category) cat.textContent = item.category;

              const price = cards[idx].querySelector('.font-bold.text-lg, .font-bold.text-xl');
              if (price && item.price) price.textContent = item.price;

              const oldPrice = cards[idx].querySelector('.line-through');
              if (oldPrice && item.originalPrice) oldPrice.textContent = item.originalPrice;

              const badge = cards[idx].querySelector('.absolute.top-3, .absolute.top-4');
              if (badge && item.badge) badge.textContent = item.badge;
            }
          });
        }
      }
    }

    // 8. Newly Launched Section
    if (data.newlyLaunched) {
      const soaps = document.getElementById('soaps');
      if (soaps) {
        const eyebrowPill = soaps.querySelector('.soaps-banner-container [class*="tracking-[0.18em]"]');
        if (eyebrowPill && data.newlyLaunched.eyebrowBadge) eyebrowPill.textContent = data.newlyLaunched.eyebrowBadge;

        const h2 = soaps.querySelector('h2');
        if (h2) {
          const accent = h2.querySelector('span');
          if (accent && data.newlyLaunched.titleAccent) accent.textContent = data.newlyLaunched.titleAccent;
          if (data.newlyLaunched.titleLine1) {
            for (let node of h2.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                node.textContent = data.newlyLaunched.titleLine1 + ' ';
                break;
              }
            }
          }
        }

        const desc = soaps.querySelector('p[class*="text-[#404F44]"]');
        if (desc && data.newlyLaunched.description) desc.textContent = data.newlyLaunched.description;

        const ctaBtn = document.getElementById('explore-soaps-btn');
        if (ctaBtn && data.newlyLaunched.ctaText) {
          const span = ctaBtn.querySelector('span:not(.sr-only)') || ctaBtn;
          span.textContent = data.newlyLaunched.ctaText;
        }

        if (data.newlyLaunched.productImage) {
          const img = soaps.querySelector('img[src*="newly_launched"]') || soaps.querySelector('.soaps-banner-container img');
          if (img) img.src = data.newlyLaunched.productImage;
        }
      }
    }

    // 9. Customer Reviews Section
    if (data.reviews) {
      const revSec = document.getElementById('reviews');
      if (revSec) {
        if (data.reviews.brandLogo) {
          const logo = revSec.querySelector('img[src*="earthglaze-logo"]');
          if (logo) logo.src = data.reviews.brandLogo;
        }

        const eyebrow = revSec.querySelector('[class*="tracking-[0.25em]"]');
        if (eyebrow && data.reviews.eyebrow) eyebrow.textContent = data.reviews.eyebrow;

        const h2 = revSec.querySelector('h2');
        if (h2) {
          const accent = h2.querySelector('span');
          if (accent && data.reviews.titleAccent) accent.textContent = data.reviews.titleAccent;
          if (data.reviews.titlePrefix) {
            for (let node of h2.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                node.textContent = data.reviews.titlePrefix + ' ';
                break;
              }
            }
          }
        }

        if (Array.isArray(data.reviews.items)) {
          const cards = revSec.querySelectorAll('.review-card');
          data.reviews.items.forEach((rev, idx) => {
            if (cards[idx]) {
              const name = cards[idx].querySelector('h4');
              if (name && rev.name) name.textContent = rev.name;

              const avatar = cards[idx].querySelector('img');
              if (avatar && rev.avatar) avatar.src = rev.avatar;

              const quote = cards[idx].querySelector('p');
              if (quote && rev.quote) quote.textContent = rev.quote;
            }
          });
        }
      }
    }

    // 10. FAQ Section
    if (data.faq) {
      const faqSec = document.getElementById('faq');
      if (faqSec) {
        const eyebrow = faqSec.querySelector('[class*="tracking-[0.25em]"]');
        if (eyebrow && data.faq.eyebrow) eyebrow.textContent = data.faq.eyebrow;

        const h2 = faqSec.querySelector('h2');
        if (h2) {
          const accent = h2.querySelector('span');
          if (accent && data.faq.titleAccent) accent.textContent = data.faq.titleAccent;
          if (data.faq.titlePrefix) {
            for (let node of h2.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                node.textContent = data.faq.titlePrefix + ' ';
                break;
              }
            }
          }
        }

        const subTitle = faqSec.querySelector('h2 + p');
        if (subTitle && data.faq.subtitle) subTitle.textContent = data.faq.subtitle;

        // Column 1 Q&As
        if (Array.isArray(data.faq.col1Questions)) {
          const col1Cards = faqSec.querySelectorAll('.grid > div:first-child .faq-card');
          data.faq.col1Questions.forEach((qObj, idx) => {
            if (col1Cards[idx]) {
              const qEl = col1Cards[idx].querySelector('h3, h4, span.font-bold');
              const aEl = col1Cards[idx].querySelector('.faq-answer p, p');
              if (qEl && qObj.q) qEl.textContent = qObj.q;
              if (aEl && qObj.a) aEl.textContent = qObj.a;
            }
          });
        }

        // Column 2 Q&As
        if (Array.isArray(data.faq.col2Questions)) {
          const col2Cards = faqSec.querySelectorAll('.grid > div:last-child .faq-card');
          data.faq.col2Questions.forEach((qObj, idx) => {
            if (col2Cards[idx]) {
              const qEl = col2Cards[idx].querySelector('h3, h4, span.font-bold');
              const aEl = col2Cards[idx].querySelector('.faq-answer p, p');
              if (qEl && qObj.q) qEl.textContent = qObj.q;
              if (aEl && qObj.a) aEl.textContent = qObj.a;
            }
          });
        }
      }
    }

    // 11. Footer Section
    if (data.footer) {
      const footer = document.querySelector('footer');
      if (footer) {
        if (data.footer.logo) {
          const logo = footer.querySelector('img[src*="earthglaze-logo"]');
          if (logo) logo.src = data.footer.logo;
        }

        if (data.footer.tagline) {
          const tagline = footer.querySelector('p[class*="text-[#404F44]"]');
          if (tagline) tagline.textContent = data.footer.tagline;
        }

        if (data.footer.copyright) {
          const cr = footer.querySelector('.footer-copyright, p[class*="text-stone-400"]');
          if (cr) cr.textContent = data.footer.copyright;
        }
      }
    }
  }

  // 1. Instant hydration from localStorage if cached
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      applySiteContent(data);
    }
  } catch (e) {
    console.warn('[CMS Client] Could not read from localStorage', e);
  }

  // 2. Fetch fresh content from /api/content
  fetch('/api/content')
    .then(res => {
      if (!res.ok) throw new Error('Network response not ok');
      return res.json();
    })
    .then(data => {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        applySiteContent(data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
      }
    })
    .catch(err => {
      // Offline or static file server without API — localStorage cache handles it
      console.log('[CMS Client] API unavailable, running in offline/static mode');
    });

  // 3. Listen for live CMS updates across tabs or iframe parent
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        applySiteContent(data);
      } catch (err) {}
    }
  });

  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'EARTHGLAZE_CMS_PREVIEW') {
      applySiteContent(e.data.content);
    }
  });

  // Expose global helper
  window.EarthGlazeCMS = {
    applySiteContent,
    getCurrentData: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
      } catch (e) {
        return null;
      }
    }
  };
})();
