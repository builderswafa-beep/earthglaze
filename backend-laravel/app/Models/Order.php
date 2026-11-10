<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'house_number',
        'street',
        'city',
        'state',
        'pincode',
        'country',
        'subtotal',
        'discount_amount',
        'coupon_code',
        'shipping_fee',
        'total_amount',
        'payment_method',
        'payment_status',
        'order_status',
        'tracking_number',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'discount_amount' => 'float',
        'shipping_fee' => 'float',
        'total_amount' => 'float',
    ];

    protected $appends = ['status', 'shipping_address'];

    public function getStatusAttribute()
    {
        return $this->order_status;
    }

    public function getShippingAddressAttribute()
    {
        return [
            'house_number' => $this->house_number,
            'street' => $this->street,
            'address' => trim(($this->house_number ? $this->house_number . ', ' : '') . $this->street),
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->pincode,
            'pincode' => $this->pincode,
            'country' => $this->country,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function tracking()
    {
        return $this->hasMany(OrderTracking::class)->orderBy('id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
