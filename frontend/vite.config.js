/**
 * vite.config.js
 * ---------------------------------------------------------------------------
 * Vite configuration for HireTrack ATS frontend.
 * – React plugin for JSX / Fast-Refresh support.
 * – Dev-server on port 5173 with /api proxy to the backend at :5000.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    /* Forward every /api request to the Express backend */
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
