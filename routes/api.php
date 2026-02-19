<?php

use App\Http\Controllers\Api\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Admin\UserController;

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// routes/api.php

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin/users')->group(function () {
    // Listar todos los usuarios
    Route::get('/', [UserController::class, 'index']);

    // Crear usuario nuevo
    Route::post('/', [UserController::class, 'store']);

    // Ver un usuario específico
    Route::get('/{user}', [UserController::class, 'show']);

   Route::put('/{user}', [UserController::class, 'update']);
    Route::post('/{user}', [UserController::class, 'update']);

    // Eliminar usuario
    Route::delete('/{user}', [UserController::class, 'destroy']);
});
