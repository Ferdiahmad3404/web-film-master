<?php

namespace App\Http\Controllers;

use App\Models\Actor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ActorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Mengambil semua aktor dengan data negara
        $actors = Actor::with('country')->get();

        return response()->json([
            'success' => true,
            'data' => $actors,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            // Validasi input
            $request->validate([
                'name' => 'required|string|max:64',
                'country_id' => 'required|integer|exists:countries,id', 
                'birth_date' => 'nullable|date',
                'poster' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048', 
            ]);

            // Menangani upload foto jika ada
            $photoPath = $request->file('poster')->store('actors', 'public');

            // Membuat aktor baru dan menyimpan data
            $actor = Actor::create(array_merge($request->all(), [
                'url_photos' => $photoPath, 
            ]));

            return response()->json([
                'message' => 'Actor added successfully',
                'success' => true,
                'data' => $actor
            ], 201);
        } catch (\Exception $e) {
            // Menangkap kesalahan dan mengembalikan respons JSON
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Actor $actor)
    {
        // Mengambil aktor dengan data negara
        $actor->load('country');

        return response()->json([
            'success' => true,
            'data' => $actor,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $actor = Actor::find($id);

        if (!$actor) {
            return response()->json(['message' => 'Actor not found'], 404);
        }

        // Update poster jika ada file
        if ($request->hasFile('poster')) {
            if ($actor->url_photos) {
                Storage::disk('public')->delete($actor->url_photos);
            }
            $path = $request->file('poster')->store('actors', 'public');
            $actor->url_photos = $path;
        }

        $actor->name = $request->get('name') ?? $actor->name;
        $actor->birth_date = $request->get('birth_date') ?? $actor->birth_date;
        $actor->country_id = $request->get('country_id') ?? $actor->country_id;
        // $actor->url_photos = $request->get('url_photos') ?? $actor->url_photos;

        try {
            if ($actor->save()) {
                return response()->json(['message' => 'Actor updated successfully', 'success' => true, 'data' => $actor], 200);
            } else {
                return response()->json(['message' => 'Error updating actor'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error updating actor: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating actor', 'error' => $e->getMessage()], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $actor = Actor::find($id);

        if (!$actor) {
            return response()->json(['message' => 'Actor not found'], 404);
        }

        // Hapus file poster jika ada
        if (Storage::disk('public')->exists($actor->url_photos)) {
            Storage::disk('public')->delete($actor->url_photos);
        } else {
            return response()->json(['message' => 'Poster file not found'], 404);
        }

        // Hapus data aktor dari database
        $actor->delete();

        return response()->json(['message' => 'Actor and poster deleted successfully', 'success' => true], 200);
    }
}
