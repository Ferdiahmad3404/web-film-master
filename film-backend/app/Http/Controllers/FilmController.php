<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class FilmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil film beserta genre dan actor melalui relasi many-to-many
        $films = Film::with(['genres', 'actors', 'country', 'awards'])->get();

        return response()->json([
            'success' => true,
            'data' => $films,
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validasi data yang diterima
            $request->validate([
                'poster' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'title' => 'required|string|max:64',
                'alt_title' => 'nullable|string|max:64',
                'description' => 'nullable|string',
                'trailer' => 'nullable|string',
                'stream_site' => 'nullable|string',
                'year' => 'required|integer',
                'status' => 'required|string|max:16',
                'created_by' => 'nullable|string|max:255',
                'country_id' => 'required|integer',
                'genres' => 'nullable|array',
                'actors' => 'nullable|array',
            ]);

            // Meng-upload file poster
            $path = $request->file('poster')->store('posters', 'public');

            // Membuat film baru
            $film = Film::create(array_merge($request->all(), [
                'url_cover' => $path,
            ]));

            // Menghubungkan film dengan genre
            if ($request->has('genres')) {
                $film->genres()->attach($request->genres);
            }

            // Menghubungkan film dengan aktor
            if ($request->has('actors') && !empty($request->actors)) {
                $film->actors()->attach($request->actors);
            }
            

            return response()->json(['message' => 'Film added successfully', 'success' => true, 'data' => $film], 201);
        } catch (\Exception $e) {
            // Menangkap kesalahan dan mengembalikan respons JSON
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        // Ambil satu film beserta genre, actor, dan hanya komentar yang berstatus 'approved'
        $film = Film::with([
            'genres',
            'actors',
            'country',
            'awards',
            // 'comments' => function ($query) {
            //     $query->approved(); // Memanggil scope approved di model Comment
            // }
        ])->find($id);

        return response()->json([
            'success' => true,
            'data' => $film,
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $film = Film::find($id);

        if (!$film) {
            return response()->json(['message' => 'Film not found'], 404);
        }

        // Update poster jika ada file
        if ($request->hasFile('poster')) {
            if ($film->url_cover) {
                Storage::disk('public')->delete($film->url_cover);
            }
            $path = $request->file('poster')->store('posters', 'public');
            $film->url_cover = $path;
        }

        // Update data lainnya
        $film->title = $request->get('title') ?? $film->title;
        $film->alt_title = $request->get('alt_title') ?? $film->alt_title;
        $film->description = $request->get('description') ?? $film->description;
        $film->trailer = $request->get('trailer') ?? $film->trailer;
        $film->stream_site = $request->get('stream_site') ?? $film->stream_site;
        $film->year = $request->get('year') ?? $film->year;
        $film->status = $request->get('status') ?? $film->status;
        $film->country_id = $request->get('country_id') ?? $film->country_id;

        // Simpan perubahan
        if ($film->save()) {
            Log::info('Film saved successfully:', $film->toArray());
        } else {
            Log::error('Failed to save the film');
        }

        // Update genres dan actors
        if ($request->filled('genres')) {
            $film->genres()->sync($request->input('genres'));
            Log::info('Updated genres:', $request->input('genres'));
        }
        if ($request->filled('actors')) {
            $film->actors()->sync($request->input('actors'));
            Log::info('Updated actors:', $request->input('actors'));
        }

        return response()->json(['message' => 'Film updated successfully', 'success' => true, 'data' => $film], 200);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Temukan film berdasarkan ID
        $film = Film::find($id);

        // Cek apakah film ditemukan
        if (!$film) {
            return response()->json(['message' => 'Film not found'], 404);
        }

        // Hapus file poster dari storage jika ada
        if ($film->url_cover) {
            Storage::disk('public')->delete($film->url_cover);
        }

        // Hapus relasi dengan actors dan genres di tabel pivot
        $film->actors()->detach();
        $film->genres()->detach();

        // Hapus semua awards yang berelasi dengan film ini
        $film->awards()->delete();

        // Hapus semua komentar yang berelasi dengan film ini
        $film->comments()->delete();

        // Terakhir, hapus data film
        $film->delete();

        return response()->json(['message' => 'Drama and all related data deleted successfully', 'success' => true], 200);
    }

}
