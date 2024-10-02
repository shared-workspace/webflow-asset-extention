// https://nuxt.com/docs/api/configuration/nuxt-config
const isProdBuild = process.env.BUILD_ENV === 'production';
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  srcDir: 'src/',
  ssr: !isProdBuild, // Disable server-side rendering
  ignore: isProdBuild ? [ 'server/**' ] : [], // Ignore the server folder
  nitro: isProdBuild ? { preset: 'static' } : {}, // Enable static site generation
})


