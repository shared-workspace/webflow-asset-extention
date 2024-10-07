// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  srcDir: "src",
  vite: {
    server: {
      hmr: {
        protocol: 'wss',
      }
    }
  },
  routeRules: {
    '/api/**': { cors: true },
  },
  runtimeConfig: {
    redis: {
      host: '',
      port: 0,
    }
  }
})
