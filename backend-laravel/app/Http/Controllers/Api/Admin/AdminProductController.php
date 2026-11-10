<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with('images')->orderBy('id', 'asc')->get();
        return response()->json(['success' => true, 'products' => $products]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'sale_price' => 'sometimes|numeric',
            'original_price' => 'nullable|numeric',
            'stock_qty' => 'sometimes|integer|min:0',
            'tagline' => 'nullable|string',
            'description' => 'nullable|string',
            'benefits' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'how_to_use' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        if (isset($validated['stock_qty']) && $validated['stock_qty'] !== $product->stock_qty) {
            $prev = $product->stock_qty;
            $new = $validated['stock_qty'];
            InventoryLog::create([
                'product_id' => $product->id,
                'change_type' => 'adjustment',
                'quantity_change' => $new - $prev,
                'previous_quantity' => $prev,
                'new_quantity' => $new,
                'reference_id' => 'ADMIN_ADJUSTMENT',
            ]);
        }

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => "Product '{$product->name}' updated successfully.",
            'product' => $product,
        ]);
    }

    public function updateStock(Request $request, int $id): JsonResponse
    {
        $request->validate(['stock_qty' => 'required|integer|min:0']);
        $product = Product::findOrFail($id);

        $prev = $product->stock_qty;
        $new = (int) $request->stock_qty;

        $product->update(['stock_qty' => $new]);

        InventoryLog::create([
            'product_id' => $product->id,
            'change_type' => 'restock',
            'quantity_change' => $new - $prev,
            'previous_quantity' => $prev,
            'new_quantity' => $new,
            'reference_id' => 'ADMIN_STOCK_UPDATE',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Stock for '{$product->name}' updated to {$new}.",
            'product' => $product,
        ]);
    }
}
