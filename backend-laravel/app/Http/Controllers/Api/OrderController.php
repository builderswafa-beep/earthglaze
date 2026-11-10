<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::with(['items', 'tracking', 'payment'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    public function track(Request $request, ?string $orderNumber = null): JsonResponse
    {
        if ($orderNumber) {
            $request->merge(['order_number' => $orderNumber]);
        }

        $request->validate([
            'order_number' => 'required|string',
        ]);

        $order = Order::with(['items', 'tracking'])
            ->where('order_number', trim($request->order_number))
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "Order #{$request->order_number} not found. Please verify your order ID."
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
            'timeline' => $order->tracking,
        ]);
    }

    public function userOrders(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()
            ->with(['items', 'tracking'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }
}
