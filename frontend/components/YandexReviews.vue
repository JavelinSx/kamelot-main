<template>
  <section id="reviews" class="border-y border-cm-line bg-cm-section py-16 sm:py-[110px]">
    <div class="cm-container flex flex-col gap-10 sm:gap-12">
      <SectionHead kicker="[07] / Отзывы"
        description="Узнай, что говорят о нас те, кто уже тренируется в Camelot Sport Academy.">
        Говорят те,<br>кто <span class="text-cm-red-title">в зале</span>
      </SectionHead>

      <div class="flex flex-wrap items-start gap-5">
        <div class="relative min-w-0 max-w-[760px] flex-[1_1_560px] overflow-hidden border border-cm-line bg-white">
          <div class="relative" :style="{ height: widgetHeight }">
            <iframe :src="widgetUrl" class="h-full w-full" style="border: none" loading="lazy"
              title="Отзывы на Яндекс.Картах" />
          </div>
          <!-- Ссылка на Яндекс.Карты (обязательная от Яндекса) -->
          <a :href="yandexMapUrl" target="_blank" rel="noopener noreferrer"
            class="absolute bottom-2 left-1/2 max-w-max -translate-x-1/2 bg-white/90 px-4 py-1 text-center text-xs text-neutral-600 hover:text-neutral-900">
            Камелот на карте Санкт‑Петербурга — Яндекс Карты
          </a>
        </div>

        <div class="flex min-w-0 flex-[1_1_300px] flex-col gap-px border border-cm-line bg-cm-line">
          <div v-for="item in highlights" :key="item.title" class="flex flex-col gap-2 bg-cm-bg p-6">
            <span class="cm-kicker">{{ item.kicker }}</span>
            <span class="cm-display text-[34px] leading-[0.9]">{{ item.title }}</span>
            <span class="text-sm leading-normal text-cm-muted">{{ item.text }}</span>
          </div>
          <div class="bg-cm-bg p-6">
            <a :href="leaveReviewUrl" target="_blank" rel="noopener noreferrer"
              class="cm-btn cm-btn-red cm-cut w-full">
              <UIcon name="i-lucide-star" class="h-5 w-5" />
              Оставить отзыв
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ID организации на Яндекс.Картах
const businessId = '159824127921'

const widgetUrl = computed(() => `https://yandex.ru/maps-reviews-widget/${businessId}?comments`)
const yandexMapUrl = `https://yandex.ru/maps/org/kamelot/${businessId}/`
const leaveReviewUrl = `https://yandex.ru/maps/org/kamelot/${businessId}/reviews/`

const highlights = [
  { kicker: '01', title: 'Высокий рейтинг', text: 'Отличные оценки на Яндекс.Картах' },
  { kicker: '02', title: 'Профессионалы', text: 'Опытные тренеры с большим стажем' },
  { kicker: '03', title: 'Результаты', text: 'Реальные достижения наших учеников' }
]

// Высота виджета
const widgetHeight = ref('760px')

onMounted(() => {
  const updateHeight = () => {
    widgetHeight.value = window.innerWidth < 768 ? '600px' : '760px'
  }

  updateHeight()
  window.addEventListener('resize', updateHeight)

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
  })
})
</script>
