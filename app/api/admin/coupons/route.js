import { NextResponse } from 'next/server';

const COUPONS = [];

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
    COUPONS.unshift(newCoupon);
    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid coupon data' }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, code, type, value, min_order_amount, max_discount_amount, is_active } = body;
    const idx = COUPONS.findIndex(c => String(c.id) === String(id));
    if (idx > -1) {
      if (code) COUPONS[idx].code = code.trim().toUpperCase();
      if (type) COUPONS[idx].type = type;
      if (value !== undefined) COUPONS[idx].value = Number(value);
      if (min_order_amount !== undefined) COUPONS[idx].min_order_amount = Number(min_order_amount);
      if (max_discount_amount !== undefined) COUPONS[idx].max_discount_amount = Number(max_discount_amount);
      if (is_active !== undefined) COUPONS[idx].is_active = Boolean(is_active);
      return NextResponse.json({ success: true, coupon: COUPONS[idx] });
    }
    return NextResponse.json({ success: true, message: 'Coupon updated' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idx = COUPONS.findIndex(c => String(c.id) === String(id));
    if (idx > -1) {
      COUPONS.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}
