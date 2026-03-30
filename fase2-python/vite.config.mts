import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // CORRECCIÓN TITAN: Alias principales para el frontend
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      // Alias para API (fuera de src)
      '@api': fileURLToPath(new URL('./api', import.meta.url)),
    },
  },
  // Esto asegura que en Vercel siempre use rutas absolutas limpias
  base: '/', 
});
