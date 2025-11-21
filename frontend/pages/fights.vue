<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:from-black dark:via-gray-900 dark:to-black">
    <!-- Hero секция -->
    <div class="relative h-96 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-red-900/50 to-orange-900/50"></div>
      <div class="absolute inset-0 bg-white/60 dark:bg-black/60"></div>

      <UContainer class="relative h-full flex flex-col justify-center items-center text-center z-10">
        <h1
          class="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6"
          data-aos="fade-down"
          data-aos-duration="800">
          Анонсы Боёв
        </h1>
        <p
          class="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200">
          Следите за предстоящими боями и результатами турниров Kamelot Fight Club
        </p>
      </UContainer>
    </div>

    <UContainer class="py-16">
      <!-- Фильтры -->
      <div
        class="flex flex-wrap gap-4 mb-12 justify-center"
        data-aos="fade-up"
        data-aos-duration="600">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-6 py-3 rounded-lg font-bold transition-all duration-300',
            activeFilter === filter.value
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/50 scale-105'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
          ]">
          {{ filter.label }}
        </button>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
      </div>

      <!-- Список боёв -->
      <div v-else-if="filteredFights.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FightCard
          v-for="(fight, index) in filteredFights"
          :key="fight.id"
          :fight="fight"
          :aos-delay="(index % 3) * 100" />
      </div>

      <!-- Пусто -->
      <div v-else class="text-center py-20">
        <UIcon name="i-heroicons-inbox" class="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Нет боёв</h3>
        <p class="text-gray-500 dark:text-gray-500">
          {{ emptyMessage }}
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { Fight } from '~/composables/useFights'

useSeoMeta({
  title: 'Анонсы боёв - Kamelot Fight Club',
  description: 'Следите за предстоящими боями, турнирами и результатами в Kamelot Fight Club. Профессиональные бои по ММА, боксу и кикбоксингу.',
  ogTitle: 'Анонсы боёв - Kamelot Fight Club',
  ogDescription: 'Расписание предстоящих боёв и турниров в лучшем клубе боевых искусств',
  ogImage: '/og-fights.jpg'
})

const { loadFights } = useFights()

// Состояние
const fights = ref<Fight[]>([])
const loading = ref(true)
const activeFilter = ref<'all' | 'upcoming' | 'completed'>('all')

// Фильтры
const filters: Array<{ label: string; value: 'all' | 'upcoming' | 'completed' }> = [
  { label: 'Все бои', value: 'all' },
  { label: 'Предстоящие', value: 'upcoming' },
  { label: 'Завершенные', value: 'completed' },
]

// Отфильтрованные бои
const filteredFights = computed(() => {
  if (activeFilter.value === 'all') {
    return fights.value
  }
  return fights.value.filter(fight => fight.status === activeFilter.value)
})

// Сообщение о пустом списке
const emptyMessage = computed(() => {
  const messages = {
    all: 'На данный момент нет анонсов боёв',
    upcoming: 'Нет предстоящих боёв. Следите за обновлениями!',
    completed: 'Нет завершенных боёв',
  }
  return messages[activeFilter.value]
})

// Загрузка данных
onMounted(async () => {
  try {
    fights.value = await loadFights()
  } catch (error) {
    // Silent error
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
