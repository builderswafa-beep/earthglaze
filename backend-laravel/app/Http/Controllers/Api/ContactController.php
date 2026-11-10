<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function submitMessage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $msg = ContactMessage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting EarthGlaze. Our botanical team will respond within 24 hours.',
            'entry' => $msg,
        ]);
    }

    public function subscribeNewsletter(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => strtolower($validated['email'])],
            ['is_active' => true]
        );

        return response()->json([
            'success' => true,
            'message' => 'Welcome to the EarthGlaze inner circle! You will receive our latest botanical care tips.',
        ]);
    }
}
