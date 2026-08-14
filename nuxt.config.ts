// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "vuetify-nuxt-module", "@pinia/nuxt"],
  typescript: {
    typeCheck: true,
  },
});
