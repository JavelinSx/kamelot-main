<template>
  <div class="min-h-screen pt-20">
    <PageHead kicker="// Цены и абонементы" ghost="₽"
      description="Пробное занятие — бесплатно. Абонементы на любые виды единоборств: от разового посещения до полного безлимита.">
      Выбери <span class="text-cm-red-title">свой ритм</span>
    </PageHead>

    <PricingSection />

    <!-- FAQ -->
    <section class="border-t border-cm-line bg-cm-section py-16 sm:py-24">
      <div class="cm-container flex flex-col gap-10 sm:gap-12">
        <SectionHead kicker="// Вопросы">
          Часто <span class="text-cm-red-title">спрашивают</span>
        </SectionHead>

        <div class="flex flex-col border-t border-cm-line">
          <details v-for="(faq, index) in faqs" :key="index" class="group border-b border-cm-line">
            <summary
              class="flex cursor-pointer list-none items-start justify-between gap-6 py-5 transition-colors hover:text-cm-red-ink sm:py-6">
              <span class="flex gap-5">
                <span class="w-8 shrink-0 pt-1.5 font-mono text-sm font-bold text-cm-red-ink">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="font-display text-[26px] font-extrabold uppercase leading-tight sm:text-[30px]">{{ faq.question }}</span>
              </span>
              <UIcon name="i-lucide-plus" class="mt-2 h-6 w-6 shrink-0 transition-transform group-open:rotate-45" />
            </summary>
            <p class="m-0 max-w-3xl pb-6 pl-[52px] text-base leading-relaxed text-cm-muted">
              {{ faq.answer }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <CtaBand kicker="// Не знаешь, что выбрать?"
      description="Приходи на бесплатное пробное занятие: попробуй тренировку, познакомься с тренером и залом — а потом выберешь тариф.">
      Сначала <span class="text-white">попробуй</span>
    </CtaBand>
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
</script>
