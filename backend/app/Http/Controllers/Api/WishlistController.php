<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $wishlist = session()->get('wishlist', []);
        $products = $this->enrichWishlistWithProducts($wishlist);
        return $this->ok($products, 'Wishlist retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|integer',
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

        $wishlist = session()->get('wishlist', []);

        if (in_array($validated['product_id'], $wishlist)) {
            return response()->json([
                'success' => false,
                'message' => 'Product already in wishlist',
                'data' => null,
            ], 409);
        }

        $wishlist[] = $validated['product_id'];
        session()->put('wishlist', $wishlist);

        $products = $this->enrichWishlistWithProducts($wishlist);

        return $this->ok($products, 'Product added to wishlist');
    }

    public function destroy(int $productId): JsonResponse
    {
        $wishlist = session()->get('wishlist', []);
        $wishlist = array_values(array_filter($wishlist, fn($id) => $id !== $productId));
        session()->put('wishlist', $wishlist);

        $products = $this->enrichWishlistWithProducts($wishlist);

        return $this->ok($products, 'Product removed from wishlist');
    }

    public function check(int $productId): JsonResponse
    {
        $wishlist = session()->get('wishlist', []);
        $isInWishlist = in_array($productId, $wishlist);

        return $this->ok([
            'product_id' => $productId,
            'in_wishlist' => $isInWishlist,
        ], 'Wishlist status checked');
    }

    public function clear(): JsonResponse
    {
        session()->forget('wishlist');
        return $this->ok([], 'Wishlist cleared');
    }

    private function enrichWishlistWithProducts(array $wishlist): array
    {
        $productService = app(ProductDataService::class);
        $allProducts = $productService->getProducts();
        $productsById = [];

        foreach ($allProducts as $product) {
            $productsById[$product['id']] = $product;
        }

        return array_map(function ($productId) use ($productsById) {
            $product = $productsById[$productId] ?? null;
            if (!$product) {
                return null;
            }
            return [
                'product_id' => $productId,
                'product' => $product,
            ];
        }, $wishlist);
    }
}