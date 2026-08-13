<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;

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
Route::get('/store-locations', [ContentController::class, 'storeLocations']);
Route::get('/delivery-options', [ContentController::class, 'deliveryOptions']);
Route::get('/offers', [ContentController::class, 'offers']);
Route::get('/testimonials', [ContentController::class, 'testimonials']);
Route::get('/faq', [ContentController::class, 'faq']);
Route::get('/team-members', [ContentController::class, 'teamMembers']);
Route::get('/news', [ContentController::class, 'news']);
Route::get('/promo-banners', [ContentController::class, 'promoBanners']);
