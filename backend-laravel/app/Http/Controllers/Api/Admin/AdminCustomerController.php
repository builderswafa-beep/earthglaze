<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminCustomerController extends Controller
{
    public function index(): JsonResponse
    {
        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->with(['orders' => function ($q) {
                $q->latest()->take(3);
            }])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'customers' => $customers]);
    }
}
