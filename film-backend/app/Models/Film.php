<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    // Tentukan nama tabel jika tidak menggunakan nama model yang di-plural
    protected $table = 'dramas';
    protected $primaryKey = 'id';
    

    // Kolom-kolom yang dapat diisi secara massal
    protected $fillable = [
        'url_cover',
        'title',
        'alt_title',
        'description',
        'trailer',
        'stream_site',
        'year',
        'status',
        'created_at',
        'created_by',
        'country_id',
    ];

    // Relasi dengan Genre
    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'dramas_genres', 'drama_id', 'genre_id');
    }

    // Relasi dengan Actor
    public function actors()
    {
        return $this->belongsToMany(Actor::class, 'dramas_actors', 'drama_id', 'actor_id');
    }

    // Relasi dengan Country
    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    // Relasi dengan Awards
    public function awards()
    {
        return $this->hasMany(Award::class, 'drama_id');
    }

    // Film memiliki banyak komentar
    public function comments()
    {
        return $this->hasMany(Comment::class, 'drama_id');
    }
}
