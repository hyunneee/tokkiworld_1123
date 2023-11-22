// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsInclude: ['**/*.html', '**/*.js', '**/*.css', '**/*.glb', '**/*/*.glb'],
    rollupOptions: {
      treeshake: false,
    },
  },
  resolve: {
    alias: {
      three: 'three', // 이 부분을 확인하세요.
    },
  },
});
