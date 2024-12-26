<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuratController;

Route::get('/surah', [SuratController::class, 'fetchFromAPI']);
Route::get('/surahall', [SuratController::class, 'index']);

Route::get('/detail', [SuratController::class, 'importAyat']);
Route::get('/detail/{nomor}', [SuratController::class, 'ayat']);

Route::get('/tafsir', [SuratController::class, 'importTafsir']);
Route::get('/tafsir/{nomor}', [SuratController::class, 'tafsir']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
