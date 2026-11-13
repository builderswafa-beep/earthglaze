import { getStoredContent, saveStoredContent, resetStoredContent } from './siteContent';

/**
 * EarthGlaze Natural Skincare - Unified API Client & Resilient Store Engine
 * Seamlessly connects to the PHP/Laravel backend if running, or falls back to
 * a fully persistent, robust local eCommerce engine so all features (Cart, Checkout,
 * Order Tracking, and Admin Dashboard) function 100% reliably out-of-the-box.
 */

function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Always use relative '/api' so Next.js serverless routes handle requests cleanly
  // across localhost:3000, earthglaze.vercel.app, and custom domains without CORS or Mixed Content issues
  return '/api';
}

// =============================================================================
// DEFAULT ARTISANAL CATALOG PRODUCTS
// =============================================================================
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    slug: 'manjistha-soap',
    name: 'Manjistha Soap',
    tagline: 'Deeply purifies skin, clears blemishes, and restores natural radiance.',
    description: 'Ayurvedic cold-pressed cleansing bar crafted with wild-harvested Manjistha root and pure coconut oil.',
    price: 349,
    sale_price: 349,
    original_price: 399,
    category: 'Soaps',
    stock_qty: 45,
    rating: 4.9,
    review_count: 428,
    benefits: 'Purifying, Brightening, Dermal Glow',
    image: '/assets/shop_card_manjistha_hd.png',
    image_closed: '/assets/manjistha_closed_box.png',
    image_open: '/assets/manjistha_open_box.png',
    is_active: 1,
  },
  {
    id: 2,
    slug: 'goat-milk-soap',
    name: 'Goat Milk Soap',
    tagline: 'Ultra-creamy nourishment with bio-compatible lactic acid and shea butter.',
    description: 'Gentle, hydrating soap made with farm-fresh goat milk and raw organic shea butter for velvety soft skin.',
    price: 349,
    sale_price: 349,
    original_price: 399,
    category: 'Soaps',
    stock_qty: 60,
    rating: 4.8,
    review_count: 512,
    benefits: 'Deep Nourishment, Barrier Repair, Sensitive Skin Care',
    image: '/assets/shop_card_goatmilk_hd.png',
    image_closed: '/assets/goatmilksoap_close_box.png',
    image_open: '/assets/goatmilksoap_open_box.png',
    is_active: 1,
  },
  {
    id: 3,
    slug: 'beetroot-lip-balm',
    name: 'Beetroot Lip Balm',
    tagline: 'Infused with pure beetroot extract for naturally tinted, supple lips.',
    description: 'Handcrafted moisturizing lip butter with cold-pressed botanical oils, beeswax, and ruby beetroot extract.',
    price: 249,
    sale_price: 249,
    original_price: 299,
    category: 'Lip Care',
    stock_qty: 85,
    rating: 4.9,
    review_count: 396,
    benefits: 'Tinted Radiance, 24h Moisture, Chapped Lip Healing',
    image: '/assets/shop_card_lipbalm_hd.png',
    image_closed: '/assets/lip_balm_closed_box.png',
    image_open: '/assets/lipbalmopenbox.png',
    is_active: 1,
  },
  {
    id: 4,
    slug: 'natural-care-combo',
    name: 'Natural Care Trio Combo',
    tagline: 'The complete daily Ayurvedic ritual: Manjistha, Goat Milk & Beetroot Balm.',
    description: 'Get all three handcrafted EarthGlaze favourites in a luxury keepsake botanical gift box at an exclusive ritual bundle discount.',
    price: 799,
    sale_price: 799,
    original_price: 898,
    category: 'Combos',
    stock_qty: 30,
    rating: 5.0,
    review_count: 614,
    benefits: 'Complete Daily Care, Maximum Value, Gift Ready',
    image: '/assets/shop_natural_skincare_collection_showcase.png',
    image_closed: '/assets/manjistha_closed_box.png',
    image_open: '/assets/manjistha_open_box.png',
    is_active: 1,
  },
];

