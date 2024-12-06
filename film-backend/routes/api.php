<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Rute untuk otentikasi
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('jwt.auth');
Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('jwt.auth');

Route::get('auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
