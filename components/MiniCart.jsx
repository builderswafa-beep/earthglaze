'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function MiniCart() {
  const {
    items,
    totals,
    miniCartOpen,
    closeMiniCart,
    updateQuantity,
    removeFromCart,
    updatingItemId,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && miniCartOpen) {
        closeMiniCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [miniCartOpen, closeMiniCart]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (miniCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [miniCartOpen]);

  if (!miniCartOpen) return null;

  const getProductImage = (item) => {
    const p = item.product;
    if (!p) return '/assets/shop_card_manjistha_hd.png';
    if (p.image_photo) return p.image_photo;
    if (p.image_closed) return p.image_closed;
    if (p.slug?.includes('goat')) return '/assets/shop_card_goatmilk_hd.png';
    if (p.slug?.includes('balm')) return '/assets/shop_card_lipbalm_hd.png';
    return '/assets/shop_card_manjistha_hd.png';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D2D1C]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeMiniCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E8DEC8] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out">
          
          {/* 1. Header */}
          <div className="p-5 sm:p-6 border-b border-[#E8DEC8] bg-[#FAF4EE] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3B2B] animate-pulse"></span>
              <h3 className="font-serif font-bold text-xl text-[#1E3B2B]">
                Your Botanical Bag
              </h3>
              <span className="bg-[#FEF6E4] text-[#9A6208] border border-[#F5E2B3] text-xs font-bold px-2 py-0.5 rounded-full">
                {totals.total_items} {totals.total_items === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              type="button"
              onClick={closeMiniCart}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition"
              aria-label="Close cart preview"
            >
              ✕
            </button>
          </div>

          {/* 2. Free Express Delivery Banner */}
          <div className="bg-[#E3EBE4] px-5 py-2.5 border-b border-[#D0DEC4] flex items-center justify-between text-xs font-medium text-[#1E3B2B]">
            <span className="flex items-center gap-1.5">
              <span>🌿</span>
              <span>Complimentary Express Delivery Applied</span>
            </span>
            <span className="font-bold text-[11px] uppercase tracking-wider text-[#14291E]">FREE</span>
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-[#EAE0D0]">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F5ECE0] text-[#8A6A32] flex items-center justify-center text-2xl">
                  🛒
                </div>
                <h4 className="font-serif font-bold text-lg text-[#1E3B2B]">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Explore our handcrafted Ayurvedic cleansing bars and tinted organic lip care to nourish your daily rituals.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    onClick={closeMiniCart}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1E3B2B] text-white text-xs font-bold shadow hover:bg-[#14291E] transition"
                  >
                    <span>Browse Formulations</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => {
                const product = item.product || {};
                const isItemUpdating = updatingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`py-4 first:pt-0 last:pb-0 flex gap-4 transition-opacity duration-200 ${
                      isItemUpdating ? 'opacity-50 pointer-events-none' : 'opacity-100'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-18 h-18 bg-white rounded-2xl p-2 border border-[#E8DEC8] flex items-center justify-center shrink-0 shadow-inner">
                      <img
                        src={getProductImage(item)}
                        alt={product.name || 'Skincare item'}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product?id=${product.id || item.product_id}`}
                            onClick={closeMiniCart}
                            className="font-serif font-bold text-sm text-[#1E3B2B] hover:text-[#2E6B3E] transition line-clamp-1"
                          >
                            {product.name || 'Artisan Skincare'}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-red-600 transition text-xs p-0.5"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                        <span className="text-[11px] text-stone-500 block">
                          {product.category_name || 'Ayurvedic Care'} {product.weight ? `• ${product.weight}` : ''}
                        </span>
                      </div>

                      {/* Quantity & Line Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center bg-white border border-[#D5C9B8] rounded-lg overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition font-bold text-xs"
                            disabled={isItemUpdating}
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-stone-900 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition font-bold text-xs"
                            disabled={isItemUpdating}
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[#1E3B2B]">
                          ₹{item.unit_price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 4. Footer Calculations & Action Buttons */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#FAF4EE] border-t border-[#E8DEC8] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{totals.subtotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Coupon Savings</span>
                    <span className="font-bold">-₹{totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Express Delivery</span>
                  <span className="font-bold text-emerald-800">FREE</span>
                </div>
                <div className="pt-2 border-t border-[#E8DEC8] flex justify-between items-baseline text-sm">
                  <span className="font-serif font-bold text-[#1E3B2B]">Total Payable</span>
                  <span className="font-bold text-xl text-[#1E3B2B]">₹{totals.total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeMiniCart}
                  className="block w-full py-3.5 bg-[#1E3B2B] hover:bg-[#14291E] text-white text-xs sm:text-sm font-bold text-center rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeMiniCart}
                  className="block w-full py-2.5 bg-white hover:bg-stone-100 border border-[#D5C9B8] text-[#1E3B2B] text-xs font-bold text-center rounded-xl transition"
                >
                  View &amp; Edit Full Shopping Bag
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="text-center pt-1">
                <span className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                  <span>🔒 256-bit SSL Secure Checkout</span>
                  <span>•</span>
                  <span>Ayurvedic Small Batch</span>
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
