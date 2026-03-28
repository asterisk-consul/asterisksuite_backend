// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@vueuse/nuxt',
    ['@pinia/nuxt', { autoImports: ['defineStore', 'storeToRefs'] }] // 👈 así se pasan las opciones
  ],
  devServer: {
    host: '0.0.0.0', // <- debe estar así
    port: 3008
  },
  experimental: {
    watcher: 'chokidar',
    componentIslands: false
  },
  typescript: {
    typeCheck: false // Desactivar temporalmente durante build
  },
  vite: {
    optimizeDeps: {
      include: ['leaflet', 'date-fns', '@unovis/vue', 'zod']
    },
    ssr: {
      noExternal: ['@unovis/vue']
    }
  },
  ssr: true,
  imports: {
    dirs: [
      'composables',
      'utils/**', // Incluye subcarpetas
      'helpers', // Carpeta adicional
      'stores' // Si tienes helpers en stores
    ]
  },

  devtools: {
    enabled: true
  },
  app: {
    baseURL: '/', // Relative paths for filesystem routing in Capacitor
    buildAssetsDir: '/_nuxt/'
  },

  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    apiBase: process.env.API_BASE,

    public: {
      apiBase: process.env.PUBLIC_API_BASE
    }
  },

  // 👇 Auto-importar types globalmente
  alias: {
    '@types': './types',
    '@server/utils': './server/utils'
  },

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    preset: 'node-server'
  }
})
