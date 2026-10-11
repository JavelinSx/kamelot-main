<template>
  <div class="min-h-screen pt-20">
    <PageHead kicker="// Расписание" ghost="18:00">
      Когда <span class="text-cm-red-title">в зал</span>
      <template #meta>
        <div v-if="scheduleData?.metadata"
          class="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.08em] text-cm-muted">
          <span>Обновлено: {{ formatDate(scheduleData.metadata.lastUpdated) }}</span>
          <span>{{ scheduleData.metadata.notes }}</span>
        </div>
      </template>
    </PageHead>

    <section v-if="scheduleData" class="cm-container flex flex-col gap-7 pb-24 pt-12">
      <!-- Зоны -->
      <div role="tablist" aria-label="Зона" class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <button v-for="(zone, index) in scheduleData.zones" :key="zone.id" type="button" role="tab"
          :aria-selected="selectedZoneIndex === index"
          class="flex cursor-pointer items-center justify-between gap-4 border-[1.5px] px-6 py-5 text-left transition-colors sm:px-7 sm:py-6"
          :class="selectedZoneIndex === index
            ? 'border-cm-red bg-cm-red text-white'
            : 'border-cm-line bg-cm-surface text-cm-text hover:border-cm-line-2'"
          @click="selectedZoneIndex = index">
          <span class="flex flex-col gap-1.5">
            <span class="cm-display text-[40px] leading-[0.9] sm:text-[48px]">{{ zone.name }}</span>
            <span class="font-mono text-xs tracking-[0.08em] opacity-85">{{ zone.description }}</span>
          </span>
          <span class="font-mono text-[13px] font-bold tracking-[0.12em]">{{ zoneSessionsCount(zone) }}&nbsp;/&nbsp;НЕД</span>
        </button>
      </div>

      <!-- Дни недели -->
      <div role="tablist" aria-label="День недели" class="grid grid-cols-7 gap-1 sm:gap-1.5">
        <button v-for="(day, index) in daysOfWeek" :key="day.key" type="button" role="tab"
          :aria-selected="selectedDayIndex === index" :aria-label="day.label"
          class="flex h-16 cursor-pointer flex-col items-center justify-center gap-1 border transition-colors sm:h-[74px]"
          :class="selectedDayIndex === index
            ? 'border-cm-red bg-cm-red text-white'
            : 'border-cm-line bg-cm-surface text-cm-text hover:border-cm-line-2'"
          @click="selectedDayIndex = index">
          <span class="font-display text-2xl font-black uppercase leading-none sm:text-[28px]">{{ day.short }}</span>
          <span class="hidden font-mono text-[10px] tracking-[0.1em] opacity-80 sm:block">
            {{ daySessionsCount(day.key) ? `${daySessionsCount(day.key)} ТРЕН.` : 'ВЫХОДНОЙ' }}
          </span>
        </button>
      </div>

      <!-- Тренировки дня -->
      <div ref="sessionsContainer" class="flex scroll-mt-28 items-baseline justify-between gap-4 pt-3">
        <h2 class="cm-display m-0 text-[40px] sm:text-[44px]">{{ daysOfWeek[selectedDayIndex]?.label }}</h2>
        <span class="text-right font-mono text-xs uppercase tracking-[0.12em] text-cm-muted">{{ selectedZone?.name }}</span>
      </div>

      <div v-if="!currentDaySessions.length"
        class="flex flex-col items-start gap-2 border border-dashed border-cm-line-2 bg-cm-surface px-7 py-12">
        <span class="cm-display text-[44px]">Выходной</span>
        <span class="text-[15px] text-cm-muted">В этот день групповых тренировок нет. Персональные — по договорённости с
          тренером.</span>
      </div>

      <div v-else class="flex flex-col gap-2">
        <div v-for="session in currentDaySessions" :key="session.id"
          class="relative flex flex-wrap items-center gap-x-9 gap-y-4 border border-cm-line bg-cm-surface py-6 pl-8 pr-6 sm:pl-[34px] sm:pr-7 lg:grid lg:grid-cols-[180px_minmax(0,1fr)_190px_150px_auto] lg:gap-x-8">
          <span aria-hidden="true" class="absolute inset-y-0 left-0 w-1.5" :class="categoryStyle(session.ageCategory).bar" />
          <div class="flex-[0_0_170px] sm:flex-[0_0_190px]">
            <div class="flex items-center gap-3">
              <span class="font-mono text-[34px] font-bold leading-none">{{ startTime(session.time) }}</span>
              <span v-if="isCurrentSession(daysOfWeek[selectedDayIndex]?.label || '', session.time)"
                class="bg-cm-red px-2 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-white">СЕЙЧАС</span>
            </div>
            <div class="mt-1.5 font-mono text-xs uppercase text-cm-muted">
              до {{ endTime(session.time) }} · {{ duration(session.time) }} мин
            </div>
          </div>
          <div class="flex min-w-0 flex-[1_1_260px] flex-col items-start gap-2.5">
            <h3 class="cm-display m-0 text-[40px] leading-[0.9] sm:text-[44px]">{{ session.discipline }}</h3>
            <span class="px-2.5 py-[5px] font-mono text-[11px] font-bold uppercase tracking-[0.12em]"
              :class="categoryStyle(session.ageCategory).chip">
              {{ session.ageGroup || categoryStyle(session.ageCategory).label }}
            </span>
          </div>
          <div class="flex-[0_1_200px]">
            <div class="cm-label">Тренер</div>
            <div class="mt-1 text-[17px] font-semibold">{{ session.trainer }}</div>
          </div>
          <div class="flex-[0_1_160px]">
            <div class="cm-label">Уровень</div>
            <div class="mt-1 text-[17px] font-semibold">{{ session.level }}</div>
          </div>
          <button type="button" class="cm-btn cm-btn-red cm-cut w-full sm:w-auto" @click="bookSession(session)">
            Записаться
            <UIcon name="i-lucide-arrow-right" class="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <!-- Неделя целиком -->
      <div class="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-cm-line pt-12">
        <div class="flex flex-col gap-2.5">
          <span class="cm-kicker">// Неделя целиком</span>
          <h2 class="cm-display m-0 text-[48px] leading-[0.9] sm:text-[64px]">Сетка тренировок</h2>
        </div>
        <div class="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-cm-soft">
          <span v-for="category in legend" :key="category" class="inline-flex items-center gap-2">
            <span class="h-3.5 w-3.5" :class="categoryStyle(category).swatch" />{{ categoryStyle(category).label }}
          </span>
        </div>
      </div>

      <div class="cm-no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div class="grid min-w-[980px] grid-cols-7 gap-1.5">
          <div v-for="(day, index) in daysOfWeek" :key="day.key" class="flex flex-col gap-1.5">
            <button type="button"
              class="h-11 cursor-pointer border font-display text-[22px] font-black uppercase transition-colors"
              :class="selectedDayIndex === index
                ? 'border-cm-red bg-cm-red text-white'
                : 'border-cm-line bg-cm-surface text-cm-text hover:border-cm-line-2'"
              @click="selectDay(index)">
              {{ day.short }}
            </button>
            <button v-for="session in daySessions(day.key)" :key="session.id" type="button"
              class="flex min-h-16 cursor-pointer flex-col gap-0.5 border border-l-4 border-cm-line bg-cm-surface px-3 py-2.5 text-left transition-colors hover:bg-cm-surface-2"
              :class="categoryStyle(session.ageCategory).border" @click="selectDay(index)">
              <span class="font-mono text-xs font-bold">{{ session.time.replace('-', '–') }}</span>
              <span class="font-display text-lg font-extrabold uppercase leading-none">{{ session.discipline }}</span>
              <span class="text-[11px] text-cm-muted">{{ session.ageGroup || categoryStyle(session.ageCategory).label }}</span>
            </button>
            <div v-if="!daySessions(day.key).length"
              class="flex min-h-16 items-center justify-center border border-dashed border-cm-line font-mono text-[11px] tracking-[0.12em] text-cm-dim">
              ОТДЫХ
            </div>
          </div>
        </div>
      </div>

      <!-- Важная информация -->
      <div class="mt-6 border border-cm-line bg-cm-surface p-6 sm:p-8">
        <h3 class="cm-display m-0 mb-5 text-[32px]">Важная информация</h3>
        <ul class="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 md:grid-cols-2">
          <li v-for="note in notes" :key="note" class="flex gap-3 text-[15px] leading-normal text-cm-soft">
            <span aria-hidden="true" class="mt-[7px] h-2 w-2 shrink-0 bg-cm-red" />{{ note }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AgeCategory, ScheduleSession, Zone } from '~/composables/useSchedule'

