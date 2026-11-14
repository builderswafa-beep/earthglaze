'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        setSuccessMsg('Signed in successfully! Welcome back.');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          if (onClose) onClose();
        }, 600);
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await register(regName, regEmail, regPassword, regPhone);
      if (res.success) {
        setSuccessMsg('Account created successfully! Welcome to EarthGlaze.');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user);
          if (onClose) onClose();
        }, 700);
      } else {
        setErrorMsg(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-[28px] border border-[#E8DEC8] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#1E3B2B] font-sans">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-sm font-bold transition cursor-pointer"
          aria-label="Close authentication window"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1 mb-6">
          <img 
            src="/assets/earthglaze-logo-hd.png" 
            alt="EarthGlaze" 
            className="h-10 w-auto mx-auto object-contain mb-2"
          />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1E3B2B]">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-stone-500">
            {mode === 'login' 
              ? 'Sign in to access your orders, saved addresses and botanical rituals.' 
              : 'Join the EarthGlaze botanical community for member perks & faster checkout.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-stone-200/60 rounded-full mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              mode === 'login' 
                ? 'bg-[#1E3B2B] text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              mode === 'register' 
                ? 'bg-[#1E3B2B] text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. yourname@example.com"
                className="w-full text-xs sm:text-sm px-4 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#235327] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-stone-500 hover:text-[#235327] cursor-pointer">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm px-4 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#235327] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#235327] hover:bg-[#183d1c] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing In...' : 'Sign In to Account →'}</span>
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Ayesha Nair"
                className="w-full text-xs sm:text-sm px-4 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#235327] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm px-4 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#235327] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number (for order delivery alerts)
              </label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs sm:text-sm px-4 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#235327] transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Create Password
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full text-xs sm:text-sm px-4 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#235327] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#235327] hover:bg-[#183d1c] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration →'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
