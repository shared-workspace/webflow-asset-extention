import { defineConfig } from 'vite';
import webflowVitePlugin from './lib/index';

export default defineConfig({
  plugins: [
    webflowVitePlugin({ port: 1337 }),
  ],
  base: '',
});
