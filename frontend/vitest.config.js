/// <reference types="vitest" />
// Vitest configuration - Force use standard Vite (vite-standard) instead of rolldown-vite
// This prevents __vite_ssr_exportName__ errors caused by rolldown-vite's SSR transformation
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Force Vitest to use standard Vite instead of rolldown-vite
      // This prevents SSR transformation issues
      'vite': path.resolve(__dirname, './node_modules/vite-standard'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/*.config.cjs',
        'dist/',
      ],
    },
    server: {
      deps: {
        inline: ['@testing-library/react'],
      },
    },
  },
  // Explicitly disable SSR (though standard Vite doesn't enable it by default)
  ssr: false,
  define: {
    'import.meta.env.SSR': 'false',
    'import.meta.env.MODE': '"test"',
  },
});
