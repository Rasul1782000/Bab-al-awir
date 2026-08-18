<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $orders = session()->get('orders', []);
        $page = request()->get('page', 1);
        $perPage = min(request()->get('per_page', 10), 50);

        $offset = ($page - 1) * $perPage;
        $paginatedOrders = array_slice($orders, $offset, $perPage);

        return $this->ok([
            'data' => $paginatedOrders,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => count($orders),
                'last_page' => ceil(count($orders) / $perPage),
            ],
        ], 'Orders retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string',
            'shipping_address.phone' => 'required|string',
            'shipping_address.address_line1' => 'required|string',
            'shipping_address.address_line2' => 'nullable|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.state' => 'required|string',
            'shipping_address.postal_code' => 'required|string',
            'shipping_address.country' => 'required|string',
            'billing_address' => 'nullable|array',
            'payment_method' => 'required|string|in:card,upi,netbanking,wallet,cod,apple_pay,google_pay',
            'payment_details' => 'nullable|array',
            'notes' => 'nullable|string',
            'gift_message' => 'nullable|string',
            'gift_wrap' => 'nullable|boolean',
        ]);

        $cartItems = $validated['items'];
        $subtotal = array_sum(array_map(fn($item) => $item['price'] * $item['quantity'], $cartItems));
        $deliveryFee = 15.00;
        $tax = round($subtotal * 0.05, 2);
        $total = $subtotal + $deliveryFee + $tax;

        $order = [
            'id' => 'ORD-' . Str::upper(Str::random(8)),
            'order_number' => 'BAW' . date('Ymd') . Str::upper(Str::random(6)),
            'status' => 'confirmed',
            'status_label' => 'Order Confirmed',
            'items' => $cartItems,
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'tax' => $tax,
            'total' => $total,
            'currency' => 'AED',
            'currency_symbol' => 'د.إ',
            'shipping_address' => $validated['shipping_address'],
            'billing_address' => $validated['billing_address'] ?? $validated['shipping_address'],
            'payment_method' => $validated['payment_method'],
            'payment_details' => $validated['payment_details'] ?? [],
            'notes' => $validated['notes'] ?? null,
            'gift_message' => $validated['gift_message'] ?? null,
            'gift_wrap' => $validated['gift_wrap'] ?? false,
            'tracking_number' => 'TRK' . Str::upper(Str::random(10)),
            'carrier' => 'Bab al Awir Logistics',
            'estimated_delivery' => date('Y-m-d', strtotime('+3 days')),
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString(),
            'status_history' => [
                ['status' => 'confirmed', 'label' => 'Order Confirmed', 'timestamp' => now()->toISOString()],
            ],
        ];

        $orders = session()->get('orders', []);
        array_unshift($orders, $order);
        session()->put('orders', $orders);

        session()->forget('cart');

        return $this->ok($order, 'Order created successfully');
    }

    public function show(string $id): JsonResponse
    {
        $orders = session()->get('orders', []);
        $order = collect($orders)->firstWhere('id', $id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'data' => null,
            ], 404);
        }

        return $this->ok($order, 'Order retrieved');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:confirmed,processing,shipped,delivered,cancelled,returned',
        ]);

        $orders = session()->get('orders', []);
        $orderIndex = collect($orders)->search(fn($o) => $o['id'] === $id);

        if ($orderIndex === false) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'data' => null,
            ], 404);
        }

        $statusLabels = [
            'confirmed' => 'Order Confirmed',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            'returned' => 'Returned',
        ];

        $orders[$orderIndex]['status'] = $validated['status'];
        $orders[$orderIndex]['status_label'] = $statusLabels[$validated['status']] ?? $validated['status'];
        $orders[$orderIndex]['updated_at'] = now()->toISOString();
        $orders[$orderIndex]['status_history'][] = [
            'status' => $validated['status'],
            'label' => $orders[$orderIndex]['status_label'],
            'timestamp' => now()->toISOString(),
        ];

        session()->put('orders', $orders);

        return $this->ok($orders[$orderIndex], 'Order updated');
    }

    public function destroy(string $id): JsonResponse
    {
        $orders = session()->get('orders', []);
        $orderIndex = collect($orders)->search(fn($o) => $o['id'] === $id);

        if ($orderIndex === false) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'data' => null,
            ], 404);
        }

        $order = $orders[$orderIndex];

        if (!in_array($order['status'], ['confirmed', 'processing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be cancelled at this stage',
                'data' => null,
            ], 422);
        }

        unset($orders[$orderIndex]);
        session()->put('orders', array_values($orders));

        return $this->ok(null, 'Order cancelled');
    }
}