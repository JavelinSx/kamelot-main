<template>
  <section id="directions" class="px-0 pb-20 pt-16 sm:pb-[120px] sm:pt-[100px]">
    <div class="cm-container flex flex-col gap-10 sm:gap-12">
      <SectionHead kicker="[01] / Направления"
        description="Шесть дисциплин под одной крышей. Выбери направление под свои цели — от первой тренировки до выхода в клетку.">
        Выбери<br>своё <span class="text-cm-red-title">оружие</span>
      </SectionHead>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <button v-for="(art, index) in martialArts" :key="art.id" type="button"
          class="group flex cursor-pointer flex-col border border-cm-line bg-cm-surface text-left text-cm-text transition-colors duration-200 hover:border-cm-red"
          :aria-label="`Записаться: ${art.name}`" @click="selectMartialArt(art)">
          <span class="relative block h-[230px] w-full overflow-hidden bg-[#e9e4da] sm:h-[270px]">
            <img :src="art.image" :alt="art.name"
              class="h-full w-full object-cover grayscale contrast-125 transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:contrast-100"
              loading="lazy" width="420" height="270" />
            <span
              class="absolute left-0 top-0 bg-[#0a0a0b] px-3.5 py-2.5 font-mono text-sm font-bold tracking-[0.1em] text-[#f3efe7]">
              0{{ index + 1 }}
            </span>
            <span
              class="absolute right-3 top-3 bg-cm-red px-2.5 py-[7px] font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              {{ art.difficulty }}
            </span>
          </span>
          <span class="flex flex-1 flex-col gap-4 px-6 pb-6 pt-6">
            <span class="cm-display block text-[48px] leading-[0.9] sm:text-[54px]">{{ art.short || art.name }}</span>
            <span class="text-[15px] leading-relaxed text-cm-muted">{{ art.description }}</span>
            <span class="flex flex-wrap gap-1.5">
              <span v-for="benefit in art.benefits" :key="benefit" class="cm-chip">{{ benefit }}</span>
            </span>
            <span class="mt-auto flex items-center justify-between border-t border-cm-line pt-[18px]">
              <span class="inline-flex items-center gap-2 font-mono text-[13px]">
                <UIcon name="i-lucide-clock-3" class="h-4 w-4 text-cm-red-ink" />{{ art.duration }}
              </span>
              <span
                class="inline-flex items-center gap-2 font-display text-[22px] font-black uppercase tracking-[0.06em] text-cm-red-ink">
                Записаться
                <UIcon name="i-lucide-arrow-right" class="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface MartialArt {
  id: number
  name: string
  short?: string
  description: string
  image: string
  benefits: string[]
  duration: string
  difficulty: string
}

const martialArts: MartialArt[] = [
  {
    id: 1,
    name: 'Бокс',
    description: 'Классический бокс развивает скорость, силу удара и координацию. Отличный способ улучшить физическую форму и научиться защищать себя.',
    image: '/images/fight-category/Box.webp',
    benefits: ['Сила удара', 'Координация', 'Выносливость'],
    duration: '90 мин',
    difficulty: 'Для всех'
  },
  {
    id: 2,
    name: 'Кикбоксинг',
    description: 'Сочетание техник рук и ног. Развивает гибкость, силу и скорость реакции. Эффективное кардио и самооборона.',
    image: '/images/fight-category/KickBox.webp',
    benefits: ['Гибкость', 'Кардио', 'Самооборона'],
    duration: '90 мин',
    difficulty: 'Средний'
  },
  {
    id: 3,
    name: 'ММА',
    description: 'Смешанные боевые искусства объединяют лучшие техники различных единоборств. Полноценная подготовка бойца.',
    image: '/images/fight-category/MMA.webp',
    benefits: ['Универсальность', 'Сила', 'Техника'],
    duration: '120 мин',
    difficulty: 'Продвинутый'
  },
  {
    id: 4,
    name: 'Грэпплинг',
    description: 'Искусство борьбы и захватов без ударов. Развивает технику, силу и стратегическое мышление.',
    image: '/images/fight-category/Grappling.webp',
    benefits: ['Техника', 'Сила', 'Стратегия'],
    duration: '90 мин',
    difficulty: 'Средний'
  },
  {
    id: 5,
    name: 'Бразильское Джиу-джитсу',
    short: 'Джиу-джитсу',
    description: 'Бразильское джиу-джитсу: борьба на земле, основанная на технике и рычагах. Развивает стратегическое мышление и гибкость.',
    image: '/images/fight-category/BJJ.webp',
    benefits: ['Техника', 'Стратегия', 'Гибкость'],
    duration: '90 мин',
    difficulty: 'Для всех'
  },
  {
    id: 6,
    name: 'Панкратион',
    description: 'Древнегреческое боевое искусство, сочетающее борьбу и удары. Развивает универсальные навыки боя.',
    image: '/images/fight-category/Pankration.webp',
    benefits: ['Универсальность', 'История', 'Техника'],
    duration: '90 мин',
    difficulty: 'Продвинутый'
  }
]

// Mapping названий к значениям из BookingForm
const trainingTypeMap: Record<string, string> = {
  'Бокс': 'boxing',
  'Кикбоксинг': 'kickboxing',
  'ММА': 'mma',
  'Грэпплинг': 'grappling',
  'Бразильское Джиу-джитсу': 'bjj',
  'Панкратион': 'pankration'
}

const { setSelectedTrainingType } = useBooking()

const selectMartialArt = (art: MartialArt) => {
  const trainingType = trainingTypeMap[art.name]
  if (trainingType) {
    setSelectedTrainingType(trainingType)
  }

  // Открываем модальное окно записи
  window.dispatchEvent(new CustomEvent('openBookingModal'))
}
</script>
