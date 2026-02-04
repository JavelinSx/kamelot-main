<template>
  <div
    class="bg-gradient-to-b from-gray-100 to-white dark:from-black dark:to-gray-900 transition-colors duration-300 overflow-hidden">
    <!-- Заголовок галереи -->
    <div v-if="title || description" class="text-center pt-8 pb-8">
      <h2 v-if="title" data-aos="fade-down" data-aos-duration="600"
        class="text-5xl font-bold text-gray-900 dark:text-gray-300 mb-12">{{ title }}</h2>
      <p v-if="description" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"
        class="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">{{ description }}</p>
    </div>

    <!-- Галерея -->
    <div ref="galleryContainer" class="masonry-container" :style="{ columnCount: columnCount, columnGap: gap + 'px' }">
      <div v-for="(image, index) in images" :key="index" data-aos="fade-up" :data-aos-delay="(index % 10) * 50"
        data-aos-duration="500" class="masonry-item group cursor-pointer break-inside-avoid"
        :style="{ marginBottom: gap + 'px' }" @click="handleImageClick(image, index)">
        <!-- Контейнер изображения -->
        <div
          class="relative overflow-hidden bg-gray-200 dark:bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <!-- Изображение -->
          <img
            :src="image"
            :alt="`Gallery image ${index + 1}`"
            class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            @error="onImageError"
          />

          <!-- Простой overlay при hover -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="p-3 bg-black/50 text-white rounded-full">
              <UIcon name="i-heroicons-magnifying-glass-plus" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопка "Показать еще" или ссылка на VK -->
    <div class="text-center mt-8 pb-8">
      <button v-if="canLoadMore" @click="$emit('loadMore')" :disabled="loadingMore"
        class="px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold rounded-lg transition-colors disabled:opacity-50 shadow-lg">
        <span v-if="!loadingMore">Показать еще</span>
        <span v-else class="flex items-center justify-center space-x-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Загрузка...</span>
        </span>
      </button>

      <!-- Ссылка на VK альбом когда все фото загружены -->
      <a v-else
        href="https://vk.com/albums-216306733"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-6 py-3 bg-[#0077FF] hover:bg-[#005FCC] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 13.72c-.37.46-.98.7-1.82.7h-1.21c-.51 0-.78-.12-1.32-.61-.54-.49-1.04-1.34-1.54-1.34-.08 0-.16.01-.23.03-.42.11-.57.53-.57 1.48 0 .39-.22.62-.75.62-.98 0-2.08-.2-3.02-1.14-.94-.94-1.92-2.82-1.92-2.82s-.15-.36 0-.54c.14-.17.52-.18.52-.18h1.5c.28 0 .38.13.49.36.26.61.78 1.58 1.11 1.88.09.08.13.12.19.12.06 0 .12-.05.12-.29V11.1c-.03-.77-.47-.84-.47-1.11 0-.14.11-.28.29-.28h2.35c.24 0 .33.13.33.35v2.89c0 .24.11.33.18.33.14 0 .25-.09.5-.34.77-.87 1.32-2.21 1.32-2.21.07-.16.21-.31.45-.31h1.5c.34 0 .41.17.34.41-.13.43-.98 1.93-1.63 2.77-.11.14-.15.21 0 .37.11.13.48.47.73.75.46.52.81 1.05.9 1.39.1.35-.05.52-.4.52z"/>
        </svg>
        Смотреть больше фото VK
      </a>
    </div>

    <!-- Lightbox модалка -->
    <Teleport to="body">
      <div v-if="lightboxImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
        @click="closeLightbox" @keydown.esc="closeLightbox">
        <!-- Закрыть -->
        <button @click="closeLightbox"
          class="fixed top-4 right-4 md:top-8 md:right-8 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-2xl hover:scale-110">
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6 md:w-7 md:h-7" />
        </button>

        <!-- Навигация слева -->
        <button v-if="lightboxIndex > 0" @click.stop="navigateLightbox(-1)"
          class="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-2xl hover:scale-110">
          <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <!-- Навигация справа -->
        <button v-if="lightboxIndex < images.length - 1" @click.stop="navigateLightbox(1)"
          class="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-2xl hover:scale-110">
          <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <!-- Изображение -->
        <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8" @click.stop>
          <img :src="lightboxImage" :alt="`Gallery image ${lightboxIndex + 1}`"
            class="max-w-full max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-12rem)] object-contain" />
        </div>

        <!-- Счетчик изображений -->
        <div
          class="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 bg-black/80 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl">
          <span class="text-white font-semibold text-lg">{{ lightboxIndex + 1 }} / {{ images.length }}</span>
        </div>
      </div>
    </Teleport>
  </div>
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
  gap: 4,
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