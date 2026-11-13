import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    stats: {
      total_sales: '1,24,850.00',
      total_orders: 348,
      total_customers: 286,
      orders_by_status: {
        pending: 4,
        processing: 6,
        shipped: 18,
        delivered: 318,
        cancelled: 2,
      },
    },
  });
}
