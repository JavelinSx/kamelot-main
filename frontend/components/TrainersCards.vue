<template>
  <section id="trainers"
    class="py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
    <!-- Кастомный контейнер с детальными настройками -->
    <UContainer :ui="{
      base: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
    }">
      <!-- Заголовок секции -->
      <div class="text-center mb-8">
        <ClientOnly>
          <h2 v-motion-slide-visible-once-top :duration="600"
            class="lg:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Наши тренеры
          </h2>
          <p v-motion-slide-visible-once-bottom :duration="600" :delay="100"
            class="lg:text-2xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Опытные профессионалы с многолетним стажем и международными достижениями
          </p>
        </ClientOnly>
      </div>

      <!-- Сетка карточек тренеров -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        <ClientOnly>
          <div v-for="(trainer, index) in trainers" :key="trainer.id" v-motion-slide-visible-once-left :duration="600"
            :delay="index * 100">
            <UCard :ui="{
              root: 'overflow-hidden bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 rounded-2xl shadow-lg hover:shadow-2xl',
              body: 'p-4 h-full',
              header: 'p-0 sm:px-0 relative'
            }" class="group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2">
              <!-- Заголовок карточки с изображением -->
              <template #header>
                <div class="relative h-80 overflow-hidden">
                  <!-- Основное изображение тренера -->
                  <img :src="trainer.avatar" :alt="`${trainer.firstName} ${trainer.lastName}`"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                  <!-- Градиентный оверлей -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <!-- Бейдж рейтинга -->
                  <div class="absolute top-4 right-4">
                    <UBadge v-if="trainer.rating >= 4.8" color="warning" variant="solid" size="lg" :ui="{
                      base: 'font-bold rounded-full',
                      label: 'font-semibold text-xs'
                    }">
                      ⭐ Топ тренер
                    </UBadge>
                  </div>

                  <!-- Специализации (показываются при ховере) -->
                  <div
                    class="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div class="flex flex-wrap gap-2">
                      <UBadge v-for="specialty in trainer.specializations" :key="specialty" color="error" variant="soft"
                        size="sm" :ui="{
                          base: 'backdrop-blur-sm rounded-lg'
                        }">
                        {{ getSpecializationName(specialty) }}
                      </UBadge>
                    </div>
                  </div>

                  <!-- Цена в углу -->
                  <div class="absolute top-4 left-4">
                    <div class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {{ trainer.price }} ₽
                    </div>
                  </div>
                </div>
              </template>

              <!-- Основное содержимое карточки -->
              <div class="space-y-4">
                <!-- Имя и специализация -->
                <div class="space-y-2">
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ trainer.firstName }} {{ trainer.lastName }}
                  </h3>
                  <p class="text-red-600 dark:text-red-400 font-semibold text-lg">
                    {{ getMainSpecialization(trainer.specializations) }}
                  </p>
                </div>

                <!-- Биография -->
                <div v-if="trainer.bio">
                  <p class="text-gray-600 dark:text-gray-300 leading-relaxed"
                    :class="expandedBio[trainer.id] ? '' : 'line-clamp-3'">
                    {{ trainer.bio }}
                  </p>
                  <button v-if="trainer.bio.length > 150" @click="toggleBio(trainer.id)"
                    class="text-red-600 dark:text-red-400 text-sm font-semibold mt-2 hover:underline">
                    {{ expandedBio[trainer.id] ? 'Скрыть' : 'Читать далее' }}
                  </button>
                </div>

                <!-- Дополнительная информация -->
                <div class="space-y-3 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500 dark:text-gray-400">Учеников:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ trainer.stats.totalStudents }}</span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-gray-500 dark:text-gray-400">Отзывы:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ trainer.reviewsCount }}</span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-gray-500 dark:text-gray-400">Тренировок:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ trainer.stats.sessionsCompleted
                    }}</span>
                  </div>
                </div>

                <!-- Достижения (аккордеон) -->
                <details class="group/details">
                  <summary
                    class="cursor-pointer list-none flex items-center justify-between py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <span class="font-semibold">Достижения</span>
                    <UIcon name="i-heroicons-chevron-down"
                      class="w-4 h-4 transition-transform group-open/details:rotate-180" />
                  </summary>
                  <div class="mt-2 space-y-1">
                    <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li v-for="achievement in trainer.achievements?.slice(0, 4)" :key="achievement"
                        class="flex items-start gap-2">
                        <span class="text-red-500 mt-1">•</span>
                        <span>{{ achievement }}</span>
                      </li>
                    </ul>
                  </div>
                </details>

                <!-- Кнопки действий -->
                <div class="pt-4 space-y-3 ">
                  <UButton color="success" variant="solid" size="lg" block
                    class="hover:cursor-pointer justify-center rounded-xl font-bold pt-3 pb-3 hover:bg-amber-50 hover:text-blue-600 transition-all duration-300"
                    @click="contactTrainer(trainer)">
                    <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
                    Связаться с тренером
                  </UButton>

                  <UButton color="neutral" variant="outline" size="lg" block
                    class="hover:cursor-pointer justify-center rounded-xl font-semibold pt-3 pb-3 hover:bg-amber-50 hover:text-slate-600 transition-all duration-300"
                    @click="viewTrainerProfile(trainer)">
                    <UIcon name="i-heroicons-user-circle" class="w-5 h-5 mr-2" />
                    Посмотреть профиль
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
          <template #fallback>
            <div v-for="(trainer, index) in trainers" :key="trainer.id">
              <UCard :ui="{
                root: 'overflow-hidden bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 rounded-2xl shadow-lg hover:shadow-2xl',
                body: 'p-4 h-full',
                header: 'p-0 sm:px-0 relative'
              }" class="group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2">
                <template #header>
                  <div class="relative h-80 overflow-hidden">
                    <img :src="trainer.avatar" :alt="`${trainer.firstName} ${trainer.lastName}`"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div class="absolute top-4 right-4">
                      <UBadge v-if="trainer.rating >= 4.8" color="warning" variant="solid" size="lg" :ui="{
                        base: 'font-bold rounded-full',
                        label: 'font-semibold text-xs'
                      }">
                        ⭐ Топ тренер
                      </UBadge>
                    </div>
                    <div class="absolute top-4 left-4">
                      <div class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {{ trainer.price }} ₽
                      </div>
                    </div>
                  </div>
                </template>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ trainer.firstName }} {{ trainer.lastName }}
                    </h3>
                    <p class="text-red-600 dark:text-red-400 font-semibold text-lg">
                      {{ getMainSpecialization(trainer.specializations) }}
                    </p>
                  </div>
                  <div v-if="trainer.bio">
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {{ trainer.bio }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </template>
        </ClientOnly>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { WorkoutType } from '~/types'

// Используем composable - данные теперь доступны сразу, без асинхронной загрузки
const { trainers } = useTrainers()
const expandedBio = ref<Record<number, boolean>>({})


const toggleBio = (trainerId: number) => {
  expandedBio.value[trainerId] = !expandedBio.value[trainerId]
}

// Словарь для перевода специализаций
const specializationNames: Record<WorkoutType, string> = {
  mma: 'ММА',
  wrestling: 'Борьба',
  grappling: 'Грэпплинг',
  kickboxing: 'Кикбоксинг',
  boxing: 'Бокс',
  bjj: 'BJJ',
  muay_thai: 'Муай Тай',
  karate: 'Каратэ',
  judo: 'Дзюдо',
  sambo: 'Самбо'
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

const contactTrainer = (trainer: any) => {
  console.log('Связаться с тренером:', trainer.firstName, trainer.lastName)
  // Здесь можно добавить логику открытия модального окна или перехода на страницу контактов
}

const viewTrainerProfile = (trainer: any) => {
  navigateTo(`/trainers/${trainer.id}`)
}
</script>

<style scoped>
/* Дополнительные утилиты для обрезки текста */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>