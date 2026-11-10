<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryLog extends Model
{
    protected $fillable = [
        'product_id',
        'change_type',
        'quantity_change',
        'previous_quantity',
        'new_quantity',
        'reference_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
