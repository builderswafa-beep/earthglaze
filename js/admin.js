/**
 * EarthGlaze Admin Dashboard CMS Logic
 * Powers live visual editing of all homepage sections, images, and copy.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'earthglaze_site_content';
  let siteData = {};

  // DOM Elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const btnSaveAll = document.getElementById('btn-save-all');
  const btnTogglePreview = document.getElementById('btn-toggle-preview');
  const previewModal = document.getElementById('preview-modal');
  const btnClosePreview = document.getElementById('btn-close-preview');
  const btnRefreshPreview = document.getElementById('btn-refresh-preview');
  const previewIframe = document.getElementById('preview-iframe');
  const btnExportJson = document.getElementById('btn-export-json');
  const inputImportJson = document.getElementById('input-import-json');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  // ==========================================================================
  // 1. Toast Notification
  // ==========================================================================
  function showToast(msg, isError = false) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.className = `fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
      isError ? 'bg-red-800 border-red-500' : 'bg-[#1E3B2B] border-amber-400/40'
    } text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3`;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.transform = 'translateY(80px)';
      toast.style.opacity = '0';
    }, 3200);
  }

  // ==========================================================================
  // 2. Tab Navigation
  // ==========================================================================
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.add('hidden'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.remove('hidden');
    });
  });

  // ==========================================================================
  // 3. Load Initial Content
  // ==========================================================================
  async function loadInitialData() {
    // 1. Try fetching from /api/content
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        if (json && Object.keys(json).length > 0) {
          siteData = json;
          populateForm(siteData);
          return;
        }
      }
    } catch (err) {
      console.warn('[CMS] API fetch failed, checking localStorage', err);
    }

    // 2. Fallback to localStorage
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        siteData = JSON.parse(cached);
        populateForm(siteData);
        return;
      }
    } catch (e) {}

    // 3. Fallback to data/site-content.json direct fetch
    try {
      const res2 = await fetch('data/site-content.json');
      if (res2.ok) {
        siteData = await res2.json();
        populateForm(siteData);
      }
    } catch (e) {
      console.error('[CMS] Failed to load site content', e);
    }
  }

  // ==========================================================================
  // 4. Populate All Form Fields
  // ==========================================================================
  function populateForm(data) {
    if (!data) return;

    // --- Tab 1: General ---
    if (data.general) {
      setVal('general-siteTitle', data.general.siteTitle);
      setVal('general-metaDescription', data.general.metaDescription);
      if (data.general.announcementBar) {
        setChecked('general-announcementBar-enabled', data.general.announcementBar.enabled !== false);
        setVal('general-announcementBar-text', data.general.announcementBar.text);
        setVal('general-announcementBar-link', data.general.announcementBar.link);
      }
    }

    // --- Tab 2: Header ---
    if (data.header) {
      if (data.header.logo) {
        setVal('header-logo-src', data.header.logo.src);
        setImgSrc('preview-header-logo', data.header.logo.src);
      }
      renderNavLinks(data.header.navLinks || []);
    }

    // --- Tab 3: Hero ---
    if (data.hero) {
      setVal('hero-eyebrow', data.hero.eyebrow);
      setVal('hero-titleLine1', data.hero.titleLine1);
      setVal('hero-titleAccent', data.hero.titleAccent);
      setVal('hero-description', data.hero.description);
      if (data.hero.ctaPrimary) {
        setVal('hero-ctaPrimary-label', data.hero.ctaPrimary.label);
        setVal('hero-ctaPrimary-href', data.hero.ctaPrimary.href);
      }
      if (data.hero.ctaSecondary) {
        setVal('hero-ctaSecondary-label', data.hero.ctaSecondary.label);
        setVal('hero-ctaSecondary-href', data.hero.ctaSecondary.href);
      }
      renderHeroSlides(data.hero.slides || []);
    }

    // --- Tab 4: Combo Offer ---
    if (data.comboOffer) {
      setVal('comboOffer-brandName', data.comboOffer.brandName);
      setVal('comboOffer-brandSub', data.comboOffer.brandSub);
      setVal('comboOffer-titleLine1', data.comboOffer.titleLine1);
      setVal('comboOffer-titleAccent', data.comboOffer.titleAccent);
      setVal('comboOffer-subtitle', data.comboOffer.subtitle);
      setVal('comboOffer-originalPrice', data.comboOffer.originalPrice);
      setVal('comboOffer-comboPrice', data.comboOffer.comboPrice);
      setVal('comboOffer-savingsText', data.comboOffer.savingsText);
      setVal('comboOffer-ctaText', data.comboOffer.ctaText);
      setVal('comboOffer-showcaseImage', data.comboOffer.showcaseImage);
      setImgSrc('preview-comboOffer-showcase', data.comboOffer.showcaseImage);
    }

    // --- Tab 5: About ---
    if (data.about) {
      setVal('about-eyebrow', data.about.eyebrow);
      setVal('about-titlePrefix', data.about.titlePrefix);
      setVal('about-titleAccent', data.about.titleAccent);
      setVal('about-description', data.about.description);
      setVal('about-archImage', data.about.archImage);
      setImgSrc('preview-about-archImage', data.about.archImage);
      renderAboutPillars(data.about.pillars || []);
    }

    // --- Tab 6: Our Story ---
    if (data.ourStory) {
      setVal('ourStory-eyebrow', data.ourStory.eyebrow);
      setVal('ourStory-titlePrefix', data.ourStory.titlePrefix);
      setVal('ourStory-titleAccent', data.ourStory.titleAccent);
      setVal('ourStory-paragraph1', data.ourStory.paragraph1);
      setVal('ourStory-paragraph2', data.ourStory.paragraph2);
      setVal('ourStory-archImage', data.ourStory.archImage);
      setImgSrc('preview-ourStory-archImage', data.ourStory.archImage);
      renderOurStoryStats(data.ourStory.stats || []);
    }

    // --- Tab 7: Products ---
    if (data.products) {
      setVal('products-eyebrow', data.products.eyebrow);
      setVal('products-titlePrefix', data.products.titlePrefix);
      setVal('products-titleAccent', data.products.titleAccent);
      setVal('products-subtitle', data.products.subtitle);
      setVal('products-bannerImage', data.products.bannerImage);
      setImgSrc('preview-products-bannerImage', data.products.bannerImage);
      renderProductsCards(data.products.items || []);
    }

    // --- Tab 8: Newly Launched ---
    if (data.newlyLaunched) {
      setVal('newlyLaunched-eyebrowBadge', data.newlyLaunched.eyebrowBadge);
      setVal('newlyLaunched-titleLine1', data.newlyLaunched.titleLine1);
      setVal('newlyLaunched-titleAccent', data.newlyLaunched.titleAccent);
      setVal('newlyLaunched-description', data.newlyLaunched.description);
      setVal('newlyLaunched-ctaText', data.newlyLaunched.ctaText);
      setVal('newlyLaunched-productImage', data.newlyLaunched.productImage);
      setImgSrc('preview-newlyLaunched-product', data.newlyLaunched.productImage);
      if (Array.isArray(data.newlyLaunched.benefits)) {
        data.newlyLaunched.benefits.forEach((b, i) => {
          setVal(`newlyLaunched-benefit-${i}`, b.label);
        });
      }
    }

    // --- Tab 9: Reviews ---
    if (data.reviews) {
      setVal('reviews-eyebrow', data.reviews.eyebrow);
      setVal('reviews-titlePrefix', data.reviews.titlePrefix);
      setVal('reviews-titleAccent', data.reviews.titleAccent);
      renderReviewsCards(data.reviews.items || []);
    }

    // --- Tab 10: FAQ ---
    if (data.faq) {
      setVal('faq-eyebrow', data.faq.eyebrow);
      setVal('faq-titlePrefix', data.faq.titlePrefix);
      setVal('faq-titleAccent', data.faq.titleAccent);
      setVal('faq-subtitle', data.faq.subtitle);
      setVal('faq-col1Title', data.faq.col1Title);
      setVal('faq-col2Title', data.faq.col2Title);
      renderFaqQuestions('faq-col1-editor', data.faq.col1Questions || [], 'col1');
      renderFaqQuestions('faq-col2-editor', data.faq.col2Questions || [], 'col2');
    }

    // --- Tab 11: Footer ---
    if (data.footer) {
      setVal('footer-tagline', data.footer.tagline);
      setVal('footer-copyright', data.footer.copyright);
      if (data.footer.contact) {
        setVal('footer-contact-email', data.footer.contact.email);
        setVal('footer-contact-phone', data.footer.contact.phone);
        setVal('footer-contact-hours', data.footer.contact.hours);
      }
      if (data.footer.socialLinks) {
        setVal('footer-social-instagram', data.footer.socialLinks.instagram);
        setVal('footer-social-facebook', data.footer.socialLinks.facebook);
        setVal('footer-social-youtube', data.footer.socialLinks.youtube);
        setVal('footer-social-pinterest', data.footer.socialLinks.pinterest);
      }
    }

    bindUploaderEvents();
  }

  // Helpers
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  }
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }
  function setChecked(id, bool) {
    const el = document.getElementById(id);
    if (el) el.checked = !!bool;
  }
  function getChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
  }
  function setImgSrc(id, src) {
    const el = document.getElementById(id);
    if (el && src) el.src = src;
  }

  // ==========================================================================
  // 5. Dynamic Array Renderers
  // ==========================================================================

  // Nav Links
  function renderNavLinks(links) {
    const container = document.getElementById('nav-links-list');
    if (!container) return;
    container.innerHTML = '';
    links.forEach((l, idx) => {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF4EE] border border-[#E8DEC8]';
      row.innerHTML = `
        <input type="text" class="form-input flex-1 nav-link-label" value="${escapeHtml(l.label)}" placeholder="Label">
        <input type="text" class="form-input flex-1 nav-link-href" value="${escapeHtml(l.href)}" placeholder="Target #id / URL">
        <button type="button" class="btn-remove-row p-2 text-stone-400 hover:text-red-600 transition" title="Delete Link">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      `;
      row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
      container.appendChild(row);
    });
  }

  document.getElementById('btn-add-nav-link')?.addEventListener('click', () => {
    const container = document.getElementById('nav-links-list');
    const row = document.createElement('div');
    row.className = 'flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF4EE] border border-[#E8DEC8]';
    row.innerHTML = `
      <input type="text" class="form-input flex-1 nav-link-label" placeholder="New Link">
      <input type="text" class="form-input flex-1 nav-link-href" placeholder="#section">
      <button type="button" class="btn-remove-row p-2 text-stone-400 hover:text-red-600 transition" title="Delete Link">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    `;
    row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
  });

  // Hero 4 Slides
  function renderHeroSlides(slides) {
    const container = document.getElementById('hero-slides-editor');
    if (!container) return;
    container.innerHTML = '';
    slides.forEach((slide, idx) => {
      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl bg-[#FAF4EE] border border-[#E8DEC8] space-y-4';
      card.innerHTML = `
        <div class="flex items-center justify-between border-b border-stone-200/80 pb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-[#1E3B2B]">Slide ${idx + 1}: ${escapeHtml(slide.name)}</span>
          <span class="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">${escapeHtml(slide.badge || '')}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-stone-600 mb-1">Product Name</label>
            <input type="text" class="form-input slide-name" value="${escapeHtml(slide.name || '')}">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-stone-600 mb-1">Tagline</label>
            <input type="text" class="form-input slide-tagline" value="${escapeHtml(slide.tagline || '')}">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-stone-600 mb-1">Price</label>
            <input type="text" class="form-input slide-price" value="${escapeHtml(slide.price || '')}">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-stone-600 mb-1">Original Price</label>
            <input type="text" class="form-input slide-orig-price" value="${escapeHtml(slide.originalPrice || '')}">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <!-- Closed Canvas Image -->
          <div class="flex items-center gap-3">
            <div class="w-16 h-16 image-preview-box flex items-center justify-center p-1 shrink-0">
              <img id="preview-slide-closed-${idx}" src="${escapeHtml(slide.closedImage || '')}" alt="" class="max-h-full max-w-full object-contain">
            </div>
            <div class="flex-1">
              <label class="block text-[11px] font-semibold text-stone-600 mb-0.5">Closed Packaging Image</label>
              <div class="flex gap-1.5">
                <input type="text" id="input-slide-closed-${idx}" class="form-input flex-1 text-xs slide-closed-img" value="${escapeHtml(slide.closedImage || '')}">
                <label class="px-2.5 py-1.5 bg-[#1E3B2B] text-white text-[11px] font-bold rounded-lg cursor-pointer shrink-0">
                  Upload
                  <input type="file" accept="image/*" class="hidden file-uploader" data-target-input="input-slide-closed-${idx}" data-target-preview="preview-slide-closed-${idx}">
                </label>
              </div>
            </div>
          </div>
          <!-- Open Canvas Image -->
          <div class="flex items-center gap-3">
            <div class="w-16 h-16 image-preview-box flex items-center justify-center p-1 shrink-0">
              <img id="preview-slide-open-${idx}" src="${escapeHtml(slide.openImage || '')}" alt="" class="max-h-full max-w-full object-contain">
            </div>
            <div class="flex-1">
              <label class="block text-[11px] font-semibold text-stone-600 mb-0.5">Open Floating Product Image</label>
              <div class="flex gap-1.5">
                <input type="text" id="input-slide-open-${idx}" class="form-input flex-1 text-xs slide-open-img" value="${escapeHtml(slide.openImage || '')}">
                <label class="px-2.5 py-1.5 bg-[#1E3B2B] text-white text-[11px] font-bold rounded-lg cursor-pointer shrink-0">
                  Upload
                  <input type="file" accept="image/*" class="hidden file-uploader" data-target-input="input-slide-open-${idx}" data-target-preview="preview-slide-open-${idx}">
                </label>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // About 4 Pillars
  function renderAboutPillars(pillars) {
    const container = document.getElementById('about-pillars-editor');
    if (!container) return;
    container.innerHTML = '';
    pillars.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-[#FAF4EE] border border-[#E8DEC8] space-y-2';
      card.innerHTML = `
        <label class="block text-xs font-bold text-[#1E3B2B] uppercase">Pillar ${idx + 1}</label>
        <input type="text" class="form-input pillar-title font-semibold" value="${escapeHtml(p.title || '')}" placeholder="Title">
        <textarea rows="2" class="form-input pillar-desc text-xs" placeholder="Description">${escapeHtml(p.desc || '')}</textarea>
      `;
      container.appendChild(card);
    });
  }

  // Our Story 4 Stats
  function renderOurStoryStats(stats) {
    const container = document.getElementById('ourStory-stats-editor');
    if (!container) return;
    container.innerHTML = '';
    stats.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'p-3 rounded-xl bg-[#FAF4EE] border border-[#E8DEC8] space-y-1.5';
      card.innerHTML = `
        <label class="block text-[11px] font-bold text-[#1E3B2B] uppercase">Counter ${idx + 1}</label>
        <input type="text" class="form-input stat-number font-bold text-center" value="${escapeHtml(s.number || '')}" placeholder="Number">
        <input type="text" class="form-input stat-label text-xs text-center" value="${escapeHtml(s.label || '')}" placeholder="Label">
      `;
      container.appendChild(card);
    });
  }

  // Products (Bestsellers)
  function renderProductsCards(items) {
    const container = document.getElementById('products-cards-editor');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'product-card-editor p-5 rounded-2xl bg-[#FAF4EE] border border-[#E8DEC8] space-y-4';
      card.setAttribute('data-idx', idx);
      card.innerHTML = `
        <div class="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span class="text-sm font-bold text-[#1E3B2B]">${escapeHtml(item.name || 'New Product')}</span>
          </div>
          <button type="button" class="btn-delete-product text-xs font-semibold text-red-600 hover:underline">
            Remove Product
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-stone-600 mb-1">Product Name</label>
            <input type="text" class="form-input prod-name font-bold" value="${escapeHtml(item.name || '')}">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Category Subtitle</label>
            <input type="text" class="form-input prod-cat" value="${escapeHtml(item.category || '')}">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Badge Tag</label>
            <input type="text" class="form-input prod-badge" value="${escapeHtml(item.badge || '')}">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Sale Price</label>
            <input type="text" class="form-input prod-price font-bold" value="${escapeHtml(item.price || '')}">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Original Price</label>
            <input type="text" class="form-input prod-orig-price" value="${escapeHtml(item.originalPrice || '')}">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Discount Tag</label>
            <input type="text" class="form-input prod-discount" value="${escapeHtml(item.discount || '')}">
          </div>
          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Rating &amp; Reviews</label>
            <div class="flex gap-1.5">
              <input type="text" class="form-input prod-rating text-center w-16" value="${escapeHtml(item.rating || '5.0')}">
              <input type="text" class="form-input prod-reviews flex-1 text-center" value="${escapeHtml(item.reviewsCount || '100')}">
            </div>
          </div>
        </div>

        <!-- Product Image Upload -->
        <div class="flex items-center gap-4 pt-1">
          <div class="w-20 h-20 image-preview-box flex items-center justify-center p-1 shrink-0">
            <img id="preview-prod-${idx}" src="${escapeHtml(item.image || '')}" alt="" class="max-h-full max-w-full object-contain">
          </div>
          <div class="flex-1">
            <label class="block text-xs font-semibold text-stone-600 mb-1">Product Photo URL or Upload New</label>
            <div class="flex gap-2">
              <input type="text" id="input-prod-${idx}" class="form-input flex-1 prod-image" value="${escapeHtml(item.image || '')}">
              <label class="px-4 py-2 bg-[#1E3B2B] hover:bg-[#142A1E] text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                <span>Upload</span>
                <input type="file" accept="image/*" class="hidden file-uploader" data-target-input="input-prod-${idx}" data-target-preview="preview-prod-${idx}">
              </label>
            </div>
          </div>
        </div>
      `;
      card.querySelector('.btn-delete-product').addEventListener('click', () => card.remove());
      container.appendChild(card);
    });
  }

  document.getElementById('btn-add-product')?.addEventListener('click', () => {
    const container = document.getElementById('products-cards-editor');
    const idx = container.children.length;
    const card = document.createElement('div');
    card.className = 'product-card-editor p-5 rounded-2xl bg-[#FAF4EE] border border-[#E8DEC8] space-y-4';
    card.innerHTML = `
      <div class="flex items-center justify-between border-b border-stone-200/80 pb-3">
        <span class="text-sm font-bold text-[#1E3B2B]">New Botanical Product</span>
        <button type="button" class="btn-delete-product text-xs font-semibold text-red-600 hover:underline">Remove</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-stone-600 mb-1">Product Name</label>
          <input type="text" class="form-input prod-name font-bold" placeholder="Product Name">
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-600 mb-1">Category</label>
          <input type="text" class="form-input prod-cat" placeholder="e.g. Radiance">
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-600 mb-1">Badge</label>
          <input type="text" class="form-input prod-badge" placeholder="Bestseller">
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-600 mb-1">Sale Price</label>
          <input type="text" class="form-input prod-price font-bold" placeholder="₹249">
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-600 mb-1">Original Price</label>
          <input type="text" class="form-input prod-orig-price" placeholder="₹299">
        </div>
        <div>
          <label class="block text-xs font-semibold text-stone-600 mb-1">Discount Tag</label>
          <input type="text" class="form-input prod-discount" placeholder="17% OFF">
        </div>
      </div>
      <div class="flex items-center gap-4 pt-1">
        <div class="w-20 h-20 image-preview-box flex items-center justify-center p-1 shrink-0">
          <img id="preview-prod-${idx}" src="assets/bestseller_goat_photo_hd.png" alt="" class="max-h-full max-w-full object-contain">
        </div>
        <div class="flex-1">
          <div class="flex gap-2">
            <input type="text" id="input-prod-${idx}" class="form-input flex-1 prod-image" value="assets/bestseller_goat_photo_hd.png">
            <label class="px-4 py-2 bg-[#1E3B2B] text-white text-xs font-bold rounded-xl cursor-pointer">
              Upload
              <input type="file" accept="image/*" class="hidden file-uploader" data-target-input="input-prod-${idx}" data-target-preview="preview-prod-${idx}">
            </label>
          </div>
        </div>
      </div>
    `;
    card.querySelector('.btn-delete-product').addEventListener('click', () => card.remove());
    container.appendChild(card);
    bindUploaderEvents();
  });

  // Customer Reviews
  function renderReviewsCards(items) {
    const container = document.getElementById('reviews-cards-editor');
    if (!container) return;
    container.innerHTML = '';
    items.forEach((rev, idx) => {
      const card = document.createElement('div');
      card.className = 'review-card-editor p-4 rounded-xl bg-[#FAF4EE] border border-[#E8DEC8] space-y-3';
      card.innerHTML = `
        <div class="flex items-center justify-between border-b border-stone-200/80 pb-2">
          <span class="text-xs font-bold uppercase text-[#1E3B2B]">Reviewer ${idx + 1}: ${escapeHtml(rev.name)}</span>
          <button type="button" class="btn-delete-review text-xs text-red-600 hover:underline">Remove</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-stone-600 mb-1">Customer Name</label>
            <input type="text" class="form-input rev-name font-bold" value="${escapeHtml(rev.name || '')}">
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-stone-600 mb-1">Star Rating (1-5)</label>
            <input type="number" min="1" max="5" class="form-input rev-rating text-center" value="${rev.rating || 5}">
          </div>
          <div class="flex items-center gap-2 pt-4">
            <label class="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#1E3B2B]">
              <input type="checkbox" class="w-4 h-4 rev-verified" ${rev.verified !== false ? 'checked' : ''}>
              <span>Verified Customer</span>
            </label>
          </div>
          <div class="md:col-span-3">
            <label class="block text-[11px] font-semibold text-stone-600 mb-1">Review Quote Text</label>
            <textarea rows="2" class="form-input rev-quote text-xs">${escapeHtml(rev.quote || '')}</textarea>
          </div>
        </div>
        <div class="flex items-center gap-3 pt-1">
          <div class="w-12 h-12 rounded-full overflow-hidden image-preview-box shrink-0">
            <img id="preview-rev-${idx}" src="${escapeHtml(rev.avatar || '')}" alt="" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 flex gap-2">
            <input type="text" id="input-rev-${idx}" class="form-input flex-1 text-xs rev-avatar" value="${escapeHtml(rev.avatar || '')}">
            <label class="px-3 py-1.5 bg-[#1E3B2B] text-white text-xs font-bold rounded-lg cursor-pointer">
              Upload
              <input type="file" accept="image/*" class="hidden file-uploader" data-target-input="input-rev-${idx}" data-target-preview="preview-rev-${idx}">
            </label>
          </div>
        </div>
      `;
      card.querySelector('.btn-delete-review').addEventListener('click', () => card.remove());
      container.appendChild(card);
    });
  }

  // FAQ 16 Questions
  function renderFaqQuestions(containerId, questions, colName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    questions.forEach((qObj, idx) => {
      const card = document.createElement('div');
      card.className = 'p-3.5 rounded-xl bg-white border border-[#E8DEC8] space-y-2';
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-[#1E3B2B] uppercase">Q${colName === 'col2' ? idx + 9 : idx + 1}</span>
        </div>
        <input type="text" class="form-input faq-q font-bold text-xs" value="${escapeHtml(qObj.q || '')}" placeholder="Question">
        <textarea rows="3" class="form-input faq-a text-xs" placeholder="Answer">${escapeHtml(qObj.a || '')}</textarea>
      `;
      container.appendChild(card);
    });
  }

  // ==========================================================================
  // 6. Universal File Uploader & Instant Preview
  // ==========================================================================
  function bindUploaderEvents() {
    document.querySelectorAll('.file-uploader').forEach(input => {
      input.onchange = async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const targetInputId = input.getAttribute('data-target-input');
        const targetPreviewId = input.getAttribute('data-target-preview');
        const targetInput = document.getElementById(targetInputId);
        const targetPreview = document.getElementById(targetPreviewId);

        // Read local base64
        const reader = new FileReader();
        reader.onload = async function (event) {
          const dataUrl = event.target.result;
          if (targetPreview) targetPreview.src = dataUrl;

          // Attempt upload to /api/upload
          try {
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: `${Date.now()}_${file.name}`,
                dataUrl: dataUrl
              })
            });
            if (uploadRes.ok) {
              const resData = await uploadRes.json();
              if (resData.url && targetInput) {
                targetInput.value = resData.url;
                showToast(`Image uploaded: ${resData.filename}`);
                return;
              }
            }
          } catch (uploadErr) {
            console.warn('[CMS Uploader] Upload API unavailable, using base64 data URL', uploadErr);
          }

          // Fallback to dataUrl
          if (targetInput) targetInput.value = dataUrl;
          showToast(`Image loaded locally: ${file.name}`);
        };
        reader.readAsDataURL(file);
      };
    });
  }

  // ==========================================================================
  // 7. Collect All Form Data & Save/Publish
  // ==========================================================================
  function collectFormData() {
    const data = JSON.parse(JSON.stringify(siteData || {}));

    // 1. General
    data.general = data.general || {};
    data.general.siteTitle = getVal('general-siteTitle');
    data.general.metaDescription = getVal('general-metaDescription');
    data.general.announcementBar = {
      enabled: getChecked('general-announcementBar-enabled'),
      text: getVal('general-announcementBar-text'),
      link: getVal('general-announcementBar-link')
    };

    // 2. Header
    data.header = data.header || {};
    data.header.logo = {
      src: getVal('header-logo-src'),
      alt: 'EarthGlaze ® Natural Skincare'
    };
    const navRows = document.querySelectorAll('#nav-links-list > div');
    data.header.navLinks = Array.from(navRows).map(row => ({
      label: row.querySelector('.nav-link-label')?.value || '',
      href: row.querySelector('.nav-link-href')?.value || ''
    }));

    // 3. Hero
    data.hero = data.hero || {};
    data.hero.eyebrow = getVal('hero-eyebrow');
    data.hero.titleLine1 = getVal('hero-titleLine1');
    data.hero.titleAccent = getVal('hero-titleAccent');
    data.hero.description = getVal('hero-description');
    data.hero.ctaPrimary = {
      label: getVal('hero-ctaPrimary-label'),
      href: getVal('hero-ctaPrimary-href')
    };
    data.hero.ctaSecondary = {
      label: getVal('hero-ctaSecondary-label'),
      href: getVal('hero-ctaSecondary-href')
    };
    const slideCards = document.querySelectorAll('#hero-slides-editor > div');
    if (slideCards.length) {
      data.hero.slides = Array.from(slideCards).map((card, i) => {
        const existing = (siteData.hero && siteData.hero.slides && siteData.hero.slides[i]) || {};
        return {
          ...existing,
          name: card.querySelector('.slide-name')?.value || '',
          tagline: card.querySelector('.slide-tagline')?.value || '',
          price: card.querySelector('.slide-price')?.value || '',
          originalPrice: card.querySelector('.slide-orig-price')?.value || '',
          closedImage: card.querySelector('.slide-closed-img')?.value || '',
          openImage: card.querySelector('.slide-open-img')?.value || ''
        };
      });
    }

    // 4. Combo Offer
    data.comboOffer = data.comboOffer || {};
    data.comboOffer.brandName = getVal('comboOffer-brandName');
    data.comboOffer.brandSub = getVal('comboOffer-brandSub');
    data.comboOffer.titleLine1 = getVal('comboOffer-titleLine1');
    data.comboOffer.titleAccent = getVal('comboOffer-titleAccent');
    data.comboOffer.subtitle = getVal('comboOffer-subtitle');
    data.comboOffer.originalPrice = getVal('comboOffer-originalPrice');
    data.comboOffer.comboPrice = getVal('comboOffer-comboPrice');
    data.comboOffer.savingsText = getVal('comboOffer-savingsText');
    data.comboOffer.ctaText = getVal('comboOffer-ctaText');
    data.comboOffer.showcaseImage = getVal('comboOffer-showcaseImage');

    // 5. About
    data.about = data.about || {};
    data.about.eyebrow = getVal('about-eyebrow');
    data.about.titlePrefix = getVal('about-titlePrefix');
    data.about.titleAccent = getVal('about-titleAccent');
    data.about.description = getVal('about-description');
    data.about.archImage = getVal('about-archImage');
    const pillarEls = document.querySelectorAll('#about-pillars-editor > div');
    data.about.pillars = Array.from(pillarEls).map(el => ({
      title: el.querySelector('.pillar-title')?.value || '',
      desc: el.querySelector('.pillar-desc')?.value || ''
    }));

    // 6. Our Story
    data.ourStory = data.ourStory || {};
    data.ourStory.eyebrow = getVal('ourStory-eyebrow');
    data.ourStory.titlePrefix = getVal('ourStory-titlePrefix');
    data.ourStory.titleAccent = getVal('ourStory-titleAccent');
    data.ourStory.paragraph1 = getVal('ourStory-paragraph1');
    data.ourStory.paragraph2 = getVal('ourStory-paragraph2');
    data.ourStory.archImage = getVal('ourStory-archImage');
    const statEls = document.querySelectorAll('#ourStory-stats-editor > div');
    data.ourStory.stats = Array.from(statEls).map(el => ({
      number: el.querySelector('.stat-number')?.value || '',
      label: el.querySelector('.stat-label')?.value || ''
    }));

    // 7. Products
    data.products = data.products || {};
    data.products.eyebrow = getVal('products-eyebrow');
    data.products.titlePrefix = getVal('products-titlePrefix');
    data.products.titleAccent = getVal('products-titleAccent');
    data.products.subtitle = getVal('products-subtitle');
    data.products.bannerImage = getVal('products-bannerImage');
    const prodCards = document.querySelectorAll('.product-card-editor');
    data.products.items = Array.from(prodCards).map((card, i) => {
      const existing = (siteData.products && siteData.products.items && siteData.products.items[i]) || {};
      return {
        ...existing,
        name: card.querySelector('.prod-name')?.value || '',
        category: card.querySelector('.prod-cat')?.value || '',
        badge: card.querySelector('.prod-badge')?.value || '',
        price: card.querySelector('.prod-price')?.value || '',
        originalPrice: card.querySelector('.prod-orig-price')?.value || '',
        discount: card.querySelector('.prod-discount')?.value || '',
        rating: card.querySelector('.prod-rating')?.value || '5.0',
        reviewsCount: card.querySelector('.prod-reviews')?.value || '100',
        image: card.querySelector('.prod-image')?.value || ''
      };
    });

    // 8. Newly Launched
    data.newlyLaunched = data.newlyLaunched || {};
    data.newlyLaunched.eyebrowBadge = getVal('newlyLaunched-eyebrowBadge');
    data.newlyLaunched.titleLine1 = getVal('newlyLaunched-titleLine1');
    data.newlyLaunched.titleAccent = getVal('newlyLaunched-titleAccent');
    data.newlyLaunched.description = getVal('newlyLaunched-description');
    data.newlyLaunched.ctaText = getVal('newlyLaunched-ctaText');
    data.newlyLaunched.productImage = getVal('newlyLaunched-productImage');
    data.newlyLaunched.benefits = [
      { color: '#E0245E', label: getVal('newlyLaunched-benefit-0') },
      { color: '#0EA5E9', label: getVal('newlyLaunched-benefit-1') },
      { color: '#C28328', label: getVal('newlyLaunched-benefit-2') }
    ];

    // 9. Reviews
    data.reviews = data.reviews || {};
    data.reviews.eyebrow = getVal('reviews-eyebrow');
    data.reviews.titlePrefix = getVal('reviews-titlePrefix');
    data.reviews.titleAccent = getVal('reviews-titleAccent');
    const revCards = document.querySelectorAll('.review-card-editor');
    data.reviews.items = Array.from(revCards).map((card, i) => {
      const existing = (siteData.reviews && siteData.reviews.items && siteData.reviews.items[i]) || {};
      return {
        ...existing,
        name: card.querySelector('.rev-name')?.value || '',
        rating: parseInt(card.querySelector('.rev-rating')?.value || '5', 10),
        verified: card.querySelector('.rev-verified')?.checked !== false,
        quote: card.querySelector('.rev-quote')?.value || '',
        avatar: card.querySelector('.rev-avatar')?.value || ''
      };
    });

    // 10. FAQ
    data.faq = data.faq || {};
    data.faq.eyebrow = getVal('faq-eyebrow');
    data.faq.titlePrefix = getVal('faq-titlePrefix');
    data.faq.titleAccent = getVal('faq-titleAccent');
    data.faq.subtitle = getVal('faq-subtitle');
    data.faq.col1Title = getVal('faq-col1Title');
    data.faq.col2Title = getVal('faq-col2Title');
    const col1Cards = document.querySelectorAll('#faq-col1-editor > div');
    data.faq.col1Questions = Array.from(col1Cards).map(card => ({
      q: card.querySelector('.faq-q')?.value || '',
      a: card.querySelector('.faq-a')?.value || ''
    }));
    const col2Cards = document.querySelectorAll('#faq-col2-editor > div');
    data.faq.col2Questions = Array.from(col2Cards).map(card => ({
      q: card.querySelector('.faq-q')?.value || '',
      a: card.querySelector('.faq-a')?.value || ''
    }));

    // 11. Footer
    data.footer = data.footer || {};
    data.footer.tagline = getVal('footer-tagline');
    data.footer.copyright = getVal('footer-copyright');
    data.footer.contact = {
      email: getVal('footer-contact-email'),
      phone: getVal('footer-contact-phone'),
      hours: getVal('footer-contact-hours')
    };
    data.footer.socialLinks = {
      instagram: getVal('footer-social-instagram'),
      facebook: getVal('footer-social-facebook'),
      youtube: getVal('footer-social-youtube'),
      pinterest: getVal('footer-social-pinterest')
    };

    return data;
  }

  async function saveAllChanges() {
    const data = collectFormData();
    siteData = data;

    // 1. Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }

    // 2. Post to /api/content
    let apiSuccess = false;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) apiSuccess = true;
    } catch (e) {
      console.warn('Backend API save warning:', e);
    }

    // 3. Post to Preview iframe if active
    if (previewIframe && previewIframe.contentWindow) {
      previewIframe.contentWindow.postMessage({
        type: 'EARTHGLAZE_CMS_PREVIEW',
        content: data
      }, '*');
    }

    showToast(apiSuccess ? 'All changes saved to server & published!' : 'Changes saved locally & published!');
  }

  btnSaveAll?.addEventListener('click', saveAllChanges);

  // ==========================================================================
  // 8. Live Preview Modal
  // ==========================================================================
  btnTogglePreview?.addEventListener('click', () => {
    if (!previewModal) return;
    previewModal.classList.remove('hidden');
    if (previewIframe) {
      previewIframe.src = 'index.html?preview=' + Date.now();
    }
  });

  btnClosePreview?.addEventListener('click', () => {
    if (previewModal) previewModal.classList.add('hidden');
  });

  btnRefreshPreview?.addEventListener('click', () => {
    if (previewIframe) {
      previewIframe.src = 'index.html?preview=' + Date.now();
    }
  });

  // ==========================================================================
  // 9. Export & Import Backup
  // ==========================================================================
  btnExportJson?.addEventListener('click', () => {
    const data = collectFormData();
    const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', str);
    dlAnchor.setAttribute('download', `earthglaze_content_backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Backup downloaded successfully!');
  });

  inputImportJson?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        const json = JSON.parse(evt.target.result);
        siteData = json;
        populateForm(siteData);
        saveAllChanges();
        showToast('Backup restored successfully!');
      } catch (err) {
        showToast('Invalid JSON file', true);
      }
    };
    reader.readAsText(file);
  });

  // ==========================================================================
  // 10. Reset to Factory Defaults
  // ==========================================================================
  btnResetDefaults?.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to reset all content to original factory defaults? Any unsaved edits will be lost.')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      const res = await fetch('data/site-content.json');
      if (res.ok) {
        siteData = await res.json();
        populateForm(siteData);
        await saveAllChanges();
        showToast('Reset to factory defaults completed!');
      }
    } catch (e) {
      showToast('Error resetting defaults', true);
    }
  });

  // Helper
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 11. BUSINESS MANAGEMENT (Orders, KPIs, Inventory, Products, Coupons)
  // ==========================================================================
  let allOrdersData = [];
  let allProductsData = [];

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === 'ok') {
        const stats = data.stats;
        const kOrders = document.getElementById('kpi-orders-val');
        const kRev = document.getElementById('kpi-revenue-val');
        const kProd = document.getElementById('kpi-products-val');
        const kCust = document.getElementById('kpi-customers-val');
        if (kOrders) kOrders.textContent = stats.total_orders;
        if (kRev) kRev.textContent = '₹' + Number(stats.total_revenue).toLocaleString('en-IN');
        if (kProd) kProd.textContent = stats.total_products;
        if (kCust) kCust.textContent = stats.total_customers;

        // Render recent orders
        if (data.recent_orders && data.recent_orders.length) {
          renderRecentOrders(data.recent_orders);
        }
      }
    } catch (e) {
      console.warn('Could not load live admin stats', e);
    }
  }

  function getStatusBadge(status) {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') {
      return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Delivered</span>';
    } else if (s === 'processing' || s === 'confirmed') {
      return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Processing</span>';
    } else if (s === 'packed') {
      return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Packed</span>';
    } else if (s === 'out_for_delivery') {
      return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800">Out for Delivery</span>';
    } else {
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800">${escapeHtml(status)}</span>`;
    }
  }

  function renderRecentOrders(orders) {
    const tbody = document.getElementById('recent-orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = orders.slice(0, 5).map(o => `
      <tr class="hover:bg-stone-50/80 transition">
        <td class="py-3 px-4 font-bold text-[#1E3B2B]">#${escapeHtml(o.order_number)}</td>
        <td class="py-3 px-4 font-medium text-stone-800">${escapeHtml(o.customer_name)}</td>
        <td class="py-3 px-4 font-bold text-stone-900">₹${Number(o.total_amount).toLocaleString('en-IN')}</td>
        <td class="py-3 px-4 text-stone-600">${escapeHtml(o.payment_method || 'Online')}</td>
        <td class="py-3 px-4">${getStatusBadge(o.order_status)}</td>
        <td class="py-3 px-4 text-right">
          <button onclick="window.EarthGlazeAdmin.openOrderModal('${escapeHtml(o.order_number)}')" class="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-[#1E3B2B] transition" title="View details">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  async function fetchAllOrders(statusFilter = 'all', searchQuery = '') {
    try {
      let url = '/api/admin/orders';
      const params = [];
      if (statusFilter && statusFilter !== 'all') params.push(`status=${encodeURIComponent(statusFilter)}`);
      if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
      if (params.length) url += '?' + params.join('&');

      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      allOrdersData = data.orders || [];
      renderOrdersFull(allOrdersData);
    } catch (e) {
      console.warn('Could not fetch all orders', e);
    }
  }

  function renderOrdersFull(orders) {
    const tbody = document.getElementById('orders-full-tbody');
    if (!tbody) return;
    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-stone-400">No matching orders found.</td></tr>`;
      return;
    }
    tbody.innerHTML = orders.map(o => {
      const itemsList = (o.items || []).map(i => `${i.product_name} (×${i.quantity})`).join(', ') || '1x Order item';
      return `
        <tr class="hover:bg-stone-50/80 transition">
          <td class="py-3.5 px-4">
            <div class="font-bold text-[#1E3B2B]">#${escapeHtml(o.order_number)}</div>
            <div class="text-[11px] text-stone-400">${escapeHtml(o.created_at || 'Recent')}</div>
          </td>
          <td class="py-3.5 px-4">
            <div class="font-semibold text-stone-800">${escapeHtml(o.customer_name)}</div>
            <div class="text-[11px] text-stone-500">${escapeHtml(o.customer_phone)}</div>
            <div class="text-[11px] text-stone-400 truncate max-w-[180px]">${escapeHtml(o.city || 'Mangalore')}, ${escapeHtml(o.state || 'KA')}</div>
          </td>
          <td class="py-3.5 px-4">
            <div class="text-xs text-stone-700 max-w-[220px] truncate" title="${escapeHtml(itemsList)}">${escapeHtml(itemsList)}</div>
            <div class="text-[11px] text-emerald-700 font-medium">${(o.items || []).length} item(s)</div>
          </td>
          <td class="py-3.5 px-4 font-bold text-stone-900">
            ₹${Number(o.total_amount).toLocaleString('en-IN')}
          </td>
          <td class="py-3.5 px-4">
            <div class="text-xs font-medium text-stone-700">${escapeHtml(o.payment_method)}</div>
            <div class="text-[10px] uppercase font-bold tracking-wider ${o.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}">${escapeHtml(o.payment_status)}</div>
          </td>
          <td class="py-3.5 px-4">
            <select onchange="window.EarthGlazeAdmin.updateStatus('${escapeHtml(o.order_number)}', this.value)" class="px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-semibold text-stone-800 bg-[#FAF4EE] focus:outline-none focus:border-[#C28328]">
              <option value="confirmed" ${o.order_status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="processing" ${o.order_status === 'processing' ? 'selected' : ''}>Processing</option>
              <option value="packed" ${o.order_status === 'packed' ? 'selected' : ''}>Packed</option>
              <option value="out_for_delivery" ${o.order_status === 'out_for_delivery' ? 'selected' : ''}>Out for Delivery</option>
              <option value="delivered" ${o.order_status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" ${o.order_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) return;
      const data = await res.json();
      allProductsData = data.products || [];
      renderProductsMgmt(allProductsData);
      renderInventory(allProductsData);
    } catch (e) {
      console.warn('Could not fetch products', e);
    }
  }

  function renderProductsMgmt(products) {
    const grid = document.getElementById('products-mgmt-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
      <div class="p-5 rounded-2xl border border-[#E8DEC8] bg-[#FAF4EE] space-y-4">
        <div class="flex items-start gap-4">
          <img src="${escapeHtml(p.image_photo || p.image_open)}" alt="${escapeHtml(p.name)}" class="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-stone-200 shrink-0">
          <div class="flex-1">
            <span class="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">${escapeHtml(p.category)}</span>
            <h4 class="text-sm font-bold text-[#1E3B2B] mt-1">${escapeHtml(p.name)}</h4>
            <div class="text-xs text-stone-500 font-mono">SKU: ${escapeHtml(p.sku)}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-stone-600 mb-1">Sale Price (₹)</label>
            <input type="number" id="prod-sale-${p.id}" value="${p.sale_price}" class="form-input">
          </div>
          <div>
            <label class="block font-semibold text-stone-600 mb-1">MRP Price (₹)</label>
            <input type="number" id="prod-mrp-${p.id}" value="${p.original_price || p.price}" class="form-input">
          </div>
          <div>
            <label class="block font-semibold text-stone-600 mb-1">Stock Quantity</label>
            <input type="number" id="prod-stock-${p.id}" value="${p.stock_qty}" class="form-input">
          </div>
          <div>
            <label class="block font-semibold text-stone-600 mb-1">Rating</label>
            <div class="py-2 text-stone-700 font-bold">★ ${p.rating} (${p.review_count})</div>
          </div>
        </div>

        <button onclick="window.EarthGlazeAdmin.saveProduct('${p.id}')" class="w-full py-2 rounded-xl bg-[#1E3B2B] hover:bg-[#142A1E] text-white text-xs font-semibold transition active:scale-95">
          Save Product Changes
        </button>
      </div>
    `).join('');
  }

  function renderInventory(products) {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;
    tbody.innerHTML = products.map(p => {
      const isLow = p.stock_qty < 50;
      return `
        <tr class="hover:bg-stone-50/80 transition">
          <td class="py-3 px-4 flex items-center gap-3">
            <img src="${escapeHtml(p.image_photo || p.image_open)}" class="w-10 h-10 rounded-lg object-contain bg-[#FAF4EE] p-0.5 border border-stone-200">
            <div>
              <div class="font-bold text-[#1E3B2B]">${escapeHtml(p.name)}</div>
              <div class="text-[11px] text-stone-400">${escapeHtml(p.category)}</div>
            </div>
          </td>
          <td class="py-3 px-4 font-mono text-stone-600">${escapeHtml(p.sku)}</td>
          <td class="py-3 px-4 font-bold text-stone-900 text-sm">
            <span id="stock-val-${p.id}">${p.stock_qty}</span> units
          </td>
          <td class="py-3 px-4">
            ${isLow ? '<span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">LOW STOCK</span>' : '<span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">HEALTHY</span>'}
          </td>
          <td class="py-3 px-4">
            <div class="inline-flex items-center gap-2">
              <button onclick="window.EarthGlazeAdmin.adjustStock('${p.id}', -10)" class="w-7 h-7 rounded-lg border border-stone-200 hover:bg-stone-100 font-bold text-stone-700 transition">-10</button>
              <button onclick="window.EarthGlazeAdmin.adjustStock('${p.id}', 10)" class="w-7 h-7 rounded-lg border border-stone-200 hover:bg-stone-100 font-bold text-stone-700 transition">+10</button>
              <button onclick="window.EarthGlazeAdmin.adjustStock('${p.id}', 50)" class="px-2.5 h-7 rounded-lg border border-stone-200 hover:bg-stone-100 font-bold text-xs text-stone-700 transition">+50 Units</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function fetchCoupons() {
    try {
      const res = await fetch('/api/coupons');
      if (!res.ok) return;
      const data = await res.json();
      const coupons = data.coupons || [];
      const tbody = document.getElementById('coupons-tbody');
      if (!tbody) return;
      tbody.innerHTML = coupons.map(c => `
        <tr class="hover:bg-stone-50/80 transition">
          <td class="py-3 px-4 font-bold font-mono text-[#1E3B2B]">${escapeHtml(c.code)}</td>
          <td class="py-3 px-4 font-semibold text-emerald-700">${c.discount_type === 'percentage' ? c.discount_value + '%' : '₹' + c.discount_value} OFF</td>
          <td class="py-3 px-4 text-stone-700">₹${c.min_order_value}</td>
          <td class="py-3 px-4 font-bold text-stone-800">${c.times_used || 0} times</td>
          <td class="py-3 px-4">
            <span class="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">Active</span>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      console.warn('Could not fetch coupons', e);
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/admin/customers');
      if (!res.ok) return;
      const data = await res.json();
      const customers = data.customers || [];
      const tbody = document.getElementById('customers-tbody');
      if (!tbody) return;
      tbody.innerHTML = customers.map(c => `
        <tr class="hover:bg-stone-50/80 transition">
          <td class="py-3 px-4 font-bold text-[#1E3B2B]">${escapeHtml(c.name)}</td>
          <td class="py-3 px-4 text-stone-700">${escapeHtml(c.email)}</td>
          <td class="py-3 px-4 text-stone-600 font-mono">${escapeHtml(c.phone || '+91 98765 43210')}</td>
          <td class="py-3 px-4 font-semibold text-stone-800">${c.orders_count || 1} order(s)</td>
          <td class="py-3 px-4 font-bold text-emerald-700">₹${Number(c.spent || 348).toLocaleString('en-IN')}</td>
        </tr>
      `).join('');
    } catch (e) {
      console.warn('Could not fetch customers', e);
    }
  }

  // Public admin methods
  window.EarthGlazeAdmin = {
    refreshStats: fetchStats,

    updateStatus: async function(orderNumber, newStatus) {
      try {
        const res = await fetch(`/api/admin/orders/${orderNumber}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
          showToast(`Order #${orderNumber} status updated to '${newStatus}'`);
          fetchStats();
          fetchAllOrders();
        } else {
          showToast('Failed to update status', true);
        }
      } catch (e) {
        showToast('Network error updating status', true);
      }
    },

    saveProduct: async function(id) {
      const saleEl = document.getElementById(`prod-sale-${id}`);
      const mrpEl = document.getElementById(`prod-mrp-${id}`);
      const stockEl = document.getElementById(`prod-stock-${id}`);
      if (!saleEl || !mrpEl || !stockEl) return;
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sale_price: parseFloat(saleEl.value),
            original_price: parseFloat(mrpEl.value),
            stock_qty: parseInt(stockEl.value)
          })
        });
        if (res.ok) {
          showToast(`Product updated successfully!`);
          fetchProducts();
        } else {
          showToast('Failed to update product', true);
        }
      } catch (e) {
        showToast('Error updating product', true);
      }
    },

    adjustStock: async function(id, delta) {
      const p = allProductsData.find(x => x.id === id);
      if (!p) return;
      const newStock = Math.max(0, p.stock_qty + delta);
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock_qty: newStock })
        });
        if (res.ok) {
          p.stock_qty = newStock;
          const valEl = document.getElementById(`stock-val-${id}`);
          if (valEl) valEl.textContent = newStock;
          showToast(`Stock updated for ${p.name}: ${newStock} units`);
          fetchProducts();
        }
      } catch (e) {
        showToast('Error adjusting stock', true);
      }
    },

    openOrderModal: async function(orderNumber) {
      const cleanRef = orderNumber.replace('#', '');
      try {
        const res = await fetch(`/api/orders/track/${cleanRef}`);
        if (!res.ok) return;
        const data = await res.json();
        const o = data.order;
        if (!o) return;

        const modal = document.getElementById('order-details-modal');
        const numEl = document.getElementById('modal-order-number');
        const dateEl = document.getElementById('modal-order-date');
        const bodyEl = document.getElementById('modal-order-body');
        if (!modal || !bodyEl) return;

        numEl.textContent = `Order #${o.order_number}`;
        dateEl.textContent = `Placed: ${o.created_at || 'Recently'}`;

        bodyEl.innerHTML = `
          <div class="flex items-center justify-between p-4 rounded-xl bg-[#FAF4EE] border border-stone-200">
            <div>
              <div class="text-xs text-stone-500 uppercase font-bold">Status</div>
              <div class="text-sm font-bold text-[#1E3B2B] capitalize">${o.order_status}</div>
            </div>
            <div>
              <div class="text-xs text-stone-500 uppercase font-bold">Payment</div>
              <div class="text-sm font-bold text-emerald-700">${o.payment_method} (${o.payment_status})</div>
            </div>
            <div>
              <div class="text-xs text-stone-500 uppercase font-bold">Total Paid</div>
              <div class="text-base font-extrabold text-[#1E3B2B]">₹${o.total_amount}</div>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-[#1E3B2B] uppercase mb-2">Customer &amp; Shipping Address</h4>
            <div class="p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
              <div class="font-bold text-stone-900">${escapeHtml(o.customer_name)}</div>
              <div>${escapeHtml(o.customer_phone)} • ${escapeHtml(o.customer_email)}</div>
              <div>${escapeHtml(o.shipping_address)}, ${escapeHtml(o.city)}, ${escapeHtml(o.state)} - ${escapeHtml(o.pincode)}</div>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-[#1E3B2B] uppercase mb-2">Ordered Items (${(o.items || []).length})</h4>
            <div class="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              ${(o.items || []).map(i => `
                <div class="p-3 flex items-center justify-between text-xs bg-white">
                  <div class="flex items-center gap-3">
                    <img src="${escapeHtml(i.image_url)}" class="w-10 h-10 rounded-lg object-contain bg-[#FAF4EE] p-0.5 border border-stone-200">
                    <div>
                      <div class="font-bold text-stone-900">${escapeHtml(i.product_name)}</div>
                      <div class="text-stone-500">Qty: ${i.quantity} × ₹${i.price}</div>
                    </div>
                  </div>
                  <div class="font-bold text-stone-900">₹${i.total}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between">
            <span class="text-xs text-stone-500">Dispatch Update:</span>
            <select onchange="window.EarthGlazeAdmin.updateStatus('${o.order_number}', this.value); document.getElementById('order-details-modal').classList.add('hidden');" class="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold bg-[#FAF4EE] text-[#1E3B2B]">
              <option value="confirmed" ${o.order_status === 'confirmed' ? 'selected' : ''}>Mark Confirmed</option>
              <option value="processing" ${o.order_status === 'processing' ? 'selected' : ''}>Mark Processing</option>
              <option value="packed" ${o.order_status === 'packed' ? 'selected' : ''}>Mark Packed</option>
              <option value="out_for_delivery" ${o.order_status === 'out_for_delivery' ? 'selected' : ''}>Mark Out for Delivery</option>
              <option value="delivered" ${o.order_status === 'delivered' ? 'selected' : ''}>Mark Delivered</option>
            </select>
          </div>
        `;

        modal.classList.remove('hidden');
      } catch (e) {
        showToast('Error opening order details', true);
      }
    }
  };

  // Wire search & status tabs
  const orderSearchInput = document.getElementById('order-search-input');
  if (orderSearchInput) {
    let debounceTimer;
    orderSearchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchAllOrders('all', e.target.value.trim());
      }, 300);
    });
  }

  const statusBtns = document.querySelectorAll('#order-status-tabs button');
  statusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusBtns.forEach(b => {
        b.className = 'px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200';
      });
      btn.className = 'px-3 py-1.5 rounded-lg bg-[#1E3B2B] text-white';
      fetchAllOrders(btn.getAttribute('data-status'));
    });
  });

  // Initial Load of Business Data
  fetchStats();
  fetchAllOrders();
  fetchProducts();
  fetchCoupons();
  fetchCustomers();

  // Initialize
  loadInitialData();
})();
