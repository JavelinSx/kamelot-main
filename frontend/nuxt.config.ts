// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/ui"],

  // Runtime configuration
  runtimeConfig: {
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.NUXT_TELEGRAM_CHAT_ID,
    public: {
      storageUrl: process.env.NUXT_PUBLIC_STORAGE_URL || '',
    },
  },

  // Настройка для статической генерации
  ssr: false, // Отключаем SSR
  nitro: {
    prerender: {
      routes: ["/"], // Добавьте все нужные маршруты
    },
  },

  // Настройка автоимпортов
  imports: {
    autoImport: true,
    dirs: ["composables", "shared/composables"],
  },

  // TypeScript конфигурация
  typescript: {
    typeCheck: true,
  },
  vite: {
    define: {
      "import.meta.glob": "import.meta.glob",
    },
  },
  // Подключение стилей
  css: ["~/assets/css/main.css"],

  // Кастомная тема Kamelot для боевых искусств
  ui: {
    prefix: "U",
  },

  // Page transitions
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
