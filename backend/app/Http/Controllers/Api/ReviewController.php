<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    use RespondsWithJson;

    public function index(Request $request): JsonResponse
    {
        $reviews = session()->get('reviews', []);
        $productId = $request->get('product_id');
        $page = $request->get('page', 1);
        $perPage = min($request->get('per_page', 10), 50);

        if ($productId) {
            $reviews = array_filter($reviews, fn($r) => $r['product_id'] == $productId);
            $reviews = array_values($reviews);
        }

        $total = count($reviews);
        $offset = ($page - 1) * $perPage;
        $paginatedReviews = array_slice($reviews, $offset, $perPage);

        return $this->ok([
            'data' => $paginatedReviews,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => ceil($total / $perPage),
            ],
        ], 'Reviews retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|integer',
            'user_name' => 'required|string|max:100',
            'user_email' => 'required|email|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:200',
            'comment' => 'required|string|max:2000',
            'verified_purchase' => 'nullable|boolean',
        ]);

        $productService = app(ProductDataService::class);
        $product = $productService->getProductById($validated['product_id']);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'data' => null,
            ], 404);
        }

        $review = [
            'id' => 'REV-' . Str::upper(Str::random(8)),
            'product_id' => $validated['product_id'],
            'product_name_en' => $product['name_en'],
            'product_name_ar' => $product['name_ar'],
            'user_name' => $validated['user_name'],
            'user_email' => $validated['user_email'],
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'comment' => $validated['comment'],
            'verified_purchase' => $validated['verified_purchase'] ?? false,
            'helpful_count' => 0,
            'status' => 'approved',
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString(),
        ];

        $reviews = session()->get('reviews', []);
        array_unshift($reviews, $review);
        session()->put('reviews', $reviews);

        $this->updateProductRating($validated['product_id']);

        return $this->ok($review, 'Review submitted successfully');
    }

    public function show(string $id): JsonResponse
    {
        $reviews = session()->get('reviews', []);
        $review = collect($reviews)->firstWhere('id', $id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found',
                'data' => null,
            ], 404);
        }

        return $this->ok($review, 'Review retrieved');
    }

    public function productSummary(int $productId): JsonResponse
    {
        $reviews = session()->get('reviews', []);
        $productReviews = array_filter($reviews, fn($r) => $r['product_id'] == $productId && $r['status'] === 'approved');
        $productReviews = array_values($productReviews);

        $totalReviews = count($productReviews);
        $averageRating = 0;
        $ratingDistribution = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];

        if ($totalReviews > 0) {
            $sum = array_sum(array_column($productReviews, 'rating'));
            $averageRating = round($sum / $totalReviews, 1);

            foreach ($productReviews as $review) {
                $ratingDistribution[$review['rating']]++;
            }
        }

        $verifiedCount = count(array_filter($productReviews, fn($r) => $r['verified_purchase']));

        return $this->ok([
            'product_id' => $productId,
            'total_reviews' => $totalReviews,
            'average_rating' => $averageRating,
            'rating_distribution' => $ratingDistribution,
            'verified_purchase_count' => $verifiedCount,
            'verified_purchase_percentage' => $totalReviews > 0 ? round(($verifiedCount / $totalReviews) * 100) : 0,
        ], 'Product review summary retrieved');
    }

    public function updateHelpful(string $id): JsonResponse
    {
        $reviews = session()->get('reviews', []);
        $reviewIndex = collect($reviews)->search(fn($r) => $r['id'] === $id);

        if ($reviewIndex === false) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found',
                'data' => null,
            ], 404);
        }

        $reviews[$reviewIndex]['helpful_count']++;
        session()->put('reviews', $reviews);

        return $this->ok($reviews[$reviewIndex], 'Review marked as helpful');
    }

    private function updateProductRating(int $productId): void
    {
        $reviews = session()->get('reviews', []);
        $productReviews = array_filter($reviews, fn($r) => $r['product_id'] == $productId && $r['status'] === 'approved');

        if (empty($productReviews)) {
            return;
        }

        $average = round(array_sum(array_column($productReviews, 'rating')) / count($productReviews), 1);

        $products = config('dummy.products');
        foreach ($products as &$product) {
            if ($product['id'] == $productId) {
                $product['rating'] = $average;
                $product['review_count'] = count($productReviews);
                break;
            }
        }

        config(['dummy.products' => $products]);
    }
}