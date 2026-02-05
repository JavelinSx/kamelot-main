<template>
  <div
    class="fight-card group relative overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black border border-gray-300 dark:border-gray-800 hover:border-red-600 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2"
    data-aos="fade-up" :data-aos-delay="aosDelay">
    <!-- Постер боя -->
    <div class="relative h-[28rem] overflow-hidden">
      <img :src="fight.poster" :alt="fight.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        @error="onImageError" />

      <!-- Overlay градиент -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>

      <!-- Статус бадж -->
      <div class="absolute top-4 right-4">
        <span :class="[
          'px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md',
          statusClass
        ]">
          {{ statusText }}
        </span>
      </div>

      <!-- Категория -->
      <div v-if="fight.category" class="absolute top-4 left-4">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-gray-300 dark:border-gray-700">
          {{ fight.category }}
        </span>
      </div>

      <!-- Информация внизу постера -->
      <div class="absolute bottom-0 left-0 right-0 p-6 pb-8">
        <h3 class="text-2xl font-bold text-white mb-3 drop-shadow-lg">{{ fight.title }}</h3>
        <div class="flex items-center gap-4 text-gray-200 text-sm drop-shadow-md">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
            <span>{{ formattedDate }}</span>
          </div>
          <div v-if="isUpcomingSoon" class="flex items-center gap-2 text-red-400 font-semibold animate-pulse">
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            <span>{{ timeUntilFight }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Детали боя -->
    <div class="p-6">
      <!-- Бойцы -->
      <div class="flex items-center justify-between mb-4">
        <!-- Первый боец -->
        <div v-if="fight.fighters[0]" class="flex flex-col items-center text-center flex-1">

          <p class="font-bold text-gray-900 dark:text-white text-sm">{{ fight.fighters[0].name }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-xs">{{ fight.fighters[0].record }}</p>
          <p class="text-gray-500 dark:text-gray-500 text-xs">{{ fight.fighters[0].team }}</p>
        </div>

        <!-- VS разделитель -->
        <div class="px-4 py-2 bg-red-600 text-white font-bold text-xl rounded-lg mx-4 flex-shrink-0">
          VS
        </div>

        <!-- Второй боец -->
        <div v-if="fight.fighters[1]" class="flex flex-col items-center text-center flex-1">

          <p class="font-bold text-gray-900 dark:text-white text-sm">{{ fight.fighters[1].name }}</p>
          <p class="text-gray-600 dark:text-gray-400 text-xs">{{ fight.fighters[1].record }}</p>
          <p class="text-gray-500 dark:text-gray-500 text-xs">{{ fight.fighters[1].team }}</p>
        </div>
      </div>

      <!-- Описание -->
      <div class="mb-4">
        <p :class="[
          'text-gray-700 dark:text-gray-300 text-sm',
          !isDescriptionExpanded && 'line-clamp-2'
        ]">
          {{ fight.description }}
        </p>
        <button
          v-if="fight.description && fight.description.length > 100"
          @click="isDescriptionExpanded = !isDescriptionExpanded"
          class="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 text-sm font-semibold mt-2 transition-colors duration-200 flex items-center gap-1">
          <span>{{ isDescriptionExpanded ? 'Свернуть' : 'Читать далее' }}</span>
          <UIcon :name="isDescriptionExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-4 h-4" />
        </button>
      </div>

      <!-- Локация и детали -->
      <div class="space-y-2 mb-4 text-sm">
        <div class="flex items-start gap-2 text-gray-600 dark:text-gray-400">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mt-0.5" />
          <div>
            <p>{{ fight.location.venue }}</p>
            <p class="text-xs text-gray-500">{{ fight.location.city }}</p>
          </div>
        </div>

        <div v-if="fight.weightClass" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <UIcon name="i-heroicons-scale" class="w-4 h-4" />
          <span>Весовая категория: {{ fight.weightClass }}</span>
        </div>

        <div v-if="fight.rounds" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <UIcon name="i-heroicons-clock" class="w-4 h-4" />
          <span>{{ fight.rounds }} раундов</span>
        </div>
      </div>

      <!-- Результаты (для завершенных боёв) -->
      <div v-if="fight.status === 'completed' && fight.results"
        class="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mb-4">
        <p class="text-green-400 font-bold mb-1">Победитель: {{ fight.results.winner }}</p>
        <p class="text-gray-400 text-sm">
          {{ fight.results.method }} • Раунд {{ fight.results.round }} • {{ fight.results.time }}
        </p>
      </div>

      <!-- Кнопки действий -->
      <div class="flex gap-2">
        <UButton v-if="fight.ticketLink" :to="fight.ticketLink" target="_blank" color="error"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold" size="md">
          <UIcon name="i-heroicons-ticket" class="w-4 h-4 mr-2" />
          Купить билет
        </UButton>

        <UButton v-if="fight.vkPost" :to="fight.vkPost" target="_blank" variant="outline" color="neutral"
          class="flex-1 border-gray-300 dark:border-gray-700 hover:border-red-600 text-gray-900 dark:text-white" size="md">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 mr-2" />
          Подробнее
        </UButton>

        <UButton v-if="fight.streamLink" :to="fight.streamLink" target="_blank" color="primary" class="flex-1"
          size="md">
          <UIcon name="i-heroicons-video-camera" class="w-4 h-4 mr-2" />
          Смотреть онлайн
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Fight } from '~/composables/useFights';

interface Props {
  fight: Fight
  aosDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  aosDelay: 0,
})

const { formatFightDate, getStatusColor, getStatusText, isUpcoming, getTimeUntilFight } = useFights()

// Состояние для раскрытия описания
const isDescriptionExpanded = ref(false)

// Форматированная дата
const formattedDate = computed(() => formatFightDate(props.fight.date, 'full'))

// Статус боя
const statusText = computed(() => getStatusText(props.fight.status))
const statusClass = computed(() => {
  const color = getStatusColor(props.fight.status)
  const classes: Record<string, string> = {
    blue: 'bg-blue-600/80 text-white',
    red: 'bg-red-600/80 text-white animate-pulse',
    green: 'bg-green-600/80 text-white',
    gray: 'bg-gray-600/80 text-white',
  }
  return classes[color] || classes.gray
})

// Проверка, является ли бой ближайшим
const isUpcomingSoon = computed(() => isUpcoming(props.fight))

// Время до боя
const timeUntilFight = computed(() => getTimeUntilFight(props.fight.date))

// Обработка ошибок загрузки изображений
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

const onFighterImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg=='
}
</script>

<style scoped>
.fight-card {
  /* Дополнительные стили при необходимости */
}

/* Анимация для пульсации */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Ограничение текста */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
