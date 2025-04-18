import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  root: '.',
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve('./index.html')
    }
  },
  
  server: {
    fs: { allow: ['.', 'public'] },
    port: 5173
  },

  optimizeDeps: {
    exclude: ['src/main']
  },

  resolve: {
    alias: [
      { find: '@', replacement: path.resolve('./src') },
      { find: '@renderer', replacement: path.resolve('./src/renderer') },
      { find: '@apis', replacement: path.resolve('./src/renderer/apis') },
      { find: '@components', replacement: path.resolve('./src/renderer/components') },
      { find: '@pages', replacement: path.resolve('./src/renderer/pages') },
      { find: '@hooks', replacement: path.resolve('./src/renderer/hooks') },
      { find: '@services', replacement: path.resolve('./src/renderer/services') },
      { find: '@stores', replacement: path.resolve('./src/renderer/stores') },
      { find: '@utils', replacement: path.resolve('./src/renderer/utils') },
      { find: '@assets', replacement: path.resolve('./src/renderer/assets') },
      { find: '@shared', replacement: path.resolve('./src/shared') }
    ]
  },

  plugins: [
    react(),
    glsl()
  ]
});
