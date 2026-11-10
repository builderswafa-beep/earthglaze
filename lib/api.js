/**
 * EarthGlaze Natural Skincare - Unified API Client
 * Connects React frontend directly to the PHP Laravel MySQL backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('earthglaze_cart_session');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('earthglaze_cart_session', sid);
  }
  return sid;
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('earthglaze_token');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const token = getToken();
  const sessionId = getSessionId();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Cart-Session': sessionId,
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      return { success: false, status: res.status, message: errorMsg, errors: data.errors || null };
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    return {
      success: false,
      status: 500,
      message: 'Unable to communicate with EarthGlaze server. Please ensure the backend is running.',
    };
  }
}

export const api = {
  // Auth
  auth: {
    register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
    login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
    me: () => request('/auth/me', { method: 'GET' }),
    updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: payload }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    saveAddress: (payload) => request('/auth/addresses', { method: 'POST', body: payload }),
    deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: 'DELETE' }),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? '?' + query : ''}`, { method: 'GET' });
    },
    getCombo: () => request('/products/combo', { method: 'GET' }),
    getByIdOrSlug: (idOrSlug) => request(`/products/${idOrSlug}`, { method: 'GET' }),
  },

  // Cart
  cart: {
    get: () => request('/cart', { method: 'GET' }),
    add: (productId, quantity = 1) => request('/cart/add', { method: 'POST', body: { product_id: productId, quantity } }),
    update: (itemId, quantity) => request(`/cart/items/${itemId}`, { method: 'PUT', body: { quantity } }),
    remove: (itemId) => request(`/cart/items/${itemId}`, { method: 'DELETE' }),
    applyCoupon: (code) => request('/cart/coupon', { method: 'POST', body: { code } }),
    removeCoupon: () => request('/cart/coupon', { method: 'DELETE' }),
    clear: () => request('/cart/clear', { method: 'DELETE' }),
  },

  // Checkout & Orders
  checkout: {
    process: (payload) => request('/checkout/process', { method: 'POST', body: payload }),
    processOrder: (payload) => request('/checkout/process', { method: 'POST', body: payload }),
  },

  payments: {
    verifyRazorpay: (payload) => request('/payments/verify', { method: 'POST', body: payload }),
  },

  orders: {
    getByNumber: (orderNumber) => request(`/orders/${orderNumber}`, { method: 'GET' }),
    track: (orderNumber) => request(`/orders/track?order_number=${encodeURIComponent(orderNumber)}`, { method: 'GET' }),
    myOrders: () => request('/my-orders', { method: 'GET' }),
  },

  // Contact & Newsletter
  contact: {
    submitMessage: (payload) => request('/contact/submit', { method: 'POST', body: payload }),
    subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: { email } }),
  },

  // Blog
  blog: {
    getPosts: () => request('/blog/posts', { method: 'GET' }),
    getPost: (slug) => request(`/blog/posts/${slug}`, { method: 'GET' }),
  },

  // Admin Portal
  admin: {
    getStats: () => request('/admin/stats', { method: 'GET' }),
    getDashboard: () => request('/admin/stats', { method: 'GET' }),
    getProducts: () => request('/admin/products', { method: 'GET' }),
    updateProduct: (id, payload) => request(`/admin/products/${id}`, { method: 'PUT', body: payload }),
    updateStock: (id, stockQty) => request(`/admin/products/${id}/stock`, { method: 'PUT', body: { stock_qty: stockQty } }),
    getOrders: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/admin/orders${q ? '?' + q : ''}`, { method: 'GET' });
    },
    getOrder: (id) => request(`/admin/orders/${id}`, { method: 'GET' }),
    updateOrderStatus: (id, payload) => {
      const body = typeof payload === 'string' ? { status: payload } : payload;
      return request(`/admin/orders/${id}/status`, { method: 'PUT', body });
    },
    getCustomers: () => request('/admin/customers', { method: 'GET' }),
    getCoupons: () => request('/admin/coupons', { method: 'GET' }),
    createCoupon: (payload) => request('/admin/coupons', { method: 'POST', body: payload }),
    updateCoupon: (id, payload) => request(`/admin/coupons/${id}`, { method: 'PUT', body: payload }),
    deleteCoupon: (id) => request(`/admin/coupons/${id}`, { method: 'DELETE' }),
  },
};

export default api;
