<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class SectionController extends Controller
{
    use RespondsWithJson;

    public function index(): JsonResponse
    {
        $service = app(ProductDataService::class);
        return $this->ok($service->getAllSections(), 'Sections retrieved');
    }
}
