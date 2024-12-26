<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Surat extends Model
{
    use HasFactory;
    protected $table ='surats';

    protected $fillable = [
        'nomor',
        'nama',
        'nama_latin',
        'jumlah_ayat',
        'deskripsi',
        'tempat_turun',
        'arti',
        'audioFull',
    ];

    protected $cats = ["audioFull" => 'array'];
}
