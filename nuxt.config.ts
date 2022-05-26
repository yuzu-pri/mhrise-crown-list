import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  generate: {
    dir: 'docs'
  },
  router: {
    base: '/mhrise-crown-list/'
  },
  // app: {
  //   cdnURL: '/yuzu-pri-mhrise-crown-list/'
  // }
})
