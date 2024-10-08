import type { NuxtConfig } from "nuxt/schema"
export const extConfig: NuxtConfig = {
  ssr: false,
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
}