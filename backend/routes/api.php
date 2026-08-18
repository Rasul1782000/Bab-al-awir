<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\ContactController;

Route::get('/regions', [RegionController::class, 'index']);
Route::get('/languages', [LanguageController::class, 'index']);
Route::get('/sections', [SectionController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/user/profile', [UserController::class, 'profile']);

Route::post('/login', [UserController::class, 'login']);
Route::post('/signup', [UserController::class, 'signup']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);

Route::get('/brand-values', [ContentController::class, 'brandValues']);
Route::get('/brands', [ContentController::class, 'brands']);
Route::get('/store-locations', [ContentController::class, 'storeLocations']);
Route::get('/delivery-options', [ContentController::class, 'deliveryOptions']);
Route::get('/offers', [ContentController::class, 'offers']);
Route::get('/testimonials', [ContentController::class, 'testimonials']);
Route::get('/faq', [ContentController::class, 'faq']);
Route::get('/team-members', [ContentController::class, 'teamMembers']);
Route::get('/news', [ContentController::class, 'news']);
Route::get('/promo-banners', [ContentController::class, 'promoBanners']);

Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::put('/cart/{productId}', [CartController::class, 'update']);
Route::delete('/cart/{productId}', [CartController::class, 'destroy']);
Route::delete('/cart', [CartController::class, 'clear']);

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

Route::post('/payments', [PaymentController::class, 'process']);
Route::get('/payments/methods', [PaymentController::class, 'methods']);

Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::get('/reviews/{id}', [ReviewController::class, 'show']);
Route::get('/reviews/product/{productId}/summary', [ReviewController::class, 'productSummary']);
Route::post('/reviews/{id}/helpful', [ReviewController::class, 'updateHelpful']);

Route::get('/wishlist', [WishlistController::class, 'index']);
Route::post('/wishlist', [WishlistController::class, 'store']);
Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);
Route::get('/wishlist/check/{productId}', [WishlistController::class, 'check']);
Route::delete('/wishlist', [WishlistController::class, 'clear']);

Route::post('/contact', [ContactController::class, 'store']);
Route::get('/contact', [ContactController::class, 'index']);
Route::get('/contact/{id}', [ContactController::class, 'show']);
Route::put('/contact/{id}', [ContactController::class, 'update']);