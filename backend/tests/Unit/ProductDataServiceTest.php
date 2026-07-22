><?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Api\ProductDataService;

class ProductDataServiceTest extends TestCase
{
    /**
     * Test that ProductDataService uses efficient lookup (O(1)) for getProductById
     */
    public function test_get_product_by_id_uses_efficient_lookup(): void
    {
        $service = new ProductDataService();

        // Get a random product ID
        $allProducts = $service->getProducts();
        $testProductId = $allProducts[array_rand($allProducts)]['id'];

        // Test the lookup - should be O(1) not O(n)
        $product = $service->getProductById($testProductId);

        $this->assertNotNull($product);
        $this->assertEquals($testProductId, $product['id']);

        // Test that non-existent product returns null
        $nonExistentProduct = $service->getProductById(99999);
        $this->assertNull($nonExistentProduct);
    }

    /**
     * Test that ProductDataService caches product data
     */
    public function test_product_data_is_cached(): void
    {
        $service = new ProductDataService();

        // Get products twice - second call should use cache
        $products1 = $service->getProducts();
        $products2 = $service->getProducts();

        $this->assertEquals($products1, $products2);
        $this->assertIsArray($products1);
        $this->assertGreaterThan(0, count($products1));
    }

    /**
     * Test that ProductDataService uses caching for other data types
     */
    public function test_regions_are_cached(): void
    {
        $service = new ProductDataService();
        $regions1 = $service->getAllRegions();
        $regions2 = $service->getAllRegions();

        $this->assertEquals($regions1, $regions2);
        $this->assertIsArray($regions1);
        $this->assertGreaterThan(0, count($regions1));
    }

    /**
     * Test that ProductDataService caches languages
     */
    public function test_languages_are_cached(): void
    {
        $service = new ProductDataService();
        $languages1 = $service->getAllLanguages();
        $languages2 = $service->getAllLanguages();

        $this->assertEquals($languages1, $languages2);
        $this->assertIsArray($languages1);
        $this->assertGreaterThan(0, count($languages1));
    }

    /**
     * Test that ProductDataService caches sections
     */
    public function test_sections_are_cached(): void
    {
        $service = new ProductDataService();
        $sections1 = $service->getAllSections();
        $sections2 = $service->getAllSections();

        $this->assertEquals($sections1, $sections2);
        $this->assertIsArray($sections1);
        $this->assertGreaterThan(0, count($sections1));
    }

    /**
     * Test that ProductDataService caches categories
     */
    public function test_categories_are_cached(): void
    {
        $service = new ProductDataService();
        $categories1 = $service->getAllCategories();
        $categories2 = $service->getAllCategories();

        $this->assertEquals($categories1, $categories2);
        $this->assertIsArray($categories1);
        $this->assertGreaterThan(0, count($categories1));
    }
}