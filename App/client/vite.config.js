import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/PaddleStack/', // Ensures correct asset paths for GitHub Pages
  plugins: [react()],
});