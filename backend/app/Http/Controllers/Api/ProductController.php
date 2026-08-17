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
        $products = $service->getProducts();
        
        // Apply proper pagination - return paginated response
        $page = request()->get('page', 1);
        $perPage = min(request()->get('per_page', 20), 100); // Limit to max 100 per page
        
        $offset = ($page - 1) * $perPage;
        $paginatedProducts = array_slice($products, $offset, $perPage);
        
        return $this->ok($paginatedProducts, 'Products retrieved');
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