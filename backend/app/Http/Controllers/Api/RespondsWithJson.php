<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

trait RespondsWithJson
{
    protected function ok(mixed $data, string $message = 'OK'): JsonResponse
    {
        $cacheKey = md5($message . serialize($data));
        $response = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($data, $message) {
            $response = response()->json([
                'success' => true,
                'message' => $message,
                'data' => $data,
            ]);
            return $response->withHeaders([
                'Cache-Control' => 'public, max-age=86400',
                'Expires' => gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT',
            ]);
        });
        return $response;
    }
}
