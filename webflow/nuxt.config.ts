// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  ignore: ['server/**'],
  nitro: { preset: 'static' },

  vite: {
    ssr: {
      noExternal: true,
    },
    build: {
      ssr: false
    }
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
})
