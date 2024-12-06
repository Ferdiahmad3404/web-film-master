<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class GenreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $genres = Genre::all();
        return response()->json($genres, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'genre' => 'required|string|max:32|unique:genres,genre', // Ensure genre name is unique
            ]);

            $genre = Genre::create($validatedData);
            return response()->json(['message' => 'Genre added successfully', 'data' => $genre], 201);

        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0]; // Mendapatkan kode error dari PostgreSQL
            
            // Tangani error duplikasi unik
            if ($errorCode == '23505') {
                return response()->json(['message' => 'Genre name must be unique'], 400);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json(['message' => 'Genre not found'], 404);
        }

        return response()->json($genre, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json(['message' => 'Genre not found'], 404);
        }
    
        try {
            $validatedData = $request->validate([
                'genre' => 'required|string|max:255',
            ]);

            // Check if the new genre already exists (case insensitive) and is not the same as the current genre
            $existingGenre = Genre::where('genre', 'ILIKE', $validatedData['genre'])
                                    ->where('id', '!=', $id)
                                    ->first();

            if ($existingGenre) {
                return response()->json(['message' => 'Genre already exists'], 409); // Conflict
            }

            $genre->update($validatedData);
            return response()->json(['message' => 'Genre updated successfully', 'data' => $genre], 200);
        
        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0];

            if ($errorCode == '23505') {
                return response()->json(['message' => 'Genre name must be unique'], 400);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $genre = Genre::find($id);

        if (!$genre) {
            return response()->json(['message' => 'Genre not found'], 404);
        }

        try {
            $genre->delete();
            return response()->json(['message' => 'Genre deleted successfully'], 200);
        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0];

            // Tangani error referensi asing
            if ($errorCode == '23503') { // kode error referensi asing di PostgreSQL
                return response()->json([
                    'message' => 'Cannot delete genre, it is still referenced by Films.'
                ], 409);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }
}
