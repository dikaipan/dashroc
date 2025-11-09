import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': '/src',
    },
    dedupe: ['react', 'react-dom', 'react-is'], // Ensure single React instance
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.1.6:5000',
        changeOrigin: true,
        secure: false
      }
    },
    historyApiFallback: true,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-is', 'recharts'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Conservative chunking strategy to avoid React dependency issues:
          // 1. Split data files (safe, no React dependency)
          // 2. Split Leaflet core (safe, no React dependency - but react-leaflet needs React)
          // 3. EVERYTHING ELSE goes to vendor-react to ensure React is always available
          // 
          // This is safer than trying to guess which packages need React.
          // Some packages may have hidden React dependencies or peer dependencies.
          
          if (id.includes('node_modules')) {
            // Large data files (definitely safe to split - no dependencies)
            if (id.includes('geojson') || id.includes('indonesia-prov')) {
              return 'data-geojson';
            }
            
            // Leaflet core ONLY (not react-leaflet or @changey/react-leaflet-markercluster)
            // Leaflet core doesn't need React, but react-leaflet wrappers do
            if (
              id.includes('node_modules/leaflet/') && 
              !id.includes('react-leaflet') && 
              !id.includes('@changey/react-leaflet')
            ) {
              return 'vendor-maps';
            }
            
            // EVERYTHING ELSE (including all React packages, papaparse, and others)
            // goes into vendor-react to ensure React is always available when needed
            // This prevents "Cannot read properties of undefined (reading 'useState')" errors
            return 'vendor-react';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Optimize chunk loading
    sourcemap: false, // Disable sourcemaps in production for smaller builds
  },
})
