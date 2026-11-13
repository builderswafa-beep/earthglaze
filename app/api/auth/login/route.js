import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    // Admin authentication
    if (email === 'admin@earthglaze.in' || email.includes('admin')) {
      return NextResponse.json({
        success: true,
        token: 'earthglaze_admin_token_' + Date.now(),
        user: {
          id: 1,
          name: 'EarthGlaze Admin',
          email: 'admin@earthglaze.in',
          role: 'admin',
        },
        message: 'Welcome back, Administrator!',
      });
    }

    // Customer authentication
    return NextResponse.json({
      success: true,
      token: 'earthglaze_user_token_' + Date.now(),
      user: {
        id: 2,
        name: email.split('@')[0] || 'Valued Customer',
        email: email,
        phone: '+91 98765 43210',
        role: 'customer',
      },
      message: 'Signed in successfully!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request payload.' },
      { status: 400 }
    );
  }
}
