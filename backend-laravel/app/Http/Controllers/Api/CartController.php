<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function getCart(Request $request): JsonResponse
    {
        $sessionId = $request->header('X-Cart-Session') ?: $request->query('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        return response()->json([
            'success' => true,
            'session_id' => $cart->session_id,
            'items' => $cart->items()->with('product')->get(),
            'totals' => $cart->calculateTotals(),
        ]);
    }

    public function addItem(Request $request): JsonResponse
    {
        $rawId = $request->input('product_id');
        if (!is_numeric($rawId)) {
            $prod = \App\Models\Product::where('slug', $rawId)->first();
            if ($prod) {
                $request->merge(['product_id' => $prod->id]);
            }
        }

        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'integer|min:1|max:10',
        ]);

        $sessionId = $request->header('X-Cart-Session') ?: $request->input('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        try {
            $cart = $this->cartService->addItem($cart, (int) $request->product_id, (int) ($request->quantity ?? 1));

            return response()->json([
                'success' => true,
                'message' => 'Item added to your EarthGlaze bag!',
                'session_id' => $cart->session_id,
                'items' => $cart->items()->with('product')->get(),
                'totals' => $cart->calculateTotals(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function updateItem(Request $request, int $id): JsonResponse
    {
        $request->validate(['quantity' => 'required|integer|min:0|max:10']);

        $sessionId = $request->header('X-Cart-Session') ?: $request->input('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        $cart = $this->cartService->updateItem($cart, $id, (int) $request->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated.',
            'items' => $cart->items()->with('product')->get(),
            'totals' => $cart->calculateTotals(),
        ]);
    }

    public function removeItem(Request $request, int $id): JsonResponse
    {
        $sessionId = $request->header('X-Cart-Session') ?: $request->input('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        $cart = $this->cartService->removeItem($cart, $id);

        return response()->json([
            'success' => true,
            'message' => 'Item removed from bag.',
            'items' => $cart->items()->with('product')->get(),
            'totals' => $cart->calculateTotals(),
        ]);
    }

    public function applyCoupon(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);

        $sessionId = $request->header('X-Cart-Session') ?: $request->input('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        $result = $this->cartService->applyCoupon($cart, $request->code);

        return response()->json($result, $result['success'] ? 200 : 422);
    }

    public function removeCoupon(Request $request): JsonResponse
    {
        $sessionId = $request->header('X-Cart-Session') ?: $request->input('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        $result = $this->cartService->removeCoupon($cart);

        return response()->json($result);
    }

    public function clear(Request $request): JsonResponse
    {
        $sessionId = $request->header('X-Cart-Session') ?: $request->input('session_id');
        $cart = $this->cartService->getOrCreateCart($request->user('sanctum'), $sessionId);

        $cart->items()->delete();
        $cart->update(['coupon_id' => null]);

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared.',
            'items' => [],
            'totals' => $cart->calculateTotals(),
        ]);
    }
}
