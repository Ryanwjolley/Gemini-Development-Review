import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
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
})
