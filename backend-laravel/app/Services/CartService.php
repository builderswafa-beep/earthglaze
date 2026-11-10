<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use Exception;

class CartService
{
    public function getOrCreateCart(?User $user, ?string $sessionId): Cart
    {
        if ($user) {
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);
            // If there is an existing session cart, merge its items into user cart
            if ($sessionId) {
                $sessionCart = Cart::where('session_id', $sessionId)->first();
                if ($sessionCart && $sessionCart->id !== $cart->id) {
                    foreach ($sessionCart->items as $sItem) {
                        $existing = CartItem::where('cart_id', $cart->id)
                            ->where('product_id', $sItem->product_id)
                            ->first();
                        if ($existing) {
                            $existing->quantity += $sItem->quantity;
                            $existing->save();
                        } else {
                            $sItem->cart_id = $cart->id;
                            $sItem->save();
                        }
                    }
                    $sessionCart->delete();
                }
            }
            return $cart;
        }

        if (!$sessionId) {
            $sessionId = 'sess_' . bin2hex(random_bytes(16));
        }

        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    public function addItem(Cart $cart, int $productId, int $quantity = 1): Cart
    {
        $product = Product::active()->findOrFail($productId);

        if ($product->stock_qty < $quantity) {
            throw new Exception("Only {$product->stock_qty} units available in stock.");
        }

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if ($item) {
            $newQty = $item->quantity + $quantity;
            if ($newQty > $product->stock_qty) {
                $newQty = $product->stock_qty;
            }
            $item->update([
                'quantity' => $newQty,
                'unit_price' => $product->sale_price,
            ]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'unit_price' => $product->sale_price,
            ]);
        }

        return $cart->fresh(['items.product', 'coupon']);
    }

    public function updateItem(Cart $cart, int $itemId, int $quantity): Cart
    {
        $item = CartItem::where('cart_id', $cart->id)->findOrFail($itemId);
        $product = Product::findOrFail($item->product_id);

        if ($quantity <= 0) {
            $item->delete();
        } else {
            $qty = min($quantity, $product->stock_qty);
            $item->update(['quantity' => $qty]);
        }

        return $cart->fresh(['items.product', 'coupon']);
    }

    public function removeItem(Cart $cart, int $itemId): Cart
    {
        CartItem::where('cart_id', $cart->id)->where('id', $itemId)->delete();
        return $cart->fresh(['items.product', 'coupon']);
    }

    public function applyCoupon(Cart $cart, string $code): array
    {
        $coupon = Coupon::where('code', strtoupper(trim($code)))->first();
        if (!$coupon) {
            return ['success' => false, 'message' => 'Invalid coupon code.'];
        }

        $totals = $cart->calculateTotals();
        if (!$coupon->isValid($totals['subtotal'])) {
            if ($totals['subtotal'] < $coupon->min_order_value) {
                return [
                    'success' => false,
                    'message' => "This coupon requires a minimum cart value of ₹{$coupon->min_order_value}."
                ];
            }
            return ['success' => false, 'message' => 'Coupon has expired or usage limit reached.'];
        }

        $cart->coupon_id = $coupon->id;
        $cart->save();

        return [
            'success' => true,
            'message' => "Coupon {$coupon->code} applied successfully!",
            'totals' => $cart->calculateTotals()
        ];
    }

    public function removeCoupon(Cart $cart): array
    {
        $cart->coupon_id = null;
        $cart->save();

        return [
            'success' => true,
            'message' => 'Coupon removed.',
            'totals' => $cart->calculateTotals()
        ];
    }
}
