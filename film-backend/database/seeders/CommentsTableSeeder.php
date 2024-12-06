<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\User;
use App\Models\Film;

class CommentsTableSeeder extends Seeder
{
    public function run()
    {
        // Pastikan sudah ada user dan film yang akan diberikan komentar
        $userIds = User::pluck('id')->toArray();
        $filmIds = Film::pluck('id')->toArray();

        for ($i = 0; $i < 10; $i++) {
            // Array contoh konten untuk komentar utama
            $mainComments = [
                'Film yang sangat menginspirasi!',
                'Ceritanya bagus dan aktornya keren!',
                'Alur cerita sedikit lambat, tapi masih bagus.',
                'Suka banget sama drama ini!',
                'Banyak adegan yang menyentuh hati!',
            ];
        
            // Array contoh konten untuk reply
            $replies = [
                'Saya setuju dengan komentar ini!',
                'Memang benar, ceritanya sangat menarik.',
                'Saya kurang setuju, menurut saya masih ada kekurangan.',
                'Sama, saya juga suka drama ini!',
                'Review yang bagus, terima kasih!',
            ];
        
            // Buat komentar utama untuk setiap film
            $mainComment = Comment::create([
                'user_id' => $userIds[array_rand($userIds)],
                'drama_id' => $filmIds[array_rand($filmIds)],
                'parent_id' => null, // Komentar utama
                'comment' => $mainComments[array_rand($mainComments)], // Konten acak dari array
                'status' => 'pending',
                'rating' => rand(1, 5),
            ]);
        
            // Tambahkan beberapa balasan untuk setiap komentar utama
            for ($j = 0; $j < rand(1, 3); $j++) { // Menentukan jumlah balasan secara acak antara 1 sampai 3
                Comment::create([
                    'user_id' => $userIds[array_rand($userIds)],
                    'drama_id' => $filmIds[array_rand($filmIds)],
                    'parent_id' => $mainComment->id, // Reply pada komentar utama
                    'status' => 'pending',
                    'comment' => $replies[array_rand($replies)], // Konten acak dari array reply
                    'rating' => rand(1, 5), // Opsional, bisa tambahkan rating pada balasan
                ]);
            }
        }
    }
}