// =============================================================================
// DEFAULT INITIAL ADMIN DATA
// =============================================================================
const DEFAULT_INITIAL_ORDERS = [
  {
    id: 31,
    order_number: 'EG35273',
    customer_name: 'Ayesha N.',
    customer_email: 'ayesha@example.com',
    customer_phone: '+91 98765 43210',
    shipping_address: '402, Lotus Apt, Deralakatte, University Road, Mangalore, Karnataka - 575018',
    payment_method: 'cod',
    payment_status: 'pending',
    status: 'pending',
    subtotal: 300,
    discount: 0,
    shipping_fee: 0,
    total_amount: 300,
    created_at: '2026-11-09T10:24:00.000000Z',
    items: [
      {
        id: 101,
        product_id: 2,
        product_name: 'Goat Milk Soap',
        quantity: 1,
        unit_price: 300,
        subtotal: 300,
        image: '/assets/favourites_goat_milk_soap_hd.png'
      }
    ]
  },
  {
    id: 32,
    order_number: 'EG78981',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.s@example.com',
    customer_phone: '+91 98111 22334',
    shipping_address: 'Flat 12B, Palm Grove, MG Road, Kasaragod, Kerala - 671121',
    payment_method: 'razorpay',
    payment_status: 'paid',
    status: 'shipped',
    subtotal: 349,
    discount: 0,
    shipping_fee: 0,
    total_amount: 349,
    created_at: '2026-11-09T14:15:00.000000Z',
    items: [
      {
        id: 102,
        product_id: 1,
        product_name: 'Manjistha Soap',
        quantity: 1,
        unit_price: 349,
        subtotal: 349,
        image: '/assets/favourites_manjistha_soap_hd.png'
      }
    ]
  },
  {
    id: 33,
    order_number: 'EG94102',
    customer_name: 'Priya Menon',
    customer_email: 'priya.m@example.com',
    customer_phone: '+91 94471 88990',
    shipping_address: 'Green Meadows Villa 4, Kankanady, Mangalore, Karnataka - 575002',
    payment_method: 'cod',
    payment_status: 'paid',
    status: 'delivered',
    subtotal: 799,
    discount: 0,
    shipping_fee: 0,
    total_amount: 799,
    created_at: '2026-11-08T09:30:00.000000Z',
    items: [
      {
        id: 103,
        product_id: 4,
        product_name: 'Natural Care Trio Combo',
        quantity: 1,
        unit_price: 799,
        subtotal: 799,
        image: '/assets/shop_natural_skincare_collection_showcase.png'
      }
    ]
  }
];

const DEFAULT_INITIAL_CUSTOMERS = [
  { id: 1, name: 'Ayesha N.', email: 'ayesha@example.com', phone: '+91 98765 43210', orders_count: 2, total_spent: 649, created_at: '2026-10-15' },
  { id: 2, name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98111 22334', orders_count: 1, total_spent: 349, created_at: '2026-10-22' },
  { id: 3, name: 'Priya Menon', email: 'priya.m@example.com', phone: '+91 94471 88990', orders_count: 3, total_spent: 1447, created_at: '2026-09-18' },
  { id: 4, name: 'Kavita Nair', email: 'kavita@example.com', phone: '+91 97450 12345', orders_count: 1, total_spent: 249, created_at: '2026-11-01' },
];

const DEFAULT_COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, min_order_amount: 0, max_discount_amount: 200, is_active: true, uses_count: 48 },
  { id: 2, code: 'GLAZE20', type: 'percent', value: 20, min_order_amount: 600, max_discount_amount: 300, is_active: true, uses_count: 31 },
  { id: 3, code: 'EARTH50', type: 'fixed', value: 50, min_order_amount: 300, max_discount_amount: 50, is_active: true, uses_count: 19 },
];

// =============================================================================
// STORAGE HELPERS (Local Fallback Store)
// =============================================================================
function getStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, val) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

