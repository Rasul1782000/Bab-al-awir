<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $cart = session()->get('cart', []);
        $products = $this->enrichCartWithProducts($cart);
        return $this->ok($products, 'Cart retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        session()->put('cart', $validated['items']);
        $products = $this->enrichCartWithProducts($validated['items']);

        return $this->ok($products, 'Cart saved');
    }

    public function update(Request $request, int $productId): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = session()->get('cart', []);
        $found = false;

        foreach ($cart as $index => $item) {
            if ($item['product_id'] === $productId) {
                if ($validated['quantity'] > 0) {
                    $cart[$index]['quantity'] = $validated['quantity'];
                } else {
                    unset($cart[$index]);
                }
                $found = true;
                break;
            }
        }

        if (!$found && $validated['quantity'] > 0) {
            $cart[] = ['product_id' => $productId, 'quantity' => $validated['quantity']];
        }

        $cart = array_values($cart);
        session()->put('cart', $cart);
        $products = $this->enrichCartWithProducts($cart);

        return $this->ok($products, 'Cart updated');
    }

    public function destroy(int $productId): JsonResponse
    {
        $cart = session()->get('cart', []);
        $cart = array_values(array_filter($cart, fn($item) => $item['product_id'] !== $productId));
        session()->put('cart', $cart);
        $products = $this->enrichCartWithProducts($cart);

        return $this->ok($products, 'Item removed from cart');
    }

    public function clear(): JsonResponse
    {
        session()->forget('cart');
        return $this->ok([], 'Cart cleared');
    }

    private function enrichCartWithProducts(array $cart): array
    {
        $productService = app(ProductDataService::class);
        $allProducts = $productService->getProducts();
        $productsById = [];

        foreach ($allProducts as $product) {
            $productsById[$product['id']] = $product;
        }

        return array_map(function ($item) use ($productsById) {
            $product = $productsById[$item['product_id']] ?? null;
            if (!$product) {
                return null;
            }
            return [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'product' => $product,
                'subtotal' => $product['price'] * $item['quantity'],
            ];
        }, $cart);
    }
}