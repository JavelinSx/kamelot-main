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
          <h2 v-motion-slide-visible-once-left :duration="600"
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <ClientOnly>
          <div v-for="(trainer, index) in trainers" :key="trainer.id" v-motion-slide-visible-once-left :duration="600"
            :delay="index * 100">
            <div
              class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group h-full min-h-[800px]">
              <!-- Фоновое изображение на всю карточку -->
              <div class="absolute inset-0">
                <img :src="trainer.avatar" :alt="`${trainer.firstName} ${trainer.lastName}`"
                  class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                <!-- Затемнение -->

              </div>

              <!-- Текстовая часть с эффектом стекла внизу -->
              <div class="relative z-10 h-full flex flex-col justify-end">
                <!-- Glassmorphism контейнер -->
                <div class="backdrop-blur-xl bg-black/60 border-t border-white/20 p-5 space-y-3">
                  <!-- Специализации -->
                  <div class="flex flex-wrap gap-1.5 mb-3">
                    <UBadge v-for="specialty in trainer.specializations" :key="specialty" color="error" variant="soft"
                      size="sm" :ui="{
                        base: 'backdrop-blur-sm rounded-lg'
                      }">
                      {{ getSpecializationName(specialty) }}
                    </UBadge>
                  </div>

                  <!-- Имя и специализация -->
                  <div class="space-y-1.5">
                    <h3 class="text-xl font-bold text-white">
                      {{ trainer.firstName }} {{ trainer.lastName }}
                    </h3>
                    <p class="text-red-400 font-semibold text-base">
                      {{ getMainSpecialization(trainer.specializations) }}
                    </p>
                  </div>

                  <!-- Биография -->
                  <div v-if="trainer.bio">
                    <p class="text-gray-200 leading-relaxed text-sm"
                      :class="expandedBio[trainer.id] ? '' : 'line-clamp-2'">
                      {{ trainer.bio }}
                    </p>
                    <button v-if="trainer.bio.length > 100" @click="toggleBio(trainer.id)"
                      class="text-red-400 text-sm font-semibold mt-2 hover:text-red-300 transition-colors">
                      {{ expandedBio[trainer.id] ? 'Скрыть' : 'Читать далее' }}
                    </button>
                  </div>

                  <!-- Дополнительная информация -->
                  <div class="flex items-center justify-around gap-3 text-sm border-t border-white/20 pt-2.5">
                    <div class="text-center">
                      <div class="font-bold text-white text-base">{{ trainer.stats.totalStudents }}</div>
                      <div class="text-gray-300 text-xs">Учеников</div>
                    </div>
                    <div class="h-6 w-px bg-white/20"></div>
                    <div class="text-center">
                      <div class="font-bold text-white text-base">{{ trainer.stats.sessionsCompleted }}</div>
                      <div class="text-gray-300 text-xs">Тренировок</div>
                    </div>
                    <div class="h-6 w-px bg-white/20"></div>
                    <div class="text-center">
                      <div class="font-bold text-white text-base">{{ trainer.experience }}</div>
                      <div class="text-gray-300 text-xs">Лет опыта</div>
                    </div>
                  </div>

                  <!-- Достижения (аккордеон) -->
                  <details class="group/details">
                    <summary
                      class="cursor-pointer list-none flex items-center justify-between py-2 text-white hover:text-red-400 transition-colors">
                      <span class="font-semibold">Достижения</span>
                      <UIcon name="i-heroicons-chevron-down"
                        class="w-4 h-4 transition-transform group-open/details:rotate-180" />
                    </summary>
                    <div class="mt-2 space-y-1">
                      <ul class="text-sm text-gray-200 space-y-1">
                        <li v-for="achievement in trainer.achievements?.slice(0, 3)" :key="achievement"
                          class="flex items-start gap-2">
                          <span class="text-red-400 mt-1">•</span>
                          <span>{{ achievement }}</span>
                        </li>
                      </ul>
                    </div>
                  </details>

                  <!-- Кнопки действий -->
                  <div class="pt-1.5 space-y-2.5">

                    <UButton color="neutral" variant="outline" size="xl" block
                      class="dark:text-white hover:cursor-pointer justify-center rounded-xl font-semibold border-white/30 text-gray-800 hover:bg-white/10 transition-all duration-300"
                      @click="viewTrainerProfile(trainer)">
                      <UIcon name="i-heroicons-user-circle" class="w-4 h-4 mr-2" />
                      Посмотреть профиль
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

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