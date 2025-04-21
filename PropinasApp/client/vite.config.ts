// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // Asegúrate de que este alias sea correcto
    },
    extensions: ['.js', '.ts', '.vue'], // Agrega '.vue' aquí
  },
});
