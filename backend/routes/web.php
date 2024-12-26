<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuratController;

// Route untuk fetch data dari API dan simpan ke database
Route::get('/fetch-surats', [SuratController::class, 'fetchFromAPI']);

// Route untuk menampilkan data dari database
Route::get('/surats', [SuratController::class, 'index']);

Route::get('/', function () {
    return view('welcome');
});
