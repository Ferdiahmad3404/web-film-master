<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateDramasTables extends Migration
{
    public function up()
    {
        // Create 'genres' table
        Schema::create('genres', function (Blueprint $table) {
            $table->id();
            $table->string('genre')->unique();
        });

        // Create 'countries' table
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('country')->unique();
        });

        // Create 'actors' table
        Schema::create('actors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url_photos')->nullable();
            $table->date('birth_date')->nullable();
            $table->foreignId('country_id')->constrained('countries')->onDelete('restrict');
        });

        // Create 'users' table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('email')->unique();
            $table->string('number')->nullable();
            $table->enum('role_id', ['admin', 'user'])->default('user'); // Menggunakan enum roles
            $table->timestamp('created_date')->default(DB::raw('CURRENT_TIMESTAMP'));
        });

        // Create 'dramas' table
        Schema::create('dramas', function (Blueprint $table) {
            $table->id();
            $table->string('url_cover')->nullable();
            $table->string('title');
            $table->string('alt_title')->nullable();
            $table->text('description')->nullable();
            $table->string('trailer')->nullable();
            $table->string('stream_site')->nullable();
            $table->enum('status', ['approved', 'pending', 'unapproved'])->default('pending'); // Menggunakan enum status
            $table->timestamp('created_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->foreignId('country_id')->constrained('countries')->onDelete('restrict');
            $table->string('created_by')->nullable();
            $table->Integer('year');
        });

        // Create 'comments' table
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->longText('comment');
            $table->integer('rating')->nullable();
            $table->enum('status', ['approved', 'pending', 'unapproved'])->default('pending');
            $table->foreignId('drama_id')->constrained('dramas')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDElete('cascade');
            $table->timestamp('created_date')->default(DB::raw('CURRENT_TIMESTAMP'));
        });

        // Create 'awards' table
        Schema::create('awards', function (Blueprint $table) {
            $table->id();
            $table->string('award');
            $table->foreignId('drama_id')->constrained('dramas')->onDelete('cascade')->nullable();
            $table->smallInteger('year');
            $table->foreignId('country_id')->constrained('countries')->onDelete('restrict')->nullable();
        });

        // Create 'dramas_genres' table
        Schema::create('dramas_genres', function (Blueprint $table) {
            $table->foreignId('drama_id')->constrained('dramas')->onDelete('cascade');
            $table->foreignId('genre_id')->constrained('genres')->onDelete('restrict');
            $table->primary(['drama_id', 'genre_id']);
        });

        // Create 'dramas_actors' table
        Schema::create('dramas_actors', function (Blueprint $table) {
            $table->foreignId('drama_id')->constrained('dramas')->onDelete('cascade');
            $table->foreignId('actor_id')->constrained('actors')->onDelete('restrict');
            $table->primary(['drama_id', 'actor_id']);
        });
    }

    public function down()
    {
        // Drop tables in reverse order to handle foreign key dependencies
        Schema::dropIfExists('dramas_actors');
        Schema::dropIfExists('dramas_genres');
        Schema::dropIfExists('awards');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('users');
        Schema::dropIfExists('actors');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('genres');
        Schema::dropIfExists('dramas');

        // Drop the custom types
        DB::statement("DROP TYPE IF EXISTS roles");
        DB::statement("DROP TYPE IF EXISTS status");
    }
}
