<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Surat;
use App\Models\Detail;
use App\Models\Tafsir;
use GuzzleHttp\Client;

class SuratController extends Controller
{
    public function fetchFromAPI()
    {
        $response = Http::get('https://equran.id/api/v2/surat');

        if ($response->successful()) {
            $data = $response->json()['data'];

            // Tambahkan debugging untuk melihat data yang diambil
            // dd($data);

            foreach ($data as $item) {
                Surat::updateOrCreate(
                    ['nomor' => $item['nomor']],
                    [
                        'nama' => $item['nama'],
                        'nama_latin' => $item['namaLatin'],
                        'jumlah_ayat' => $item['jumlahAyat'],
                        'tempat_turun' => $item['tempatTurun'],
                        'arti' => $item['arti'],
                        'deskripsi' => $item['deskripsi'],
                        'audio_full' => json_encode($item['audioFull']),
                    ]
                );
            }

            return response()->json(['message' => 'Data successfully fetched and stored']);
        }

        return response()->json(['message' => 'Failed to fetch data'], 500);
    }

    public function index()
    {
        $surats = Surat::all();

        return response()->json([
            'data' => $surats
        ]);
    }

    public function importAyat() {
        ini_set('max_execution_time', 7200); // Set waktu maksimum eksekusi menjadi 2 jam
    
        $client = new Client([
            'timeout' => 7200,
            'connect_timeout' => 7200,
            'retry' => 10,
        ]);
    
        $failedSurah = [];
    
        for ($nomor = 1; $nomor <= 114; $nomor++) {
            $url = "https://equran.id/api/v2/surat/{$nomor}";
            $response = Http::get($url);
    
            if ($response->successful()) {
                $data = $response->json()['data']['ayat'];
    
                foreach ($data as $ayat) {
                    Detail::updateOrCreate([
                        'nomor_surah' => $nomor,
                        'nomor_ayat' => $ayat['nomorAyat'],
                    ],
                    [
                        'teks_arab' => $ayat['teksArab'],
                        'teks_latin' => $ayat['teksLatin'],
                        'teks_indo' => $ayat['teksIndonesia'],
                        'audio' => json_encode($ayat['audio']),
                    ]);
                }
            } else {
                $failedSurah[] = $nomor;
            }
        }
    
        if (empty($failedSurah)) {
            return response()->json([
                'code' => 200,
                'message' => 'All ayat data retrieved successfully'
            ]);
        } else {
            return response()->json([
                'code' => 206,
                'message' => 'Some surah data failed to be retrieved',
                'failedSurah' => $failedSurah
            ]);
        }
    }
    public function ayat($nomor)
    {
        $ayat = Detail::where('nomor_surah', $nomor)->get();
        return response()->json([
            'code' => 200,
            'message' => 'Data ayat retrieved successfully',
            'data' => $ayat,
        ]);
    }
    public function importTafsir()
    {
        ini_set('max_execution_time', 7200); // Set waktu maksimum eksekusi menjadi 2 jam

            $client = new Client([
                'timeout' => 7200,
                'connect_timeout' => 7200,
            'retry' => 10,
            ]);

            for ($nomor = 1; $nomor <= 114; $nomor++) {
                $url = "https://equran.id/api/v2/tafsir/{$nomor}"; 
                $response = Http::get($url);

                if ($response->successful()) {
                    $data = $response->json()['data']['tafsir'];

                    foreach ($data as $ayat) {
                        Tafsir::updateOrCreate([
                            'nomor_surah' => $nomor,
                            'nomor_ayat' => $ayat['ayat'],
                        ],
                        [
                            'teks' => $ayat['teks'],
                        ]
                    );
                }
            } else {
                return response()->json([
                    'code' => 500,
                    'message' => 'Failed to fetch data tafsir for surah {$nomor} from external API'
                ], 500);
            }
        }

        return response()->json([
            'code' => 200,
            'message' => 'All tafsir data retrieved successfully'
        ]);
    }

    public function tafsir($nomor)
    {
        $tafsir = Tafsir::where('nomor_surah', $nomor)->get();
        return response()->json([
            'data' => $tafsir
        ]);
    }

}
