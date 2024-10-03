// https://nuxt.com/docs/api/configuration/nuxt-config
const isProdBuild = process.env.BUILD_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
console.log('isProdBuild:', isProdBuild);
console.log('isDev:', isDev);
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  srcDir: 'src/',
  routeRules: {
    '/api/**': { cors: true },
  },
  ...(isProdBuild && {
    ssr: false,
    ignore: ['server/**'],
    nitro: { preset: 'static' },
  }),
  ...(isDev && {
    // ssr: true,
    // css: [],
    plugins: [
      {src: '~/plugins/dummy-webflow-provider.ts', mode: 'client' },
    ],
    // vite: {
    //   build: {
    //     ssr: true,
    //     rollupOptions: {
    //       output: {
    //         manualChunks: {
    //           // This can help control the chunks and potentially reduce client-side bundles.
    //         }
    //       }
    //     }
    //   }
    // },
  }),
})


