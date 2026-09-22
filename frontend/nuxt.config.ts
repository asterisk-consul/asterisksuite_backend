// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  ssr: false,
  devtools: {
    enabled: true
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'assets'
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.PUBLIC_API_BASE ?? 'http://localhost:3000'
    }
  },
  routeRules: {
    '/api/**': {
      cors: true
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3008
  },
  experimental: {
    watcher: 'chokidar',
    componentIslands: false
  },
  compatibilityDate: '2024-07-11',
  // ← Esto lo hace SPA
  nitro: {
    preset: 'static'
  },
  typescript: {
    typeCheck: false
  },
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
