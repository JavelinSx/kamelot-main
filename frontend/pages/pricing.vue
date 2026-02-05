<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Хедер страницы -->
    <section class="relative pt-20 mb-10 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <UContainer>
        <div class="text-center" data-aos="fade-down">
          <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-red-600">
              Цены и абонементы
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Выберите подходящий тариф для тренировок по боевым искусствам.
            Пробное занятие - бесплатно! Все абонементы включают доступ ко всем видам единоборств.
          </p>
        </div>
      </UContainer>
    </section>

    <!-- Секция с карточками цен -->
    <PricingSection />

    <!-- FAQ секция -->
    <section class="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <UContainer>
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12" data-aos="fade-up">
            Часто задаваемые вопросы
          </h2>

          <div class="space-y-4">
            <div v-for="(faq, index) in faqs" :key="index" data-aos="fade-up" :data-aos-delay="index * 100"
              class="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 hover:border-red-500/50 transition-colors shadow-sm">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-start gap-2">
                <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                {{ faq.question }}
              </h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA секция -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <UContainer>
        <div class="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <div
            class="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/20 rounded-2xl p-12 border border-red-500/50 shadow-lg">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Не знаете, какой абонемент выбрать?
            </h2>
            <p class="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Запишитесь на бесплатное пробное занятие! Попробуйте тренировку, познакомьтесь с тренером
              и залом, а затем выберите подходящий тариф.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton size="xl" color="error"
                class="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 font-semibold"
                @click="openBooking">
                <UIcon name="i-heroicons-gift" class="w-5 h-5 mr-2" />
                Записаться на пробное занятие
              </UButton>
              <UButton size="xl" variant="outline" color="neutral" class="font-semibold" to="tel:+79520957776">
                <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
                +7 (952) 095-77-76
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Цены и абонементы | Camelot Sport Academy СПб',
  description: 'Цены на тренировки по ММА, БЖЖ, грэпплингу, кикбоксингу и боксу в Camelot Sport Academy на Парнасе. Пробное занятие бесплатно! Абонементы от 5000₽. Запись: +7 (952) 095-77-76',
  keywords: 'цены боевые искусства СПб, абонемент ММА Парнас, стоимость тренировок БЖЖ, цены грэпплинг СПб, кикбоксинг цены Парнас, пробное занятие бесплатно',
  ogTitle: 'Цены и абонементы | Camelot Sport Academy',
  ogDescription: 'Пробное занятие - бесплатно! Абонементы на тренировки по ММА, БЖЖ, грэпплингу, кикбоксингу от 5000₽',
  ogImage: '/og-image.jpg'
})

// Структурированные данные для цен
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'PriceSpecification',
        'name': 'Camelot Sport Academy - Абонементы',
        'description': 'Цены на тренировки по боевым искусствам',
        'priceCurrency': 'RUB',
        'offers': [
          {
            '@type': 'Offer',
            'name': 'Пробное занятие',
            'price': '0',
            'priceCurrency': 'RUB'
          },
          {
            '@type': 'Offer',
            'name': 'Разовое посещение',
            'price': '900',
            'priceCurrency': 'RUB'
          },
          {
            '@type': 'Offer',
            'name': '8 тренировок',
            'price': '5000',
            'priceCurrency': 'RUB'
          },
          {
            '@type': 'Offer',
            'name': '12 тренировок',
            'price': '6000',
            'priceCurrency': 'RUB'
          },
          {
            '@type': 'Offer',
            'name': 'Безлимит к тренеру',
            'price': '7000',
            'priceCurrency': 'RUB'
          },
          {
            '@type': 'Offer',
            'name': 'Полный безлимит',
            'price': '8000',
            'priceCurrency': 'RUB'
          }
        ]
      })
    }
  ]
})

// FAQ данные
const faqs = [
  {
    question: 'Что включает абонемент?',
    answer: 'Разовое посещение, а также абонементы на 8 и 12 тренировок дают доступ только к ОДНОМУ выбранному единоборству у одного тренера. Безлимит к тренеру позволяет посещать все виды единоборств у одного тренера. Полный безлимит даёт доступ ко всем тренерам и всем единоборствам.'
  },
  {
    question: 'Что такое "Безлимит к тренеру"?',
    answer: 'Это абонемент, который позволяет посещать все виды единоборств (ММА, БЖЖ, грэпплинг, кикбоксинг, бокс, панкратион), но только у одного выбранного тренера. Подходит, если вы хотите тренироваться по программе конкретного специалиста.'
  },
  {
    question: 'Чем отличается "Полный безлимит"?',
    answer: 'Полный безлимит даёт доступ ко всем тренировкам всех тренеров без ограничений. Вы можете посещать любые групповые занятия по любым единоборствам в любое удобное время.'
  },
  {
    question: 'Пробное занятие действительно бесплатно?',
    answer: 'Да! Пробное занятие полностью бесплатное. Это отличная возможность познакомиться с клубом, тренером и попробовать тренировку перед покупкой абонемента.'
  },
  {
    question: 'Что нужно для первой тренировки?',
    answer: 'Для первой тренировки вам понадобится: спортивная форма, сменная обувь (кроссовки для ударных, босиком для борцовских), вода и полотенце. Перчатки и защиту можно взять в аренду.'
  },
  {
    question: 'Есть ли скидки для детей?',
    answer: 'Да! Специальный детский абонемент на 12 тренировок стоит 6000₽. Также для детей доступно бесплатное пробное занятие.'
  },
  {
    question: 'Как записаться на тренировку?',
    answer: 'Вы можете записаться, нажав кнопку "Записаться" на сайте или позвонив по телефону +7 (952) 095-77-76. Администратор поможет выбрать подходящее время и ответит на все вопросы.'
  },
  {
    question: 'Сколько длится тренировка?',
    answer: 'Групповая тренировка длится 1.5-2 часа в зависимости от вида единоборства и программы тренера. Точное расписание можно уточнить у администратора.'
  }
]

// Открыть модалку записи
const openBooking = () => {
  const event = new CustomEvent('openBookingModal')
  window.dispatchEvent(event)
}
</script>