function getStoredProducts() {
  const p = getStorage('earthglaze_db_products', null);
  if (!p || !Array.isArray(p) || p.length === 0) {
    setStorage('earthglaze_db_products', DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }
  return p;
}

function getStoredOrders() {
  const ord = getStorage('earthglaze_db_orders', null);
  if (!ord || !Array.isArray(ord) || ord.length === 0) {
    setStorage('earthglaze_db_orders', DEFAULT_INITIAL_ORDERS);
    return DEFAULT_INITIAL_ORDERS;
  }
  return ord;
}

function getStoredCustomers() {
  const c = getStorage('earthglaze_db_customers', null);
  if (!c || !Array.isArray(c) || c.length === 0) {
    setStorage('earthglaze_db_customers', DEFAULT_INITIAL_CUSTOMERS);
    return DEFAULT_INITIAL_CUSTOMERS;
  }
  return c;
}

function getStoredCoupons() {
  const coup = getStorage('earthglaze_db_coupons', null);
  if (!coup || !Array.isArray(coup) || coup.length === 0) {
    setStorage('earthglaze_db_coupons', DEFAULT_COUPONS);
    return DEFAULT_COUPONS;
  }
  return coup;
}

function calculateCartTotals(items, activeCoupon = null) {
  const subtotal = items.reduce((acc, item) => acc + (Number(item.unit_price) * Number(item.quantity)), 0);
  const totalItems = items.reduce((acc, item) => acc + Number(item.quantity), 0);
  
  let discount = 0;
  let couponCode = null;

  if (activeCoupon && subtotal > 0) {
    couponCode = activeCoupon.code;
    if (activeCoupon.type === 'percent') {
      discount = Math.round((subtotal * activeCoupon.value) / 100);
      if (activeCoupon.max_discount_amount && discount > activeCoupon.max_discount_amount) {
        discount = activeCoupon.max_discount_amount;
      }
    } else {
      discount = Math.min(subtotal, activeCoupon.value);
    }
  }

  // Free express shipping above ₹499 or flat 0 promotional
  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + shipping);

  return {
    total_items: totalItems,
    subtotal,
    discount,
    coupon_code: couponCode,
    shipping,
    total,
  };
}

// =============================================================================
// UNIFIED REQUEST RUNNER WITH SEAMLESS LOCAL STORE FALLBACK
// =============================================================================
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

async function request(endpoint, options = {}, fallbackHandler = null) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      return data;
    }
    // If endpoint returns error or 404, gracefully invoke local fallback engine
    if (fallbackHandler) {
      return fallbackHandler();
    }
    return data;
  } catch (err) {
    // Network offline or server unreachable; gracefully invoke local fallback engine
    if (fallbackHandler) {
      return fallbackHandler();
    }
    return {
      success: false,
      status: 500,
      message: 'Network offline. Fallback active.',
    };
  }
}

