<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Buat beberapa pengguna contoh
        User::create([
            'username' => 'admin',
            'password' => Hash::make('password123'),
            'email' => 'admin@example.com',
            'number' => '1234567890',
            'role_id' => 'admin',
        ]);

        User::create([
            'username' => 'user1',
            'password' => Hash::make('password123'),
            'email' => 'user1@example.com',
            'number' => '0987654321',
            'role_id' => 'user',
        ]);

        User::create([
            'username' => 'user2',
            'password' => Hash::make('password123'),
            'email' => 'user2@example.com',
            'number' => '1122334455',
            'role_id' => 'user',
        ]);

        User::create([
            'username' => 'user3',
            'password' => Hash::make('password123'),
            'email' => 'user3@example.com',
            'number' => '1122334455',
            'role_id' => 'user',
        ]);

        User::create([
            'username' => 'user4',
            'password' => Hash::make('password123'),
            'email' => 'user4@example.com',
            'number' => '1122334455',
            'role_id' => 'user',
        ]);

        // Anda bisa menambahkan lebih banyak pengguna sesuai kebutuhan
    }
}
