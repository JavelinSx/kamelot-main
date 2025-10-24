// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@vueuse/motion/nuxt"],

  // Runtime configuration
  runtimeConfig: {
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.NUXT_TELEGRAM_CHAT_ID,
    public: {
      storageUrl: process.env.NUXT_PUBLIC_STORAGE_URL || "",
    },
  },

  // Настройка для статической генерации
  ssr: true, // Включаем SSR для генерации статического контента с данными
  nitro: {
    prerender: {
      routes: ["/", "/trainers", "/schedule", "/blog", "/kids"], // Маршруты для пререндеринга
    },
  },

  // Настройка автоимпортов
  imports: {
    autoImport: true,
    dirs: ["composables"],
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

  // Настройка цветовой темы
  colorMode: {
    preference: "dark", // Темная тема по умолчанию
    fallback: "dark", // Резервная тема - темная
    classSuffix: "", // Используем класс 'dark' вместо 'dark-mode'
  },

  // Page transitions
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