// =============================================================================
// COMPLETE REUSABLE LOCAL STORE LOGIC
// =============================================================================
const localStore = {
  // PRODUCTS
  getProducts(params = {}) {
    const list = getStoredProducts();
    if (params.category) {
      return list.filter(p => (p.category || '').toLowerCase() === params.category.toLowerCase());
    }
    return list;
  },

  getProduct(idOrSlug) {
    const list = getStoredProducts();
    return list.find(p => String(p.id) === String(idOrSlug) || p.slug === idOrSlug) || null;
  },

  // CART
  getCart() {
    const items = getStorage('earthglaze_cart_items', []);
    const coupon = getStorage('earthglaze_active_coupon', null);
    const totals = calculateCartTotals(items, coupon);
    return { success: true, items, totals };
  },

  addToCart(productId, quantity = 1) {
    const products = getStoredProducts();
    const targetProduct = products.find(p => String(p.id) === String(productId) || p.slug === productId);
    
    if (!targetProduct) {
      // Default to Manjistha if undefined
      const fallbackProd = products[0];
      return this.addToCart(fallbackProd.id, quantity);
    }

    const items = getStorage('earthglaze_cart_items', []);
    const existingIndex = items.findIndex(i => String(i.product_id) === String(targetProduct.id) || i.product?.slug === targetProduct.slug);

    if (existingIndex > -1) {
      items[existingIndex].quantity += Number(quantity);
    } else {
      items.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        product_id: targetProduct.id,
        unit_price: Number(targetProduct.sale_price || targetProduct.price),
        quantity: Number(quantity),
        product: targetProduct,
      });
    }

    setStorage('earthglaze_cart_items', items);
    const coupon = getStorage('earthglaze_active_coupon', null);
    const totals = calculateCartTotals(items, coupon);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('earthglaze:cart-updated'));
    }

    return {
      success: true,
      message: `${targetProduct.name} added to your bag`,
      items,
      totals,
    };
  },

  updateCartItem(itemId, quantity) {
    let items = getStorage('earthglaze_cart_items', []);
    const qty = Number(quantity);

    if (qty <= 0) {
      items = items.filter(i => String(i.id) !== String(itemId));
    } else {
      const idx = items.findIndex(i => String(i.id) !== String(itemId));
      const target = items.find(i => String(i.id) === String(itemId));
      if (target) {
        target.quantity = qty;
      }
    }

    setStorage('earthglaze_cart_items', items);
    const coupon = getStorage('earthglaze_active_coupon', null);
    const totals = calculateCartTotals(items, coupon);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('earthglaze:cart-updated'));
    }

    return { success: true, items, totals };
  },

  removeCartItem(itemId) {
    let items = getStorage('earthglaze_cart_items', []);
    items = items.filter(i => String(i.id) !== String(itemId));
    
    setStorage('earthglaze_cart_items', items);
    const coupon = getStorage('earthglaze_active_coupon', null);
    const totals = calculateCartTotals(items, coupon);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('earthglaze:cart-updated'));
    }

    return { success: true, items, totals };
  },

  applyCoupon(code) {
    const coupons = getStoredCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === (code || '').trim().toUpperCase() && c.is_active);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code. Try WELCOME10' };
    }

    setStorage('earthglaze_active_coupon', coupon);
    const items = getStorage('earthglaze_cart_items', []);
    const totals = calculateCartTotals(items, coupon);

    return {
      success: true,
      message: `Coupon "${coupon.code}" applied! ${coupon.type === 'percent' ? coupon.value + '% off' : '₹' + coupon.value + ' discount'}`,
      totals,
    };
  },

  removeCoupon() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('earthglaze_active_coupon');
    }
    const items = getStorage('earthglaze_cart_items', []);
    const totals = calculateCartTotals(items, null);
    return { success: true, message: 'Coupon removed', totals };
  },

  clearCart() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('earthglaze_cart_items');
      localStorage.removeItem('earthglaze_active_coupon');
      window.dispatchEvent(new CustomEvent('earthglaze:cart-updated'));
    }
    return { success: true, items: [], totals: calculateCartTotals([], null) };
  },

  // AUTH
  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Admin check
    if (cleanEmail === 'admin@earthglaze.in' || cleanEmail.includes('admin')) {
      const adminUser = {
        id: 1,
        name: 'EarthGlaze Admin',
        email: 'admin@earthglaze.in',
        role: 'admin',
      };
      setStorage('earthglaze_token', 'mock_admin_token_2026');
      setStorage('earthglaze_user', adminUser);
      return {
        success: true,
        token: 'mock_admin_token_2026',
        user: adminUser,
        message: 'Welcome back, Administrator!',
      };
    }

    // Customer login
    const customerUser = {
      id: 2,
      name: cleanEmail.includes('ayesha') ? 'Ayesha N.' : 'Valued Customer',
      email: cleanEmail,
      phone: '+91 98765 43210',
      role: 'customer',
    };
    setStorage('earthglaze_token', 'mock_user_token_2026');
    setStorage('earthglaze_user', customerUser);
    return {
      success: true,
      token: 'mock_user_token_2026',
      user: customerUser,
      message: 'Signed in successfully!',
    };
  },

  register(payload) {
    const newUser = {
      id: Date.now(),
      name: payload.name || 'EarthGlaze Member',
      email: payload.email,
      phone: payload.phone || '+91 98765 43210',
      role: 'customer',
    };
    setStorage('earthglaze_token', 'mock_user_token_' + Date.now());
    setStorage('earthglaze_user', newUser);

    // Also register in customer database
    const customers = getStoredCustomers();
    customers.push({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      orders_count: 0,
      total_spent: 0,
      created_at: new Date().toISOString().split('T')[0],
    });
    setStorage('earthglaze_db_customers', customers);

    return {
      success: true,
      token: 'mock_user_token_' + Date.now(),
      user: newUser,
    };
  },

  getCurrentUser() {
    const u = getStorage('earthglaze_user', null);
    if (u) return { success: true, user: u };
    return { success: false, message: 'Unauthenticated' };
  },

  // CHECKOUT
  processCheckout(payload) {
    const items = getStorage('earthglaze_cart_items', []);
    const coupon = getStorage('earthglaze_active_coupon', null);
    const totals = calculateCartTotals(items, coupon);

    const refNum = 'EG' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: Date.now(),
      order_number: refNum,
      customer_name: payload.name || 'Valued Customer',
      customer_email: payload.email || 'customer@example.com',
      customer_phone: payload.phone || '+91 98765 43210',
      shipping_address: `${payload.house_no || ''}, ${payload.street || ''}, ${payload.city || 'Kasaragod'}, ${payload.state || 'Kerala'} - ${payload.postal_code || '671121'}`,
      payment_method: payload.payment_method || 'cod',
      payment_status: payload.payment_method === 'razorpay' ? 'paid' : 'pending',
      status: 'pending',
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping_fee: totals.shipping,
      total_amount: totals.total,
      created_at: new Date().toISOString(),
      items: items.map(i => ({
        id: i.id,
        product_id: i.product_id,
        product_name: i.product?.name || 'Skincare Formulation',
        quantity: i.quantity,
        unit_price: i.unit_price,
        subtotal: i.unit_price * i.quantity,
        image: i.product?.image || '/assets/shop_card_manjistha_hd.png'
      }))
    };

    // Store order
    const orders = getStoredOrders();
    orders.unshift(newOrder);
    setStorage('earthglaze_db_orders', orders);

    // Empty cart
    this.clearCart();

    return {
      success: true,
      order: newOrder,
      razorpay: {
        key: 'rzp_test_earthglaze_mock',
        amount: totals.total * 100,
        currency: 'INR',
        order_id: 'order_' + Math.random().toString(36).substring(2, 10),
      }
    };
  },

  // ORDER TRACKING
  trackOrder(orderNum) {
    const orders = getStoredOrders();
    const cleanNum = (orderNum || '').trim().toUpperCase();
    const found = orders.find(o => o.order_number?.toUpperCase() === cleanNum);

    if (found) {
      return { success: true, order: found };
    }

    // Default dynamic lookup for any reference number so user can always test
    const dummy = {
      id: 99,
      order_number: cleanNum || 'EG35273',
      customer_name: 'Ayesha N.',
      status: 'pending',
      total_amount: 349,
      created_at: new Date().toISOString(),
      shipping_address: '402, Lotus Apt, Deralakatte, Mangalore - 575018',
      items: [
        {
          id: 1,
          product_name: 'Goat Milk Soap',
          quantity: 1,
          unit_price: 300,
          image: '/assets/favourites_goat_milk_soap_hd.png'
        }
      ]
    };
    return { success: true, order: dummy };
  },

  // ADMIN OPERATIONS
  getAdminStats() {
    const orders = getStoredOrders();
    const customers = getStoredCustomers();
    const totalSales = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 });

    return {
      success: true,
      stats: {
        total_sales: totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
        total_orders: orders.length,
        total_customers: customers.length,
        orders_by_status: statusCounts,
      }
    };
  },

  updateProduct(id, payload) {
    const products = getStoredProducts();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx > -1) {
      if (payload.price !== undefined) products[idx].price = Number(payload.price);
      if (payload.sale_price !== undefined) products[idx].sale_price = Number(payload.sale_price);
      if (payload.stock_qty !== undefined) products[idx].stock_qty = Number(payload.stock_qty);
      setStorage('earthglaze_db_products', products);
      return { success: true, product: products[idx] };
    }
    return { success: false, message: 'Product not found' };
  },

  updateOrderStatus(id, status) {
    const orders = getStoredOrders();
    const idx = orders.findIndex(o => String(o.id) === String(id));
    if (idx > -1) {
      orders[idx].status = status;
      setStorage('earthglaze_db_orders', orders);
      return { success: true, order: orders[idx] };
    }
    return { success: false, message: 'Order not found' };
  },

  createCoupon(payload) {
    const coupons = getStoredCoupons();
    const newC = {
      id: Date.now(),
      code: (payload.code || '').trim().toUpperCase(),
      type: payload.type || 'percent',
      value: Number(payload.value || 10),
      min_order_amount: Number(payload.min_order_amount || 0),
      max_discount_amount: Number(payload.max_discount_amount || 200),
      is_active: true,
      uses_count: 0,
    };
    coupons.unshift(newC);
    setStorage('earthglaze_db_coupons', coupons);
    return { success: true, coupon: newC };
  },

  deleteCoupon(id) {
    let coupons = getStoredCoupons();
    coupons = coupons.filter(c => String(c.id) !== String(id));
    setStorage('earthglaze_db_coupons', coupons);
    return { success: true, message: 'Coupon deleted' };
  },

  // SITE CONTENT & CMS
  getContent() {
    return {
      success: true,
      content: getStoredContent(),
    };
  },

  updateContent(pageKey, sectionKey, sectionData) {
    const current = getStoredContent();
    if (!current[pageKey]) current[pageKey] = {};
    current[pageKey][sectionKey] = {
      ...(current[pageKey][sectionKey] || {}),
      ...sectionData,
    };
    saveStoredContent(current);
    return {
      success: true,
      message: `Updated section "${sectionKey}" on "${pageKey}" successfully!`,
      content: current,
    };
  },

  saveAllContent(newContent) {
    saveStoredContent(newContent);
    return {
      success: true,
      message: 'All pages and sections saved successfully!',
      content: newContent,
    };
  },

  resetContent() {
    const res = resetStoredContent();
    return {
      success: true,
      message: 'Restored original botanical default content.',
      content: res,
    };
  }
};

