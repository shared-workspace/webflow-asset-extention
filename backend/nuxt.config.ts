// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  ssr: true, // Ensure server-side rendering is enabled
  app: {
    head: {}, // don't need any default meta tags
    pageTransition: false, // Disable page transitions
  },
  vite: {
    ssr: {
      noExternal: true, // Ensure no externalization of dependencies
    },
    css: {},
    build: {
      
    }
  },
  build: {
    transpile: [], // Define any specific transpilation requirements if needed
  },
  nitro: {
    preset: 'node-server', // Use Node.js preset for server deployment
    plugins: [
    ]
  },
  // hooks: {
  //   'build:manifest': (manifest) => {
  //     if (manifest) {
  //       // Iterate over each property in the manifest
  //       for (const key in manifest) {
  //         if (Object.prototype.hasOwnProperty.call(manifest, key)) {
  //           const resourceMeta = manifest[key];

  //           // Check if resourceMeta has a file property
  //           if (resourceMeta && resourceMeta.file) {
  //             // Example of modifying the resourceMeta while preserving the required 'file' property
  //             manifest[key] = {
  //               ...resourceMeta,
  //               file: resourceMeta.file, // Ensure the 'file' property is preserved
  //               // Add or modify other properties if needed
  //             };
  //           }
  //         }
  //       }
  //     }
  //   },
  // },
  // Define your server middleware and routes
  // Optionally define API routes
  routeRules: {
    '/api/**': { cors: true },
  },
  // Disable features that are not used in server-only mode
  features: {
    inlineStyles: false,
  },
})
