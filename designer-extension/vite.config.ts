import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import webflowServe from './plugins/plugin-webflow-serve';

export default defineConfig({
  plugins: [
    vue(),
    webflowServe({ port: 1337 }),
  ], 
  base: ''
});
