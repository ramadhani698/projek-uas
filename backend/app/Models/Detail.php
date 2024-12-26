<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class detail extends Model
{
    use HasFactory;
    protected $table = 'details';

    protected $fillable = [
        'nomor_surah',
        'nomor_ayat',
        'teks_arab',
        'teks_latin',
        'teks_indonesia',
        'audio',
    ];

    protected $cats = ["audio" => 'array'];
}
