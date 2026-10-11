<template>
  <section class="pb-16 sm:pb-[120px]">
    <!-- Заголовок галереи -->
    <div class="cm-container mb-8 sm:mb-10">
      <SectionHead kicker="[05] / Галерея">
        Клетка <span class="text-cm-red-title">не врёт</span>
        <template #aside>
          <a :href="vkAlbumUrl" target="_blank" rel="noopener noreferrer" class="cm-btn cm-btn-outline">
            Больше фото в ВК
            <UIcon name="i-lucide-arrow-up-right" class="h-[18px] w-[18px]" />
          </a>
        </template>
      </SectionHead>
    </div>

    <!-- Галерея -->
    <div ref="galleryContainer" class="masonry-container px-1.5"
      :style="{ columnCount: columnCount, columnGap: gap + 'px' }">
      <div v-for="(image, index) in images" :key="index" class="masonry-item group cursor-pointer break-inside-avoid"
        :style="{ marginBottom: gap + 'px' }" @click="handleImageClick(image, index)">
        <button type="button" class="relative block w-full cursor-pointer overflow-hidden bg-cm-surface-2"
          :aria-label="`Открыть фото ${index + 1}`">
          <img :src="image" :alt="`Фото из зала Camelot ${index + 1}`"
            class="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"
            @error="onImageError" />
          <span
            class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span class="cm-cut inline-flex h-12 w-12 items-center justify-center bg-cm-red text-white">
              <UIcon name="i-lucide-zoom-in" class="h-6 w-6" />
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- Кнопка "Показать еще" или ссылка на VK -->
    <div class="mt-10 flex justify-center px-4">
      <button v-if="canLoadMore" type="button" class="cm-btn cm-btn-red cm-cut" :disabled="loadingMore"
        @click="$emit('loadMore')">
        <span v-if="!loadingMore">Показать ещё</span>
        <span v-else class="flex items-center gap-2.5">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
          Загрузка
        </span>
      </button>

      <a v-else :href="vkAlbumUrl" target="_blank" rel="noopener noreferrer" class="cm-btn cm-btn-red cm-cut">
        <IconVk class="h-5 w-5" />
        Смотреть все фото
      </a>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxImage" role="dialog" aria-modal="true" aria-label="Просмотр фото"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md" @click="closeLightbox">
        <button type="button" aria-label="Закрыть"
          class="fixed right-4 top-4 z-20 flex h-12 w-12 cursor-pointer items-center justify-center bg-cm-red text-white transition-colors hover:bg-cm-red-hover md:right-8 md:top-8 md:h-14 md:w-14"
          @click="closeLightbox">
          <UIcon name="i-lucide-x" class="h-6 w-6 md:h-7 md:w-7" />
        </button>

        <button v-if="lightboxIndex > 0" type="button" aria-label="Предыдущее фото"
          class="fixed left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/30 bg-black/60 text-white transition-colors hover:border-cm-red hover:bg-cm-red md:left-8 md:h-16 md:w-16"
          @click.stop="navigateLightbox(-1)">
          <UIcon name="i-lucide-chevron-left" class="h-6 w-6 md:h-8 md:w-8" />
        </button>

        <button v-if="lightboxIndex < images.length - 1" type="button" aria-label="Следующее фото"
          class="fixed right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/30 bg-black/60 text-white transition-colors hover:border-cm-red hover:bg-cm-red md:right-8 md:h-16 md:w-16"
          @click.stop="navigateLightbox(1)">
          <UIcon name="i-lucide-chevron-right" class="h-6 w-6 md:h-8 md:w-8" />
        </button>

        <div class="relative flex h-full w-full items-center justify-center p-4 md:p-8" @click.stop>
          <img :src="lightboxImage" :alt="`Фото из зала Camelot ${lightboxIndex + 1}`"
            class="max-h-[calc(100vh-8rem)] max-w-full object-contain md:max-h-[calc(100vh-12rem)]" />
        </div>

        <div
          class="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 border border-white/20 bg-black/80 px-5 py-2.5 font-mono text-sm font-bold tracking-[0.12em] text-white md:bottom-8">
          {{ String(lightboxIndex + 1).padStart(2, '0') }} / {{ String(images.length).padStart(2, '0') }}
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  images: string[] // Просто массив URL изображений
  title?: string
  description?: string
  columns?: number
  gap?: number
  canLoadMore?: boolean
  loadingMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: 0, // 0 = автоматически
  gap: 6,
  canLoadMore: false,
  loadingMore: false
})

interface Emits {
  imageClick: [imageUrl: string, index: number]
  loadMore: []
  lightboxOpen: [imageUrl: string, index: number]
  lightboxClose: []
}

const emit = defineEmits<Emits>()

const vkAlbumUrl = 'https://vk.com/albums-216306733'

// Реактивные данные
const galleryContainer = ref<HTMLElement>()
const lightboxImage = ref<string | null>(null)
const lightboxIndex = ref(-1)

// Адаптивные колонки
// Используем 0 для SSR, чтобы избежать hydration mismatch
const windowWidth = ref(0)

const columnCount = computed(() => {
  if (props.columns > 0) return props.columns

  // Если windowWidth еще не установлен (SSR), возвращаем mobile-first значение
  if (windowWidth.value === 0) return 1

  // Автоматическое определение количества колонок
  const width = windowWidth.value
  if (width < 640) return 1      // mobile
  if (width < 768) return 2      // tablet
  if (width < 1024) return 3     // desktop
  if (width < 1280) return 4     // large
  return 5                       // xl
})

// Методы
const handleImageClick = (imageUrl: string, index: number) => {
  openLightbox(imageUrl, index)
  emit('imageClick', imageUrl, index)
}

const openLightbox = (imageUrl: string, index: number) => {
  lightboxImage.value = imageUrl
  lightboxIndex.value = index
  document.body.style.overflow = 'hidden'
  emit('lightboxOpen', imageUrl, index)
}

const closeLightbox = () => {
  lightboxImage.value = null
  lightboxIndex.value = -1
  document.body.style.overflow = ''
  emit('lightboxClose')
}

const navigateLightbox = (direction: number) => {
  const newIndex = lightboxIndex.value + direction
  if (newIndex >= 0 && newIndex < props.images.length) {
    const image = props.images[newIndex]
    if (image) {
      lightboxIndex.value = newIndex
      lightboxImage.value = image
    }

  }
}

const onImageError = (payload: string | Event) => {
  // Можно заменить на placeholder
  if (typeof payload === 'string') return
  const img = payload.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// Обработчик клавиш для lightbox
const handleKeydown = (event: KeyboardEvent) => {
  if (!lightboxImage.value) return

  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      navigateLightbox(-1)
      break
    case 'ArrowRight':
      navigateLightbox(1)
      break
  }
}

// Обновление колонок при изменении размера окна
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// Lifecycle
onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.masonry-container {
  column-fill: balance;
}

.masonry-item {
  display: inline-block;
  width: 100%;
  vertical-align: top;
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Адаптивность */
@media (max-width: 640px) {
  .masonry-container {
    column-count: 1 !important;
  }
}

@media (max-width: 768px) {
  .masonry-container {
    column-count: 2 !important;
  }
}
</style>