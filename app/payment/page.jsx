'use client';

import React from 'react';
import Link from 'next/link';

export default function PaymentPage() {
  return (
    <div className="w-full min-h-screen">


  {/* Header */}
  

  {/* Main Payment Content */}
  <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
    
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Payment Methods */}
      <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8DEC8] space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1E3B2B]">Choose Payment Method</h1>
          <p className="text-xs text-stone-500 mt-1">All transactions are encrypted and processed through certified banking standards.</p>
        </div>

        <div className="space-y-4" id="payment-options-container">
          
          {/* Option 1: Online Payment (UPI, Cards, Net Banking) */}
          <label className="block p-5 rounded-2xl border-2 border-[#1E3B2B] bg-[#FAF7F2] cursor-pointer transition relative group hover:border-[#1E3B2B]" id="opt-online-label">
            <div className="flex items-start gap-3">
              <input type="radio" name="payment_method" value="Online Payment" checked className="mt-1 text-[#1E3B2B] focus:ring-[#1E3B2B]" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#1E3B2B]">Online Payment</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">Pay securely with UPI, Debit/Credit Cards, Net Banking & Wallets</p>
                
                {/* Payment Logos Row matching Portfolio Reference */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-200/80">
                  <span className="px-2 py-1 bg-white rounded border border-stone-200 text-[10px] font-bold text-emerald-800">UPI</span>
                  <span className="px-2 py-1 bg-white rounded border border-stone-200 text-[10px] font-bold text-blue-700">VISA</span>
                  <span className="px-2 py-1 bg-white rounded border border-stone-200 text-[10px] font-bold text-amber-600">Mastercard</span>
                  <span className="px-2 py-1 bg-white rounded border border-stone-200 text-[10px] font-bold text-sky-800">RuPay</span>
                </div>
              </div>
            </div>
          </label>

          {/* Option 2: Cash on Delivery (COD) */}
          <label className="block p-5 rounded-2xl border border-stone-300 hover:border-[#1E3B2B] bg-white cursor-pointer transition relative group" id="opt-cod-label">
            <div className="flex items-start gap-3">
              <input type="radio" name="payment_method" value="Cash on Delivery" className="mt-1 text-[#1E3B2B] focus:ring-[#1E3B2B]" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-stone-900">Cash on Delivery (COD)</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">Pay in cash or UPI QR code when you receive your order at your doorstep.</p>
              </div>
            </div>
          </label>

        </div>

        {/* Place Order Button */}
        <div className="pt-4">
          <button 
            type="button" 
            id="btn-place-order" 
            className="w-full py-4 bg-[#1E3B2B] hover:bg-[#14291E] text-white font-bold text-sm rounded-2xl transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 active:scale-95"
          >
            <span id="place-order-text">Place Order – ₹348</span>
            <span>✓</span>
          </button>
        </div>

        {/* Security Guarantee matching Portfolio Reference */}
        <div className="text-center pt-2">
          <p className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Secured by 256-bit SSL Encryption</span>
          </p>
        </div>

      </div>

      {/* Right Column: Shipping Summary Preview */}
      <div className="md:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-[#E8DEC8] space-y-4">
        <h2 className="font-serif font-bold text-base text-[#1E3B2B] border-b border-stone-200 pb-3">Delivery Summary</h2>

        <div className="text-xs text-stone-600 space-y-1" id="delivery-address-slot">
          <p className="font-bold text-stone-900" id="ship-name">Valued Customer</p>
          <p id="ship-phone">Contact confirmed at checkout</p>
          <p id="ship-address">Shipping destination selected at checkout</p>
        </div>

        <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-bold text-stone-900" id="pay-subtotal">₹0</span>
          </div>
          <div id="pay-discount-row" className="hidden justify-between text-emerald-700">
            <span>Discount</span>
            <span className="font-bold" id="pay-discount">-₹0</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Shipping</span>
            <span className="font-bold text-emerald-700">FREE</span>
          </div>
          <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-serif font-bold text-[#1E3B2B]">
            <span>Total Payable</span>
            <span id="pay-final-total">₹0</span>
          </div>
        </div>
      </div>

    </div>

  </main>

  
  

    </div>
  );
}
