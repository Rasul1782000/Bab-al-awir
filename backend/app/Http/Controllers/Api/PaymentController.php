<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use RespondsWithJson;

    public function process(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'required|string|size:3',
            'payment_method' => 'required|string|in:card,upi,netbanking,wallet,cod,apple_pay,google_pay',
            'payment_details' => 'nullable|array',
            'payment_details.card_number' => 'required_if:payment_method,card|nullable|string|size:16',
            'payment_details.card_expiry' => 'required_if:payment_method,card|nullable|string',
            'payment_details.card_cvv' => 'required_if:payment_method,card|nullable|string|size:3',
            'payment_details.card_name' => 'required_if:payment_method,card|nullable|string',
            'payment_details.upi_id' => 'required_if:payment_method,upi|nullable|string|email',
            'payment_details.netbanking_bank' => 'required_if:payment_method,netbanking|nullable|string',
            'payment_details.wallet_type' => 'required_if:payment_method,wallet|nullable|string',
            'payment_details.wallet_phone' => 'required_if:payment_method,wallet|nullable|string',
            'payment_details.apple_pay_token' => 'required_if:payment_method,apple_pay|nullable|string',
            'payment_details.google_pay_token' => 'required_if:payment_method,google_pay|nullable|string',
        ]);

        if ($validated['payment_method'] === 'cod') {
            $validated['payment_details'] = [];
        }

        if ($validated['payment_method'] === 'card') {
            $expiry = $validated['payment_details']['card_expiry'] ?? '';
            if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $expiry)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid card expiry format. Use MM/YY',
                    'data' => null,
                ], 422);
            }
        }

        $orderId = $validated['order_id'];
        $orders = session()->get('orders', []);
        $order = collect($orders)->firstWhere('id', $orderId);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'data' => null,
            ], 404);
        }

        if ($order['status'] !== 'confirmed') {
            return response()->json([
                'success' => false,
                'message' => 'Order is not in a payable state',
                'data' => null,
            ], 422);
        }

        if (abs($validated['amount'] - $order['total']) > 0.01) {
            return response()->json([
                'success' => false,
                'message' => 'Payment amount does not match order total',
                'data' => null,
            ], 422);
        }

        $payment = $this->processPayment($validated);

        if ($payment['success']) {
            $orderIndex = collect($orders)->search(fn($o) => $o['id'] === $orderId);
            if ($orderIndex !== false) {
                $orders[$orderIndex]['status'] = 'processing';
                $orders[$orderIndex]['status_label'] = 'Processing';
                $orders[$orderIndex]['payment'] = $payment['data'];
                $orders[$orderIndex]['updated_at'] = now()->toISOString();
                $orders[$orderIndex]['status_history'][] = [
                    'status' => 'processing',
                    'label' => 'Processing',
                    'timestamp' => now()->toISOString(),
                ];
                session()->put('orders', $orders);
            }

            return $this->ok($payment['data'], 'Payment processed successfully');
        }

        return response()->json([
            'success' => false,
            'message' => $payment['message'],
            'data' => null,
        ], 402);
    }

    public function methods(): JsonResponse
    {
        $methods = [
            [
                'id' => 'card',
                'name' => 'Credit / Debit Card',
                'name_ar' => 'بطاقة ائتمان / خصم',
                'icon' => '💳',
                'fields' => ['card_number', 'card_expiry', 'card_cvv', 'card_name'],
                'enabled' => true,
            ],
            [
                'id' => 'upi',
                'name' => 'UPI',
                'name_ar' => 'UPI',
                'icon' => '📱',
                'fields' => ['upi_id'],
                'enabled' => true,
            ],
            [
                'id' => 'netbanking',
                'name' => 'Net Banking',
                'name_ar' => 'الخدمات المصرفية عبر الإنترنت',
                'icon' => '🏦',
                'fields' => ['netbanking_bank'],
                'enabled' => true,
            ],
            [
                'id' => 'wallet',
                'name' => 'Digital Wallet',
                'name_ar' => 'محفظة رقمية',
                'icon' => '👛',
                'fields' => ['wallet_type', 'wallet_phone'],
                'enabled' => true,
            ],
            [
                'id' => 'cod',
                'name' => 'Cash on Delivery',
                'name_ar' => 'الدفع عند الاستلام',
                'icon' => '💵',
                'fields' => [],
                'enabled' => true,
            ],
            [
                'id' => 'apple_pay',
                'name' => 'Apple Pay',
                'name_ar' => 'Apple Pay',
                'icon' => '🍎',
                'fields' => ['apple_pay_token'],
                'enabled' => true,
            ],
            [
                'id' => 'google_pay',
                'name' => 'Google Pay',
                'name_ar' => 'Google Pay',
                'icon' => '🤖',
                'fields' => ['google_pay_token'],
                'enabled' => true,
            ],
        ];

        return $this->ok($methods, 'Payment methods retrieved');
    }

    private function processPayment(array $validated): array
    {
        $method = $validated['payment_method'];

        $transactionId = 'TXN' . strtoupper(substr(md5(uniqid('', true)), 0, 12));
        $timestamp = now()->toISOString();

        switch ($method) {
            case 'card':
                return $this->processCardPayment($validated, $transactionId, $timestamp);

            case 'upi':
                return $this->processUpiPayment($validated, $transactionId, $timestamp);

            case 'netbanking':
                return $this->processNetBankingPayment($validated, $transactionId, $timestamp);

            case 'wallet':
                return $this->processWalletPayment($validated, $transactionId, $timestamp);

            case 'cod':
                return [
                    'success' => true,
                    'message' => 'Cash on Delivery selected. Pay when order is delivered.',
                    'data' => [
                        'transaction_id' => $transactionId,
                        'method' => 'cod',
                        'status' => 'pending',
                        'amount' => $validated['amount'],
                        'currency' => $validated['currency'],
                        'timestamp' => $timestamp,
                    ],
                ];

            case 'apple_pay':
            case 'google_pay':
                return [
                    'success' => true,
                    'message' => ucfirst(str_replace('_', ' ', $method)) . ' payment authorized',
                    'data' => [
                        'transaction_id' => $transactionId,
                        'method' => $method,
                        'status' => 'completed',
                        'amount' => $validated['amount'],
                        'currency' => $validated['currency'],
                        'timestamp' => $timestamp,
                        'token' => $validated['payment_details']["{$method}_token"] ?? null,
                    ],
                ];

            default:
                return [
                    'success' => false,
                    'message' => 'Unsupported payment method',
                    'data' => null,
                ];
        }
    }

    private function processCardPayment(array $validated, string $transactionId, string $timestamp): array
    {
        $details = $validated['payment_details'];
        $cardNumber = $details['card_number'];

        if (!preg_match('/^\d{16}$/', $cardNumber)) {
            return ['success' => false, 'message' => 'Invalid card number', 'data' => null];
        }

        $lastFour = substr($cardNumber, -4);
        $masked = '**** **** **** ' . $lastFour;

        return [
            'success' => true,
            'message' => 'Card payment processed successfully',
            'data' => [
                'transaction_id' => $transactionId,
                'method' => 'card',
                'status' => 'completed',
                'amount' => $validated['amount'],
                'currency' => $validated['currency'],
                'timestamp' => $timestamp,
                'card' => [
                    'masked_number' => $masked,
                    'expiry' => $details['card_expiry'],
                    'name' => $details['card_name'],
                    'type' => $this->detectCardType($cardNumber),
                ],
            ],
        ];
    }

    private function processUpiPayment(array $validated, string $transactionId, string $timestamp): array
    {
        return [
            'success' => true,
            'message' => 'UPI payment processed successfully',
            'data' => [
                'transaction_id' => $transactionId,
                'method' => 'upi',
                'status' => 'completed',
                'amount' => $validated['amount'],
                'currency' => $validated['currency'],
                'timestamp' => $timestamp,
                'upi_id' => $validated['payment_details']['upi_id'],
            ],
        ];
    }

    private function processNetBankingPayment(array $validated, string $transactionId, string $timestamp): array
    {
        return [
            'success' => true,
            'message' => 'Net Banking payment processed successfully',
            'data' => [
                'transaction_id' => $transactionId,
                'method' => 'netbanking',
                'status' => 'completed',
                'amount' => $validated['amount'],
                'currency' => $validated['currency'],
                'timestamp' => $timestamp,
                'bank' => $validated['payment_details']['netbanking_bank'],
            ],
        ];
    }

    private function processWalletPayment(array $validated, string $transactionId, string $timestamp): array
    {
        return [
            'success' => true,
            'message' => 'Wallet payment processed successfully',
            'data' => [
                'transaction_id' => $transactionId,
                'method' => 'wallet',
                'status' => 'completed',
                'amount' => $validated['amount'],
                'currency' => $validated['currency'],
                'timestamp' => $timestamp,
                'wallet_type' => $validated['payment_details']['wallet_type'],
                'wallet_phone' => $validated['payment_details']['wallet_phone'],
            ],
        ];
    }

    private function detectCardType(string $cardNumber): string
    {
        $firstDigit = $cardNumber[0];
        $firstTwo = substr($cardNumber, 0, 2);
        $firstFour = substr($cardNumber, 0, 4);

        if ($firstDigit === '4') return 'Visa';
        if (in_array($firstTwo, range(51, 55)) || in_array($firstFour, range(2221, 2720))) return 'Mastercard';
        if (in_array($firstTwo, ['34', '37'])) return 'American Express';
        if (in_array($firstFour, ['6011', '644', '645', '646', '647', '648', '649', '65']) || $firstTwo === '65') return 'Discover';

        return 'Unknown';
    }
}