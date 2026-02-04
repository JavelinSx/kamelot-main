<template>
  <div class="-mt-20">
    <HeroVideo />
    <MartialArtsCards />
    <TrainersCards />
    <FightersCards />
    <LocationMap />
    <YandexReviews />
    <Gallery :images="photos" :can-load-more="hasMore" :loading-more="loading" @load-more="handleLoadMore" />
  </div>
</template>

<script setup lang="ts">
import Gallery from '~/components/Gallery.vue'
import { useGallery } from '~/composables/useGallery'

// SEO мета-теги с фокусом на локальный поиск (Санкт-Петербург, Парнас)
useSeoMeta({
  title: 'Тренировки - ММА, БЖЖ, Грэпплинг, Кикбоксинг, Бокс | Camelot Sport Academy',
  description: 'Профессиональный клуб смешанных единоборств в Санкт-Петербурге на Парнасе (ул. Архитектора Белова 6к1). ММА, БЖЖ, грэпплинг, панкратион, кикбоксинг, бокс для взрослых и детей. Тренеры - мастера спорта, чемпионы России и Европы. Запись на пробную тренировку!',
  keywords: 'боевые искусства Парнас, ММА СПб, БЖЖ Санкт-Петербург, грэпплинг Парнас, кикбоксинг СПб, бокс для детей Парнас, смешанные единоборства Санкт-Петербург, панкратион СПб, секция единоборств для детей, клуб боевых искусств Парнас, Архитектора Белова 6к1, тренировки ММА СПб, школа боевых искусств Парнас',
  ogTitle: 'Клуб боевых искусств Kamelot на Парнасе | ММА, БЖЖ, Кикбоксинг',
  ogDescription: 'Тренируйся с чемпионами России и Европы! ММА, БЖЖ, грэпплинг, панкратион, кикбоксинг, бокс. Группы для взрослых и детей. Парнас, ул. Архитектора Белова 6к1',
  ogImage: '/og-image.jpg',
  ogType: 'website',
  ogLocale: 'ru_RU',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Camelot Sport Academy - Боевые искусства на Парнасе',
  twitterDescription: 'ММА, БЖЖ, грэпплинг, кикбоксинг, бокс для взрослых и детей в СПб на Парнасе'
})

// Структурированные данные Schema.org для локального бизнеса
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        '@id': 'https://kamelot-academy.ru',
        name: 'CAMELOT Sport Academy',
        alternateName: 'Камелот Спортивная Академия',
        description: 'Профессиональный клуб боевых искусств. Тренируйся с лучшими, становись чемпионом.',
        url: 'https://kamelot-academy.ru',
        telephone: '+7 (952) 095-77-76',
        priceRange: '₽₽',
        image: 'https://kamelot-academy.ru/og-image.jpg',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'улица Архитектора Белова, 6к1',
          addressLocality: 'Санкт-Петербург',
          addressRegion: 'СПб',
          postalCode: '194362',
          addressCountry: 'RU'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 60.069444,
          longitude: 30.340833
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '10:00',
            closes: '23:00'
          }
        ],
        sport: [
          'Mixed Martial Arts',
          'Brazilian Jiu-Jitsu',
          'Grappling',
          'Kickboxing',
          'Boxing',
          'Pankration',
          'Wrestling'
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Тренировки по боевым искусствам',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'ММА (Смешанные единоборства)',
                description: 'Тренировки по смешанным боевым искусствам для взрослых и детей'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Бразильское джиу-джитсу (БЖЖ)',
                description: 'Обучение технике БЖЖ с мастерами спорта'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Грэпплинг',
                description: 'Борьба в партере, тренировки с чемпионами России'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Кикбоксинг',
                description: 'Ударная техника, работа на мешках и лапах'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Бокс',
                description: 'Классический бокс для всех уровней подготовки'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Панкратион',
                description: 'Древнегреческое боевое искусство'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Детские группы',
                description: 'Секции боевых искусств для детей от 6 лет'
              }
            }
          ]
        },
        employee: [
          {
            '@type': 'Person',
            name: 'Павел Коваль',
            jobTitle: 'Главный тренер',
            description: 'Мастер спорта по панкратиону, вольной борьбе и СБИ ММА. Главный тренер сборной Санкт-Петербурга и России по панкратиону 2018г.',
            award: [
              'Мастер спорта по панкратиону',
              'Мастер спорта по вольной борьбе',
              'Финалист чемпионата России по СБИ ММА',
              'Чемпион Санкт-Петербурга по грэпплингу',
              'Судья международной категории'
            ]
          },
          {
            '@type': 'Person',
            name: 'Артем Владимирович',
            jobTitle: 'Тренер',
            description: 'КМС по тайскому боксу и грэпплингу. Чемпион Кубка Консула по тайскому боксу.',
            award: [
              'КМС по тайскому боксу',
              'Чемпион Кубка Консула',
              'КМС по грэпплингу'
            ]
          },
          {
            '@type': 'Person',
            name: 'Роял Исмаилов',
            jobTitle: 'Тренер',
            description: 'Мастер спорта по кикбоксингу. Чемпион России по К-1.',
            award: [
              'Мастер спорта по кикбоксингу',
              'Чемпион России по К-1',
              'Обладатель кубка России по кэмп ММА'
            ]
          },
          {
            '@type': 'Person',
            name: 'Александр Скрипник',
            jobTitle: 'Тренер',
            description: 'КМС по панкратиону и грэпплингу. Чемпион СЗФО по грэпплингу.',
            award: [
              'КМС по панкратиону',
              'Чемпион СЗФО по грэпплингу',
              'Победитель боя по ММА Россия-Беларусь'
            ]
          }
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '482',
          bestRating: '5',
          worstRating: '1'
        },
        amenityFeature: [
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Раздевалки с душем'
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Боксёрские мешки и груши'
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Ринг'
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Борцовский ковёр'
          },
          {
            '@type': 'LocationFeatureSpecification',
            name: 'Детская раздевалка'
          }
        ],
        sameAs: [
          'https://vk.com/edinoborstva_parnas',
          'https://t.me/Koval_Team_MMA'
        ]
      })
    }
  ]
})

// Инициализируем галерею с пагинацией
const { useGalleryPagination } = useGallery()
const { photos, hasMore, loading, initialize, loadMore } = useGalleryPagination()

// Обработчик кнопки "Показать еще"
const handleLoadMore = () => {
  loadMore()
}

// Загружаем первую порцию фотографий при монтировании
onMounted(() => {
  initialize()
})
</script>