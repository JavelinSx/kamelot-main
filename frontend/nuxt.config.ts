// https://nuxt.com/docs/api/configuration/nuxt-config

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
      googleSheetsPricingId: process.env.NUXT_PUBLIC_GOOGLE_SHEETS_PRICING_ID || "",
      googleSheetsApiKey: process.env.NUXT_PUBLIC_GOOGLE_SHEETS_API_KEY || "",
      // Устаревшая переменная для Excel (оставлена для обратной совместимости)
      fightsExcelUrl: process.env.NUXT_PUBLIC_FIGHTS_EXCEL_URL || "",
    },
  },

  // Настройка для статической генерации
  ssr: true, // Включаем SSR для генерации статического контента с данными
  nitro: {
    prerender: {
      routes: [
        "/",
        "/trainers",
        "/schedule",
        "/blog",
        "/kids",
        "/privacy-policy",
        "/terms-of-service",
      ], // Маршруты для пререндеринга
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
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'yandex-verification', content: '' }, // Добавьте ваш код верификации Яндекса
        { name: 'google-site-verification', content: '' }, // Добавьте ваш код верификации Google
        // Geo meta tags для локального SEO
        { name: 'geo.region', content: 'RU-SPE' },
        { name: 'geo.placename', content: 'Санкт-Петербург, Парнас' },
        { name: 'geo.position', content: '60.069444;30.340833' },
        { name: 'ICBM', content: '60.069444, 30.340833' },
        // Robots meta
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'yandex', content: 'index, follow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://kamelot-academy.ru' },
        // Preconnect для Google Fonts (критично для производительности)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        // Загрузка шрифтов с display=swap для мгновенного отображения текста
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
          media: 'print',
          onload: "this.media='all'"
        }
      ]
    }
  },
});
