// https://nuxt.com/docs/api/configuration/nuxt-config

import type { NuxtConfig } from "nuxt/schema"
import * as fs from 'node:fs'
const useDevtools = process.env.DEVTOOLS === 'true'
const isDev = process.env.NODE_ENV === 'development' // need both server and client code using nuxt dev

// below two are used concurrently
const isWebflowBuild = process.env.WEBFLOW_BUILD === 'true' // need static build and excluding server code using nuxt generate
const isServerOnly = process.env.SERVER_DEV === 'true' // need server code only using nuxt dev


const webflowConfig: NuxtConfig = {
  
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
const devConfig: NuxtConfig = {
  ssr: true,
  plugins: [
    { src: '~/plugins/dummy-webflow-provider.ts', mode: 'client' },
  ],
  routeRules: {
    '/api/**': { cors: true },
  },
}
const serverConfig: NuxtConfig = {
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
}
const config: NuxtConfig = {
  compatibilityDate: '2024-04-03',
  devtools: { enabled: useDevtools },
  srcDir: 'src/',

  // routeRules: {
  //   '/': { prerender: true },
  // },


  ...(isWebflowBuild ? webflowConfig : {}),
  ...(isDev ? devConfig : {}),
  ...(isServerOnly ? serverConfig : {}),
}
if (useDevtools) {
  if (config.vite) {
    config.vite.server = {
      https: {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost-cert.pem')
      },
      hmr: {
        protocol: 'wss'
      }
    }
  } else {
    config.vite = {
      server: {
        https: {
          key: fs.readFileSync('./localhost-key.pem'),
          cert: fs.readFileSync('./localhost-cert.pem')
        },
        hmr: {
          protocol: 'wss'
        }
      }
    }
  }
}
export default defineNuxtConfig(config)