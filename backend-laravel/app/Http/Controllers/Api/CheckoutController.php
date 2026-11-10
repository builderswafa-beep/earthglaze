<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\RazorpayService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    protected CartService $cartService;
    protected OrderService $orderService;
    protected RazorpayService $razorpayService;

    public function __construct(CartService $cartService, OrderService $orderService, RazorpayService $razorpayService)
    {
        $this->cartService = $cartService;
        $this->orderService = $orderService;
        $this->razorpayService = $razorpayService;
    }

    public function processOrder(Request $request): JsonResponse
    {
        if (!$request->filled('street') && $request->filled('address')) {
            $request->merge(['street' => $request->address]);
        }
        if (!$request->filled('pincode') && $request->filled('postal_code')) {
            $request->merge(['pincode' => $request->postal_code]);
        }
        if (!$request->filled('house_number') && $request->filled('house_no')) {
            $request->merge(['house_number' => $request->house_no]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'house_number' => 'nullable|string|max:100',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'country' => 'nullable|string|max:100',
            'payment_method' => 'required|in:razorpay,cod,upi,card,netbanking',
            'notes' => 'nullable|string|max:500',
        ]);

        $sessionId = $request->header('X-Cart-Session') ?: $request->input('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        try {
            $order = $this->orderService->createOrderFromCart($cart, $validated, $validated['payment_method']);

            // If Cash On Delivery
            if ($validated['payment_method'] === 'cod') {
                return response()->json([
                    'success' => true,
                    'order_number' => $order->order_number,
                    'order' => $order,
                    'payment_type' => 'cod',
                    'message' => 'Order placed successfully with Cash on Delivery.',
                ]);
            }

            // Online Payment via Razorpay
            $razorpayOrder = $this->razorpayService->createOrder(
                $order->total_amount,
                $order->order_number,
                [
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                ]
            );

            // Save Razorpay order id to payment record
            $order->payment()->update(['razorpay_order_id' => $razorpayOrder['id']]);

            return response()->json([
                'success' => true,
                'order_number' => $order->order_number,
                'order' => $order,
                'payment_type' => 'razorpay',
                'razorpay' => [
                    'key' => $this->razorpayService->getKey(),
                    'order_id' => $razorpayOrder['id'],
                    'amount' => $razorpayOrder['amount'],
                    'currency' => 'INR',
                    'name' => 'EarthGlaze Natural Skincare',
                    'description' => "Order #{$order->order_number}",
                    'prefill' => [
                        'name' => $order->customer_name,
                        'email' => $order->customer_email,
                        'contact' => $order->customer_phone,
                    ],
                    'theme' => [
                        'color' => '#1E3B2B',
                    ]
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
