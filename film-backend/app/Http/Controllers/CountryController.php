<?php

namespace App\Http\Controllers;

use App\Models\Country; // Gunakan bentuk tunggal "Country"
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class CountryController extends Controller
{
    // Mendapatkan semua negara
    public function index()
    {
        $countries = Country::all();
        return response()->json($countries, 200);
    }

    // Menambah negara baru
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'country' => 'required|string|max:32|unique:countries,country',
            ]);

            // ID akan dihasilkan secara otomatis oleh Laravel
            $country = Country::create($validatedData);
            return response()->json(['message' => 'Country added successfully', 'data' => $country], 201);

        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0]; // Mendapatkan kode error dari PostgreSQL
            
            // Tangani error duplikasi unik
            if ($errorCode == '23505') {
                return response()->json(['message' => 'Country name must be unique'], 400);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }

    // Mendapatkan data negara berdasarkan ID
    public function show($id)
    {
        $country = Country::find($id);

        if (!$country) {
            return response()->json(['message' => 'Country not found'], 404);
        }

        return response()->json($country, 200);
    }

    // Mengupdate data negara
    public function update(Request $request, $id)
    {
        $country = Country::find($id);

        if (!$country) {
            return response()->json(['message' => 'Country not found'], 404);
        }
        if (!$country) {
            return response()->json(['message' => 'Country not found'], 404);
        }

        try {
            $validatedData = $request->validate([
                'country' => 'required|string|max:255',
            ]);

            // Cek jika nama negara sudah ada (case insensitive)
            $existingCountry = Country::where('country', 'ILIKE', $validatedData['country'])
                                      ->where('id', '!=', $id)
                                      ->first();

            if ($existingCountry) {
                return response()->json(['message' => 'Country already exists'], 400);
            }

            $country->update($validatedData);
            return response()->json(['message' => 'Country updated successfully', 'data' => $country], 200);

        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0];

            if ($errorCode == '23505') {
                return response()->json(['message' => 'Country name must be unique'], 400);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }

    // Menghapus negara berdasarkan ID
    public function destroy($id)
    {
        $country = Country::find($id);

        if (!$country) {
            return response()->json(['message' => 'Country not found'], 404);
        }

        try {
            $country->delete();
            return response()->json(['message' => 'Country deleted successfully'], 200);

        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[0];

            // Tangani error referensi asing
            if ($errorCode == '23503') { // kode error referensi asing di PostgreSQL
                return response()->json([
                    'message' => 'Cannot delete country, it is still referenced by actors.'
                ], 409);
            }

            return response()->json([
                'message' => 'Database error',
                'error' => $e->errorInfo[2]
            ], 500);
        }
    }
}
