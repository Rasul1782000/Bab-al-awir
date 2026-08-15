<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    use RespondsWithJson;

    public function brandValues(): JsonResponse
    {
        return $this->ok(config('dummy.brand.values'), 'Brand values retrieved');
    }

    public function brands(): JsonResponse
    {
        return $this->ok(config('dummy.brands'), 'Brands retrieved');
    }

    public function storeLocations(): JsonResponse
    {
        return $this->ok(config('dummy.store_locations'), 'Store locations retrieved');
    }

    public function deliveryOptions(): JsonResponse
    {
        return $this->ok(config('dummy.delivery_options'), 'Delivery options retrieved');
    }

    public function offers(): JsonResponse
    {
        return $this->ok(config('dummy.offers'), 'Offers retrieved');
    }

    public function testimonials(): JsonResponse
    {
        return $this->ok(config('dummy.testimonials'), 'Testimonials retrieved');
    }

    public function faq(): JsonResponse
    {
        return $this->ok(config('dummy.faq'), 'FAQ retrieved');
    }

    public function teamMembers(): JsonResponse
    {
        return $this->ok(config('dummy.team_members'), 'Team members retrieved');
    }

    public function news(): JsonResponse
    {
        return $this->ok(config('dummy.news'), 'News retrieved');
    }

    public function promoBanners(): JsonResponse
    {
        return $this->ok(config('dummy.promo_banners'), 'Promo banners retrieved');
    }
}
