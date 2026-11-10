'use client';

import React, { useEffect, useRef } from 'react';

/**
 * BotanicalConfetti
 * A lightweight, high-performance canvas particle burst
 * featuring organic botanical petals (golden petals, emerald leaves, cream florets).
 * Fully self-contained, GPU-accelerated, auto-dismissing, respects prefers-reduced-motion.
 */
export default function BotanicalConfetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palette: EarthGlaze Gold, Forest Green, Sage, Warm Cream
    const colors = [
      '#C28328', // EarthGlaze Gold
      '#D4AF37', // Metallic Gold
      '#2E6B3E', // Forest Green Leaf
      '#5C8765', // Sage Leaf
      '#8A6A32', // Warm Bronze
      '#FAF4EE', // Cream Petal
      '#E8DEC8', // Soft Sand
    ];

    // Create 55 organic botanical petal particles
    const particleCount = 55;
    const particles = [];
    const originX = width / 2;
    const originY = Math.min(height * 0.35, 280);

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 8 + 4;
      particles.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed * (Math.random() * 0.9 + 0.5),
        vy: (Math.sin(angle) * speed - Math.random() * 7) * 0.85,
        gravity: 0.14 + Math.random() * 0.08,
        friction: 0.96,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 7,
        shape: Math.random() > 0.4 ? 'petal' : 'circle',
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.007 + 0.005,
      });
    }

    const startTime = Date.now();
    const duration = 3800; // 3.8 seconds total duration

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        return; // finished
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;
        p.opacity = Math.max(0, p.life);

        if (p.opacity <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'petal') {
          // Draw organic leaf/petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Circular floret
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      aria-hidden="true"
    />
  );
}
