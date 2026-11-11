'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import api from '../lib/api';
import styles from './AnnouncementCarousel.module.css';

const AUTO_SLIDE_INTERVAL_MS = 4800;

/**
 * Shared announcement card renderer used by both the desktop showcase row
 * and the mobile horizontal slide track so interaction, coupon feedback,
 * and floating motion stay consistent across breakpoints.
 */
function AnnouncementCard({
  offer,
  index,
  isActive,
  copiedCoupon,
  couponCode,
  onCopyCoupon,
  onActivateSlide,
}) {
  const floatDelayClass =
    index % 3 === 0
      ? styles.cardFloatDelay0
      : index % 3 === 1
        ? styles.cardFloatDelay1
        : styles.cardFloatDelay2;

  const interactiveClass = [
    styles.cardInteractive,
    isActive ? styles.cardActive : 'opacity-95 hover:opacity-100',
    'relative block w-full aspect-[1024/288] rounded-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D77F]/80',
  ].join(' ');

  const cardInner = (
    <div className={`${styles.cardFloat} ${floatDelayClass} w-full h-full`}>
      <img
        src={offer.imageSrc}
        alt={offer.alt}
        width={1024}
        height={288}
        loading="eager"
        decoding="async"
        draggable={false}
        className="block w-full h-full object-contain select-none"
      />
      <span className="sr-only">{offer.srText}</span>

      {offer.actionType === 'coupon' && copiedCoupon && (
        <span
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-full border border-[#E7BC52]/90 bg-[#022E18]/95 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#FDF0B8] shadow-md"
        >
          ✓ Copied {couponCode}!
        </span>
      )}
    </div>
  );

  if (offer.actionType === 'coupon') {
    return (
      <button
        type="button"
        onClick={() => {
          onActivateSlide(index);
          onCopyCoupon();
        }}
        title={`Click to copy coupon ${couponCode} (${offer.liveSummary})`}
        aria-label={offer.ariaLabel}
        className={`${interactiveClass} cursor-pointer border-0 bg-transparent p-0 text-left`}
      >
        {cardInner}
      </button>
    );
  }

  return (
    <Link
      href={offer.href}
      onFocus={() => onActivateSlide(index)}
      title={offer.liveSummary}
      aria-label={offer.ariaLabel}
      className={interactiveClass}
    >
      {cardInner}
    </Link>
  );
}

/** Compact circular previous/next arrow button for the announcement track. */
function CarouselNavButton({ direction, onClick }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Previous offer' : 'Next offer'}
      className="flex-shrink-0 w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/95 hover:bg-[#FFF9E6] text-[#053B1F] flex items-center justify-center shadow-sm border border-[#E6B94D]/40 transition-all duration-200 hover:scale-105 cursor-pointer"
    >
      <svg
        className="w-2.5 h-2.5 sm:w-3 sm:h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d={isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  );
}

export default function AnnouncementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1); // Highlight center card initially to match reference
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const [comboData, setComboData] = useState({
    title: 'Save More, Glow More!',
    subtitle: 'Get curated skincare combos at special prices.',
    price: 799,
    savings: 148,
    discountPercent: 15,
  });

  const [couponData] = useState({
    code: 'GLOW15',
    discountPercent: 15,
    minOrderValue: 800,
  });

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadBackendOffers() {
      try {
        const res = await api.products.getCombo();
        if (!isCancelled && res?.success && res?.combo) {
          const c = res.combo;
          setComboData({
            title: 'Save More, Glow More!',
            subtitle: c.description || 'Get curated skincare combos at special prices.',
            price: c.combo_price || 799,
            savings: c.savings || 148,
            discountPercent: c.discount_percentage || 15,
          });
        }
      } catch (err) {
        console.warn('Could not load combo from API, using default', err);
      }
    }

    loadBackendOffers();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  /**
   * Extensible offer configuration backed by separate replaceable image assets.
   * To replace or add offers later, update an item's `imageSrc` or append a new entry.
   */
  const offerCards = useMemo(
    () => [
      {
        id: 'combo-offer',
        actionType: 'link',
        href: '/shop',
        imageSrc: '/assets/announcement_card_combo.png',
        alt: `Combo Offer – ${comboData.title}`,
        liveSummary: `${comboData.title} — Combo ₹${comboData.price} (Save ₹${comboData.savings})`,
        srText: `Combo Offer – ${comboData.title}. ${comboData.subtitle} Price ₹${comboData.price}, Save ₹${comboData.savings}.`,
        ariaLabel: `Combo Offer – ${comboData.title}. ${comboData.subtitle} Shop now.`,
      },
      {
        id: 'coupon-offer',
        actionType: 'coupon',
        imageSrc: '/assets/announcement_card_coupon.png',
        alt: `Extra ${couponData.discountPercent}% OFF on orders above ₹${couponData.minOrderValue} – Use Coupon ${couponData.code}`,
        liveSummary: `Extra ${couponData.discountPercent}% OFF above ₹${couponData.minOrderValue}`,
        srText: `Extra ${couponData.discountPercent}% OFF on orders above ₹${couponData.minOrderValue}. Coupon ${couponData.code}.`,
        ariaLabel: `Extra ${couponData.discountPercent}% OFF on orders above ₹${couponData.minOrderValue}. Click to copy coupon ${couponData.code}.`,
      },
      {
        id: 'limited-offer',
        actionType: 'link',
        href: '/shop',
        imageSrc: '/assets/announcement_card_limited.png',
        alt: 'Limited Time Offer – Grab Your Favourite Skincare Combo at This Price. Shop Now',
        liveSummary: `Limited Time Offer – Shop Combo at ₹${comboData.price}`,
        srText: `Limited Time Offer – Shop Now. Grab your favourite skincare combo at ₹${comboData.price}.`,
        ariaLabel: 'Limited Time Offer – Grab your favourite skincare combo at this price. Shop now.',
      },
    ],
    [comboData, couponData]
  );

  const totalSlides = offerCards.length;

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handleCopyCoupon = useCallback(async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(couponData.code);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied && typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = couponData.code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        // Ignore clipboard errors in restricted environments
      }
      document.body.removeChild(textarea);
    }

    setCopiedCoupon(true);
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = setTimeout(() => setCopiedCoupon(false), 2400);
  }, [couponData.code]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (touchEndX.current !== 0 && Math.abs(delta) > 40) {
      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
    setIsPaused(false);
  };

  const desktopStartIndex =
    totalSlides > 3 ? Math.min(currentIndex, totalSlides - 3) : 0;

  return (
    <section
      aria-label="Promotional Offers"
      className={`${styles.stripRoot} announcement-carousel-root relative w-full overflow-x-clip border-b border-[#0c4a2b] bg-gradient-to-r from-[#012212] via-[#03371E] to-[#012212]`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle botanical edge leaves anchored flush to strip corners */}
      <img
        src="/assets/announcement_edge_leaves_left.png"
        alt=""
        aria-hidden="true"
        width={119}
        height={300}
        className="pointer-events-none select-none absolute bottom-0 left-0 z-[1] h-[84%] sm:h-[92%] lg:h-full w-auto max-w-[44px] sm:max-w-[68px] lg:max-w-[96px] object-contain object-left-bottom opacity-45 sm:opacity-65 lg:opacity-80"
      />
      <img
        src="/assets/announcement_edge_leaves_right.png"
        alt=""
        aria-hidden="true"
        width={209}
        height={300}
        className="pointer-events-none select-none absolute bottom-0 right-0 z-[1] h-[80%] sm:h-[88%] lg:h-[96%] w-auto max-w-[54px] sm:max-w-[84px] lg:max-w-[120px] object-contain object-right-bottom opacity-45 sm:opacity-65 lg:opacity-80"
      />

      <div className="relative z-10 mx-auto max-w-[700px] xl:max-w-[740px] px-2 sm:px-4 lg:px-4 pt-[3px] pb-[2px]">
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2">
          <CarouselNavButton direction="prev" onClick={handlePrev} />

          {/* Desktop 3-Card Horizontal Carousel */}
          <div className="hidden lg:block flex-1 min-w-0 overflow-x-clip py-[2px]">
            <div
              className={`${styles.desktopTrack} flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
              style={
                totalSlides > 3
                  ? {
                      transform: `translateX(calc(-${desktopStartIndex} * (100% + 8px) / 3))`,
                    }
                  : undefined
              }
            >
              {offerCards.map((offer, idx) => (
                <div
                  key={offer.id}
                  className="min-w-0 flex-shrink-0 basis-[calc((100%-16px)/3)]"
                >
                  <AnnouncementCard
                    offer={offer}
                    index={idx}
                    isActive={currentIndex === idx}
                    copiedCoupon={copiedCoupon}
                    couponCode={couponData.code}
                    onCopyCoupon={handleCopyCoupon}
                    onActivateSlide={setCurrentIndex}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Single-Card Horizontal Carousel */}
          <div className="lg:hidden flex-1 min-w-0 overflow-hidden py-[2px]">
            <div
              className={`${styles.mobileTrack} flex w-full items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {offerCards.map((offer, idx) => (
                <div key={offer.id} className="w-full min-w-0 flex-shrink-0 px-0.5 sm:px-2">
                  <div className="mx-auto w-full max-w-[224px] sm:max-w-[265px]">
                    <AnnouncementCard
                      offer={offer}
                      index={idx}
                      isActive={currentIndex === idx}
                      copiedCoupon={copiedCoupon}
                      couponCode={couponData.code}
                      onCopyCoupon={handleCopyCoupon}
                      onActivateSlide={setCurrentIndex}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CarouselNavButton direction="next" onClick={handleNext} />
        </div>

        {/* Indicator Dots */}
        <div
          className="mt-0 flex items-center justify-center gap-0.5"
          role="tablist"
          aria-label="Select promotional offer"
        >
          {offerCards.map((offer, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={offer.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View offer ${idx + 1}: ${offer.liveSummary}`}
                className="flex h-2 w-3.5 items-center justify-center border-0 bg-transparent p-0 cursor-pointer"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? 'h-[4px] w-2 bg-[#FFF6D6] shadow-[0_0_5px_rgba(245,215,127,0.75)]'
                      : 'h-[4px] w-[4px] bg-white/40 hover:bg-white/70'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
