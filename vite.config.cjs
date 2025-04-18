const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  root: '.',           
  base: './',                    // 상대 경로 로드
  publicDir: 'public',           // 정적 리소스 위치

  build: {
    outDir: 'dist/renderer',    // 프로젝트 루트 기준 dist 디렉토리
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },

  server: {
    fs: { allow: ['.', 'public'] }, // Vite가 접근 허용할 폴더 모두 포함
    port: 5173
  },

  optimizeDeps: {
    exclude: ['src/main']        // main 프로세스 코드는 번들에 포함되지 않음
  },

  resolve: {
    alias: [
      { find: '@',           replacement: path.resolve(__dirname, 'src') },
      { find: '@renderer',   replacement: path.resolve(__dirname, 'src/renderer') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/renderer/components') },
      { find: '@pages',      replacement: path.resolve(__dirname, 'src/renderer/pages') },
      { find: '@hooks',      replacement: path.resolve(__dirname, 'src/renderer/hooks') },
      { find: '@services',   replacement: path.resolve(__dirname, 'src/renderer/services') },
      { find: '@store',      replacement: path.resolve(__dirname, 'src/renderer/store') },
      { find: '@assets',     replacement: path.resolve(__dirname, 'src/renderer/assets') },
      { find: '@shared',     replacement: path.resolve(__dirname, 'src/shared') }
    ]
  },

  plugins: [react()]
});