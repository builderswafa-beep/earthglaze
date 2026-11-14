import { NextResponse } from 'next/server';

const ORDERS = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: ORDERS,
  });
}

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, status, tracking_number, courier, shipping_address } = body;
    const idx = ORDERS.findIndex(o => String(o.id) === String(id));
    if (idx > -1) {
      if (status) ORDERS[idx].status = status;
      if (tracking_number) ORDERS[idx].tracking_number = tracking_number;
      if (courier) ORDERS[idx].courier = courier;
      if (shipping_address) ORDERS[idx].shipping_address = shipping_address;
      return NextResponse.json({ success: true, order: ORDERS[idx] });
    }
    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idx = ORDERS.findIndex(o => String(o.id) === String(id));
    if (idx > -1) {
      ORDERS.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}
