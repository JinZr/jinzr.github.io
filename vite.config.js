import { defineConfig } from 'vite';

const lastEdited = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'Asia/Shanghai',
});

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
  define: {
    __LAST_EDITED__: JSON.stringify(lastEdited),
  },
});
