<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/quran', [App\Http\Controllers\QuranController::class, 'index']);
Route::get('/quran/{surat}', [App\Http\Controllers\QuranController::class, 'surat']);

