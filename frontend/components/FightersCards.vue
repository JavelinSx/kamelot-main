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

            <div class="mb-4">
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
            </div>

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

            <div class="space-y-3">
              <UButton color="error" variant="solid" class="w-full" @click="viewFighterStats(fighter)">
                Статистика
              </UButton>

              <UButton variant="outline" color="neutral" class="w-full" @click="viewFighterProfile(fighter)">
                Профиль
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
interface FighterRecord {
  wins: number
  losses: number
  draws: number
  knockouts: number
}

interface Fighter {
  id: number
  name: string
  nickname: string
  photo: string
  discipline: string
  weightClass: string
  age: number
  experience: string
  record: FighterRecord
  achievements: string[]
  isCurrentChampion: boolean
}

const fighters = ref<Fighter[]>([
  {
    id: 1,
    name: 'Иван Петров',
    nickname: 'Железный Кулак',
    photo: '/images/fighter1.jpg',
    discipline: 'Бокс',
    weightClass: 'Средний вес',
    age: 28,
    experience: '8 лет',
    record: { wins: 24, losses: 3, draws: 1, knockouts: 18 },
    achievements: [
      'Чемпион России по боксу (2022-2023)',
      'Обладатель кубка Европы',
      'Лучший боксер года по версии WBC'
    ],
    isCurrentChampion: true
  },
  {
    id: 2,
    name: 'Елена Козлова',
    nickname: 'Молния',
    photo: '/images/fighter2.jpg',
    discipline: 'ММА',
    weightClass: 'Наилегчайший вес',
    age: 25,
    experience: '6 лет',
    record: { wins: 18, losses: 2, draws: 0, knockouts: 8 },
    achievements: [
      'Чемпионка Европы по ММА',
      'Обладательница пояса Fight Nights',
      'Лучшая женщина-боец года'
    ],
    isCurrentChampion: true
  },
  {
    id: 3,
    name: 'Андрей Волков',
    nickname: 'Медведь',
    photo: '/images/fighter3.jpg',
    discipline: 'Кикбоксинг',
    weightClass: 'Тяжелый вес',
    age: 32,
    experience: '12 лет',
    record: { wins: 31, losses: 5, draws: 2, knockouts: 23 },
    achievements: [
      'Чемпион мира по К-1',
      'Двукратный чемпион России',
      'Участник турнира Glory'
    ],
    isCurrentChampion: false
  },
  {
    id: 4,
    name: 'Дмитрий Смирнов',
    nickname: 'Вихрь',
    photo: '/images/fighter4.jpg',
    discipline: 'Муай Тай',
    weightClass: 'Полусредний вес',
    age: 26,
    experience: '7 лет',
    record: { wins: 22, losses: 4, draws: 1, knockouts: 15 },
    achievements: [
      'Чемпион WBC Muay Thai',
      'Победитель турнира в Таиланде',
      'Обладатель красного пояса'
    ],
    isCurrentChampion: false
  },
  {
    id: 5,
    name: 'Мария Федорова',
    nickname: 'Огонь',
    photo: '/images/fighter5.jpg',
    discipline: 'Каратэ',
    weightClass: 'Легкий вес',
    age: 23,
    experience: '10 лет',
    record: { wins: 28, losses: 1, draws: 0, knockouts: 12 },
    achievements: [
      'Чемпионка мира по каратэ Киокушин',
      'Трехкратная чемпионка России',
      'Черный пояс 3-й дан'
    ],
    isCurrentChampion: true
  },
  {
    id: 6,
    name: 'Роман Николаев',
    nickname: 'Титан',
    photo: '/images/fighter6.jpg',
    discipline: 'Бразильское джиу-джитсу',
    weightClass: 'Супертяжелый вес',
    age: 29,
    experience: '9 лет',
    record: { wins: 16, losses: 3, draws: 1, knockouts: 4 },
    achievements: [
      'Черный пояс BJJ',
      'Чемпион мира IBJJF',
      'Обладатель кубка Mundials'
    ],
    isCurrentChampion: false
  }
])

const getBadgeColor = (wins: number, losses: number) => {
  const percentage = (wins / (wins + losses)) * 100
  if (percentage >= 80) return 'primary'
  if (percentage >= 60) return 'secondary'
  return 'error'
}

const getWinPercentage = (record: FighterRecord) => {
  const total = record.wins + record.losses + record.draws
  return Math.round((record.wins / total) * 100)
}

const viewFighterStats = (fighter: Fighter) => {
  console.log('Статистика бойца:', fighter.name)
}

const viewFighterProfile = (fighter: Fighter) => {
  console.log('Профиль бойца:', fighter.name)
}

const viewAllFighters = () => {
  console.log('Просмотр всех бойцов')
}
</script>