<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class OrderControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Session::flush();
    }

    public function test_index_returns_empty_orders_when_empty(): void
    {
        $controller = new OrderController();
        $request = Request::create('/api/orders', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->index();
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertIsArray($data['data']['data']);
        $this->assertEmpty($data['data']['data']);
    }

    public function test_store_creates_order(): void
    {
        $controller = new OrderController();
        $orderData = [
            'items' => [
                ['product_id' => 1, 'quantity' => 2, 'price' => 12.50],
            ],
            'shipping_address' => [
                'name' => 'John Doe',
                'phone' => '+971 50 123 4567',
                'address_line1' => '123 Main St',
                'city' => 'Dubai',
                'state' => 'Dubai',
                'postal_code' => '00000',
                'country' => 'UAE',
            ],
            'payment_method' => 'card',
            'payment_details' => [
                'card_number' => '4111111111111111',
                'card_expiry' => '12/28',
                'card_cvv' => '123',
                'card_name' => 'John Doe',
            ],
        ];

        $request = Request::create('/api/orders', 'POST', $orderData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('confirmed', $data['data']['status']);
        $this->assertEquals(2, $data['data']['items'][0]['quantity']);
    }

    public function test_show_returns_order(): void
    {
        $controller = new OrderController();
        $order = [
            'id' => 'TEST-123',
            'status' => 'confirmed',
            'items' => [['product_id' => 1, 'quantity' => 1, 'price' => 10]],
            'total' => 25,
        ];
        Session::put('orders', [$order]);

        $request = Request::create('/api/orders/TEST-123', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->show('TEST-123');
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('TEST-123', $data['data']['id']);
    }

    public function test_show_returns_404_for_missing_order(): void
    {
        $controller = new OrderController();
        $request = Request::create('/api/orders/NONEXISTENT', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->show('NONEXISTENT');
        $this->assertEquals(404, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Order not found', $data['message']);
    }

    public function test_update_changes_status(): void
    {
        $controller = new OrderController();
        $order = [
            'id' => 'TEST-123',
            'status' => 'confirmed',
            'status_label' => 'Order Confirmed',
            'status_history' => [['status' => 'confirmed', 'label' => 'Order Confirmed', 'timestamp' => now()->toISOString()]],
        ];
        Session::put('orders', [$order]);

        $request = Request::create('/api/orders/TEST-123', 'PUT', ['status' => 'shipped']);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->update($request, 'TEST-123');
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals('shipped', $data['data']['status']);
        $this->assertEquals('Shipped', $data['data']['status_label']);
        $this->assertCount(2, $data['data']['status_history']);
    }

    public function test_destroy_cancels_order(): void
    {
        $controller = new OrderController();
        $order = [
            'id' => 'TEST-123',
            'status' => 'confirmed',
        ];
        Session::put('orders', [$order]);

        $request = Request::create('/api/orders/TEST-123', 'DELETE');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->destroy('TEST-123');
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);

        $orders = Session::get('orders', []);
        $this->assertEmpty($orders);
    }
}