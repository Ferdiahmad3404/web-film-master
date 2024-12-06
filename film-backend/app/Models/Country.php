<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    public $timestamps = false;

    // Tentukan nama tabel jika tidak menggunakan nama model yang di-plural
    protected $table = 'countries';

    // Kolom-kolom yang dapat diisi secara massal
    protected $fillable = [
        'country',
    ];

    // Relasi dengan Film
    public function films()
    {
        return $this->hasMany(Film::class);
    }

}
