><?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductDataService;

class ProductControllerTest extends TestCase
{
    /**
     * Test ProductController.index uses ProductDataService
     */
    public function test_index_uses_product_data_service(): void
    {
        $controller = new ProductController();
        $response = $controller->index();

        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);

        $this->assertTrue($data['success']);
        $this->assertIsArray($data['data']);
        $this->assertGreaterThan(0, count($data['data']));
    }

    /**
     * Test ProductController.show uses ProductDataService for O(1) lookup
     */
    public function test_show_uses_product_data_service_for_efficient_lookup(): void
    {
        $controller = new ProductController();

        // Test with an existing product
        $allProducts = $this->app->make(ProductDataService::class)->getProducts();
        $testProductId = $allProducts[array_rand($allProducts)]['id'];

        $response = $controller->show($testProductId);

        $this->assertEquals(200, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);

        $this->assertTrue($data['success']);
        $this->assertEquals($testProductId, $data['data']['id']);

        // Test with non-existent product
        $response = $controller->show(99999);
        $this->assertEquals(404, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertEquals('Product not found', $data['message']);
    }
}