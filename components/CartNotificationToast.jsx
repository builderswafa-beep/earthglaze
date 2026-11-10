'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartNotificationToast() {
  const { toast, closeToast, openMiniCart } = useCart();

  useEffect(() => {
    if (!toast.open) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.open, toast.timestamp, closeToast]);

  if (!toast.open || !toast.product) return null;

  const p = toast.product;
  const imageSrc =
    p.image_photo ||
    p.image_closed ||
    (p.slug?.includes('goat')
      ? '/assets/shop_card_goatmilk_hd.png'
      : p.slug?.includes('balm')
      ? '/assets/shop_card_lipbalm_hd.png'
      : '/assets/shop_card_manjistha_hd.png');

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-[#FAF7F2] border border-[#E8DEC8] rounded-2xl shadow-2xl p-4 transition-all duration-300 transform translate-y-0 opacity-100 font-sans"
      style={{
        boxShadow: '0 20px 40px -15px rgba(30, 59, 43, 0.18), 0 0 0 1px rgba(194, 131, 40, 0.15)',
      }}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D0]">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#1E3B2B] text-white flex items-center justify-center text-xs font-bold">
            ✓
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3B2B]">
            Added to Botanical Ritual
          </span>
        </div>
        <button
          type="button"
          onClick={closeToast}
          className="text-stone-400 hover:text-stone-700 transition p-1 text-sm rounded-lg"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>

      {/* Product Information */}
      <div className="flex items-center gap-3 py-3">
        <div className="w-14 h-14 bg-white rounded-xl p-1.5 border border-[#EAE0D0] flex items-center justify-center shrink-0 shadow-inner">
          <img
            src={imageSrc}
            alt={p.name || 'Artisan product'}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold text-sm text-[#1E3B2B] truncate">
            {p.name || 'Pure Herbal Formulation'}
          </h4>
          <p className="text-xs text-stone-500 truncate">
            {p.weight || '100% Cold-Pressed'} • ₹{p.sale_price || p.price || 349}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            closeToast();
            openMiniCart();
          }}
          className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-[#1E3B2B] text-[#1E3B2B] hover:bg-[#FAF4EE] transition"
        >
          Quick Bag Preview
        </button>
        <Link
          href="/checkout"
          onClick={closeToast}
          className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-[#1E3B2B] hover:bg-[#14291E] text-white transition shadow-sm"
        >
          Checkout →
        </Link>
      </div>
    </div>
  );
}
