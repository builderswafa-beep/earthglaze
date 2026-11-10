<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCouponController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'coupons' => Coupon::latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->filled('discount_type')) {
            $t = $request->input('type');
            if ($t === 'percent') $t = 'percentage';
            $request->merge(['discount_type' => $t ?: 'percentage']);
        }
        if (!$request->filled('discount_value') && $request->filled('value')) {
            $request->merge(['discount_value' => $request->value]);
        }
        if (!$request->filled('min_order_value') && $request->filled('min_order_amount')) {
            $request->merge(['min_order_value' => $request->min_order_amount]);
        }

        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:1',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric',
            'usage_limit' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $coupon = Coupon::create($validated);

        return response()->json(['success' => true, 'coupon' => $coupon, 'message' => 'Coupon created!']);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->update($request->all());
        return response()->json(['success' => true, 'coupon' => $coupon, 'message' => 'Coupon updated!']);
    }

    public function destroy(int $id): JsonResponse
    {
        Coupon::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Coupon deleted.']);
    }
}
