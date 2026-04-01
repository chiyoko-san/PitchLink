import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages のリポジトリ名に合わせる
  base: '/PitchLink/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
