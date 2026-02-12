<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();  // opcional, pero útil si necesitas PK propia

            $table->foreignId('user_id')
                ->constrained()               // referencia automáticamente users(id)
                ->cascadeOnDelete();

            $table->foreignId('role_id')
                ->constrained()               // referencia automáticamente roles(id)
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['user_id', 'role_id']);  // evita duplicados
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_user');
    }
};
