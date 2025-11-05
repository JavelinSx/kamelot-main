<template>
  <section class="location-map-section py-20 bg-gray-900">
    <div class="container mx-auto px-4">
      <!-- Заголовок секции -->
      <div class="text-center mb-12">
        <h2
          class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Как нас найти
        </h2>
      </div>

      <!-- Контейнер с картой -->
      <div class="map-container max-w-6xl mx-auto">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <!-- Яндекс карта -->
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A7c2a5b4697e8df987cf3a9987f5a2f08ee4f7ede139c841afa913b7cc82023ee&amp;source=constructor"
            width="100%" height="516" frameborder="0" class="w-full" loading="lazy"></iframe>
        </div>

        <!-- Кнопка "Маршрут" -->
        <div class="flex justify-center mt-6">
          <a
            href="https://yandex.ru/maps/-/CLvy7W9a"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            Построить маршрут
          </a>
        </div>

        <!-- Контактная информация под картой -->
        <div class="grid md:grid-cols-3 gap-6 mt-8">
          <!-- Адрес -->
          <div
            class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all">
            <div class="flex items-start gap-4">
              <div class="text-red-500 text-2xl">
                📍
              </div>
              <div>
                <h3 class="text-white font-semibold mb-2">Адрес</h3>
                <p class="text-gray-400 text">
                  Улица Архитектора Белова 6к1, Санкт-Петербург
                </p>
              </div>
            </div>
          </div>

          <!-- Время работы -->
          <div
            class="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all">
            <div class="flex items-start gap-4">
              <div class="text-red-500 text-2xl">
                🕐
              </div>
              <div>
                <h3 class="text-white font-semibold mb-2">Время работы</h3>
                <p class="text-gray-400 text">
                  Пн-ВС: 10:00 - 23:00
                </p>
              </div>
            </div>
          </div>

          <!-- Телефон -->
          <div
            class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all">
            <div class="flex items-start gap-4">
              <div class="text-red-500 text-2xl">
                📞
              </div>
              <div>
                <h3 class="text-white font-semibold mb-2">Телефон</h3>
                <a href="tel:+74951234567" class="text-gray-400 text hover:text-red-500 transition-colors">
                  +7 (952) 095-77-76
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Анимация при наведении на карточки */
.bg-gray-800\/50:hover {
  transform: translateY(-2px);
}
</style>
