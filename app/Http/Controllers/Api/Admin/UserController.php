<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:15',
            'role'     => 'required|exists:roles,name', // nombre del rol
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone'    => $validated['phone'] ?? null,
        ]);

        // Asignar rol
        $role = Role::where('name', $validated['role'])->first();
        $user->roles()->attach($role->id);

        return response()->json($user->load('roles'), 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load('roles'));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8|confirmed|nullable',
            'phone'    => 'nullable|string|max:15',
            'role'     => 'sometimes|exists:roles,name',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Actualizar rol si se envía
        if ($request->has('role')) {
            $role = Role::where('name', $request->role)->first();
            $user->roles()->sync($role->id); // reemplaza roles anteriores
        }

        return response()->json($user->load('roles'));
    }

    public function destroy(User $user)
    {
        // Evitar eliminar al propio admin o usuarios críticos
        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'No puedes eliminarte a ti mismo'], 403);
        }

        $user->delete();
        return response()->json(null, 204);
    }
}