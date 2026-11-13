'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import MiniCart from './MiniCart';
import CartNotificationToast from './CartNotificationToast';
import StickyFloatingActions from './StickyFloatingActions';
import LogoPreloader from './LogoPreloader';
import ScrollAnimationController from './ScrollAnimationController';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <LogoPreloader />
        <ScrollAnimationController />
        {children}
        <MiniCart />
        <CartNotificationToast />
        <StickyFloatingActions />
      </CartProvider>
    </AuthProvider>
  );
}
