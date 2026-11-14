import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    stats: {
      total_sales: '0.00',
      total_orders: 0,
      total_customers: 0,
      orders_by_status: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
    },
  });
}
