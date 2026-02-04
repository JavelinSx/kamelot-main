<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 max-w-4xl mx-auto">
    <!-- Заголовок календаря с навигацией -->
    <div class="flex items-center justify-between mb-4 sm:mb-6">
      <button @click="previousMonth"
        class="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <UIcon name="i-heroicons-chevron-left" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
      </button>

      <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        {{ currentMonthName }} {{ currentYear }}
      </h3>

      <button @click="nextMonth"
        class="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
      </button>
    </div>

    <!-- Дни недели (заголовки) -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
      <div v-for="day in weekDays" :key="day"
        class="text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 py-1 sm:py-2">
        {{ day }}
      </div>
    </div>

    <!-- Сетка дат -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2">
      <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day-cell">
        <!-- Пустые ячейки для выравнивания -->
        <div v-if="!day.date" class="w-full h-full"></div>

        <!-- Даты с тренировками -->
        <button v-else @click="selectDate(day)"
          :class="[
            'w-full h-full rounded-lg transition-all duration-200 flex items-center justify-center font-semibold relative text-xs sm:text-sm md:text-base',
            day.isToday
              ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-gray-800'
              : '',
            day.hasTraining
              ? selectedDate?.date === day.date
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 hover:scale-105'
              : selectedDate?.date === day.date
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600',
            day.isCurrentMonth ? '' : 'opacity-40'
          ]">
          <span class="calendar-day-number">{{ day.date }}</span>

          <!-- Индикатор тренировок -->
          <span v-if="day.hasTraining && day.trainingCount > 0"
            class="calendar-badge">
            {{ day.trainingCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Легенда -->
    <div class="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded bg-red-100 dark:bg-red-900/30 border-2 border-red-600"></div>
        <span class="text-gray-700 dark:text-gray-300">Есть тренировки</span>
      </div>
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600"></div>
        <span class="text-gray-700 dark:text-gray-300">Нет тренировок</span>
      </div>
      <div class="flex items-center gap-1 sm:gap-2">
        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded bg-white dark:bg-gray-800 border-2 border-red-500"></div>
        <span class="text-gray-700 dark:text-gray-300">Сегодня</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Zone } from '~/composables/useSchedule'

interface Props {
  zone: Zone | null
}

const props = defineProps<Props>()

interface Emits {
  dateSelect: [dayIndex: number]
}

const emit = defineEmits<Emits>()

// Состояние календаря
const currentDate = ref(new Date())
const selectedDate = ref<CalendarDay | null>(null)

// Названия дней недели
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// Текущий месяц и год
const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('ru-RU', { month: 'long' })
})

// Дни недели для расписания
const scheduleDaysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

interface CalendarDay {
  date: number
  dayOfWeek: number // 0 = воскресенье, 1 = понедельник, и т.д.
  hasTraining: boolean
  trainingCount: number
  isToday: boolean
  isCurrentMonth: boolean
}

// Генерация календарных дней
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  // Первый день месяца
  const firstDay = new Date(year, month, 1)
  // Последний день месяца
  const lastDay = new Date(year, month + 1, 0)

  // День недели первого дня месяца (0 = воскресенье, 1 = понедельник, и т.д.)
  const firstDayOfWeek = firstDay.getDay()
  // Корректируем для начала недели с понедельника
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Количество дней в месяце
  const daysInMonth = lastDay.getDate()

  // Создаем массив дней
  const days: (CalendarDay | { date: null })[] = []

  // Добавляем пустые ячейки перед первым днем
  for (let i = 0; i < startOffset; i++) {
    days.push({ date: null })
  }

  // Сегодняшняя дата для сравнения
  const today = new Date()
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  // Добавляем дни месяца
  for (let date = 1; date <= daysInMonth; date++) {
    const currentDayDate = new Date(year, month, date)
    const dayOfWeek = currentDayDate.getDay()

    // Определяем, есть ли тренировки в этот день недели
    let hasTraining = false
    let trainingCount = 0

    if (props.zone) {
      const dayKey = scheduleDaysMap[dayOfWeek] as keyof typeof props.zone.schedule
      const sessions = props.zone.schedule[dayKey] || []
      hasTraining = sessions.length > 0
      trainingCount = sessions.length
    }

    // Проверяем, является ли день сегодняшним
    const isToday = date === todayDate && month === todayMonth && year === todayYear

    days.push({
      date,
      dayOfWeek,
      hasTraining,
      trainingCount,
      isToday,
      isCurrentMonth: true
    })
  }

  return days
})

// Навигация по месяцам
function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

// Выбор даты
function selectDate(day: CalendarDay) {
  if (!day.date) return

  selectedDate.value = day

  // Преобразуем dayOfWeek в индекс дня недели для расписания
  // JavaScript: 0 = воскресенье, 1 = понедельник, ... 6 = суббота
  // Расписание: 0 = понедельник, 1 = вторник, ... 6 = воскресенье
  const dayIndex = day.dayOfWeek === 0 ? 6 : day.dayOfWeek - 1

  emit('dateSelect', dayIndex)
}

// Автоматически выбираем сегодняшний день при монтировании
onMounted(() => {
  const todayDay = calendarDays.value.find(day => day && 'isToday' in day && day.isToday) as CalendarDay | undefined
  if (todayDay) {
    selectedDate.value = todayDay
  }
})
</script>

<style scoped>
/* Календарная ячейка дня */
.calendar-day-cell {
  aspect-ratio: 1 / 1;
  /* Мобильные устройства: полный размер */
  width: 100%;
  height: auto;
}

/* ПК режим: уменьшаем клетки на 50% */
@media (min-width: 768px) {
  .calendar-day-cell {
    /* Ограничиваем максимальную высоту для ПК */
    max-height: 60px;
  }
}

/* Число даты */
.calendar-day-number {
  position: relative;
  z-index: 1;
}

/* Бейдж с количеством тренировок */
.calendar-badge {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: rgb(220, 38, 38); /* red-600 */
  color: white;
  border-radius: 9999px;

  /* Мобильные устройства: маленький бейдж в углу */
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  font-size: 10px;
  line-height: 1;
}

/* Планшеты и больше: увеличиваем бейдж */
@media (min-width: 640px) {
  .calendar-badge {
    bottom: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
}

/* ПК: еще больше бейдж */
@media (min-width: 768px) {
  .calendar-badge {
    width: 22px;
    height: 22px;
    font-size: 12px;
  }
}
</style>
