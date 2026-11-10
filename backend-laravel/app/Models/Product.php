<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'slug',
        'category_id',
        'category_name',
        'price',
        'sale_price',
        'original_price',
        'weight',
        'stock_qty',
        'rating',
        'review_count',
        'tagline',
        'description',
        'benefits',
        'ingredients',
        'how_to_use',
        'image_closed',
        'image_open',
        'image_photo',
        'is_featured',
        'is_new',
        'is_active',
    ];

    protected $casts = [
        'price' => 'float',
        'sale_price' => 'float',
        'original_price' => 'float',
        'rating' => 'float',
        'review_count' => 'integer',
        'stock_qty' => 'integer',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('display_order');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    public function inventoryLogs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
