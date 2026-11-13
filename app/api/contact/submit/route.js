import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Our botanical team will respond to your query shortly.',
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Submission error' }, { status: 400 });
  }
}
