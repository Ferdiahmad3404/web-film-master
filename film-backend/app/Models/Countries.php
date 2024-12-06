<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Countries extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'countries';

    // Kolom yang bisa diisi secara mass-assignment
    protected $fillable = ['country'];

    // Primary key
    protected $primaryKey = 'id';

    // Jika tidak menggunakan timestamps (created_at, updated_at)
    public $timestamps = false;
}
