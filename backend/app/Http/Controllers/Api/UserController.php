<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    use RespondsWithJson;

    public function profile(): JsonResponse
    {
        return $this->ok(config('dummy.user'), 'User profile retrieved');
    }
}
