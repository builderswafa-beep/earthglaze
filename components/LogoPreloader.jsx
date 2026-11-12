'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function LogoPreloader() {
  const [phase, setPhase] = useState('center'); // 'center' | 'flying' | 'done'
  const [logoCoords, setLogoCoords] = useState(null);
  const [progress, setProgress] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const preloaderLogoRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Measure initial center position
    const timer = setTimeout(() => {
      if (preloaderLogoRef.current) {
        const rect = preloaderLogoRef.current.getBoundingClientRect();
        setLogoCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }, 50);

    // Smooth progress animation from 0 to 100
    const startProgressTime = performance.now();
    const progressDuration = 1100;

    const updateProgress = (now) => {
      const elapsed = now - startProgressTime;
      const pct = Math.min(Math.round((elapsed / progressDuration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Progress complete: measure header logo target location
        setTimeout(() => {
          const headerLogo = document.getElementById('header-brand-logo');
          if (headerLogo) {
            const hRect = headerLogo.getBoundingClientRect();
            setTargetRect({
              top: hRect.top,
              left: hRect.left,
              width: hRect.width,
              height: hRect.height,
            });

            // Hide header logo temporarily while preloader logo flies into it
            headerLogo.style.opacity = '0';
          }
          // Initiate flight to header
          setPhase('flying');

          // Restore page scroll as flight begins
          document.body.style.overflow = originalOverflow || '';

          // Finish docking after flight duration (950ms)
          setTimeout(() => {
            const headerLogo = document.getElementById('header-brand-logo');
            if (headerLogo) {
              headerLogo.style.opacity = '1';
              headerLogo.style.transition = 'opacity 0.2s ease-in';
            }
            setPhase('done');
          }, 950);
        }, 150);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow || '';
    };
  }, []);

  if (phase === 'done') return null;

  // Compute flight styles
  const isFlying = phase === 'flying' && targetRect;

  return (
    <aside 
      className={`fixed inset-0 z-[9999] pointer-events-none select-none transition-opacity duration-700 ease-out ${
        phase === 'flying' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#FAF7F2',
      }}
      aria-label="Website Loading"
    >
      {/* Ambient Botanical Radial Halo */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(230, 244, 233, 0.85) 0%, rgba(250, 247, 242, 0.98) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Transition Logo Container */}
      <div
        ref={preloaderLogoRef}
        style={
          isFlying
            ? {
                position: 'fixed',
                top: `${targetRect.top}px`,
                left: `${targetRect.left}px`,
                width: `${targetRect.width}px`,
                height: `${targetRect.height}px`,
                transform: 'none',
                transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10000,
                pointerEvents: 'none',
              }
            : logoCoords
            ? {
                position: 'fixed',
                top: `${logoCoords.top}px`,
                left: `${logoCoords.left}px`,
                width: `${logoCoords.width}px`,
                height: `${logoCoords.height}px`,
                transform: 'none',
                transition: 'none',
                zIndex: 10000,
                pointerEvents: 'none',
              }
            : {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '210px',
                height: '70px',
                zIndex: 10000,
                pointerEvents: 'none',
              }
        }
        className="flex items-center justify-center pointer-events-none"
      >
        <img
          src="/assets/earthglaze-logo-hd.png"
          alt="EarthGlaze Logo"
          className={`w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(22,61,38,0.15)] transition-transform duration-500 ${
            phase === 'center' ? 'scale-100 animate-pulse' : 'scale-100'
          }`}
        />
      </div>

      {/* Center Branding Content (Tagline & Progress Bar) - Fades out before flight */}
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-12 sm:translate-y-14 flex flex-col items-center justify-center pointer-events-none transition-all duration-400 ${
          phase === 'flying' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Botanical Tagline */}
        <div className="mt-4 text-[11px] sm:text-xs font-semibold tracking-[0.24em] text-[#2D5A3C] uppercase flex items-center gap-2">
          <span>Pure</span>
          <span className="w-1 h-1 rounded-full bg-[#C28328]"></span>
          <span>Botanical</span>
          <span className="w-1 h-1 rounded-full bg-[#C28328]"></span>
          <span>Artisanal</span>
        </div>

        {/* Minimalist Botanical Progress Bar */}
        <div className="w-36 sm:w-44 h-1 bg-[#E2ECE3] rounded-full overflow-hidden mt-3 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#163D26] via-[#2A6B3D] to-[#C28328] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
