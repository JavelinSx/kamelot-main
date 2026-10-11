<template>
  <section class="location-map-section pb-16 sm:pb-[120px]">
    <div class="cm-container flex flex-col gap-10 sm:gap-12">
      <SectionHead kicker="[06] / Как нас найти">
        Зал на <span class="text-cm-red-title">Парнасе</span>
      </SectionHead>

      <div class="flex flex-wrap gap-5">
        <!-- Яндекс карта с ленивой загрузкой -->
        <div class="map-container relative min-w-0 flex-[999_1_560px] overflow-hidden border border-cm-line bg-cm-surface">
          <ClientOnly>
            <div v-if="!mapLoaded" class="flex h-[380px] w-full items-center justify-center sm:h-[520px]">
              <button type="button" class="cm-btn cm-btn-red cm-cut" @click="loadMap">Загрузить карту</button>
            </div>
            <iframe v-else
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A7c2a5b4697e8df987cf3a9987f5a2f08ee4f7ede139c841afa913b7cc82023ee&amp;source=constructor"
              width="100%" height="520" frameborder="0" class="block h-[380px] w-full sm:h-[520px]" loading="lazy"
              title="Яндекс карта — местоположение Camelot Academy"></iframe>
            <template #fallback>
              <div class="h-[380px] w-full sm:h-[520px]" />
            </template>
          </ClientOnly>
        </div>

        <div class="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
          <div class="flex flex-col border border-cm-line bg-cm-surface">
            <div class="flex gap-4 border-b border-cm-line px-6 py-5">
              <UIcon name="i-lucide-map-pin" class="mt-0.5 h-[22px] w-[22px] shrink-0 text-cm-red-ink" />
              <div>
                <div class="cm-label">Адрес</div>
                <div class="mt-1 text-base leading-normal">{{ contacts.academy.address }}</div>
              </div>
            </div>
            <div class="flex gap-4 border-b border-cm-line px-6 py-5">
              <UIcon name="i-lucide-clock-3" class="mt-0.5 h-[22px] w-[22px] shrink-0 text-cm-red-ink" />
              <div>
                <div class="cm-label">Время работы</div>
                <div class="mt-1 text-base leading-normal">
                  {{ contacts.academy.workingHours.weekdays }}<br>{{ contacts.academy.workingHours.weekend }}
                </div>
              </div>
            </div>
            <div class="flex gap-4 px-6 py-5">
              <UIcon name="i-lucide-phone" class="mt-0.5 h-[22px] w-[22px] shrink-0 text-cm-red-ink" />
              <div>
                <div class="cm-label">Телефон</div>
                <a :href="`tel:${phoneHref}`" class="mt-1 block text-base leading-normal text-cm-text hover:text-cm-red-ink">
                  {{ contacts.academy.phone }}
                </a>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <a href="https://yandex.ru/maps/-/CLvy7W9a" target="_blank" rel="noopener noreferrer"
              class="cm-btn cm-btn-red cm-cut flex-[1_1_180px]">
              Построить маршрут
            </a>
            <a :href="`tel:${phoneHref}`" class="cm-btn cm-btn-outline flex-[1_1_140px]">Позвонить</a>
          </div>

          <div class="flex flex-col gap-3.5 bg-cm-inv p-6 text-cm-on-inv">
            <div class="flex items-center gap-1" role="img" aria-label="Отзывы на Яндекс.Картах">
              <UIcon v-for="n in 5" :key="n" name="i-heroicons-star-solid" class="h-5 w-5 text-cm-red" />
            </div>
            <span class="cm-display text-[40px] leading-[0.9]">Отзывы на Яндекс.Картах</span>
            <p class="m-0 text-sm leading-normal text-cm-on-inv-muted">
              Тренировался у нас — расскажи, как прошло. Читай, что пишут другие.
            </p>
            <div class="flex flex-wrap gap-2.5">
              <a :href="leaveReviewUrl" target="_blank" rel="noopener noreferrer"
                class="cm-btn cm-btn-sm flex-1 bg-cm-on-inv text-cm-inv hover:bg-cm-red hover:text-white">
                Оставить отзыв
              </a>
              <a href="#reviews" class="cm-btn cm-btn-sm flex-1 border-[1.5px] border-cm-on-inv text-cm-on-inv">
                Читать
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { contacts } = useContacts()
const phoneHref = computed(() => contacts.value.academy.phone.replace(/[^\d+]/g, ''))

const leaveReviewUrl = 'https://yandex.ru/maps/org/kamelot/159824127921/reviews/'

const mapLoaded = ref(false)

const loadMap = () => {
  mapLoaded.value = true
}

// Автоматически загружать карту при скролле
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !mapLoaded.value) {
        mapLoaded.value = true
        observer.disconnect()
      }
    })
  }, { rootMargin: '100px' })

  const mapContainer = document.querySelector('.map-container')
  if (mapContainer) {
    observer.observe(mapContainer)
  }
})
</script>
