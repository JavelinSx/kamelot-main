<template>
  <div class="mt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <UContainer class="py-10">
      <!-- Заголовок -->
      <div class="text-center mb-12">
        <h1 data-aos="fade-down" data-aos-duration="600"
          class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Расписание тренировок
        </h1>
        <p data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"
          class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Выберите зону и день недели для просмотра расписания
        </p>

        <div v-if="scheduleData?.metadata" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>{{ scheduleData.metadata.notes }}</p>
          <p class="mt-1">Обновлено: {{ formatDate(scheduleData.metadata.lastUpdated) }}</p>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">Загрузка расписания...</p>
        </div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md mx-auto">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p class="text-red-600 dark:text-red-400 font-semibold mb-2">Ошибка загрузки расписания</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ error.message }}</p>
        </div>
      </div>

      <!-- Расписание -->
      <div v-else-if="scheduleData" class="space-y-8">
        <!-- Табы зон -->
        <div class="mb-8" data-aos="fade-up" data-aos-duration="600">
          <div class="flex gap-4 justify-center">
            <button v-for="(zone, index) in scheduleData.zones" :key="zone.id" @click="selectedZoneIndex = index"
              :class="[
                'px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300',
                selectedZoneIndex === index
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]">
              {{ zone.name }}
            </button>
          </div>
        </div>

        <div v-if="selectedZone" class="space-y-6">
          <!-- Описание зоны -->
          <div
            class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6"
            data-aos="fade-up" data-aos-duration="600">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ selectedZone.name }}</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ selectedZone.description }}</p>
          </div>

          <!-- Табы дней недели -->
          <div class="mb-6">
            <div class="flex flex-wrap gap-2 justify-center">
              <button v-for="(day, index) in daysOfWeek" :key="day.key" @click="selectedDayIndex = index" :class="[
                'px-6 py-3 rounded-lg font-semibold transition-all duration-300',
                selectedDayIndex === index
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              ]">
                {{ day.label }}
              </button>
            </div>
          </div>

          <div class="py-6">
            <!-- Нет тренировок -->
            <div v-if="!currentDaySessions || currentDaySessions.length === 0" class="text-center py-12">
              <UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400 text-lg">В этот день нет тренировок</p>
            </div>

            <!-- Карточки тренировок -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(session, index) in currentDaySessions" :key="session.id" data-aos="zoom-in"
                :data-aos-delay="index * 50" data-aos-duration="600"
                class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">

                <!-- Заголовок карточки -->
                <div class="bg-gradient-to-r from-red-600 to-orange-600 p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-clock" class="w-6 h-6 text-white" />
                      <span class="text-white font-bold text-lg">{{ session.time }}</span>
                    </div>
                    <UBadge v-if="isCurrentSession(daysOfWeek[selectedDayIndex]?.label || '', session.time)"
                      color="success" variant="solid">
                      Сейчас
                    </UBadge>
                  </div>
                </div>

                <!-- Содержимое -->
                <div class="p-6 space-y-4 relative overflow-hidden">
                  <!-- Фоновая картинка -->
                  <div class="absolute right-0 top-0 bottom-0 w-32 pointer-events-none" :style="{
                    filter: session.ageCategory === 'kid'
                      ? 'drop-shadow(2px 0 4px rgba(34, 197, 94, 0.6))'
                      : session.ageCategory === 'teen'
                        ? 'drop-shadow(2px 0 4px rgba(249, 115, 22, 0.6))'
                        : 'drop-shadow(2px 0 4px rgba(239, 68, 68, 0.6))'
                  }">
                    <img v-if="session.ageCategory === 'kid'" :src="kid" class="h-full w-full object-cover"
                      alt="Детская группа" />
                    <img v-else-if="session.ageCategory === 'teen'" :src="teen" class="h-full w-full object-cover"
                      alt="Подростковая группа" />
                    <img v-else :src="adult" class="h-full w-full object-cover" alt="Взрослая группа" />
                  </div>

                  <!-- Дисциплина -->
                  <div class="relative z-10">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {{ session.discipline }}
                    </h3>
                    <p v-if="session.ageGroup" :class="[
                      'text-sm font-semibold',
                      session.ageCategory === 'kid' ? 'text-green-500' :
                        session.ageCategory === 'teen' ? 'text-orange-500' :
                          'text-red-500'
                    ]">
                      {{ session.ageGroup }}
                    </p>
                  </div>

                  <!-- Тренер -->
                  <div class="flex items-center gap-3 relative z-10">
                    <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-red-600" />
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Тренер</p>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ session.trainer }}</p>
                    </div>
                  </div>

                  <!-- Уровень -->
                  <div class="flex items-center gap-3 relative z-10">
                    <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-red-600" />
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Уровень</p>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ session.level }}</p>
                    </div>
                  </div>

                  <!-- Кнопка записи -->
                  <UButton color="error" variant="solid" block class="mt-4 relative z-10" @click="bookSession(session)">
                    <UIcon name="i-heroicons-calendar-plus" class="w-5 h-5 mr-2" />
                    Записаться
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Дополнительная информация -->
        <div class="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6" data-aos="fade-up" data-aos-duration="600">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-6 h-6 text-blue-600" />
            Важная информация
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-blue-600 mt-1">•</span>
              <span>Запись на тренировки обязательна. Позвоните по телефону или напишите в мессенджер.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-600 mt-1">•</span>
              <span>Приходите за 10-15 минут до начала тренировки для переодевания.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-600 mt-1">•</span>
              <span>При первом посещении необходима справка от врача о допуске к занятиям.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-600 mt-1">•</span>
              <span>Расписание может изменяться. Уточняйте актуальность у администратора.</span>
            </li>
          </ul>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import adult from '~/public/images/fight-category/adult.png'
