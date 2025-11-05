// https://nuxt.com/docs/api/configuration/nuxt-config

// Логируем переменные окружения при сборке
console.log('[nuxt.config] Environment variables at build time:', {
  NUXT_PUBLIC_GOOGLE_SHEETS_ID: process.env.NUXT_PUBLIC_GOOGLE_SHEETS_ID,
  NUXT_PUBLIC_STORAGE_URL: process.env.NUXT_PUBLIC_STORAGE_URL,
  NODE_ENV: process.env.NODE_ENV,
});

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@vueuse/motion/nuxt"],

  // Runtime configuration
  runtimeConfig: {
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.NUXT_TELEGRAM_CHAT_ID,
    // VK API Configuration
    vkAccessToken: process.env.NUXT_VK_ACCESS_TOKEN,
    vkGroupId: process.env.NUXT_VK_GROUP_ID,
    vkAlbumId: process.env.NUXT_VK_ALBUM_ID,
    public: {
      storageUrl: process.env.NUXT_PUBLIC_STORAGE_URL || "",
      googleSheetsId: process.env.NUXT_PUBLIC_GOOGLE_SHEETS_ID || "",
      // Устаревшая переменная для Excel (оставлена для обратной совместимости)
      fightsExcelUrl: process.env.NUXT_PUBLIC_FIGHTS_EXCEL_URL || "",
    },
  },

  // Настройка для статической генерации
  ssr: true, // Включаем SSR для генерации статического контента с данными
  nitro: {
    prerender: {
      routes: ["/", "/trainers", "/schedule", "/blog", "/kids", "/privacy-policy", "/terms-of-service"], // Маршруты для пререндеринга
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
