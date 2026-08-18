<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ReviewControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Session::flush();
    }

    public function test_index_returns_reviews(): void
    {
        $controller = new ReviewController();
        $reviews = [
            [
                'id' => 'REV-TEST1',
                'product_id' => 1,
                'user_name' => 'Test User',
                'rating' => 5,
                'title' => 'Great!',
                'comment' => 'Love it',
                'status' => 'approved',
            ],
        ];
        Session::put('reviews', $reviews);

        $request = Request::create('/api/reviews', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->index($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertCount(1, $data['data']['data']);
    }

    public function test_index_filters_by_product_id(): void
    {
        $controller = new ReviewController();
        $reviews = [
            ['id' => 'REV-1', 'product_id' => 1, 'user_name' => 'User 1', 'rating' => 5, 'title' => 'Great', 'comment' => 'Good', 'status' => 'approved'],
            ['id' => 'REV-2', 'product_id' => 2, 'user_name' => 'User 2', 'rating' => 4, 'title' => 'Good', 'comment' => 'Okay', 'status' => 'approved'],
        ];
        Session::put('reviews', $reviews);

        $request = Request::create('/api/reviews?product_id=1', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->index($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertCount(1, $data['data']['data']);
        $this->assertEquals(1, $data['data']['data'][0]['product_id']);
    }

    public function test_store_creates_review(): void
    {
        $controller = new ReviewController();
        $reviewData = [
            'product_id' => 1,
            'user_name' => 'Test User',
            'user_email' => 'test@example.com',
            'rating' => 5,
            'title' => 'Excellent!',
            'comment' => 'This product is amazing.',
            'verified_purchase' => true,
        ];

        $request = Request::create('/api/reviews', 'POST', $reviewData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals(1, $data['data']['product_id']);
        $this->assertEquals(5, $data['data']['rating']);
        $this->assertEquals('Excellent!', $data['data']['title']);
    }

    public function test_store_returns_404_for_invalid_product(): void
    {
        $controller = new ReviewController();
        $reviewData = [
            'product_id' => 99999,
            'user_name' => 'Test User',
            'user_email' => 'test@example.com',
            'rating' => 5,
            'title' => 'Excellent!',
            'comment' => 'This product is amazing.',
        ];

        $request = Request::create('/api/reviews', 'POST', $reviewData);
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->store($request);
        $this->assertEquals(404, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Product not found', $data['message']);
    }

    public function test_product_summary_returns_aggregated_data(): void
    {
        $controller = new ReviewController();
        $reviews = [
            ['id' => 'REV-1', 'product_id' => 1, 'user_name' => 'User 1', 'rating' => 5, 'title' => 'Great', 'comment' => 'Good', 'status' => 'approved', 'verified_purchase' => true],
            ['id' => 'REV-2', 'product_id' => 1, 'user_name' => 'User 2', 'rating' => 4, 'title' => 'Good', 'comment' => 'Okay', 'status' => 'approved', 'verified_purchase' => false],
            ['id' => 'REV-3', 'product_id' => 1, 'user_name' => 'User 3', 'rating' => 5, 'title' => 'Amazing', 'comment' => 'Love it', 'status' => 'approved', 'verified_purchase' => true],
        ];
        Session::put('reviews', $reviews);

        $request = Request::create('/api/reviews/product/1/summary', 'GET');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->productSummary(1);
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals(3, $data['data']['total_reviews']);
        $this->assertEquals(4.7, $data['data']['average_rating']);
        $this->assertEquals(2, $data['data']['verified_purchase_count']);
    }

    public function test_update_helpful_increments_count(): void
    {
        $controller = new ReviewController();
        $reviews = [
            ['id' => 'REV-TEST1', 'product_id' => 1, 'user_name' => 'Test', 'rating' => 5, 'title' => 'Great', 'comment' => 'Good', 'status' => 'approved', 'helpful_count' => 0],
        ];
        Session::put('reviews', $reviews);

        $request = Request::create('/api/reviews/REV-TEST1/helpful', 'POST');
        $request->setLaravelSession($this->app['session']->driver());

        $response = $controller->updateHelpful('REV-TEST1');
        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertEquals(1, $data['data']['helpful_count']);
    }
}