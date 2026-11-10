<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrderFromCart(Cart $cart, array $customerData, string $paymentMethod): Order
    {
        $totals = $cart->calculateTotals();

        if (empty($totals['total_items']) || $totals['total_items'] === 0) {
            throw new Exception("Cannot checkout with an empty shopping cart.");
        }

        return DB::transaction(function () use ($cart, $customerData, $paymentMethod, $totals) {
            // 1. Verify and lock stock for each item
            foreach ($cart->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);
                if (!$product || $product->stock_qty < $item->quantity) {
                    $avail = $product ? $product->stock_qty : 0;
                    throw new Exception("Product '{$item->product->name}' has only {$avail} units left in stock.");
                }
            }

            // 2. Generate unique Order ID e.g. EG48273
            $orderNumber = 'EG' . random_int(10000, 99999);
            while (Order::where('order_number', $orderNumber)->exists()) {
                $orderNumber = 'EG' . random_int(10000, 99999);
            }

            // 3. Create Order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $cart->user_id,
                'customer_name' => $customerData['name'] ?? $customerData['full_name'],
                'customer_email' => $customerData['email'],
                'customer_phone' => $customerData['phone'],
                'house_number' => $customerData['house_number'] ?? '',
                'street' => $customerData['street'] ?? $customerData['address'] ?? '',
                'city' => $customerData['city'] ?? '',
                'state' => $customerData['state'] ?? '',
                'pincode' => $customerData['pincode'] ?? '',
                'country' => $customerData['country'] ?? 'India',
                'subtotal' => $totals['subtotal'],
                'discount_amount' => $totals['discount'],
                'coupon_code' => $totals['coupon_code'],
                'shipping_fee' => $totals['shipping'],
                'total_amount' => $totals['total'],
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentMethod === 'cod' ? 'pending' : 'pending',
                'order_status' => 'pending',
                'notes' => $customerData['notes'] ?? null,
            ]);

            // 4. Create Order Items and Decrement Inventory
            foreach ($cart->items as $item) {
                $prod = Product::find($item->product_id);
                $prevStock = $prod->stock_qty;
                $newStock = $prevStock - $item->quantity;
                $prod->update(['stock_qty' => $newStock]);

                // Inventory audit log
                InventoryLog::create([
                    'product_id' => $prod->id,
                    'change_type' => 'sale',
                    'quantity_change' => -$item->quantity,
                    'previous_quantity' => $prevStock,
                    'new_quantity' => $newStock,
                    'reference_id' => $orderNumber,
                ]);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $prod->id,
                    'product_name' => $prod->name,
                    'sku' => $prod->sku,
                    'unit_price' => $item->unit_price,
                    'quantity' => $item->quantity,
                    'subtotal_price' => round($item->unit_price * $item->quantity, 2),
                    'image_url' => $prod->image_closed ?: $prod->image_photo,
                ]);
            }

            // 5. Increment coupon usage
            if ($cart->coupon) {
                $cart->coupon->increment('times_used');
            }

            // 6. Create Initial Order Tracking Stage
            OrderTracking::create([
                'order_id' => $order->id,
                'stage' => 'ordered',
                'status_title' => 'Order Placed',
                'description' => 'We have received your natural skincare order.',
                'is_completed' => true,
                'completed_at' => now(),
            ]);

            // 7. Initialize Payment Record
            Payment::create([
                'order_id' => $order->id,
                'payment_gateway' => $paymentMethod === 'cod' ? 'cod' : 'razorpay',
                'payment_method' => $paymentMethod,
                'amount' => $order->total_amount,
                'currency' => 'INR',
                'status' => 'created',
            ]);

            // 8. Clear Cart Items
            $cart->items()->delete();
            $cart->update(['coupon_id' => null]);

            return $order->load(['items', 'tracking', 'payment']);
        });
    }

    public function markOrderPaid(Order $order, string $razorpayPaymentId, ?string $signature = null, array $payload = []): Order
    {
        return DB::transaction(function () use ($order, $razorpayPaymentId, $signature, $payload) {
            $order->update([
                'payment_status' => 'paid',
                'order_status' => 'confirmed',
            ]);

            $order->payment()->updateOrCreate(
                ['order_id' => $order->id],
                [
                    'razorpay_payment_id' => $razorpayPaymentId,
                    'razorpay_signature' => $signature,
                    'status' => 'captured',
                    'payload' => $payload,
                ]
            );

            OrderTracking::firstOrCreate(
                ['order_id' => $order->id, 'stage' => 'confirmed'],
                [
                    'status_title' => 'Payment Confirmed',
                    'description' => 'Payment authorized & order is confirmed for artisan crafting.',
                    'is_completed' => true,
                    'completed_at' => now(),
                ]
            );

            return $order->fresh(['items', 'tracking', 'payment']);
        });
    }
}
