<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderTracking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['items', 'tracking', 'payment'])->latest();

        if ($request->filled('status')) {
            $query->where('order_status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('order_number', 'like', "%{$s}%")
                  ->orWhere('customer_name', 'like', "%{$s}%")
                  ->orWhere('customer_email', 'like', "%{$s}%")
                  ->orWhere('customer_phone', 'like', "%{$s}%");
            });
        }

        return response()->json([
            'success' => true,
            'orders' => $query->get(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with(['items', 'tracking', 'payment', 'user'])->findOrFail($id);
        return response()->json(['success' => true, 'order' => $order]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        if (!$request->filled('order_status') && $request->filled('status')) {
            $request->merge(['order_status' => $request->status]);
        }

        $request->validate([
            'order_status' => 'required|in:pending,confirmed,processing,shipped,out_for_delivery,delivered,cancelled,refunded',
            'tracking_number' => 'nullable|string',
            'status_title' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);
        $order->order_status = $request->order_status;
        if ($request->filled('tracking_number')) {
            $order->tracking_number = $request->tracking_number;
        }
        $order->save();

        // Create tracking milestone
        $stageTitles = [
            'confirmed' => 'Order Confirmed',
            'processing' => 'Handcrafted & Packed',
            'shipped' => 'Dispatched via Courier',
            'out_for_delivery' => 'Out for Delivery',
            'delivered' => 'Package Delivered',
            'cancelled' => 'Order Cancelled',
        ];

        OrderTracking::create([
            'order_id' => $order->id,
            'stage' => $request->order_status,
            'status_title' => $request->status_title ?: ($stageTitles[$request->order_status] ?? ucfirst($request->order_status)),
            'description' => $request->description ?: "Order status updated to {$request->order_status}.",
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Order #{$order->order_number} status updated to {$order->order_status}.",
            'order' => $order->load(['items', 'tracking']),
        ]);
    }
}
