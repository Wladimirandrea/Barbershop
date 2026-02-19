// vite.config.js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'   // ← importante para el alias

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.js',
      ],
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
    tailwindcss(),
  ],

  // ← Esto es lo más importante que faltaba
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },

  server: {
    watch: {
      // Ignorar carpetas que causan recargas infinitas en algunos setups
      ignored: ['**/storage/framework/views/**', '**/vendor/**'],
    },
    // Opcional: fuerza HMR si tienes problemas con hot reload
    hmr: {
      host: 'localhost',
    },
  },
})