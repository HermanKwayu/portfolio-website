import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './components'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/supabase': path.resolve(__dirname, './supabase'),
      '@/public': path.resolve(__dirname, './public'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'sonner'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'sonner',
      'motion/react',
      'recharts'
    ],
  },
});