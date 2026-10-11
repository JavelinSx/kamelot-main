<template>
  <article
    class="group relative grid grid-cols-1 overflow-hidden border border-cm-line bg-cm-surface transition-colors hover:border-cm-line-2 md:grid-cols-[300px_minmax(0,1fr)]">
    <span aria-hidden="true" class="absolute inset-y-0 left-0 z-10 w-1.5 bg-cm-red" />

    <!-- Постер боя -->
    <div class="relative h-[420px] overflow-hidden bg-cm-surface-2 md:h-auto md:min-h-[400px]">
      <img :src="fight.poster" :alt="fight.title"
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy" @error="onImageError" />
      <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div class="absolute bottom-4 left-5 right-4 flex flex-col gap-1 text-[#f3efe7]">
        <span class="cm-display text-[44px] leading-[0.9]">{{ fight.title }}</span>
        <span class="font-mono text-xs uppercase tracking-[0.1em] text-[#d6d2ca]">{{ formattedDate }}</span>
      </div>
    </div>

    <div class="flex min-w-0 flex-col">
      <!-- Верхняя полоса -->
      <div
        class="flex flex-wrap items-center gap-2.5 border-b border-cm-line py-4 pl-6 pr-5 font-mono text-[11px] uppercase tracking-[0.14em] sm:pl-7">
        <span v-if="fight.category" class="cm-chip">{{ fight.category }}</span>
        <span v-if="fight.weightClass" class="cm-chip">{{ fight.weightClass }}</span>
        <span v-if="fight.rounds" class="cm-chip">{{ fight.rounds }} раундов</span>
        <span class="ml-auto inline-flex items-center gap-2 px-2.5 py-1.5 font-bold" :class="statusClass">
          <span class="h-[7px] w-[7px] rounded-full" :class="fight.status === 'live' ? 'animate-pulse bg-white' : 'bg-cm-red'" />
          {{ statusText }}
        </span>
      </div>

      <!-- Бойцы -->
      <div
        class="grid grid-cols-1 items-center gap-5 px-6 pb-6 pt-7 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-7 sm:pl-7 sm:pr-7">
        <div v-if="fight.fighters[0]" class="flex min-w-0 flex-col gap-2.5">
          <span class="self-start bg-cm-red px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white">
            {{ fight.fighters[0].team || 'Camelot' }}
          </span>
          <div class="cm-display break-words text-[44px] leading-[0.86] lg:text-[56px]">
            <span v-for="part in nameParts(fight.fighters[0].name)" :key="part" class="block">{{ part }}</span>
          </div>
          <span v-if="fight.fighters[0].record" class="font-mono text-sm text-cm-muted">
            Рекорд <b class="text-lg text-cm-text">{{ fight.fighters[0].record }}</b>
          </span>
        </div>

        <div
          class="cm-cut cm-display flex h-16 w-16 items-center justify-center bg-cm-red text-[36px] text-white sm:h-[84px] sm:w-[84px] sm:text-[48px]">
          VS
        </div>

        <div v-if="fight.fighters[1]" class="flex min-w-0 flex-col gap-2.5 sm:items-end sm:text-right">
          <span class="self-start border border-cm-line-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cm-muted sm:self-end">
            {{ fight.fighters[1].team || 'Соперник' }}
          </span>
          <div class="cm-display cm-outline-text break-words text-[44px] leading-[0.86] lg:text-[56px]">
            <span v-for="part in nameParts(fight.fighters[1].name)" :key="part" class="block">{{ part }}</span>
          </div>
          <span v-if="fight.fighters[1].record" class="font-mono text-sm text-cm-muted">
            Рекорд <b class="text-lg text-cm-text">{{ fight.fighters[1].record }}</b>
          </span>
        </div>
      </div>

      <!-- Описание -->
      <div v-if="fight.description" class="px-6 pb-5 sm:px-7">
        <p class="m-0 text-[15px] leading-relaxed text-cm-muted" :class="!isDescriptionExpanded && 'line-clamp-2'">
          {{ fight.description }}
        </p>
        <button v-if="fight.description.length > 100" type="button"
          class="mt-2 inline-flex cursor-pointer items-center gap-1 font-mono text-xs uppercase tracking-[0.12em] text-cm-red-ink"
          @click="isDescriptionExpanded = !isDescriptionExpanded">
          {{ isDescriptionExpanded ? 'Свернуть' : 'Читать далее' }}
          <UIcon :name="isDescriptionExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="h-4 w-4" />
        </button>
      </div>

      <!-- Результаты (для завершённых боёв) -->
      <div v-if="fight.status === 'completed' && fight.results"
        class="mx-6 mb-5 border-l-4 border-cm-red bg-cm-surface-2 px-4 py-3 sm:mx-7">
        <p class="m-0 font-display text-2xl font-extrabold uppercase">Победа: {{ fight.results.winner }}</p>
        <p class="m-0 mt-1 font-mono text-xs uppercase tracking-[0.08em] text-cm-muted">
          {{ fight.results.method }} · Раунд {{ fight.results.round }} · {{ fight.results.time }}
        </p>
      </div>

      <!-- Место и действия -->
      <div
        class="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-cm-line px-6 py-4 sm:px-7">
        <div class="flex items-start gap-2.5">
          <UIcon name="i-lucide-map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-cm-red-ink" />
          <div class="text-sm leading-snug">
            <div>{{ fight.location.venue }}</div>
            <div class="text-xs text-cm-dim">{{ fight.location.city }}</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <a v-if="fight.ticketLink" :href="fight.ticketLink" target="_blank" rel="noopener noreferrer"
            class="cm-btn cm-btn-red cm-btn-sm cm-cut">
            Купить билет
          </a>
          <a v-if="fight.streamLink" :href="fight.streamLink" target="_blank" rel="noopener noreferrer"
            class="cm-btn cm-btn-inv cm-btn-sm">
            Смотреть онлайн
          </a>
          <a v-if="fight.vkPost" :href="fight.vkPost" target="_blank" rel="noopener noreferrer"
            class="cm-btn cm-btn-outline cm-btn-sm">
            Подробнее
            <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Fight } from '~/composables/useFights'

interface Props {
  fight: Fight
}

const props = defineProps<Props>()

const { formatFightDate, getStatusText, isUpcoming, getTimeUntilFight } = useFights()

// Состояние для раскрытия описания
const isDescriptionExpanded = ref(false)

// Форматированная дата
const formattedDate = computed(() => formatFightDate(props.fight.date, 'full'))

// Статус боя: для ближайших показываем обратный отсчёт
const statusText = computed(() => {
  if (isUpcoming(props.fight)) return getTimeUntilFight(props.fight.date)
  return getStatusText(props.fight.status)
})

const statusClass = computed(() => {
  const classes: Record<string, string> = {
    upcoming: 'bg-cm-inv text-cm-on-inv',
    live: 'bg-cm-red text-white',
    completed: 'border border-cm-line-2 text-cm-soft',
    cancelled: 'border border-cm-line text-cm-dim line-through'
  }
  return classes[props.fight.status] || classes.completed
})

const nameParts = (name: string) => name.trim().split(/\s+/).slice(0, 2)

// Обработка ошибок загрузки изображений
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.visibility = 'hidden'
}
</script>
