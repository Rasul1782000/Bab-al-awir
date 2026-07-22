<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Cache;

class ProductDataService
{
    private ?array $products = null;
    private ?array $productsById = null;

    public function getProducts(): array
    {
        if ($this->products === null) {
            $this->products = config('dummy.products');
        }
        return $this->products;
    }

    public function getProductById(int $id): ?array
    {
        if ($this->productsById === null) {
            $products = $this->getProducts();
            foreach ($products as $product) {
                $this->productsById[$product['id']] = $product;
            }
        }
        return $this->productsById[$id] ?? null;
    }

    public function getAllRegions(): array
    {
        return Cache::remember('regions', now()->addDay(), function () {
            return config('dummy.regions');
        });
    }

    public function getAllLanguages(): array
    {
        return Cache::remember('languages', now()->addDay(), function () {
            return config('dummy.languages');
        });
    }

    public function getAllSections(): array
    {
        return Cache::remember('sections', now()->addDay(), function () {
            return config('dummy.sections');
        });
    }

    public function getAllCategories(): array
    {
        return Cache::remember('categories', now()->addDay(), function () {
            return config('dummy.categories');
        });
    }
}