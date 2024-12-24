<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuranController;

Route::get('/quran', 'QuranController@index');

Route::get('/', function () {
    return view('welcome');
});
