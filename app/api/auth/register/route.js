import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';
    const phone = (body.phone || '').trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Please provide your full name.' },
        { status: 400 }
      );
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone || '+91 98765 43210',
      role: email.includes('admin') ? 'admin' : 'customer',
    };

    return NextResponse.json({
      success: true,
      token: 'earthglaze_user_token_' + Date.now(),
      user: newUser,
      message: 'Account created successfully! Welcome to EarthGlaze.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process registration request.' },
      { status: 500 }
    );
  }
}
