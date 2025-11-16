<template>
  <section class="py-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
    <UContainer>
      <div class="text-center mb-8">
        <ClientOnly>
          <h2 v-motion-slide-visible-once-top :duration="600"
            class="text-4xl text-gray-900 dark:text-white font-bold mb-4">
            Наши чемпионы
          </h2>
          <p v-motion-slide-visible-once-bottom :duration="600" :delay="100"
            class="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Бойцы, прошедшие подготовку в нашем клубе и добившиеся выдающихся результатов
          </p>
          <template #fallback>
            <h2 class="text-4xl text-gray-900 dark:text-white font-bold mb-4">
              Наши чемпионы
            </h2>
            <p class="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Бойцы, прошедшие подготовку в нашем клубе и добившиеся выдающихся результатов
            </p>
          </template>
        </ClientOnly>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ClientOnly>
          <div v-for="(fighter, index) in fighters" :key="fighter.id" v-motion-pop-visible-once :delay="index * 100"
            :duration="600"
            class="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ring-1 ring-gray-200 dark:ring-gray-700">
            <div class="relative overflow-hidden">
              <img :src="fighter.photo" :alt="fighter.name"
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />

              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div class="absolute top-4 left-4">
                <UBadge :color="getBadgeColor(fighter.record.wins, fighter.record.losses)" variant="solid"
                  class="text-xs font-semibold">
                  {{ fighter.record.wins }}W-{{ fighter.record.losses }}L
                </UBadge>
              </div>

              <div class="absolute top-4 right-4">
                <UBadge v-if="fighter.isCurrentChampion" color="neutral" variant="solid" class="text-xs font-semibold">
                  Чемпион
                </UBadge>
              </div>

              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-2xl dark:text-gray-100 font-bold mb-1">{{ fighter.name }}</h3>
                <p class="text-red-400 font-semibold">{{ fighter.nickname }}</p>
              </div>
            </div>

            <div class="p-6">
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Дисциплина</span>
                  <span class="text-gray-900 dark:text-white font-semibold">{{ fighter.discipline }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Весовая категория</span>
                  <span class="text-gray-900 dark:text-white font-semibold">{{ fighter.weightClass }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Возраст</span>
                  <span class="text-gray-900 dark:text-white font-semibold">{{ fighter.age }} лет</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Опыт</span>
                  <span class="text-gray-900 dark:text-white font-semibold">{{ fighter.experience }}</span>
                </div>
              </div>

              <div class="mb-6">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Достижения:</h4>
                <ul class="space-y-1">
                  <li v-for="achievement in fighter.achievements.slice(0, 3)" :key="achievement"
                    class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <UIcon name="i-heroicons-trophy" class="text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{{ achievement }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <template #fallback>
            <div v-for="(fighter, index) in fighters" :key="fighter.id"
              class="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ring-1 ring-gray-200 dark:ring-gray-700">
              <div class="relative overflow-hidden">
                <img :src="fighter.photo" :alt="fighter.name"
                  class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div class="absolute bottom-4 left-4 right-4">
                  <h3 class="text-2xl font-bold mb-1 text-white">{{ fighter.name }}</h3>
                  <p class="text-red-400 font-semibold">{{ fighter.nickname }}</p>
                </div>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
// Используем composable - данные теперь доступны сразу, без асинхронной загрузки
const { fighters, getWinPercentage } = useFighters()

const getBadgeColor = (wins: number, losses: number) => {
  const percentage = (wins / (wins + losses)) * 100
  if (percentage >= 80) return 'primary'
  if (percentage >= 60) return 'secondary'
  return 'error'
}

const viewFighterStats = (fighter: any) => {
  // View fighter stats
}

const viewFighterProfile = (fighter: any) => {
  // View fighter profile
}

const viewAllFighters = () => {
  // View all fighters
}
</script>