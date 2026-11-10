/**
 * EarthGlaze Natural Skincare - Unified Store Client & Cart Management
 */
(function() {
  'use strict';

  const CART_KEY = 'earthglaze_cart';
  const WISHLIST_KEY = 'earthglaze_wishlist';
  const USER_KEY = 'earthglaze_user';
  const TOKEN_KEY = 'earthglaze_token';

  const EarthGlazeStore = {
    // ---------------- Cart Methods ----------------
    getCart: function() {
      try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    saveCart: function(cart) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent('earthglaze:cart-updated', { detail: { cart } }));
    },

    addToCart: function(product, qty = 1) {
      const cart = this.getCart();
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.sale_price || product.price,
          original_price: product.original_price || product.price,
          image: product.image_photo || product.image_open || product.image || product.image_closed,
          quantity: qty,
          weight: product.weight || '100 g',
          category: product.category || 'Soaps'
        });
      }
      this.saveCart(cart);
      this.showToast(`Added ${product.name} to cart`);
    },

    removeFromCart: function(productId) {
      let cart = this.getCart();
      cart = cart.filter(item => item.id !== productId);
      this.saveCart(cart);
    },

    updateQuantity: function(productId, delta) {
      const cart = this.getCart();
      const item = cart.find(i => i.id === productId);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
          return;
        }
        this.saveCart(cart);
      }
    },

    setQuantity: function(productId, qty) {
      const cart = this.getCart();
      const item = cart.find(i => i.id === productId);
      if (item) {
        if (qty <= 0) {
          this.removeFromCart(productId);
        } else {
          item.quantity = qty;
          this.saveCart(cart);
        }
      }
    },

    clearCart: function() {
      localStorage.removeItem(CART_KEY);
      this.updateBadges();
      window.dispatchEvent(new CustomEvent('earthglaze:cart-updated', { detail: { cart: [] } }));
    },

    getCartCount: function() {
      const cart = this.getCart();
      return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },

    getCartSubtotal: function() {
      const cart = this.getCart();
      return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    },

    updateBadges: function() {
      const count = this.getCartCount();
      document.querySelectorAll('.cart-badge-count, #header-cart-count, #cart-drawer-count').forEach(el => {
        el.textContent = count;
        if (count > 0) {
          el.classList.remove('hidden');
          el.style.display = 'flex';
        } else {
          el.style.display = 'none';
        }
      });
    },

    // ---------------- Wishlist Methods ----------------
    getWishlist: function() {
      try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    toggleWishlist: function(productId) {
      let list = this.getWishlist();
      const idx = list.indexOf(productId);
      if (idx > -1) {
        list.splice(idx, 1);
        this.showToast('Removed from Wishlist');
      } else {
        list.push(productId);
        this.showToast('Saved to Wishlist');
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('earthglaze:wishlist-updated', { detail: { list } }));
      return list.includes(productId);
    },

    isInWishlist: function(productId) {
      return this.getWishlist().includes(productId);
    },

    // ---------------- User / Auth Methods ----------------
    getUser: function() {
      try {
        return JSON.parse(localStorage.getItem(USER_KEY)) || null;
      } catch (e) {
        return null;
      }
    },

    setUser: function(user, token) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      if (token) localStorage.setItem(TOKEN_KEY, token);
      window.dispatchEvent(new CustomEvent('earthglaze:user-updated', { detail: { user } }));
    },

    logout: function() {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = 'account.html';
    },

    // ---------------- UI Helpers ----------------
    formatPrice: function(amt) {
      return '₹' + Math.round(amt).toLocaleString('en-IN');
    },

    showToast: function(msg) {
      let toast = document.getElementById('eg-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'eg-toast';
        toast.className = 'fixed bottom-6 right-6 z-50 bg-[#1E3B2B] text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2.5 transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none border border-emerald-700/50';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg><span>${msg}</span>`;
      toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
      }, 2600);
    }
  };

  window.EarthGlazeStore = EarthGlazeStore;

  // Initialize badges on load
  document.addEventListener('DOMContentLoaded', () => {
    EarthGlazeStore.updateBadges();
  });
})();
