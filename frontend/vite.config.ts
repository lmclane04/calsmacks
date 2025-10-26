import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for Dream-to-Scene
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
