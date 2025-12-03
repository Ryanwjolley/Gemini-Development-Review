import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './functions/shared/index.esm.js'),
    },
  },
  server: {
    port: 3010,
    open: false,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    commonjsOptions: {
      include: [/functions\/shared/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
  envPrefix: 'VITE_',
  define: {
    // Set mock data mode for production builds
    'import.meta.env.VITE_USE_MOCK_DATA': mode === 'production' ? '"true"' : 'undefined',
    'import.meta.env.VITE_USE_MOCK_AUTH': mode === 'production' ? '"true"' : 'undefined',
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    include: ['shared'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}))
