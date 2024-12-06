<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UserController extends Controller
{
    /**
     * Menampilkan daftar pengguna.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Suspend pengguna untuk durasi tertentu.
     */
    public function suspendUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $duration = $request->input('duration'); // e.g., "1h", "1d", "7d"

        $suspendedUntil = null;
        if ($duration === '1h') {
            $suspendedUntil = now()->addHour();
        } elseif ($duration === '1d') {
            $suspendedUntil = now()->addDay();
        } elseif ($duration === '7d') {
            $suspendedUntil = now()->addWeek();
        } elseif ($duration === '1m') {
            $suspendedUntil = now()->addMinute();
        } elseif ($duration === 'null') {
            return response()->json(['message' => 'Invalid duration.'], 400);
        }
        $user->update(['suspended_until' => $suspendedUntil]);

        return response()->json(['message' => 'User suspended successfully!']);
    }

    
}
