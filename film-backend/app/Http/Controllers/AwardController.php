<?php

namespace App\Http\Controllers;

use App\Models\Award;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class AwardController extends Controller
{
    // Function to display all awards
    public function index()
    {
        $awards = Award::with(['country', 'film'])->get();
        return response()->json($awards, 200);
    }

    // Function to store a new award
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'award' => 'required|string|max:64|unique:awards,award',
                'country_id' => 'required|exists:countries,id',
                'year' => 'required|integer|min:1900|max:' . date('Y'),
            ]);

            $award = Award::create($validatedData);
            return response()->json(['message' => 'Award added successfully', 'data' => $award], 201);

        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0];

            if ($errorCode == '23505') {
                return response()->json(['message' => 'Award name must be unique'], 400);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }

    // Function to update an existing award
    public function update(Request $request, $id)
    {
        $award = Award::find($id);

        if (!$award) {
            return response()->json(['message' => 'Award not found'], 404);
        }

        try {
                $validatedData = $request->validate([
                    'award' => 'required|string|max:255',
                    'drama_id' => 'nullable|exists:films,id',
                    'country_id' => 'nullable|exists:countries,id',
                    'year' => 'required|integer|min:1900|max:' . date('Y'),
                ]);
    
                // Cek jika nama country sudah ada (case insensitive)
                $existingAward = Award::where('award', 'ILIKE', $validatedData['award'])
                                          ->where('id', '!=', $id)
                                          ->first();
    
                if ($existingAward) {
                    return response()->json(['message' => 'Award already exists'], 400);
                }
    
                $award->update($validatedData);
                return response()->json(['message' => 'Award updated successfully', 'data' => $award], 200);
    
        } catch (QueryException $e) {
                $errorCode = $e->errorInfo[0];
    
                if ($errorCode == '23505') {
                    return response()->json(['message' => 'Award name must be unique'], 400);
                }
    
                return response()->json([
                    'message' => 'Database error',
                    'error' => $e->errorInfo[2]
                ], 500);
        }
    }


    // Function to delete an award
    public function destroy($id)
    {
        // Temukan award berdasarkan ID
        $award = Award::find($id);

        if (!$award) {
            return response()->json(['message' => 'Award not found'], 404);
        }

        // Periksa apakah drama_id bernilai null
        if (!is_null($award->drama_id)) {
            return response()->json([
                'message' => 'Cannot delete award because it is associated with a drama.'
            ], 409);
        }

        try {
            // Jika drama_id null, maka award bisa dihapus
            $award->delete();
            return response()->json(['message' => 'Award deleted successfully'], 200);

        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0];

            // Tangani error referensi asing
            if ($errorCode == '23503') { // kode error referensi asing di PostgreSQL
                return response()->json([
                    'message' => 'Cannot delete award, it is still referenced by other entities.'
                ], 409);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }
}
