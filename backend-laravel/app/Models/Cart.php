<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id', 'session_id', 'coupon_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function calculateTotals(): array
    {
        $this->load(['items.product', 'coupon']);

        $subtotal = 0.0;
        $totalItems = 0;

        foreach ($this->items as $item) {
            $price = $item->product ? (float) $item->product->sale_price : (float) $item->unit_price;
            $subtotal += $price * $item->quantity;
            $totalItems += $item->quantity;
        }

        $discount = 0.0;
        if ($this->coupon && $this->coupon->isValid($subtotal)) {
            $discount = $this->coupon->calculateDiscount($subtotal);
        }

        // Free standard promotional shipping
        $shipping = 0.0;
        $total = max(0.0, round($subtotal - $discount + $shipping, 2));

        return [
            'total_items' => $totalItems,
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'coupon_code' => $this->coupon ? $this->coupon->code : null,
            'shipping' => $shipping,
            'total' => $total,
        ];
    }
}
