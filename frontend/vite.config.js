import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Force production mode for builds to avoid development chunks
  // This ensures react-router uses production builds, not development chunks
  const isProduction = mode === 'production' || process.env.NODE_ENV === 'production';
  
  // Build mode logging disabled to reduce console noise
  // if (!isProduction) {
  //   console.warn('⚠️  Warning: Building in non-production mode.');
  // } else {
  //   console.log('✅ Building in production mode');
  // }
  
  return {
    // Explicitly set mode to production for builds
    mode: isProduction ? 'production' : mode,
    // Define multiple environment variables to ensure react-router uses production build
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      'import.meta.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      '__DEV__': JSON.stringify(isProduction ? 'false' : 'true')
    },
    plugins: [
      react({
        // Optimize Fast Refresh
        fastRefresh: true,
        // Exclude context files from Fast Refresh issues
        exclude: /node_modules/,
        // Only include .jsx and .js files
        include: '**/*.{jsx,js}',
      })
    ],
    base: '/',
    publicDir: 'public',
    resolve: {
      alias: {
        '@': '/src',
        'react-router/dist/development': 'react-router/dist/production',
        'react-router-dom/dist/development': 'react-router-dom/dist/production',
      },
      dedupe: [
        'react', 
        'react-dom', 
        'react-is', 
        'react-router', 
        'react-router-dom',
        'react-feather',
        'react-hot-toast',
        'react-leaflet'
      ], // Ensure single React instance for all React packages
      preserveSymlinks: false,
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
          ws: true, // Enable websocket proxy
          configure: (proxy, _options) => {
            proxy.on('error', (err, req, res) => {
              // Only log critical proxy errors
              if (process.env.VITE_DEBUG_PROXY === 'true') {
                console.error('[Vite Proxy] Error:', err.message, req.url);
              }
              if (res && !res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                  error: 'Proxy error: Flask server may not be running',
                  message: 'Please ensure Flask server is running on port 5000'
                }));
              }
            });
            // Log only errors to avoid performance violations during HMR
            // Uncomment below for debugging proxy issues:
            // proxy.on('proxyReq', (proxyReq, req, _res) => {
            //   console.log('[Vite Proxy] Proxying:', req.method, req.url);
            // });
            // proxy.on('proxyRes', (proxyRes, req, _res) => {
            //   console.log('[Vite Proxy] Response:', proxyRes.statusCode, req.url);
            // });
          }
        }
      },
      historyApiFallback: true,
      open: true
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-is',
        'react-router',
        'react-router-dom',
        'react-hot-toast',
        'react-feather',
        'recharts', // Include recharts for pre-bundling to avoid runtime issues
        'react-leaflet', // Include react-leaflet for pre-bundling to avoid runtime issues
        'leaflet' // Include leaflet core for pre-bundling
      ],
      exclude: [],
      esbuildOptions: {
        target: 'esnext'
      }
    },
    build: {
      // Don't empty outDir automatically to avoid permission errors
      // We'll clean it manually in prebuild script
      emptyOutDir: false,
      target: 'esnext',
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          // Optimize chunk names for better caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // Safe chunking - keep React ecosystem together
            if (id.includes('node_modules')) {
              // Keep all React-related in one chunk to prevent loading order issues
              if (id.includes('react') || id.includes('scheduler')) {
                return 'vendor';
              }
              // Charts library - separate but safe
              if (id.includes('recharts')) {
                return 'vendor';
              }
              // Map library - separate but safe
              if (id.includes('leaflet')) {
                return 'vendor';
              }
              // Everything else
              return 'vendor';
            }
            
            // Split large source files into separate chunks
            if (id.includes('src/components/map/MapWithRegions')) {
              return 'map-regions';
            }
            if (id.includes('src/pages/Dashboard')) {
              return 'page-dashboard';
            }
            if (id.includes('src/components/charts/EngineerTrainingKPICards')) {
              return 'charts-kpi';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      // Optimize chunk loading
      sourcemap: false, // Disable sourcemaps in production for smaller builds
      minify: 'esbuild', // Use esbuild for faster builds
      cssCodeSplit: true, // Split CSS for better caching
      // Performance optimizations
      reportCompressedSize: false, // Faster builds
      cssMinify: true, // Minify CSS
    },
  };
});
