<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function getStats(): JsonResponse
    {
        $totalSales = (float) Order::where('payment_status', 'paid')->sum('total_amount');
        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalProducts = Product::count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $processingOrders = Order::where('order_status', 'processing')->count();
        $lowStockProducts = Product::where('stock_qty', '<', 15)->get();

        $recentOrders = Order::with(['items'])->latest()->take(6)->get();

        $messages = ContactMessage::where('is_resolved', false)->latest()->take(5)->get();

        $metrics = [
            'total_sales' => round($totalSales, 2),
            'total_orders' => $totalOrders,
            'total_customers' => $totalCustomers,
            'total_products' => $totalProducts,
            'pending_orders' => $pendingOrders,
            'processing_orders' => $processingOrders,
            'low_stock_count' => $lowStockProducts->count(),
        ];

        return response()->json([
            'success' => true,
            'stats' => $metrics,
            'metrics' => $metrics,
            'low_stock_products' => $lowStockProducts,
            'recent_orders' => $recentOrders,
            'recent_messages' => $messages,
        ]);
    }
}
