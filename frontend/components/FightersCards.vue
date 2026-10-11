<template>
  <section id="champions" class="border-y border-cm-line bg-cm-section py-16 sm:py-[110px]">
    <div class="cm-container flex flex-col gap-10 sm:gap-12">
      <SectionHead kicker="[02] / Наши чемпионы"
        description="Бойцы, прошедшие подготовку в нашем клубе и добившиеся выдающихся результатов в России и за её пределами.">
        Сделано<br>в <span class="text-cm-red-title">Камелоте</span>
      </SectionHead>

      <div
        class="cm-no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        <article v-for="fighter in fighters" :key="fighter.id"
          class="group flex w-[316px] shrink-0 snap-start flex-col border border-cm-line bg-cm-bg sm:w-auto">
          <div class="relative h-[380px] overflow-hidden bg-cm-surface-2 sm:h-[400px]">
            <img :src="fighter.photo" :alt="fighter.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              :style="{ objectPosition: photoPosition(fighter.photo) }" loading="lazy" width="420" height="400" />
            <div aria-hidden="true" class="absolute inset-0"
              style="background: linear-gradient(180deg, rgba(10, 10, 11, 0) 38%, rgba(10, 10, 11, 0.96) 100%)" />

            <span v-if="fighter.isCurrentChampion"
              class="cm-tag-cut absolute left-3.5 top-3.5 bg-cm-red py-[7px] pl-2.5 pr-3 font-mono text-[11px] font-bold tracking-[0.16em] text-white">
              ЧЕМПИОН
            </span>

            <div class="absolute right-3.5 top-3.5 flex border border-[#3a3a40] bg-[#0a0a0b]/90 font-mono text-[#f3efe7]"
              :aria-label="`Рекорд: ${fighter.record.wins} побед, ${fighter.record.losses} поражений`" role="img">
              <div class="flex flex-col items-center border-r border-[#3a3a40] px-3 py-2">
                <span class="text-[26px] font-bold leading-none">{{ fighter.record.wins }}</span>
                <span class="mt-1 text-[10px] tracking-[0.16em] text-[#4ade80]">WIN</span>
              </div>
              <div class="flex flex-col items-center px-3 py-2">
                <span class="text-[26px] font-bold leading-none">{{ fighter.record.losses }}</span>
                <span class="mt-1 text-[10px] tracking-[0.16em] text-[#ff4436]">LOSS</span>
              </div>
            </div>

            <div class="absolute inset-x-5 bottom-5 flex flex-col gap-2 text-[#f3efe7]">
              <span class="font-mono text-xs uppercase tracking-[0.14em] text-[#ff4436]">{{ fighter.nickname }}</span>
              <h3 class="cm-display m-0 text-[44px] leading-[0.88] sm:text-[50px]">
                <span class="block">{{ firstName(fighter.name) }}</span>
                <span class="block">{{ lastName(fighter.name) }}</span>
              </h3>
            </div>
          </div>

          <dl class="m-0 grid grid-cols-2 border-b border-cm-line">
            <div class="border-b border-r border-cm-line px-5 py-4">
              <dt class="cm-label">Дисциплина</dt>
              <dd class="m-0 mt-1 font-display text-[22px] font-extrabold uppercase leading-tight">{{ fighter.discipline }}</dd>
            </div>
            <div class="border-b border-cm-line px-5 py-4">
              <dt class="cm-label">Вес</dt>
              <dd class="m-0 mt-1 font-display text-[22px] font-extrabold uppercase leading-tight">{{ shortWeight(fighter.weightClass) }}</dd>
            </div>
            <div class="border-r border-cm-line px-5 py-4">
              <dt class="cm-label">Возраст</dt>
              <dd class="m-0 mt-1 font-display text-[22px] font-extrabold uppercase leading-tight">{{ fighter.age }} {{ yearsWord(fighter.age) }}</dd>
            </div>
            <div class="px-5 py-4">
              <dt class="cm-label">Опыт</dt>
              <dd class="m-0 mt-1 font-display text-[22px] font-extrabold uppercase leading-tight">{{ fighter.experience }}</dd>
            </div>
          </dl>

          <ul class="m-0 flex list-none flex-col gap-2.5 px-5 pb-6 pt-5">
            <li v-for="achievement in fighter.achievements.slice(0, 3)" :key="achievement"
              class="flex gap-3 text-sm leading-normal text-cm-soft">
              <span aria-hidden="true" class="mt-[7px] h-2 w-2 shrink-0 bg-cm-red" />
              {{ achievement }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Данные встроены в билд — доступны сразу
const { fighters } = useFighters()

// Фокус кадра для фото разной ориентации
const photoPositions: Record<string, string> = {
  '/images/students/ynusov.webp': '50% 30%',
  '/images/students/zagid.webp': '50% 22%',
  '/images/students/scripnik.webp': '50% 20%',
  '/images/students/rasul.webp': '45% 25%'
}

const photoPosition = (photo: string) => photoPositions[photo] || '50% 30%'

const firstName = (name: string) => name.split(' ')[0] || name
const lastName = (name: string) => name.split(' ').slice(1).join(' ')

// «Легчайший вес (61.2 кг)» → «Легчайший 61,2»
const shortWeight = (weight: string) => weight
  .replace(/\s*вес\s*/i, ' ')
  .replace(/\((\d+)\.(\d+)\s*кг\)/, '$1,$2')
  .replace(/\s+/g, ' ')
  .trim()

const yearsWord = (age: number) => {
  const mod10 = age % 10
  const mod100 = age % 100
  if (mod10 === 1 && mod100 !== 11) return 'год'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'года'
  return 'лет'
}
</script>
