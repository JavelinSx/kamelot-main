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
        // SEO Meta Tags
        {
          name: 'description',
          content: 'Академия единоборств Kamelot в СПб (Парнас) - профессиональные тренировки по ММА, боксу, БЖЖ. Групповые и индивидуальные занятия для взрослых и детей. Запись на пробную тренировку!'
        },
        {
          name: 'keywords',
          content: 'мма спб, мма санкт-петербург, мма питер, тренировки мма спб, единоборства спб, бокс спб, бжж спб, джиу джитсу спб, каратэ спб, борьба спб, секция мма, школа единоборств спб, спортивный клуб спб, фитнес спб, тренажерный зал спб, парнас спб, тренировки парнас, спорт парнас, мма для детей спб, детские секции спб, единоборства для детей, kamelot academy, камелот спб, единоборства парнас'
        },
        { name: 'author', content: 'Академия единоборств Kamelot' },
        // Open Graph Meta Tags
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Академия единоборств Kamelot - ММА, Бокс, БЖЖ | СПб, Парнас' },
        { property: 'og:description', content: 'Профессиональные тренировки по ММА, боксу, БЖЖ в Санкт-Петербурге. Современный зал на Парнасе. Групповые и индивидуальные занятия.' },
        { property: 'og:url', content: 'https://kamelot-academy.ru' },
        { property: 'og:site_name', content: 'Kamelot Academy' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:image', content: 'https://kamelot-academy.ru/web-app-manifest-512x512.png' },
        { property: 'og:image:width', content: '512' },
        { property: 'og:image:height', content: '512' },
        { property: 'og:image:type', content: 'image/png' },
        // Geo meta tags для локального SEO
        { name: 'geo.region', content: 'RU-SPE' },
        { name: 'geo.placename', content: 'Санкт-Петербург, Парнас' },
        { name: 'geo.position', content: '60.069444;30.340833' },
        { name: 'ICBM', content: '60.069444, 30.340833' },
        // Local Business Schema
        { name: 'business:contact_data:street_address', content: 'Парнас' },
        { name: 'business:contact_data:locality', content: 'Санкт-Петербург' },
        { name: 'business:contact_data:region', content: 'SPE' },
        { name: 'business:contact_data:country_name', content: 'Russia' },
        // Robots meta
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'yandex', content: 'index, follow' }
      ],
      link: [
        // Favicons для браузеров и поисковиков
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
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
