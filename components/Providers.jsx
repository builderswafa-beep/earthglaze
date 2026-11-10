'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import MiniCart from './MiniCart';
import CartNotificationToast from './CartNotificationToast';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <MiniCart />
        <CartNotificationToast />
      </CartProvider>
    </AuthProvider>
  );
}