// Используем composable - данные теперь доступны сразу, без асинхронной загрузки
const { scheduleData } = useSchedule()

const selectedZoneIndex = ref(0)
const selectedDayIndex = ref(getCurrentDayIndex())
const sessionsContainer = ref<HTMLElement | null>(null)

// Дни недели
const daysOfWeek = [
  { key: 'monday', label: 'Понедельник', short: 'Пн' },
  { key: 'tuesday', label: 'Вторник', short: 'Вт' },
  { key: 'wednesday', label: 'Среда', short: 'Ср' },
  { key: 'thursday', label: 'Четверг', short: 'Чт' },
  { key: 'friday', label: 'Пятница', short: 'Пт' },
  { key: 'saturday', label: 'Суббота', short: 'Сб' },
  { key: 'sunday', label: 'Воскресенье', short: 'Вс' }
] as const

type DayKey = typeof daysOfWeek[number]['key']

const notes = [
  'Запись на тренировки обязательна. Позвони по телефону или напиши в мессенджер.',
  'Приходи за 10–15 минут до начала тренировки, чтобы переодеться.',
  'При первом посещении нужна справка от врача о допуске к занятиям.',
  'Расписание может меняться. Уточняй актуальность у администратора.'
]

// Текущая зона
const selectedZone = computed(() => {
  if (!scheduleData.value) return null
  return scheduleData.value.zones[selectedZoneIndex.value] || null
})

