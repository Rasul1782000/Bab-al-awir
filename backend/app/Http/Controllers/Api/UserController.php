<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use RespondsWithJson;

    public function profile(): JsonResponse
    {
        return $this->ok(config('dummy.user'), 'User profile retrieved');
    }

    public function login(Request $request): JsonResponse
    {
        $email = strtolower(trim($request->input('email', '')));
        $password = $request->input('password', '');

        foreach ((array) config('dummy.auth.users', []) as $user) {
            if (strtolower($user['email']) === $email && $user['password'] === $password) {
                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'data' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'name_ar' => $user['name_ar'],
                        'email' => $user['email'],
                        'phone' => $user['phone'],
                        'token' => config('dummy.auth.token'),
                    ],
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password',
            'data' => null,
        ], 401);
    }

    public function signup(Request $request): JsonResponse
    {
        $name = trim($request->input('name', ''));
        $email = strtolower(trim($request->input('email', '')));
        $phone = trim($request->input('phone', ''));
        $password = $request->input('password', '');

        $errors = [];

        if ($name === '') {
            $errors[] = 'Name is required';
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'A valid email is required';
        }
        if ($phone === '') {
            $errors[] = 'Phone number is required';
        }
        if (strlen($password) < 6) {
            $errors[] = 'Password must be at least 6 characters';
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'message' => implode(', ', $errors),
                'data' => null,
            ], 422);
        }

        foreach ((array) config('dummy.auth.users', []) as $user) {
            if (strtolower($user['email']) === $email) {
                return response()->json([
                    'success' => false,
                    'message' => 'An account already exists for that email',
                    'data' => null,
                ], 409);
            }
        }

        $newId = 1;
        $existing = (array) config('dummy.auth.users', []);
        if (!empty($existing)) {
            $maxId = max(array_column($existing, 'id'));
            $newId = $maxId + 1;
        }

        $created = [
            'id' => $newId,
            'name' => $name,
            'name_ar' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => $password,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully',
            'data' => [
                'id' => $created['id'],
                'name' => $created['name'],
                'email' => $created['email'],
                'phone' => $created['phone'],
                'token' => config('dummy.auth.token'),
            ],
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $email = strtolower(trim($request->input('email', '')));

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'success' => false,
                'message' => 'A valid email is required',
                'data' => null,
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => config('dummy.auth.reset_message', 'If an account exists for that email, a reset link has been sent.'),
            'data' => [
                'email' => $email,
                'note' => 'Demo: use any of the seeded account emails or sign up.',
            ],
        ]);
    }
}
