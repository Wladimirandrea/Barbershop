<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',

        health: '/up',
    )
    ->withBroadcasting(
        channels: __DIR__ . '/../routes/channels.php',
        attributes: ['middleware' => ['auth:sanctum']],
    )



    ->withMiddleware(function (Middleware $middleware): void {
        // Habilita autenticación stateful para SPA (cookies + Sanctum)
        $middleware->statefulApi();  // ← ¡Esto es clave para Sanctum en SPA!

        $middleware->validateCsrfTokens(except: [
            'api/broadcasting/auth',
        ]);
        // Opcional: agrega alias para middlewares personalizados
        $middleware->alias([
            'role'     => \App\Http\Middleware\CheckRole::class,        // tu middleware de roles
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
