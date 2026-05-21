import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/ghn-proxy': {
        target: 'https://online-gateway.ghn.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ghn-proxy/, ''),
      },
      '/geovina-proxy': {
        target: 'https://geovina.io.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geovina-proxy/, ''),
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
})