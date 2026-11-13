import { NextResponse } from 'next/server';

const PRODUCTS = [
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  if (category) {
    const filtered = PRODUCTS.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    return NextResponse.json({ success: true, products: filtered });
  }
  return NextResponse.json({ success: true, products: PRODUCTS });
}