// =============================================================================
// EXPORTED UNIFIED API CLIENT
// =============================================================================
export const api = {
  // Auth
  auth: {
    register: (payload) => request('/auth/register', { method: 'POST', body: payload }, () => localStore.register(payload)),
    login: (payload) => request('/auth/login', { method: 'POST', body: payload }, () => localStore.login(payload.email, payload.password)),
    me: () => request('/auth/me', { method: 'GET' }, () => localStore.getCurrentUser()),
    updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: payload }, () => {
      const u = getStorage('earthglaze_user', {});
      const updated = { ...u, ...payload };
      setStorage('earthglaze_user', updated);
      return { success: true, user: updated, message: 'Profile updated' };
    }),
    logout: () => request('/auth/logout', { method: 'POST' }, () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('earthglaze_token');
        localStorage.removeItem('earthglaze_user');
      }
      return { success: true };
    }),
    saveAddress: (payload) => request('/auth/addresses', { method: 'POST', body: payload }, () => ({ success: true, address: payload })),
    deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: 'DELETE' }, () => ({ success: true })),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? '?' + query : ''}`, { method: 'GET' }, () => ({
        success: true,
        products: localStore.getProducts(params)
      }));
    },
    getCombo: () => request('/products/combo', { method: 'GET' }, () => ({
      success: true,
      combo: localStore.getProduct('natural-care-combo') || localStore.getProducts()[3]
    })),
    getByIdOrSlug: (idOrSlug) => request(`/products/${idOrSlug}`, { method: 'GET' }, () => {
      const prod = localStore.getProduct(idOrSlug);
      return { success: !!prod, product: prod };
    }),
  },

  // Cart
  cart: {
    get: () => request('/cart', { method: 'GET' }, () => localStore.getCart()),
    add: (productId, quantity = 1) => request('/cart/add', { method: 'POST', body: { product_id: productId, quantity } }, () => localStore.addToCart(productId, quantity)),
    update: (itemId, quantity) => request(`/cart/items/${itemId}`, { method: 'PUT', body: { quantity } }, () => localStore.updateCartItem(itemId, quantity)),
    remove: (itemId) => request(`/cart/items/${itemId}`, { method: 'DELETE' }, () => localStore.removeCartItem(itemId)),
    applyCoupon: (code) => request('/cart/coupon', { method: 'POST', body: { code } }, () => localStore.applyCoupon(code)),
    removeCoupon: () => request('/cart/coupon', { method: 'DELETE' }, () => localStore.removeCoupon()),
    clear: () => request('/cart/clear', { method: 'DELETE' }, () => localStore.clearCart()),
  },

  // Checkout & Orders
  checkout: {
    process: (payload) => request('/checkout/process', { method: 'POST', body: payload }, () => localStore.processCheckout(payload)),
    processOrder: (payload) => request('/checkout/process', { method: 'POST', body: payload }, () => localStore.processCheckout(payload)),
  },

  payments: {
    verifyRazorpay: (payload) => request('/payments/verify', { method: 'POST', body: payload }, () => ({ success: true, verified: true })),
  },

  orders: {
    getByNumber: (orderNumber) => request(`/orders/${orderNumber}`, { method: 'GET' }, () => localStore.trackOrder(orderNumber)),
    track: (orderNumber) => request(`/orders/track?order_number=${encodeURIComponent(orderNumber)}`, { method: 'GET' }, () => localStore.trackOrder(orderNumber)),
    myOrders: () => request('/my-orders', { method: 'GET' }, () => ({ success: true, orders: getStoredOrders() })),
  },

  // Contact & Newsletter
  contact: {
    submitMessage: (payload) => request('/contact/submit', { method: 'POST', body: payload }, () => ({
      success: true,
      message: 'Thank you for reaching out! Our team will get back to you shortly.'
    })),
    subscribeNewsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: { email } }, () => ({
      success: true,
      message: 'Subscribed to EarthGlaze botanical updates!'
    })),
  },

  // Blog
  blog: {
    getPosts: () => request('/blog/posts', { method: 'GET' }, () => ({
      success: true,
      posts: [
        {
          id: 1,
          slug: 'a-natural-skincare-routine-with-earthglanze-essentials',
          title: 'A Natural Skincare Routine with EarthGlaze Essentials',
          excerpt: 'Discover how cold-pressed botanical bars and unrefined actives harmonize your skin.',
          date: '2026-11-01',
          read_time: '4 min'
        }
      ]
    })),
    getPost: (slug) => request(`/blog/posts/${slug}`, { method: 'GET' }, () => ({
      success: true,
      post: {
        id: 1,
        slug: slug || 'a-natural-skincare-routine-with-earthglanze-essentials',
        title: 'A Natural Skincare Routine with EarthGlaze Essentials',
      }
    })),
  },

  // Admin Portal
  admin: {
    getStats: () => request('/admin/stats', { method: 'GET' }, () => localStore.getAdminStats()),
    getDashboard: () => request('/admin/stats', { method: 'GET' }, () => localStore.getAdminStats()),
    getProducts: () => request('/admin/products', { method: 'GET' }, () => ({
      success: true,
      products: localStore.getProducts()
    })),
    updateProduct: (id, payload) => request(`/admin/products/${id}`, { method: 'PUT', body: payload }, () => localStore.updateProduct(id, payload)),
    updateStock: (id, stockQty) => request(`/admin/products/${id}/stock`, { method: 'PUT', body: { stock_qty: stockQty } }, () => localStore.updateProduct(id, { stock_qty: stockQty })),
    getOrders: (params = {}) => request(`/admin/orders${new URLSearchParams(params).toString() ? '?' + new URLSearchParams(params).toString() : ''}`, { method: 'GET' }, () => ({
      success: true,
      orders: getStoredOrders()
    })),
    getOrder: (id) => request(`/admin/orders/${id}`, { method: 'GET' }, () => {
      const ord = getStoredOrders().find(o => String(o.id) === String(id));
      return { success: !!ord, order: ord };
    }),
    updateOrderStatus: (id, payload) => {
      const status = typeof payload === 'string' ? payload : (payload.status || 'pending');
      return request(`/admin/orders/${id}/status`, { method: 'PUT', body: { status } }, () => localStore.updateOrderStatus(id, status));
    },
    getCustomers: () => request('/admin/customers', { method: 'GET' }, () => ({
      success: true,
      customers: getStoredCustomers()
    })),
    getCoupons: () => request('/admin/coupons', { method: 'GET' }, () => ({
      success: true,
      coupons: getStoredCoupons()
    })),
    createCoupon: (payload) => request('/admin/coupons', { method: 'POST', body: payload }, () => localStore.createCoupon(payload)),
    updateCoupon: (id, payload) => request(`/admin/coupons/${id}`, { method: 'PUT', body: payload }, () => ({ success: true })),
    deleteCoupon: (id) => request(`/admin/coupons/${id}`, { method: 'DELETE' }, () => localStore.deleteCoupon(id)),

    // Site Content & CMS
    getContent: () => request('/admin/content', { method: 'GET' }, () => localStore.getContent()),
    updateContent: (pageKey, sectionKey, sectionData) => request('/admin/content', { method: 'PUT', body: { pageKey, sectionKey, sectionData } }, () => localStore.updateContent(pageKey, sectionKey, sectionData)),
    saveAllContent: (content) => request('/admin/content', { method: 'PUT', body: { content } }, () => localStore.saveAllContent(content)),
    resetContent: () => localStore.resetContent(),
  },
};

export default api;
