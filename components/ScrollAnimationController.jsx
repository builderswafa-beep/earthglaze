'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Universal Scroll & Entrance Animation Controller
 * Detects all page sections and elements with entrance animation classes
 * across every page in the application, applying smooth botanical reveals.
 */
export default function ScrollAnimationController() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Small delay to let DOM render fully after route changes
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll(
        'section:not(.no-auto-reveal), [data-reveal], .reveal-section, .page-header-banner, .animate-on-scroll'
      );

      if (!targets.length) return;

      if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('section-entered'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('section-entered');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.06,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      targets.forEach((el, index) => {
        // Initial setup for unrevealed state
        if (!el.classList.contains('section-entered')) {
          el.classList.add('section-reveal-init');
          
          // Check if already in viewport (e.g. above-the-fold hero)
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.88) {
            // Slight stagger for top-of-page elements
            setTimeout(() => {
              el.classList.add('section-entered');
            }, Math.min(index * 60, 240));
            return;
          }

          observer.observe(el);
        }
      });

      return () => {
        observer.disconnect();
      };
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
