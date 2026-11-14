import { NextResponse } from 'next/server';

const CUSTOMERS = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    customers: CUSTOMERS,
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newCust = {
      id: Date.now(),
      name: body.name || 'New Customer',
      email: (body.email || '').trim().toLowerCase(),
      phone: body.phone || '',
      role: body.role || 'customer',
      orders_count: 0,
      total_spent: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    CUSTOMERS.unshift(newCust);
    return NextResponse.json({ success: true, customer: newCust });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Creation failed' }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, name, email, phone, role } = body;
    const idx = CUSTOMERS.findIndex(c => String(c.id) === String(id));
    if (idx > -1) {
      if (name) CUSTOMERS[idx].name = name;
      if (email) CUSTOMERS[idx].email = email;
      if (phone !== undefined) CUSTOMERS[idx].phone = phone;
      if (role) CUSTOMERS[idx].role = role;
      return NextResponse.json({ success: true, customer: CUSTOMERS[idx] });
    }
    return NextResponse.json({ success: true, message: 'Customer updated' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idx = CUSTOMERS.findIndex(c => String(c.id) === String(id));
    if (idx > -1) {
      CUSTOMERS.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Delete failed' }, { status: 400 });
  }
}
