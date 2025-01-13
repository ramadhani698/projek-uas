<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tafsir extends Model
{
    use HasFactory;

    protected $table = 'tafsirs';
    protected $fillable = [
        'nomor_surah',
        'nomor_ayat',
        'teks'
    ];
}
