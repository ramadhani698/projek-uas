<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Surah;
use App\Models\Persurat;

class QuranController extends Controller
{
    public function index(){
        //get surah from DB
        $surahs = Surah::all();
        //return json
        return response()->json($surahs);
    }
    
    public function show($surah){
        $surah = Persurat::where('sura',$surat)->get();
        return response()->json($surah);
    }
}
