import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  build: {
    outDir: '../dist',
    assetsDir: 'site-assets',
    emptyOutDir: true,
    modulePreload: {
      polyfill: false,
    },
  },
});
