import { NextResponse } from 'next/server';

const COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, min_order_amount: 0, max_discount_amount: 150, is_active: true, uses_count: 84 },
  { id: 2, code: 'GLAZE20', type: 'percent', value: 20, min_order_amount: 699, max_discount_amount: 250, is_active: true, uses_count: 52 },
  { id: 3, code: 'EARTH50', type: 'fixed', value: 50, min_order_amount: 499, max_discount_amount: 50, is_active: true, uses_count: 119 },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    coupons: COUPONS,
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newCoupon = {
      id: Date.now(),
      code: (body.code || '').trim().toUpperCase(),
      type: body.type || 'percent',
      value: Number(body.value || 10),
      min_order_amount: Number(body.min_order_amount || 0),
      max_discount_amount: Number(body.max_discount_amount || 200),
      is_active: true,
      uses_count: 0,
    };
    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid coupon data' }, { status: 400 });
  }
}
