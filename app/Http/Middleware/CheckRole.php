<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (!$user->hasAnyRole($roles)) {
            return response()->json([
                'error' => 'No autorizado',
                'required_roles' => $roles,
                'user_roles' => $user->roles->pluck('name')->toArray()
            ], 403);
        }

        return $next($request);
    }
}
