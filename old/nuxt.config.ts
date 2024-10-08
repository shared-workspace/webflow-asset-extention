import { extConfig } from "./ext.nuxt.config"

// const ONE_DAY = 60 * 60 * 24 * 1000;
const ONE_DAY = 10 * 1000;
const ONE_WEEK = ONE_DAY * 7;
// https://nuxt.com/docs/api/configuration/nuxt-config
const isExtBuild = process.env.EXT_BUILD === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  ...(isExtBuild ? extConfig : {
    runtimeConfig: {
      cookieName: "__session",
      cookieSecret: "secret",
      cookieExpires: ONE_DAY.toString(),
      cookieRememberMeExpires: ONE_WEEK.toString(),
    },
    vite: {
      server: {
        hmr: {
          protocol: 'wss',
        },
      },
    },
    nitro: {
      routeRules: {
        '/api/**': {
          cors: true,
        },
      },
    },
  }),
})
