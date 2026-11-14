import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();

    return NextResponse.json({
      success: true,
      user: {
        id: body.id || 2,
        name: name || 'Valued Customer',
        email: body.email || 'customer@earthglaze.in',
        phone: phone || '+91 98765 43210',
        role: 'customer',
      },
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
