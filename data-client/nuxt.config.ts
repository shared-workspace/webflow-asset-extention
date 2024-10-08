// https://nuxt.com/docs/api/configuration/nuxt-config


// const ONE_DAY = 60 * 60 * 24 * 1000;
const ONE_DAY = 10 * 1000;
const ONE_WEEK = ONE_DAY * 7;

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  vite: {
    server: {
      hmr: {
        protocol: "wss"
      }
    }
  },

  runtimeConfig: {
    cookieName: "__session",
    cookieSecret: "secret",
    cookieExpires: ONE_DAY.toString(),
    cookieRememberMeExpires: ONE_WEEK.toString(),
  },

  modules: ["nuxt-security"],
  
  security: {
    corsHandler: {
      allowHeaders: "*",
      methods: "*",
      origin: "*",
      preflight: {
        statusCode: 200
      }
    }
  }
})