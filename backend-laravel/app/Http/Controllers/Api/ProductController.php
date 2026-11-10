<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::active()->with(['category', 'images']);

        // Category filter
        if ($request->filled('category') && $request->category !== 'all') {
            $catSlug = strtolower($request->category);
            $query->whereHas('category', function ($q) use ($catSlug) {
                $q->where('slug', $catSlug);
            })->orWhere('category_name', 'like', "%{$request->category}%");
        }

        // Search filter
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('tagline', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%")
                  ->orWhere('ingredients', 'like', "%{$s}%");
            });
        }

        // Price range
        if ($request->filled('min_price')) {
            $query->where('sale_price', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('sale_price', '<=', (float) $request->max_price);
        }

        // Sorting
        $sort = $request->get('sort', 'featured');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('sale_price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('sale_price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
                $query->orderBy('id', 'desc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_featured', 'desc')->orderBy('id', 'asc');
                break;
        }

        $products = $query->get();

        return response()->json([
            'success' => true,
            'count' => $products->count(),
            'products' => $products,
            'categories' => Category::where('is_active', true)->get(),
        ]);
    }

    public function show($idOrSlug): JsonResponse
    {
        $product = Product::active()
            ->with(['category', 'images', 'reviews'])
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'product' => $product,
            'related' => Product::active()->where('id', '!=', $product->id)->take(2)->get(),
        ]);
    }

    public function combo(): JsonResponse
    {
        $products = Product::active()->get();

        $bundleItems = $products->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => $p->sale_price,
                'image' => $p->image_photo ?: $p->image_closed,
            ];
        });

        $individualTotal = $products->sum('sale_price');
        $comboPrice = 799.00;
        $savings = max(0.0, round($individualTotal - $comboPrice, 2));

        return response()->json([
            'success' => true,
            'combo' => [
                'title' => 'Complete Natural Care Set',
                'sku' => 'EG-BUNDLE-ALL3',
                'description' => 'Experience the complete EarthGlaze botanical ritual: Manjistha Soap, Goat Milk Soap, and Beet Root Lip Balm.',
                'individual_total' => $individualTotal,
                'combo_price' => $comboPrice,
                'savings' => $savings,
                'discount_percentage' => round(($savings / $individualTotal) * 100),
                'items' => $bundleItems,
                'image' => '/assets/story_pedestal_products.png',
            ]
        ]);
    }
}
