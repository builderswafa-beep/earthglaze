import { NextResponse } from 'next/server';
import { DEFAULT_SITE_CONTENT } from '../../../../lib/siteContent';

// In-memory runtime cache for serverless instance
let serverContentCache = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));

export async function GET() {
  return NextResponse.json({
    success: true,
    content: serverContentCache,
  });
}

export async function PUT(request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.content && typeof body.content === 'object') {
      serverContentCache = {
        ...serverContentCache,
        ...body.content,
      };
      return NextResponse.json({
        success: true,
        message: 'Site content updated successfully across all pages and sections!',
        content: serverContentCache,
      });
    }

    if (body.pageKey && body.sectionKey && body.sectionData) {
      if (!serverContentCache[body.pageKey]) {
        serverContentCache[body.pageKey] = {};
      }
      serverContentCache[body.pageKey][body.sectionKey] = {
        ...(serverContentCache[body.pageKey][body.sectionKey] || {}),
        ...body.sectionData,
      };

      return NextResponse.json({
        success: true,
        message: `Section "${body.sectionKey}" on page "${body.pageKey}" updated successfully!`,
        content: serverContentCache,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid payload: provide content or pageKey, sectionKey, and sectionData.' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update site content.' },
      { status: 500 }
    );
  }
}