// Тренировки выбранной зоны по дню
const daySessions = (dayKey: DayKey): readonly ScheduleSession[] => selectedZone.value?.schedule[dayKey] || []

const daySessionsCount = (dayKey: DayKey) => daySessions(dayKey).length

const zoneSessionsCount = (zone: Zone) =>
  Object.values(zone.schedule).reduce((total, sessions) => total + sessions.length, 0)

// Текущие тренировки дня
const currentDaySessions = computed(() => {
  const dayKey = daysOfWeek[selectedDayIndex.value]?.key
  return dayKey ? daySessions(dayKey) : []
})

// «18:00-19:30» → начало, конец, длительность
const startTime = (range: string) => range.split('-')[0]?.trim() || range
const endTime = (range: string) => range.split('-')[1]?.trim() || ''
const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours * 60 + minutes
}
const duration = (range: string) => toMinutes(endTime(range)) - toMinutes(startTime(range))

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

// Стили категорий: различаются не только цветом, но и заливкой
interface CategoryStyle {
  label: string
  bar: string
  chip: string
  swatch: string
  border: string
}

const categoryStyles: Record<AgeCategory, CategoryStyle> = {
  kid: {
    label: 'Дети',
    bar: 'bg-cm-text',
    chip: 'bg-cm-inv text-cm-on-inv',
    swatch: 'bg-cm-inv',
    border: 'border-l-cm-text'
  },
  teen: {
    label: 'Подростки / 14+',
    bar: 'bg-cm-dim',
    chip: 'border border-cm-text text-cm-text',
    swatch: 'border-[1.5px] border-cm-text',
    border: 'border-l-cm-dim'
  },
  adult: {
    label: 'Взрослые',
    bar: 'bg-cm-red',
    chip: 'bg-cm-red text-white',
    swatch: 'bg-cm-red',
    border: 'border-l-cm-red'
  }
}

const legend: AgeCategory[] = ['kid', 'teen', 'adult']

const categoryStyle = (category: AgeCategory) => categoryStyles[category] || categoryStyles.adult

// Форматирование даты
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Выбор дня в сетке недели
function selectDay(dayIndex: number) {
  selectedDayIndex.value = dayIndex

  // Плавный скролл к секции с тренировками
  nextTick(() => {
    if (sessionsContainer.value) {
      sessionsContainer.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
}

// Запись на тренировку
const { openBookingModal } = useBooking()

function bookSession(session: ScheduleSession) {
  const dayLabel = daysOfWeek[selectedDayIndex.value]?.label || ''
  const zoneName = selectedZone.value?.name || ''

  // Открываем модальное окно с предзаполненными данными
  openBookingModal({
    discipline: session.discipline,
    time: session.time,
    day: dayLabel,
    trainer: session.trainer,
    ageGroup: session.ageGroup,
    level: session.level,
    zone: zoneName
  })
}

// SEO
useHead({
  title: 'Расписание тренировок - Camelot Sport Academy',
  meta: [
    {
      name: 'description',
      content: 'Актуальное расписание тренировок по ММА, боксу, кикбоксингу, грэпплингу и другим единоборствам в спортивной академии Camelot'
    }
  ]
})
</script>
