'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  const dropdownRef = useRef(null);
  const { cartCount, cartBounce, openMiniCart } = useCart();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header 
        className={`header-nav fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-[#FAF4EE]/95 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(23,61,43,0.08)] border-stone-200/80 py-2.5 sm:py-3' 
            : 'bg-[#FAF4EE]/90 backdrop-blur-md shadow-none border-stone-200/40 py-3.5'
        }`}
      >
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between transition-all duration-300">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group focus-visible:outline-none rounded-lg" aria-label="EarthGlaze Natural Skincare Home">
            <img 
              id="header-brand-logo"
              src="/assets/earthglaze-logo-hd.png"
              alt="EarthGlaze • Natural Skincare" 
              className={`w-auto max-w-[140px] sm:max-w-none object-contain transition-all duration-300 group-hover:scale-[1.02] ${
                scrolled 
                  ? 'h-9 sm:h-11 md:h-14' 
                  : 'h-10 sm:h-12 md:h-16'
              }`}
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
          <div className="flex items-center gap-1 sm:gap-2.5 md:gap-3">
            
            {/* Search Button */}
            <Link 
              href="/shop" 
              className="group w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white/80 transition shadow-xs sm:shadow-sm border border-transparent hover:border-stone-200"
              aria-label="Search skincare products"
              title="Search products"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 icon-hover-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </Link>

            {/* User Profile / Auth Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(prev => !prev)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white/80 transition shadow-xs sm:shadow-sm border border-transparent hover:border-stone-200 relative group cursor-pointer"
                aria-label="Customer Account Profile"
                aria-expanded={userDropdownOpen}
                title={user ? `Logged in as ${user.name}` : "Account & Login"}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 icon-hover-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {user && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-[#FAF4EE]" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] shadow-xl p-3 z-50 text-[#1E3B2B] animate-fadeIn text-xs">
                  {user ? (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white rounded-xl border border-stone-200/80">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1E3B2B] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div className="overflow-hidden">
                            <span className="block font-bold text-xs truncate text-[#1E3B2B]">
                              {user.name}
                            </span>
                            <span className="block text-[11px] text-stone-500 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-200/50 text-stone-700 hover:text-[#1E3B2B] font-semibold transition"
                        >
                          <span>👤</span>
                          <span>My Account &amp; Dashboard</span>
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-200/50 text-stone-700 hover:text-[#1E3B2B] font-semibold transition"
                        >
                          <span>📦</span>
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/track-order"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-200/50 text-stone-700 hover:text-[#1E3B2B] font-semibold transition"
                        >
                          <span>🚚</span>
                          <span>Track Package</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition"
                          >
                            <span>🛡️</span>
                            <span>Admin Portal →</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer"
                        >
                          <span>Sign Out</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 p-1">
                      <div className="text-center pb-2 border-b border-stone-200">
                        <span className="font-serif font-bold text-sm block text-[#1E3B2B]">
                          Welcome to EarthGlaze
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Sign in for member perks &amp; tracking
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthModalMode('login');
                            setAuthModalOpen(true);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#1E3B2B] hover:bg-[#152a1f] text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Sign In</span>
                          <span>→</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthModalMode('register');
                            setAuthModalOpen(true);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 font-bold text-xs transition cursor-pointer"
                        >
                          Create Account
                        </button>
                      </div>

                      <div className="pt-1 text-center">
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="text-[11px] text-[#235327] hover:underline font-semibold"
                        >
                          Go to Account Page ↗
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

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
              className="group w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white/80 transition shadow-xs sm:shadow-sm border border-transparent hover:border-stone-200 relative cursor-pointer"
              aria-label="Shopping Bag"
              title="View Shopping Bag"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 icon-hover-bag" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span className={`absolute -top-1 -right-1 bg-[#235327] text-white text-[10px] sm:text-[11px] font-bold w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow transition-all duration-300 ${cartBounce ? 'scale-125 bg-[#C28328] ring-2 ring-white' : 'scale-100'}`}>
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-stone-700 hover:text-[#235327] hover:bg-white transition ml-0.5"
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
          <div className="md:hidden bg-[#FAF4EE]/98 backdrop-blur-lg border-t border-stone-200 px-6 py-4 space-y-3 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
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

            {user ? (
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <Link 
                  href="/account" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-bold text-[#1E3B2B] py-1"
                >
                  👤 My Account ({user.name})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-red-600 font-bold py-1 text-sm text-left cursor-pointer"
                >
                  Sign Out →
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E3B2B] text-white text-xs font-bold text-center cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold text-center cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}

            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-[#1E3B2B] py-2 border-t border-stone-200"
              >
                Admin Panel →
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authModalMode} 
      />

      {/* Fixed Header Layout Spacer so content flow and section spacing remain preserved */}
      <div className="header-nav-spacer h-[68px] sm:h-[76px] md:h-[92px] w-full shrink-0 pointer-events-none select-none" aria-hidden="true" />
    </>
  );
}
