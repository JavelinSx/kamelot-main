<template>
  <section class="py-10 bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
    <UContainer>
      <div class="flex flex-col items-center mb-8 text-center">
        <h2 data-aos="fade-down" data-aos-duration="800"
          class="inline-block lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 ">
          Направления единоборств
        </h2>
        <p data-aos="fade-up" data-aos-duration="800" data-aos-delay="100"
          class="inline-block lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto ">
          Выберите подходящее направление для развития своих навыков и достижения целей
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div v-for="(art, index) in (martialArts || [])" :key="art?.id || 'default'" data-aos="fade-up"
          data-aos-duration="600" class="flex">
          <UCard
            class="hover:-translate-y-2 transition-all duration-300 transform shadow-lg hover:shadow-md bg-white dark:bg-slate-800 rounded-lg ring-1 ring-gray-200 dark:ring-gray-700 flex flex-col w-full"
            :class="getShadowClass(art.id)" :ui="{
              body: 'h-full'
            }">
            <template #header>
              <div class="relative h-48 rounded-md overflow-hidden">
                <img :src="art.image" :alt="art.name"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div class="absolute bottom-4 left-4 ">
                  <h3 class="text-2xl font-bold text-white">{{ art.name }}</h3>
                </div>
              </div>
            </template>

            <div class="text-gray-800 dark:text-gray-100 flex flex-col flex-1 justify-between h-full">
              <p class="mb-4 leading-relaxed">
                {{ art.description }}
              </p>
              <div>
                <div class="flex flex-wrap gap-2 mb-4">
                  <UBadge v-for="benefit in (art?.benefits || [])" :key="benefit || 'benefit'" variant="soft"
                    color="error" size="sm">
                    {{ benefit }}
                  </UBadge>
                </div>

                <div class="flex justify-between items-center text-sm mb-4 text-gray-700 dark:text-gray-300">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-clock" class="text-red-500" />
                    <span>{{ art.duration }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-user-group" class="text-red-500" />
                    <span>{{ art.difficulty }}</span>
                  </div>
                </div>

                <div class="text-center mt-auto">
                  <UButton color="error" variant="outline" class="w-full hover:cursor-pointer"
                    @click="selectMartialArt(art)">
                    Записаться
                  </UButton>
                </div>
              </div>

            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
interface MartialArt {
  id: number
  name: string
  description: string
  image: string
  benefits: string[]
  duration: string
  difficulty: string
}

const getShadowClass = (id: number) => {
  const shadows = {
    1: 'shadow-sky-400/40',
    2: 'shadow-green-400/40',
    3: 'shadow-red-400/40',
    4: 'shadow-cyan-400/40',
    5: 'shadow-emerald-400/40',
    6: 'shadow-yellow-400/40'
  }
  return shadows[id as keyof typeof shadows] || 'shadow-gray-700'
}

const martialArts = ref<MartialArt[]>([
  {
    id: 1,
    name: 'Бокс',
    description: 'Классический бокс развивает скорость, силу удара и координацию. Отличный способ улучшить физическую форму и научиться защищать себя.',
    image: '/images/fight-category/Box.png',
    benefits: ['Сила удара', 'Координация', 'Выносливость'],
    duration: '90 мин',
    difficulty: 'Для всех'
  },
  {
    id: 2,
    name: 'Кикбоксинг',
    description: 'Сочетание техник рук и ног. Развивает гибкость, силу и скорость реакции. Эффективное кардио и самооборона.',
    image: '/images/fight-category/KickBox.png',
    benefits: ['Гибкость', 'Кардио', 'Самооборона'],
    duration: '90 мин',
    difficulty: 'Средний'
  },
  {
    id: 3,
    name: 'ММА',
    description: 'Смешанные боевые искусства объединяют лучшие техники различных единоборств. Полноценная подготовка бойца.',
    image: '/images/fight-category/MMA.png',
    benefits: ['Универсальность', 'Сила', 'Техника'],
    duration: '120 мин',
    difficulty: 'Продвинутый'
  },
  {
    id: 4,
    name: 'Грэпплинг',
    description: 'Искусство борьбы и захватов без ударов. Развивает технику, силу и стратегическое мышление.',
    image: '/images/fight-category/Grappling.png',
    benefits: ['Техника', 'Сила', 'Стратегия'],
    duration: '90 мин',
    difficulty: 'Средний'
  },
  {
    id: 5,
    name: 'Бразильское Джиу-джитсу',
    description: 'Искусство борьбы на земле, основанное на технике и рычагах. Развивает стратегическое мышление и гибкость.',
    image: '/images/fight-category/BJJ.png',
    benefits: ['Техника', 'Стратегия', 'Гибкость'],
    duration: '90 мин',
    difficulty: 'Для всех'
  },
  {
    id: 6,
    name: 'Панкратион',
    description: 'Древнегреческое боевое искусство, сочетающее борьбу и удары. Развивает универсальные навыки боя.',
    image: '/images/fight-category/Pankration.png',
    benefits: ['Универсальность', 'История', 'Техника'],
    duration: '90 мин',
    difficulty: 'Продвинутый'
  }
])

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

  // Скроллим к форме в Header
  // Триггерим событие для открытия модального окна
  const event = new CustomEvent('openBookingModal')
  window.dispatchEvent(event)
}
</script>
