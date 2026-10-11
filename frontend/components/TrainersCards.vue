<template>
  <section id="trainers" :class="compact ? 'py-16 sm:py-[120px]' : 'pb-24 pt-10'">
    <div class="cm-container flex flex-col gap-10 sm:gap-12">
      <SectionHead v-if="compact" kicker="[04] / Тренеры"
        description="Мастера спорта, действующие бойцы и судьи международной категории. Ставят технику так, как ставили себе.">
        Тренерский<br><span class="text-cm-red-title">штаб</span>
      </SectionHead>

      <div :class="compact
        ? ['cm-no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0', trainers.length > 4 ? 'md:grid-cols-3 xl:grid-cols-5' : 'lg:grid-cols-4']
        : 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'">
        <article v-for="trainer in trainers" :key="trainer.id"
          class="group flex flex-col border border-cm-line bg-cm-surface"
          :class="compact ? 'w-[240px] shrink-0 snap-start sm:w-auto' : ''">
          <NuxtLink :to="`/trainers/${trainer.id}`"
            class="relative block overflow-hidden bg-cm-surface-2 text-[#f3efe7]"
            :class="compact ? 'h-[300px] sm:h-[340px]' : 'h-[440px]'"
            :aria-label="`Профиль тренера: ${trainer.firstName} ${trainer.lastName}`">
            <img :src="trainer.avatar" :alt="`${trainer.firstName} ${trainer.lastName}`"
              class="h-full w-full object-cover object-[50%_22%] grayscale contrast-[1.15] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:contrast-100"
              loading="lazy" width="480" height="640" />
            <span aria-hidden="true" class="absolute inset-0"
              style="background: linear-gradient(180deg, rgba(10, 10, 11, 0) 45%, rgba(10, 10, 11, 0.95) 100%)" />
            <span class="absolute inset-x-[18px] bottom-4 flex flex-col gap-1.5">
              <span class="font-mono text-[11px] uppercase tracking-[0.14em] text-[#ff4436]">
                {{ specializationLine(trainer.specializations) }}
              </span>
              <span class="cm-display block leading-[0.88]" :class="compact ? 'text-[36px] sm:text-[40px]' : 'text-[52px]'">
                {{ trainer.firstName }}<br>{{ trainer.lastName }}
              </span>
            </span>
          </NuxtLink>

          <dl class="m-0 grid grid-cols-3 border-b border-cm-line text-center font-mono">
            <div class="flex flex-col-reverse border-r border-cm-line px-2 py-3">
              <dt class="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-cm-dim">Учеников</dt>
              <dd class="m-0 text-lg font-bold">{{ trainer.stats.totalStudents }}</dd>
            </div>
            <div class="flex flex-col-reverse border-r border-cm-line px-2 py-3">
              <dt class="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-cm-dim">Тренировок</dt>
              <dd class="m-0 text-lg font-bold">{{ trainer.stats.sessionsCompleted }}</dd>
            </div>
            <div class="flex flex-col-reverse px-2 py-3">
              <dt class="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-cm-dim">Лет опыта</dt>
              <dd class="m-0 text-lg font-bold">{{ trainer.experience }}</dd>
            </div>
          </dl>

          <template v-if="!compact">
            <div v-if="trainer.bio" class="px-5 pt-5">
              <p class="m-0 text-sm leading-relaxed text-cm-muted" :class="expandedBio[trainer.id] ? '' : 'line-clamp-3'">
                {{ trainer.bio }}
              </p>
              <button v-if="trainer.bio.length > 100" type="button"
                class="mt-2 cursor-pointer font-mono text-xs uppercase tracking-[0.12em] text-cm-red-ink"
                @click="toggleBio(trainer.id)">
                {{ expandedBio[trainer.id] ? 'Скрыть' : 'Читать далее' }}
              </button>
            </div>

            <details v-if="trainer.achievements?.length" class="group/details mx-5 mt-4 border-t border-cm-line">
              <summary
                class="flex cursor-pointer list-none items-center justify-between py-3 font-display text-xl font-extrabold uppercase tracking-[0.04em] hover:text-cm-red-ink">
                Достижения
                <UIcon name="i-lucide-chevron-down" class="h-4 w-4 transition-transform group-open/details:rotate-180" />
              </summary>
              <ul class="m-0 mb-2 flex list-none flex-col gap-2 p-0">
                <li v-for="achievement in trainer.achievements.slice(0, 5)" :key="achievement"
                  class="flex gap-3 text-sm leading-normal text-cm-soft">
                  <span aria-hidden="true" class="mt-[7px] h-2 w-2 shrink-0 bg-cm-red" />
                  {{ achievement }}
                </li>
              </ul>
            </details>
          </template>

          <p v-else-if="trainer.bio" class="m-0 line-clamp-3 px-[18px] pt-4 text-[13px] leading-normal text-cm-muted">
            {{ trainer.bio }}
          </p>

          <div class="mt-auto px-[18px] pb-[18px] pt-4">
            <NuxtLink :to="`/trainers/${trainer.id}`"
              class="flex h-11 items-center justify-between border border-cm-line-2 px-3.5 font-display text-[19px] font-black uppercase tracking-[0.06em] text-cm-text transition-colors hover:border-cm-red hover:text-cm-red-ink">
              Профиль
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WorkoutType } from '~/types'

withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false
})

// Данные встроены в билд — доступны сразу
const { trainers } = useTrainers()
const expandedBio = ref<Record<number, boolean>>({})

const toggleBio = (trainerId: number) => {
  expandedBio.value[trainerId] = !expandedBio.value[trainerId]
}

const specializationNames: Record<WorkoutType, string> = {
  mma: 'ММА',
  wrestling: 'Борьба',
  grappling: 'Грэпплинг',
  kickboxing: 'Кикбоксинг',
  boxing: 'Бокс',
  bjj: 'БЖЖ',
  ofp: 'ОФП (детское)',
  pankration: 'Панкратион'
}

const specializationLine = (specializations: readonly WorkoutType[]) =>
  specializations.map(type => specializationNames[type] || type).join(' · ') || 'Тренер'
</script>
