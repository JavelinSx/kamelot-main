<template>
  <section v-if="fight" class="pt-16 sm:pt-[120px]">
    <div class="cm-container">
      <div class="relative overflow-hidden border border-cm-line bg-cm-surface">
        <div aria-hidden="true"
          class="cm-display cm-ghost-text pointer-events-none absolute -right-8 -top-24 hidden text-[460px] leading-none md:block">
          VS
        </div>
        <div aria-hidden="true" class="absolute inset-y-0 left-0 w-1.5 bg-cm-red" />

        <div class="relative flex flex-col gap-8 px-6 py-7 sm:gap-11 sm:px-14 sm:py-12">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <span class="cm-kicker">[03] / Ближайший бой</span>
              <span v-if="fight.category" class="cm-chip">{{ fight.category }}</span>
              <span
                class="inline-flex items-center gap-2 bg-cm-inv px-2.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.12em] text-cm-on-inv">
                <span class="h-[7px] w-[7px] rounded-full bg-cm-red" />{{ timeUntil }}
              </span>
            </div>
            <NuxtLink to="/fights"
              class="inline-flex items-center gap-2.5 font-display text-[22px] font-black uppercase tracking-[0.06em] text-cm-text hover:text-cm-red-ink">
              Все бои
              <UIcon name="i-lucide-arrow-right" class="h-[18px] w-[18px]" />
            </NuxtLink>
          </div>

          <div class="grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-10">
            <div v-if="fight.fighters[0]" class="flex flex-col gap-3.5">
              <span class="cm-kicker">{{ fight.fighters[0].team || 'Camelot' }}</span>
              <div class="cm-display text-[clamp(48px,6.4vw,104px)] leading-[0.84]">
                <span v-for="part in nameParts(fight.fighters[0].name)" :key="part" class="block">{{ part }}</span>
              </div>
              <span v-if="fight.fighters[0].record" class="font-mono text-[15px] text-cm-muted">
                Рекорд <b class="text-[22px] text-cm-text">{{ fight.fighters[0].record }}</b>
              </span>
            </div>

            <div
              class="cm-cut-lg cm-display flex h-20 w-20 items-center justify-center bg-cm-red text-5xl text-white md:h-32 md:w-32 md:text-[72px]">
              VS
            </div>

            <div v-if="fight.fighters[1]" class="flex flex-col gap-3.5 md:items-end md:text-right">
              <span class="font-mono text-xs uppercase tracking-[0.18em] text-cm-muted">{{ fight.fighters[1].team || 'Соперник' }}</span>
              <div class="cm-display cm-outline-text text-[clamp(48px,6.4vw,104px)] leading-[0.84]">
                <span v-for="part in nameParts(fight.fighters[1].name)" :key="part" class="block">{{ part }}</span>
              </div>
              <span v-if="fight.fighters[1].record" class="font-mono text-[15px] text-cm-muted">
                Рекорд <b class="text-[22px] text-cm-text">{{ fight.fighters[1].record }}</b>
              </span>
            </div>
          </div>

          <dl class="m-0 grid grid-cols-2 gap-y-5 border-t border-cm-line pt-5 lg:grid-cols-4">
            <div class="pr-5">
              <dt class="cm-label">Турнир</dt>
              <dd class="m-0 mt-1 font-display text-[26px] font-extrabold uppercase leading-tight">{{ fight.title }}</dd>
            </div>
            <div class="pr-5">
              <dt class="cm-label">Дата</dt>
              <dd class="m-0 mt-1 font-display text-[26px] font-extrabold uppercase leading-tight">{{ formattedDate }}</dd>
            </div>
            <div class="pr-5">
              <dt class="cm-label">Место</dt>
              <dd class="m-0 mt-1 font-display text-[26px] font-extrabold uppercase leading-tight">
                {{ [fight.location.city, fight.location.venue].filter(Boolean).join(', ') }}
              </dd>
            </div>
            <div v-if="fight.weightClass">
              <dt class="cm-label">Весовая</dt>
              <dd class="m-0 mt-1 font-display text-[26px] font-extrabold uppercase leading-tight">{{ fight.weightClass }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Fight } from '~/composables/useFights'

const { loadFights, formatFightDate, getTimeUntilFight } = useFights()
const fight = ref<Fight | null>(null)

const formattedDate = computed(() => fight.value ? formatFightDate(fight.value.date, 'short') : '')
const timeUntil = computed(() => fight.value ? getTimeUntilFight(fight.value.date).toUpperCase() : '')

const nameParts = (name: string) => name.trim().split(/\s+/).slice(0, 2)

onMounted(async () => {
  try {
    const now = Date.now()
    const upcoming = (await loadFights())
      .filter(item => item.status === 'upcoming' && new Date(item.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    fight.value = upcoming.find(item => item.featured) || upcoming[0] || null
  } catch {
    fight.value = null
  }
})
</script>
