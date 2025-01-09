<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuratController;

Route::get('/fetch-surat', [SuratController::class, 'fetchFromAPI']);
Route::get('/suratall', [SuratController::class,'index']);
Route::get('/importayat', [SuratController::class,'importAyat']);
Route::get('/ayat/{nomor}', [SuratController::class,'ayat']);
Route::get('/importtafsir', [SuratController::class,'importTafsir']);
Route::get('/tafsir/{nomor}', [SuratController::class,'Tafsir']);