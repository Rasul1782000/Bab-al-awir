<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class WishlistControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Session::flush();
    }

    public function test_index_returns_empty_wishlist_when_empty(): void
    {
        $controller = new WishlistController();
        $request = Request::create('/api/wishlist', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->index();
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertIsArray($data['data']);
        $this->assertEmpty($data['data']);
    }

    public function test_store_adds_product_to_wishlist(): void
    {
        $controller = new WishlistController();
        $request = Request::create('/api/wishlist', 'POST', ['product_id' => 1]);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertCount(1, $data['data']);
        $this->assertEquals(1, $data['data'][0]['product_id']);
    }

    public function test_store_returns_404_for_invalid_product(): void
    {
        $controller = new WishlistController();
        $request = Request::create('/api/wishlist', 'POST', ['product_id' => 99999]);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(404, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Product not found', $data['message']);
    }

    public function test_store_returns_409_for_duplicate_product(): void
    {
        $controller = new WishlistController();
        Session::put('wishlist', [1]);

        $request = Request::create('/api/wishlist', 'POST', ['product_id' => 1]);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(409, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Product already in wishlist', $data['message']);
    }

    public function test_destroy_removes_product(): void
    {
        $controller = new WishlistController();
        Session::put('wishlist', [1, 2, 3]);

        $request = Request::create('/api/wishlist/2', 'DELETE');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->destroy(2);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertCount(2, $data['data']);
        $productIds = array_column($data['data'], 'product_id');
        $this->assertNotContains(2, $productIds);
    }

    public function test_check_returns_true_for_product_in_wishlist(): void
    {
        $controller = new WishlistController();
        Session::put('wishlist', [1, 3, 5]);

        $request = Request::create('/api/wishlist/check/3', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->check(3);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertTrue($data['data']['in_wishlist']);
        $this->assertEquals(3, $data['data']['product_id']);
    }

    public function test_check_returns_false_for_product_not_in_wishlist(): void
    {
        $controller = new WishlistController();
        Session::put('wishlist', [1, 3, 5]);

        $request = Request::create('/api/wishlist/check/2', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->check(2);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertFalse($data['data']['in_wishlist']);
        $this->assertEquals(2, $data['data']['product_id']);
    }

    public function test_clear_empties_wishlist(): void
    {
        $controller = new WishlistController();
        Session::put('wishlist', [1, 2, 3]);

        $request = Request::create('/api/wishlist', 'DELETE');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->clear($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEmpty($data['data']);
    }
}