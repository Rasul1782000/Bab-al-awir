<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\CartController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Session::flush();
    }

    public function test_index_returns_empty_cart_when_empty(): void
    {
        $controller = new CartController();
        $request = Request::create('/api/cart', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->index();
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertIsArray($data['data']);
        $this->assertEmpty($data['data']);
    }

    public function test_store_saves_cart_items(): void
    {
        $controller = new CartController();
        $items = [
            ['product_id' => 1, 'quantity' => 2],
            ['product_id' => 2, 'quantity' => 1],
        ];

        $request = Request::create('/api/cart', 'POST', ['items' => $items]);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertCount(2, $data['data']);
    }

    public function test_update_changes_quantity(): void
    {
        $controller = new CartController();
        $items = [['product_id' => 1, 'quantity' => 2]];
        Session::put('cart', $items);

        $request = Request::create('/api/cart/1', 'PUT', ['quantity' => 5]);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->update($request, 1);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals(5, $data['data'][0]['quantity']);
    }

    public function test_update_removes_item_when_quantity_zero(): void
    {
        $controller = new CartController();
        $items = [['product_id' => 1, 'quantity' => 2]];
        Session::put('cart', $items);

        $request = Request::create('/api/cart/1', 'PUT', ['quantity' => 0]);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->update($request, 1);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEmpty($data['data']);
    }

    public function test_destroy_removes_item(): void
    {
        $controller = new CartController();
        $items = [
            ['product_id' => 1, 'quantity' => 2],
            ['product_id' => 2, 'quantity' => 1],
        ];
        Session::put('cart', $items);

        $request = Request::create('/api/cart/1', 'DELETE');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->destroy(1);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertCount(1, $data['data']);
        $this->assertEquals(2, $data['data'][0]['product_id']);
    }

    public function test_clear_empties_cart(): void
    {
        $controller = new CartController();
        $items = [['product_id' => 1, 'quantity' => 2]];
        Session::put('cart', $items);

        $request = Request::create('/api/cart', 'DELETE');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->clear($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEmpty($data['data']);
    }
}