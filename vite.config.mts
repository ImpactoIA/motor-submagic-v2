import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // CORRECCIÓN TITAN:
      // Apuntamos a 'src/api' en lugar de buscar 'api' en la raíz fuera del código fuente.
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      // Alias útil para importar cosas desde la raíz de src con '@/'
      '@': fileURLToPath(new URL('./src', import.meta.url)), 
    },
  },
  // Esto asegura que en Vercel siempre use rutas absolutas limpias
  base: '/', 
});