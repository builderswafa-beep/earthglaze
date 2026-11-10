/**
 * EarthGlaze — Storyboard Animation & Carousel Integration Bridge
 * Delegates hero carousel operations directly to the central EarthGlazeCarousel controller.
 *
 * Products in continuous loop:
 *   0. EARTHGLAZE Goat Milk Soap
 *   1. EARTHGLAZE Manjistha Soap
 *   2. EARTHGLAZE Neem Soap
 *   3. EARTHGLAZE Beet Root Lip Balm
 */

(function () {
  'use strict';

  function initBridge() {
    if (typeof window.EarthGlazeCarousel !== 'undefined') {
      window.EarthGlazeStoryboard = window.EarthGlazeCarousel;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridge);
  } else {
    initBridge();
  }
})();
