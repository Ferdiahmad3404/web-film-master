<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    use HasFactory;

    public $timestamps = false;

    // Define the table name
    protected $table = 'awards';

    // Define the primary key field
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'award',
        'drama_id',
        'country_id',
        'year',
    ];

    // Define a relationship with the Film model
    public function film()
    {
        return $this->belongsTo(Film::class, 'drama_id'); // 'drama_id' is the foreign key in the awards table
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id'); // 'country_id' is the foreign key in the awards table
    }
}
