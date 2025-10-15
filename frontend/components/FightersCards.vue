<template>
  <section class="py-10 bg-gray-900 text-white">
    <UContainer>
      <div class="text-center mb-8">
        <h2 data-aos="fade-down" data-aos-duration="600" class="text-4xl text-white font-bold mb-4">
          Наши чемпионы
        </h2>
        <p data-aos="fade-up" data-aos-duration="600" data-aos-delay="100"
          class="text-xl text-gray-300 max-w-2xl mx-auto">
          Бойцы, прошедшие подготовку в нашем клубе и добившиеся выдающихся результатов
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(fighter, index) in fighters" :key="fighter.id" data-aos="zoom-in" :data-aos-delay="index * 100"
          data-aos-duration="600"
          class="group bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
              <h3 class="text-2xl font-bold mb-1">{{ fighter.name }}</h3>
              <p class="text-red-400 font-semibold">{{ fighter.nickname }}</p>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-400 text-sm">Дисциплина</span>
                <span class="text-white font-semibold">{{ fighter.discipline }}</span>
              </div>

              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-400 text-sm">Весовая категория</span>
                <span class="text-white font-semibold">{{ fighter.weightClass }}</span>
              </div>

              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-400 text-sm">Возраст</span>
                <span class="text-white font-semibold">{{ fighter.age }} лет</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-400 text-sm">Опыт</span>
                <span class="text-white font-semibold">{{ fighter.experience }}</span>
              </div>
            </div>

            <!-- <div class="mb-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">Побед нокаутом</span>
                <span class="text-red-400 font-semibold">{{ fighter.record.knockouts }}</span>
              </div>

              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full transition-all duration-300"
                  :style="`width: ${getWinPercentage(fighter.record)}%`" />
              </div>

              <div class="text-center text-xs text-gray-400 mt-1">
                {{ getWinPercentage(fighter.record) }}% побед
              </div>
            </div> -->

            <div class="mb-6">
              <h4 class="text-sm font-semibold text-gray-300 mb-2">Достижения:</h4>
              <ul class="space-y-1">
                <li v-for="achievement in fighter.achievements.slice(0, 3)" :key="achievement"
                  class="text-sm text-gray-400 flex items-start gap-2">
                  <UIcon name="i-heroicons-trophy" class="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{{ achievement }}</span>
                </li>
              </ul>
            </div>

            <!-- <div class="space-y-3">
              <UButton color="error" variant="solid" class="w-full" @click="viewFighterStats(fighter)">
                Статистика
              </UButton>

              <UButton variant="outline" color="neutral" class="w-full" @click="viewFighterProfile(fighter)">
                Профиль
              </UButton>
            </div> -->
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
// Используем composable для загрузки бойцов
const { fighters, loading, fetchFighters, getWinPercentage } = useFighters()

onMounted(async () => {
  try {
    await fetchFighters()
  } catch (error) {
    console.error('Failed to load fighters:', error)
  }
})

const getBadgeColor = (wins: number, losses: number) => {
  const percentage = (wins / (wins + losses)) * 100
  if (percentage >= 80) return 'primary'
  if (percentage >= 60) return 'secondary'
  return 'error'
}

const viewFighterStats = (fighter: any) => {
  console.log('Статистика бойца:', fighter.name)
}

const viewFighterProfile = (fighter: any) => {
  console.log('Профиль бойца:', fighter.name)
}

const viewAllFighters = () => {
  console.log('Просмотр всех бойцов')
}
</script>