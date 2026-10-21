import { defineConfig } from 'astro/config';

// G2: modo estático puro. Sin SSR ni adapter de plataforma.
export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  }
});