import kid from '~/public/images/fight-category/kid.png'
import teen from '~/public/images/fight-category/teen.png'
const { scheduleData, loading, error, fetchSchedule } = useSchedule()

const selectedZoneIndex = ref(0)
const selectedDayIndex = ref(getCurrentDayIndex())

// Загружаем расписание
onMounted(async () => {
  try {
    await fetchSchedule()
  } catch (err) {
    console.error('Failed to load schedule:', err)
  }
})

// Дни недели
const daysOfWeek = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' }
]

// Текущая зона
const selectedZone = computed(() => {
  if (!scheduleData.value) return null
  return scheduleData.value.zones[selectedZoneIndex.value] || null
})

// Текущие тренировки дня
const currentDaySessions = computed(() => {
  if (!selectedZone.value) return []
  const dayKey = daysOfWeek[selectedDayIndex.value]?.key as keyof typeof selectedZone.value.schedule
  if (!dayKey) return []
  return selectedZone.value.schedule[dayKey] || []
})

// Определяем текущий день недели
function getCurrentDayIndex(): number {
  const today = new Date().getDay()
  // В JavaScript воскресенье = 0, понедельник = 1
  return today === 0 ? 6 : today - 1
}

// Проверяем, идет ли тренировка сейчас
function isCurrentSession(day: string, timeRange: string): boolean {
  const now = new Date()
  const currentDayData = daysOfWeek[getCurrentDayIndex()]
  if (!currentDayData) return false

  const currentDay = currentDayData.label

  if (day !== currentDay) return false

  const [startTime] = timeRange.split('-')
  if (!startTime) return false

  const timeParts = startTime.trim().split(':').map(Number)
  const hours = timeParts[0]
  const minutes = timeParts[1]

  if (hours === undefined || minutes === undefined) return false

  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()

  // Упрощенная проверка (можно улучшить)
  return currentHours === hours && currentMinutes >= minutes && currentMinutes < minutes + 90
}

// Форматирование даты
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Запись на тренировку
function bookSession(session: any) {
  // TODO: Добавить логику записи на тренировку
  console.log('Запись на тренировку:', session)
  alert(`Запись на "${session.discipline}" в ${session.time}\nТренер: ${session.trainer}\n\nДля записи позвоните по телефону или напишите в мессенджер.`)
}

// SEO
useHead({
  title: 'Расписание тренировок - Kamelot Fight Club',
  meta: [
    {
      name: 'description',
      content: 'Актуальное расписание тренировок по ММА, боксу, кикбоксингу, грэпплингу и другим единоборствам в клубе Kamelot'
    }
  ]
})
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
