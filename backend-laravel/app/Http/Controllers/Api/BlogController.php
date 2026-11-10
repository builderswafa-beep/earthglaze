<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;

class BlogController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = BlogPost::where('is_published', true)->latest()->get();
        return response()->json([
            'success' => true,
            'posts' => $posts,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)->where('is_published', true)->firstOrFail();
        return response()->json([
            'success' => true,
            'post' => $post,
            'recent' => BlogPost::where('id', '!=', $post->id)->where('is_published', true)->take(3)->get(),
        ]);
    }
}
