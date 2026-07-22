<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class RegionController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $service = app(ProductDataService::class);
        return $this->ok($service->getAllRegions(), 'Regions retrieved');
    }
}
