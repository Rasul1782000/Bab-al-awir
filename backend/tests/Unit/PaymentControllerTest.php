<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class PaymentControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Session::flush();
    }

    public function test_methods_returns_payment_methods(): void
    {
        $controller = new PaymentController();
        $request = Request::create('/api/payments/methods', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->methods();
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertIsArray($data['data']);
        $this->assertGreaterThan(0, count($data['data']));

        $methodIds = array_column($data['data'], 'id');
        $this->assertContains('card', $methodIds);
        $this->assertContains('upi', $methodIds);
        $this->assertContains('netbanking', $methodIds);
        $this->assertContains('wallet', $methodIds);
        $this->assertContains('cod', $methodIds);
        $this->assertContains('apple_pay', $methodIds);
        $this->assertContains('google_pay', $methodIds);
    }

    public function test_process_returns_404_for_missing_order(): void
    {
        $controller = new PaymentController();
        $paymentData = [
            'order_id' => 'NONEXISTENT',
            'amount' => 100,
            'currency' => 'AED',
            'payment_method' => 'card',
            'payment_details' => [
                'card_number' => '4111111111111111',
                'card_expiry' => '12/28',
                'card_cvv' => '123',
                'card_name' => 'John Doe',
            ],
        ];

        $request = Request::create('/api/payments', 'POST', $paymentData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->process($request);
        $this->assertEquals(404, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Order not found', $data['message']);
    }

    public function test_process_returns_422_for_wrong_amount(): void
    {
        $controller = new PaymentController();
        $order = [
            'id' => 'TEST-123',
            'status' => 'confirmed',
            'total' => 100,
        ];
        Session::put('orders', [$order]);

        $paymentData = [
            'order_id' => 'TEST-123',
            'amount' => 200,
            'currency' => 'AED',
            'payment_method' => 'card',
            'payment_details' => [
                'card_number' => '4111111111111111',
                'card_expiry' => '12/28',
                'card_cvv' => '123',
                'card_name' => 'John Doe',
            ],
        ];

        $request = Request::create('/api/payments', 'POST', $paymentData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->process($request);
        $this->assertEquals(422, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Payment amount does not match order total', $data['message']);
    }

    public function test_process_cod_payment(): void
    {
        $controller = new PaymentController();
        $order = [
            'id' => 'TEST-123',
            'status' => 'confirmed',
            'total' => 100,
        ];
        Session::put('orders', [$order]);

        $paymentData = [
            'order_id' => 'TEST-123',
            'amount' => 100,
            'currency' => 'AED',
            'payment_method' => 'cod',
            'payment_details' => [],
        ];

        $request = Request::create('/api/payments', 'POST', $paymentData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->process($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('cod', $data['data']['method']);
        $this->assertEquals('pending', $data['data']['status']);
    }

    public function test_process_card_payment(): void
    {
        $controller = new PaymentController();
        $order = [
            'id' => 'TEST-123',
            'status' => 'confirmed',
            'total' => 100,
        ];
        Session::put('orders', [$order]);

        $paymentData = [
            'order_id' => 'TEST-123',
            'amount' => 100,
            'currency' => 'AED',
            'payment_method' => 'card',
            'payment_details' => [
                'card_number' => '4111111111111111',
                'card_expiry' => '12/28',
                'card_cvv' => '123',
                'card_name' => 'John Doe',
            ],
        ];

        $request = Request::create('/api/payments', 'POST', $paymentData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->process($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('card', $data['data']['method']);
        $this->assertEquals('completed', $data['data']['status']);
        $this->assertEquals('Visa', $data['data']['card']['type']);
        $this->assertEquals('**** **** **** 1111', $data['data']['card']['masked_number']);
    }
}