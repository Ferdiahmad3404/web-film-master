<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Firebase\JWT\JWT;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:32',
                'email' => 'required|string|email|max:32|unique:users',
                'role_id' => 'required|in:admin,user',
                'password' => 'required|string|min:6|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'role_id' => $request->role_id,
                'password' => Hash::make($request->password),
            ]);

            return response()->json(['message' => 'Registrasi berhasil'], 201);
        } catch (\Exception $e) {
            // Tampilkan pesan error untuk debugging
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    /**
     * Login user and return a token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
        ]);

        $identifier = $request->input('identifier');
        $password = $request->input('password');
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // Cek apakah user ada dan mencoba login
        $user = User::where($field, $identifier)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Cek apakah akun sedang disuspend
        if ($user->suspended_until && now()->lt($user->suspended_until)) {
            return response()->json([
                'error' => 'Your account is suspended until ' . $user->suspended_until->format('Y-m-d H:i:s'),
                'suspended_until' => $user->suspended_until
            ], 403); // Status 403 Forbidden karena akun disuspend
        }

        // Jika akun tidak disuspend, lanjutkan login
        if (! $token = auth()->login($user)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'role_id' => $user->role_id,
            'id' => $user->id,
        ]);
    }

    /**
     * Log out the user (invalidate the token).
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Return token array structure.
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    /**
     * Redirect to Google OAuth.
     */
    public function redirectToGoogle()
    {
        $queryParams = http_build_query([
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
            'response_type' => 'code',
            'scope' => 'openid profile email',
            'access_type' => 'offline',
        ]);

        return redirect('https://accounts.google.com/o/oauth2/v2/auth?' . $queryParams);
    }

    /**
     * Handle Google OAuth callback.
     */
    public function handleGoogleCallback(Request $request)
    {
        $code = $request->query('code');

        if (!$code) {
            return response()->json(['error' => 'Authorization code not provided'], 400);
        }

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
            'grant_type' => 'authorization_code',
            'code' => $code,
        ]);

        $data = $response->json();

        if (!isset($data['id_token'])) {
            return response()->json(['error' => 'Failed to obtain ID token'], 500);
        }

        $googleUser = json_decode(base64_decode(explode('.', $data['id_token'])[1]));

        $user = User::firstOrCreate(
            ['email' => $googleUser->email],
            [
                'username' => $googleUser->name,
                'google_id' => $googleUser->sub,
                'password' => Hash::make(uniqid()),
                'role_id' => 'user',
            ]
        );

        // Cek apakah akun sedang disuspend
        if ($user->suspended_until && now()->lt($user->suspended_until)) {
            return response()->json([
                'error' => 'Your account is suspended until ' . $user->suspended_until->format('Y-m-d H:i:s'),
                'suspended_until' => $user->suspended_until
            ], 403); // Status 403 Forbidden karena akun disuspend
        }

        $payload = [
            'iss' => "DramaKu",
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + 60*60
        ];

        $jwt = JWT::encode($payload, env('JWT_SECRET'), 'HS256');        

        return redirect()->away(env('FRONTEND_URL') . '/auth/google/callback?access_token=' . $jwt . '&role_id=' . $user->role_id . '&username=' . $user->username);
    }
}