import { NextResponse } from 'next/server';

const CUSTOMERS = [
  { id: 1, name: 'Ayesha N.', email: 'ayesha@example.com', phone: '+91 98765 43210', orders_count: 3, total_spent: 1047, created_at: '2026-10-14' },
  { id: 2, name: 'Priya Sharma', email: 'priya.s@example.com', phone: '+91 98451 23456', orders_count: 5, total_spent: 2490, created_at: '2026-09-20' },
  { id: 3, name: 'Kavita Menon', email: 'kavita.m@example.com', phone: '+91 94471 98765', orders_count: 2, total_spent: 898, created_at: '2026-11-02' },
  { id: 4, name: 'Rahul Varma', email: 'rahul.v@example.com', phone: '+91 97455 11223', orders_count: 1, total_spent: 799, created_at: '2026-11-10' },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    customers: CUSTOMERS,
  });
}
