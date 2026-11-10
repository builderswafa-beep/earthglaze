<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminCustomerController;
use App\Http\Controllers\Api\Admin\AdminCouponController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| EarthGlaze Natural Skincare API Routes
|--------------------------------------------------------------------------
*/

// Healthcheck
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'app' => 'EarthGlaze Natural Skincare API',
        'backend' => 'PHP Laravel',
        'database' => 'MySQL 8.4',
        'timestamp' => now()->toISOString(),
    ]);
});

// Public Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated Customer Profile & Addresses
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/addresses', [AuthController::class, 'saveAddress']);
    Route::delete('/addresses/{id}', [AuthController::class, 'deleteAddress']);
});

// Public Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/combo', [ProductController::class, 'combo']);
Route::get('/products/{idOrSlug}', [ProductController::class, 'show']);

// Public Cart (supports guest sessions and authenticated users)
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'getCart']);
    Route::post('/add', [CartController::class, 'addItem']);
    Route::put('/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/items/{id}', [CartController::class, 'removeItem']);
    Route::post('/coupon', [CartController::class, 'applyCoupon']);
    Route::post('/coupon/apply', [CartController::class, 'applyCoupon']);
    Route::delete('/coupon', [CartController::class, 'removeCoupon']);
    Route::delete('/clear', [CartController::class, 'clear']);
});

// Checkout & Order Creation
Route::post('/checkout/process', [CheckoutController::class, 'processOrder']);

// Payments (Razorpay & COD)
Route::post('/payments/verify', [PaymentController::class, 'verifyRazorpay']);

// Orders & Tracking
Route::get('/orders/track', [OrderController::class, 'track']);
Route::get('/orders/track/{orderNumber}', [OrderController::class, 'track']);
Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
Route::middleware('auth:sanctum')->get('/my-orders', [OrderController::class, 'userOrders']);

// Contact & Newsletter
Route::post('/contact', [ContactController::class, 'submitMessage']);
Route::post('/contact/submit', [ContactController::class, 'submitMessage']);
Route::post('/newsletter/subscribe', [ContactController::class, 'subscribeNewsletter']);

// Blog
Route::get('/blog/posts', [BlogController::class, 'index']);
Route::get('/blog/posts/{slug}', [BlogController::class, 'show']);

// --------------------------------------------------------------------------
// Admin Protected APIs (Requires auth:sanctum + admin role)
// --------------------------------------------------------------------------
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminDashboardController::class, 'getStats']);
    Route::get('/dashboard', [AdminDashboardController::class, 'getStats']);

    // Admin Product Management
    Route::get('/products', [AdminProductController::class, 'index']);
    Route::put('/products/{id}', [AdminProductController::class, 'update']);
    Route::put('/products/{id}/stock', [AdminProductController::class, 'updateStock']);

    // Admin Order Management
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

    // Admin Customer Management
    Route::get('/customers', [AdminCustomerController::class, 'index']);

    // Admin Coupon Management
    Route::get('/coupons', [AdminCouponController::class, 'index']);
    Route::post('/coupons', [AdminCouponController::class, 'store']);
    Route::put('/coupons/{id}', [AdminCouponController::class, 'update']);
    Route::delete('/coupons/{id}', [AdminCouponController::class, 'destroy']);
});
