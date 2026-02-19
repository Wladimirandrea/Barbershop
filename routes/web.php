<?php

use Illuminate\Support\Facades\Route;
use App\Events\TestNotification;
/* 
Route::get('/', function () {
    return view('welcome');
});


Route::get('/test-broadcast', function () {
    broadcast(new TestNotification('¡Nuevo turno reservado para Juan! Corte fade + barba 🔥'))->toOthers();
    // O simplemente: event(new TestNotification('Mensaje custom'));

    return 'Evento broadcasted → mira la consola del navegador o tu componente Vue';
}); */

Route::get('/{any?}', function () {
    return view('app'); // o 'welcome' o el nombre de tu vista principal
})->where('any', '.*');