<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\User;

class RoleAndUserSeeder extends Seeder
{
    public function run(): void
    {
        // Crear roles
        $roles = [
            ['name' => 'admin',   'description' => 'Administrador del sistema'],
            ['name' => 'barber',  'description' => 'Barbero / Estilista'],
            ['name' => 'client',  'description' => 'Cliente de la barbería'],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['name' => $roleData['name']], $roleData);
        }

        // Crear usuarios de prueba (solo con los campos que SÍ existen en tu tabla)
        $users = [
            [
                'name'     => 'Admin Principal',
                'email'    => 'admin@barbershop.com',
                'password' => Hash::make('admin123'),
                'phone'    => '555-0001',
            ],
            [
                'name'     => 'Barbero Juan',
                'email'    => 'barber@barbershop.com',
                'password' => Hash::make('barber123'),
                'phone'    => '555-0002',
            ],
            [
                'name'     => 'Cliente María',
                'email'    => 'client@barbershop.com',
                'password' => Hash::make('client123'),
                'phone'    => '555-0003',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData + [
                    'is_active' => true,
                ]
            );

            // Asignar rol según el email (ejemplo simple)
            $roleName = match ($user->email) {
                'admin@barbershop.com'  => 'admin',
                'barber@barbershop.com' => 'barber',
                default                 => 'client',
            };

            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user->roles()->syncWithoutDetaching($role->id);
            }
        }

        $this->command->info('Roles y usuarios de prueba creados exitosamente.');
        $this->command->info('Admin: admin@barbershop.com / admin123');
        $this->command->info('Barber: barber@barbershop.com / barber123');
        $this->command->info('Client: client@barbershop.com / client123');
    }
}