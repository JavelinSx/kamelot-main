<template>
  <div class="pt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
    <UContainer class="py-12">
      <!-- Hero секция с фото и основной информацией -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
        <div class="md:flex">
          <!-- Фото тренера -->
          <div class="md:w-2/5 relative">
            <img v-if="trainer" :src="trainer.avatar" :alt="`${trainer.firstName} ${trainer.lastName}`"
              class="w-full h-96 md:h-full object-cover" />
            <div class="absolute top-4 right-4">
              <UBadge v-if="trainer?.rating && trainer.rating >= 4.8" color="warning" variant="solid" size="lg">
                ⭐ Топ тренер
              </UBadge>
            </div>
          </div>

          <!-- Основная информация -->
          <div class="md:w-3/5 p-8 space-y-6">
            <div>
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {{ trainer?.firstName }} {{ trainer?.lastName }}
              </h1>
              <p class="text-xl text-red-600 dark:text-red-400 font-semibold">
                {{ getMainSpecialization(trainer?.specializations || []) }}
              </p>
            </div>

            <!-- Статистика -->
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center justify-center gap-2 text-yellow-500 mb-1">
                  <UIcon name="i-heroicons-star-solid" class="w-6 h-6" />
                  <span class="font-bold text-2xl text-gray-900 dark:text-white">{{ trainer?.rating }}</span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Рейтинг</p>
              </div>

              <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center justify-center gap-2 text-blue-500 mb-1">
                  <UIcon name="i-heroicons-trophy-solid" class="w-6 h-6" />
                  <span class="font-bold text-2xl text-gray-900 dark:text-white">{{ trainer?.experience }}</span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Лет опыта</p>
              </div>

              <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center justify-center gap-2 text-green-500 mb-1">
                  <UIcon name="i-heroicons-user-group-solid" class="w-6 h-6" />
                  <span class="font-bold text-2xl text-gray-900 dark:text-white">{{ trainer?.stats.totalStudents
                  }}</span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Учеников</p>
              </div>
            </div>

            <!-- Специализации -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Специализации</h3>
              <div class="flex flex-wrap gap-2">
                <UBadge v-for="specialty in trainer?.specializations" :key="specialty" color="error" variant="soft"
                  size="md">
                  {{ getSpecializationName(specialty) }}
                </UBadge>
              </div>
            </div>

            <!-- Цена и кнопка -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <UButton color="error" size="xl" @click="contactTrainer">
                <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
                Записаться
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Биография -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">О тренере</h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
          {{ trainer?.bio }}
        </p>
      </div>

      <!-- Достижения -->
      <div v-if="trainer?.achievements?.length" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Достижения</h2>
        <ul class="space-y-3">
          <li v-for="achievement in trainer.achievements" :key="achievement"
            class="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <UIcon name="i-heroicons-trophy" class="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
            <span class="text-lg">{{ achievement }}</span>
          </li>
        </ul>
      </div>

      <!-- Дополнительная статистика -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Статистика</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span class="text-gray-600 dark:text-gray-300">Проведено тренировок</span>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ trainer?.stats.sessionsCompleted }}</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span class="text-gray-600 dark:text-gray-300">Отзывов</span>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ trainer?.reviewsCount }}</span>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { Trainer, WorkoutType } from '~/types'

// Получаем ID тренера из роута
const route = useRoute()
const trainerId = computed(() => Number(route.params.id))

// Загружаем данные тренера
const { trainers } = useTrainers()
const trainer = computed(() => trainers.value.find((t: Trainer) => t.id === trainerId.value))

// Если тренер не найден, редирект на главную
if (!trainer.value && process.client) {
  navigateTo('/')
}

// Словарь специализаций
const specializationNames: Record<WorkoutType, string> = {
  mma: 'ММА',
  wrestling: 'Борьба',
  grappling: 'Грэпплинг',
  kickboxing: 'Кикбоксинг',
  boxing: 'Бокс',
  bjj: 'BJJ',
  ofp: 'ОФП',
  pankration: 'Панкратион'
}

const getSpecializationName = (type: WorkoutType): string => {
  return specializationNames[type] || type
}

const getMainSpecialization = (specializations: readonly WorkoutType[]): string => {
  if (specializations.length === 0) return 'Тренер'
  const firstSpecialization = specializations[0]
  if (!firstSpecialization) return 'Тренер'
  return `Тренер по ${getSpecializationName(firstSpecialization)}`
}

const contactTrainer = () => {
  const event = new CustomEvent('openBookingModal')
  window.dispatchEvent(event)
}

// SEO
useSeoMeta({
  title: `${trainer.value?.firstName} ${trainer.value?.lastName} - Тренер | Kamelot Fight Club`,
  description: trainer.value?.bio || 'Профессиональный тренер в Kamelot Fight Club'
})
</script>