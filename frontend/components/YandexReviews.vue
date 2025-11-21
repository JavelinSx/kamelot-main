<template>
  <section
    class="pb-16 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
    <UContainer>
      <!-- Заголовок секции -->
      <div class="flex flex-col items-center mb-12 text-center" data-aos="fade-down">
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            Отзывы наших клиентов
          </span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Узнайте, что говорят о нас те, кто уже тренируется в Kamelot Academy
        </p>
      </div>

      <!-- Контейнер с виджетом -->
      <div class="max-w-96 md:max-w-2xl mx-auto" data-aos="fade-up">
        <div
          class="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-300 dark:border-gray-700 hover:border-red-500/50 transition-all duration-300">
          <!-- Виджет Яндекс.Карт -->
          <div class="relative" :style="{ height: widgetHeight }">
            <iframe :src="widgetUrl" class="w-full h-full" style="border: none; border-radius: 8px;" loading="lazy"
              title="Отзывы на Яндекс.Картах" />
          </div>

          <!-- Ссылка на Яндекс.Карты (обязательная от Яндекса) -->
          <a :href="yandexMapUrl" target="_blank" rel="noopener noreferrer"
            class="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 hover:text-gray-400 transition-colors px-4 py-1 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm mx-auto max-w-max rounded">
            Камелот на карте Санкт‑Петербурга — Яндекс Карты
          </a>
        </div>

        <!-- Кнопка "Оставить отзыв" -->
        <div class="flex justify-center mt-8" data-aos="fade-up" data-aos-delay="100">
          <a :href="leaveReviewUrl" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
              </path>
            </svg>
            Оставить отзыв
          </a>
        </div>
      </div>

      <!-- Преимущества (дополнительная секция) -->
      <div class="grid md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
        <!-- Рейтинг -->
        <div
          class="bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-gray-700 hover:border-red-500/50 transition-all text-center">
          <div class="text-red-500 text-4xl mb-3">⭐</div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-2">Высокий рейтинг</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Отличные оценки на Яндекс.Картах
          </p>
        </div>

        <!-- Опыт -->
        <div
          class="bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-gray-700 hover:border-red-500/50 transition-all text-center">
          <div class="text-red-500 text-4xl mb-3">💪</div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-2">Профессионалы</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Опытные тренеры с большим стажем
          </p>
        </div>

        <!-- Результаты -->
        <div
          class="bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-gray-700 hover:border-red-500/50 transition-all text-center">
          <div class="text-red-500 text-4xl mb-3">🏆</div>
          <h3 class="text-gray-900 dark:text-white font-semibold mb-2">Результаты</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Реальные достижения наших учеников
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
// ID организации на Яндекс.Картах
const businessId = "159824127921";

// URL виджета отзывов
const widgetUrl = computed(() => `https://yandex.ru/maps-reviews-widget/${businessId}?comments`);

// URL страницы организации на Яндекс.Картах
const yandexMapUrl = `https://yandex.ru/maps/org/kamelot/${businessId}/`;

// URL для оставления отзыва (перенаправит на Яндекс.Карты)
const leaveReviewUrl = `https://yandex.ru/maps/org/kamelot/${businessId}/reviews/`;

// Высота виджета (можно настроить)
const widgetHeight = ref("800px");

// Адаптивная высота для мобильных устройств
onMounted(() => {
  const updateHeight = () => {
    if (window.innerWidth < 768) {
      widgetHeight.value = "600px";
    } else {
      widgetHeight.value = "800px";
    }
  };

  updateHeight();
  window.addEventListener("resize", updateHeight);

  onUnmounted(() => {
    window.removeEventListener("resize", updateHeight);
  });
});
</script>

<style scoped>
/* Дополнительная анимация при наведении */
.bg-gray-800\/50:hover {
  transform: translateY(-4px);
}

/* Плавная загрузка iframe */
iframe {
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;
  animation-delay: 0.2s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
