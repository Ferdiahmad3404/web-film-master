<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Film;
use Illuminate\Http\Request;

class CMSCommentController extends Controller
{
    // Fungsi untuk menampilkan semua komentar
    public function index()
    {
        $comments = Comment::with('user', 'film')->get();  // Menambahkan relasi untuk user dan film
        return response()->json($comments, 200);
    }

    // Fungsi untuk mengganti status komentar
    public function toggleStatus($id, Request $request)
    {
        $status = $request->input('status');

        if (!in_array($status, ['approved', 'unapproved'])) {
            return response()->json(['message' => 'Invalid status.'], 400);
        }

        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found.'], 404);
        }

        $comment->status = $status;
        $comment->save();

        return response()->json(['message' => "Comment status updated to {$status}."]);
    }


    // Menghapus komentar berdasarkan ID
    public function destroy($id)
    {
        $comment = Comment::find($id);
        if ($comment) {
            $comment->delete();
            return response()->json(['message' => 'Comment deleted successfully.']);
        }
        return response()->json(['message' => 'Comment not found.'], 404);
    }

    // Menghapus semua komentar berdasarkan film ID
    public function bulkDeleteByFilm($filmId)
    {
        $film = Film::find($filmId);
        
        if ($film) {
            $film->comments()->delete();
            return response()->json(['message' => 'All comments for this film have been deleted.']);
        }

        return response()->json(['message' => 'Film not found.'], 404);
    }
}

