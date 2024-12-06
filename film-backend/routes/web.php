<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FilmController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ActorController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AwardController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CMSCommentController;
use App\Http\Controllers\UserController;

// Rute untuk Film
Route::prefix('films')->group(function () {
    Route::post('/', [FilmController::class, 'store']);
    Route::get('/{id}', [FilmController::class, 'show']);
    Route::get('/', [FilmController::class, 'index']); 
    Route::post('/{id}', [FilmController::class, 'update']);
    Route::get('/{id}', [FilmController::class, 'show']); 
    Route::delete('/{id}', [FilmController::class, 'destroy']);
    Route::post('/{id}/comments', [CommentController::class, 'addComment']);
    Route::post('/${id}/comments/${commentId}/reply', [CommentController::class, 'addReply']);
    Route::get('/{id}/comments', [CommentController::class, 'getComments']); 
});

// Rute untuk Countries
Route::prefix('countries')->group(function () {
    Route::post('/', [CountryController::class, 'store']);
    Route::get('/', [CountryController::class, 'index']);
    Route::put('/{id}', [CountryController::class, 'update']);
    Route::delete('/{id}', [CountryController::class, 'destroy']);
});

// Rute untuk Genre
Route::prefix('genres')->group(function () {
    Route::post('/', [GenreController::class, 'store']);
    Route::get('/', [GenreController::class, 'index']);
    Route::put('/{id}', [GenreController::class, 'update']);
    Route::delete('/{id}', [GenreController::class, 'destroy']);
});

// Rute untuk Actor
Route::prefix('actors')->group(function () {
    Route::post('/', [ActorController::class, 'store']);
    Route::get('/', [ActorController::class, 'index']);
    Route::post('/{id}', [ActorController::class, 'update']);
    Route::delete('/{id}', [ActorController::class, 'destroy']);
});

// Rute untuk Award
Route::prefix('awards')->group(function () {
    Route::post('/', [AwardController::class, 'store']);
    Route::get('/', [AwardController::class, 'index']);
    Route::put('/{id}', [AwardController::class, 'update']);
    Route::delete('/{id}', [AwardController::class, 'destroy']);
});

// Rute untuk Comments
Route::prefix('CMScomments')->group(function () {
    // Menampilkan semua komentar
    Route::get('/', [CMSCommentController::class, 'index'])->name('comments.index');
    
    // Menyetujui komentar atau menandai sebagai unapproved berdasarkan status
    Route::patch('/{id}/status', [CMSCommentController::class, 'toggleStatus'])->name('comments.toggleStatus');
    
    // Menghapus komentar berdasarkan ID
    Route::delete('/{id}', [CMSCommentController::class, 'destroy'])->name('comments.destroy');
    
    // Menghapus semua komentar berdasarkan ID film (bulk delete)
    Route::delete('/bulk/{filmId}', [CMSCommentController::class, 'bulkDeleteByFilm'])->name('comments.bulkDeleteByFilm');
});

// Rute untuk CMSUsers
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/suspend/{userId}', [UserController::class, 'suspendUser']);
});

// Rute untuk otentikasi
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('jwt.auth');
Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('jwt.auth');