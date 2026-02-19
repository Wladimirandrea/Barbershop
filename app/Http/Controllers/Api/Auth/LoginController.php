<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Usa auth() en lugar de Auth::
        if (! auth()->attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        $user = auth()->user();

        // Opcional: regenerar token si quieres invalidar anteriores
        // $user->tokens()->delete();  // Revoca todos los tokens anteriores

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('roles'),  // carga roles para verlos en la respuesta
            'token' => $token,
        ]);
    }
}