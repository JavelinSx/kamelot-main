<template>
  <div class="min-h-screen pt-20">
    <section v-if="trainer" class="border-b border-cm-line">
      <div class="cm-container flex flex-col gap-6 pb-12 pt-8 sm:pb-16">
        <NuxtLink to="/trainers"
          class="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.14em] text-cm-muted hover:text-cm-red-ink">
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Все тренеры
        </NuxtLink>

        <div class="grid grid-cols-1 border border-cm-line bg-cm-surface md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <!-- Фото -->
          <div class="relative h-[440px] overflow-hidden bg-cm-surface-2 md:h-auto md:min-h-[560px]">
            <img :src="trainer.avatar" :alt="`${trainer.firstName} ${trainer.lastName}`"
              class="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
            <span v-if="trainer.rating && trainer.rating >= 4.8"
              class="cm-tag-cut absolute left-4 top-4 bg-cm-red py-[7px] pl-2.5 pr-3 font-mono text-[11px] font-bold tracking-[0.16em] text-white">
              ТОП-ТРЕНЕР
            </span>
          </div>

          <!-- Основная информация -->
          <div class="flex flex-col gap-7 p-6 sm:p-10">
            <div class="flex flex-col gap-3">
              <span class="cm-kicker">{{ specializationLine }}</span>
              <h1 class="cm-display m-0 text-[clamp(60px,7vw,112px)] leading-[0.84]">
                {{ trainer.firstName }}<br><span class="text-cm-red-title">{{ trainer.lastName }}</span>
              </h1>
            </div>

            <dl class="m-0 grid grid-cols-2 border border-cm-line sm:grid-cols-4">
              <div v-for="(stat, index) in stats" :key="stat.label" class="flex flex-col-reverse gap-1 px-4 py-4"
                :class="[index % 2 === 0 ? 'border-r border-cm-line' : 'sm:border-r sm:border-cm-line', index < 2 ? 'border-b border-cm-line sm:border-b-0' : '', index === 3 ? 'sm:border-r-0' : '']">
                <dt class="cm-label">{{ stat.label }}</dt>
                <dd class="cm-display m-0 text-[44px] leading-none">{{ stat.value }}</dd>
              </div>
            </dl>

            <div class="flex flex-wrap gap-1.5">
              <span v-for="specialty in trainer.specializations" :key="specialty" class="cm-chip">
                {{ getSpecializationName(specialty) }}
              </span>
            </div>

            <p v-if="trainer.bio" class="m-0 text-base leading-relaxed text-cm-soft sm:text-lg">{{ trainer.bio }}</p>

            <div class="mt-auto flex flex-wrap gap-3">
              <button type="button" class="cm-btn cm-btn-red cm-cut-lg cm-btn-lg" @click="contactTrainer">
                Записаться
                <UIcon name="i-lucide-arrow-right" class="h-5 w-5" />
              </button>
              <NuxtLink to="/schedule" class="cm-btn cm-btn-outline cm-btn-lg">Расписание</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="trainer?.achievements?.length || trainer?.certifications?.length" class="py-14 sm:py-20">
      <div class="cm-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div v-if="trainer.achievements?.length" class="flex flex-col gap-6">
          <div class="flex flex-col gap-3">
            <span class="cm-kicker">// Достижения</span>
            <h2 class="cm-display m-0 text-[clamp(44px,5vw,72px)]">Послужной список</h2>
          </div>
          <ol class="m-0 flex list-none flex-col border-t border-cm-line p-0">
            <li v-for="(achievement, index) in trainer.achievements" :key="achievement"
              class="flex gap-5 border-b border-cm-line py-4">
              <span class="w-8 shrink-0 pt-0.5 font-mono text-sm font-bold text-cm-red-ink">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="text-base leading-normal text-cm-soft sm:text-[17px]">{{ achievement }}</span>
            </li>
          </ol>
        </div>

        <div v-if="trainer.certifications?.length" class="flex flex-col gap-6">
          <div class="flex flex-col gap-3">
            <span class="cm-kicker">// Квалификация</span>
            <h2 class="cm-display m-0 text-[clamp(44px,5vw,72px)]">Сертификаты</h2>
          </div>
          <ul class="m-0 flex list-none flex-col gap-px border border-cm-line bg-cm-line p-0">
            <li v-for="certification in trainer.certifications" :key="certification"
              class="flex gap-3 bg-cm-surface px-5 py-4 text-[15px] leading-normal text-cm-soft">
              <UIcon name="i-lucide-badge-check" class="mt-0.5 h-5 w-5 shrink-0 text-cm-red-ink" />
              {{ certification }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <CtaBand kicker="// Пробное занятие" :description="trainer ? `Приходи на бесплатную тренировку к тренеру ${trainer.firstName} ${trainer.lastName}.` : undefined">
      Первая — <span class="text-white">бесплатно</span>
    </CtaBand>
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
  bjj: 'БЖЖ',
  ofp: 'ОФП',
  pankration: 'Панкратион'
}

const getSpecializationName = (type: WorkoutType): string => {
  return specializationNames[type] || type
}

const specializationLine = computed(() => {
  const list = trainer.value?.specializations || []
  return list.length ? `// Тренер · ${list.map(getSpecializationName).join(' · ')}` : '// Тренер'
})

const stats = computed(() => {
  if (!trainer.value) return []
  return [
    { label: 'Лет опыта', value: trainer.value.experience },
    { label: 'Учеников', value: trainer.value.stats.totalStudents },
    { label: 'Тренировок', value: trainer.value.stats.sessionsCompleted },
    { label: 'Рейтинг', value: trainer.value.rating }
  ]
})

const contactTrainer = () => {
  window.dispatchEvent(new CustomEvent('openBookingModal'))
}

// SEO
useSeoMeta({
  title: `${trainer.value?.firstName} ${trainer.value?.lastName} - Тренер | Camelot Sport Academy`,
  description: trainer.value?.bio || 'Профессиональный тренер в Camelot Sport Academy'
})
</script>
