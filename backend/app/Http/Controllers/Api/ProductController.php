<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $service = app(ProductDataService::class);
        return $this->ok($service->getProducts(), 'Products retrieved');
    }

    public function show(int $id): JsonResponse
    {
        $service = app(ProductDataService::class);
        $product = $service->getProductById($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'data' => null,
            ], 404);
        }

        return $this->ok($product, 'Product retrieved');
    }
}
