import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt', // Add Pinia module
  ],

  // router: {
  //   options: {
  //     trailingSlash: false, // Configure router options (if needed)
  //   },
  // },

  compatibilityDate: '2024-12-02',
  // nuxt.config.ts or nuxt.config.js
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL
    }
  }
});
