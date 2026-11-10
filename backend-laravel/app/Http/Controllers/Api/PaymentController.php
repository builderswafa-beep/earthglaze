<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\RazorpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected RazorpayService $razorpayService;
    protected OrderService $orderService;

    public function __construct(RazorpayService $razorpayService, OrderService $orderService)
    {
        $this->razorpayService = $razorpayService;
        $this->orderService = $orderService;
    }

    public function verifyRazorpay(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_number' => 'required|string|exists:orders,order_number',
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $order = Order::where('order_number', $validated['order_number'])->firstOrFail();

        $verified = $this->razorpayService->verifySignature(
            $validated['razorpay_order_id'],
            $validated['razorpay_payment_id'],
            $validated['razorpay_signature']
        );

        if (!$verified) {
            return response()->json([
                'success' => false,
                'message' => 'Payment signature verification failed.',
            ], 400);
        }

        $order = $this->orderService->markOrderPaid(
            $order,
            $validated['razorpay_payment_id'],
            $validated['razorpay_signature'],
            $request->all()
        );

        return response()->json([
            'success' => true,
            'message' => 'Payment verified & order confirmed successfully!',
            'order' => $order,
        ]);
    }
}
