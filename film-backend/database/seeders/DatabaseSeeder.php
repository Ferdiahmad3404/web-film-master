<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UsersTableSeeder::class, // Tambahkan seeder Users
            CommentsTableSeeder::class, // Seeder Comments
            // Tambahkan seeder lain jika ada
        ]);
    }
}
