'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({
    total_items: 0,
    subtotal: 0,
    discount: 0,
    coupon_code: null,
    shipping: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [couponMessage, setCouponMessage] = useState(null);

  // UI / Animation & Feedback States
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [toast, setToast] = useState({ open: false, product: null, message: '' });
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);

  const syncLegacyStorage = (cartItems) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('earthglaze_cart', JSON.stringify(cartItems));
        window.dispatchEvent(new CustomEvent('earthglaze:cart-updated'));
      } catch (e) {
        // ignore
      }
    }
  };

  const triggerCartBounce = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 800);
  };

  const showToastNotification = (product, message = 'Added to your botanical ritual') => {
    setToast({
      open: true,
      product,
      message,
      timestamp: Date.now(),
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const openMiniCart = () => setMiniCartOpen(true);
  const closeMiniCart = () => setMiniCartOpen(false);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.cart.get();
      if (res.success) {
        setItems(res.items || []);
        if (res.totals) {
          setTotals(res.totals);
        }
        syncLegacyStorage(res.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Enhanced Add to Cart with feedback, debouncing, and optional drawer trigger
  const addToCart = async (productId, quantity = 1, options = {}) => {
    const { openDrawer = false, showToast = true, productInfo = null } = options;

    // Prevent accidental duplicate rapid-fire clicks
    if (addingProductId === productId) {
      return { success: false, message: 'Processing your request...' };
    }

    setAddingProductId(productId);

    try {
      const res = await api.cart.add(productId, quantity);
      if (res.success) {
        const newItems = res.items || [];
        setItems(newItems);
        if (res.totals) {
          setTotals(res.totals);
        }
        syncLegacyStorage(newItems);

        // Find product for toast display
        const addedItem = newItems.find((i) => i.product_id === Number(productId) || i.product?.id === Number(productId));
        const prod = productInfo || addedItem?.product || { name: 'Artisan Skincare Formulation' };

        triggerCartBounce();

        if (showToast) {
          showToastNotification(prod, res.message || `${prod.name || 'Item'} added to bag`);
        }

        if (openDrawer) {
          openMiniCart();
        }

        return { success: true, message: res.message, items: newItems };
      }
      return { success: false, message: res.message || 'Could not add to cart.' };
    } catch (e) {
      return { success: false, message: 'Server communication error.' };
    } finally {
      setAddingProductId(null);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setUpdatingItemId(itemId);
    try {
      const res = await api.cart.update(itemId, quantity);
      if (res.success) {
        setItems(res.items || []);
        if (res.totals) {
          setTotals(res.totals);
        }
        syncLegacyStorage(res.items || []);
        triggerCartBounce();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (e) {
      return { success: false, message: 'Update error.' };
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeFromCart = async (itemId) => {
    setUpdatingItemId(itemId);
    try {
      const res = await api.cart.remove(itemId);
      if (res.success) {
        setItems(res.items || []);
        if (res.totals) {
          setTotals(res.totals);
        }
        syncLegacyStorage(res.items || []);
        triggerCartBounce();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (e) {
      return { success: false, message: 'Removal error.' };
    } finally {
      setUpdatingItemId(null);
    }
  };

  const applyCoupon = async (code) => {
    setCouponMessage(null);
    try {
      const res = await api.cart.applyCoupon(code);
      if (res.success) {
        if (res.totals) {
          setTotals(res.totals);
        }
        setCouponMessage({ type: 'success', text: res.message });
        return { success: true, message: res.message };
      }
      setCouponMessage({ type: 'error', text: res.message });
      return { success: false, message: res.message };
    } catch (e) {
      setCouponMessage({ type: 'error', text: 'Failed to apply coupon.' });
      return { success: false, message: 'Coupon error.' };
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await api.cart.removeCoupon();
      if (res.success && res.totals) {
        setTotals(res.totals);
        setCouponMessage(null);
      }
    } catch (e) {
      // ignore
    }
  };

  const clearCart = async () => {
    try {
      await api.cart.clear();
      setItems([]);
      setTotals({
        total_items: 0,
        subtotal: 0,
        discount: 0,
        coupon_code: null,
        shipping: 0,
        total: 0,
      });
      syncLegacyStorage([]);
    } catch (e) {
      // ignore
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totals,
        cartCount: totals.total_items,
        loading,
        couponMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
        refreshCart: fetchCart,
        // UI Extensions
        miniCartOpen,
        openMiniCart,
        closeMiniCart,
        cartBounce,
        toast,
        closeToast,
        updatingItemId,
        addingProductId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
