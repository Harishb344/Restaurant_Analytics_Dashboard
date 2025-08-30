<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AnalyticsController;

Route::get('/api/restaurants', [RestaurantController::class, 'index']);
Route::get('/api/restaurants/{id}', [RestaurantController::class, 'show']);

// ✅ Single unified analytics route
Route::get('/api/analytics', [AnalyticsController::class, 'analytics']);

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
