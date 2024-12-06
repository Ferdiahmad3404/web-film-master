<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // Mendapatkan komentar untuk sebuah film beserta reply-nya
    public function getComments($id)
    {
        \Log::info('Fetching comments for drama ID: ' . $id);
        
        $comments = Comment::with(['user', 'replies.user'])
                            ->where('drama_id', $id)
                            ->whereNull('parent_id')
                            ->where('status', 'approved') 
                            ->get();

        if ($comments->isEmpty()) {
            return response()->json(['message' => 'No comments found.'], 404);
        }

        return response()->json($comments);
    }

    // Menambahkan komentar baru
    public function addComment(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5'
        ]);

        $comment = Comment::create([
            'user_id' => $request->userId, // Ambil ID dari token JWT
            'drama_id' => $id,
            'comment' => $request->comment,
            'status' => "pending", // Status default
            'rating' => null, // Pastikan rating juga dikirim jika diperlukan
            'parent_id' => null // null jika komentar utama
        ]);

        return response()->json($comment, 201);
    }


    // Menambahkan reply ke komentar tertentu
    public function addReply(Request $request, $id, $commentId)
    {
        $request->validate([
            'comment' => 'required|string'
        ]);

        $comment = Comment::findOrFail($commentId);
        $reply = Comment::create([
            'user_id' => $request->userId,
            'drama_id' => $id,
            'status' => "pending", // Status default
            'comment' => $request->comment,
            'rating' => null,
            'parent_id' => $commentId
        ]);

        return response()->json($reply, 201);
    }
}
