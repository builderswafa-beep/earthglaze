import { NextResponse } from 'next/server';

export async function GET(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (token.includes('admin')) {
    return NextResponse.json({
      success: true,
      user: {
        id: 1,
        name: 'EarthGlaze Admin',
        email: 'admin@earthglaze.in',
        role: 'admin',
      },
    });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: 2,
      name: 'Valued Customer',
      email: 'customer@earthglaze.in',
      phone: '+91 98765 43210',
      role: 'customer',
    },
  });
}
