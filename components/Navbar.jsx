'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, cartBounce, openMiniCart } = useCart();
  const { user, isAdmin } = useAuth();

  return (
    <>
      <header className="header-nav sticky top-0 z-40 w-full bg-[#FAF4EE]/90 backdrop-blur-md transition-all duration-300 border-b border-stone-200/50">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group focus-visible:outline-none rounded-lg" aria-label="EarthGlaze Natural Skincare Home">
            <img 
              src="/assets/earthglaze-logo-hd.png"
              alt="EarthGlaze • Natural Skincare" 
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6" aria-label="Main Navigation">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                pathname === '/' 
                  ? 'bg-[#E3EBE4] text-[#1E3B2B] shadow-sm' 
                  : 'text-stone-700 hover:text-[#235327] hover:bg-stone-200/50'
              }`}
            >
              Home
            </Link>

            <Link 
              href="/shop" 
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/shop' 
                  ? 'bg-[#E3EBE4] text-[#1E3B2B] font-semibold' 
                  : 'text-stone-800 hover:text-[#235327] hover:bg-stone-200/50'
              }`}
            >
              <span>Shop</span>
              <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </Link>

            <Link 
              href="/about" 
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/about' || pathname === '/story'
                  ? 'bg-[#E3EBE4] text-[#1E3B2B] font-semibold' 
                  : 'text-stone-800 hover:text-[#235327] hover:bg-stone-200/50'
              }`}
            >
              About Us
            </Link>

            <Link 
              href="/ingredients" 
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/ingredients' 
                  ? 'bg-[#E3EBE4] text-[#1E3B2B] font-semibold' 
                  : 'text-stone-800 hover:text-[#235327] hover:bg-stone-200/50'
              }`}
            >
              Ingredients
            </Link>

            <Link 
              href="/blog" 
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/blog' 
                  ? 'bg-[#E3EBE4] text-[#1E3B2B] font-semibold' 
                  : 'text-stone-800 hover:text-[#235327] hover:bg-stone-200/50'
              }`}
            >
              Blog
            </Link>

            <Link 
              href="/contact" 
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === '/contact' 
                  ? 'bg-[#E3EBE4] text-[#1E3B2B] font-semibold shadow-2xs' 
                  : 'text-stone-800 hover:text-[#235327] hover:bg-stone-200/50'
              }`}
            >
              Contact
            </Link>

            {isAdmin && (
              <Link 
                href="/admin" 
                className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#1E3B2B] text-[#FAF7F2] hover:bg-[#2a4e3b] transition shadow-sm flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Admin
              </Link>
            )}
          </nav>

          {/* Action Utility Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Search Button */}
            <Link 
              href="/shop" 
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white/80 transition shadow-sm border border-transparent hover:border-stone-200"
              aria-label="Search skincare products"
              title="Search products"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </Link>

            {/* User Profile Button */}
            <Link 
              href="/account" 
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white/80 transition shadow-sm border border-transparent hover:border-stone-200 relative group"
              aria-label="Customer Account Profile"
              title={user ? `Logged in as ${user.name}` : "Account Profile"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              {user && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-[#FAF4EE]" />
              )}
            </Link>

            {/* Shopping Bag / Cart Button */}
            <Link 
              href="/cart" 
              onClick={(e) => {
                // If not navigating with modifier key, open quick slide-over mini cart
                if (!e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  openMiniCart();
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white/80 transition shadow-sm border border-transparent hover:border-stone-200 relative cursor-pointer"
              aria-label="Shopping Bag"
              title="View Shopping Bag"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span className={`absolute -top-1 -right-1 bg-[#235327] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow transition-all duration-300 ${cartBounce ? 'scale-125 bg-[#C28328] ring-2 ring-white' : 'scale-100'}`}>
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white transition ml-1"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            </button>

          </div>

        </div>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF4EE] border-t border-stone-200 px-6 py-4 space-y-3">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              Shop All Products
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              About Us
            </Link>
            <Link 
              href="/ingredients" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              Ingredients
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              Contact Us
            </Link>
            <Link 
              href="/track-order" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              Track Order
            </Link>
            <Link 
              href="/account" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-800 hover:text-[#235327] py-2"
            >
              {user ? `Account (${user.name})` : 'My Account'}
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-[#1E3B2B] py-2"
              >
                Admin Panel →
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
