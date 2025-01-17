<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class detail extends Model
{
    use HasFactory;

    protected $table = 'ayats';

    protected $fillable = [
        'nomor_surah',
        'nomor_ayat',
        'teks_arab',
        'teks_latin',
        'teks_indo',
        'audio'
    ];

    protected $cats = ['audio' => 'array'];
}
