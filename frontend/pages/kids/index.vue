<template>
  <div class="bg-gradient-to-b from-orange-50 via-yellow-50 to-white min-h-screen">
    <!-- Hero секция -->
    <section class="relative py-24 md:py-32 bg-gradient-to-r from-orange-500 to-green-600 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-bounce"></div>
        <div class="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full animate-bounce"
          style="animation-delay: 0.5s"></div>
      </div>

      <UContainer class="relative z-10 px-6">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg text-white">
            Боевые искусства для детей
          </h1>
          <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Развиваем силу, дисциплину и уверенность в себе с ранних лет
          </p>
          <UButton color="neutral" variant="solid" size="xl"
            class="bg-white !text-red-600 font-bold hover:bg-gray-100 shadow-xl" @click="openBooking">
            <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 mr-2" />
            Записаться на пробное занятие
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- Почему боевые искусства для детей -->
    <section class="py-20 bg-white">
      <UContainer class="px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Почему это важно для вашего ребёнка?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Боевые искусства — это не только физическая подготовка, но и развитие личности
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="benefit in benefits" :key="benefit.title"
            class="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-md p-8 hover:shadow-xl transition-all hover:-translate-y-1">
            <div
              class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <UIcon :name="benefit.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ benefit.title }}</h3>
            <p class="text-gray-700 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Возрастные группы -->
    <section class="py-20 bg-gradient-to-b from-orange-50 to-yellow-50">
      <UContainer class="px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Возрастные группы
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Программы адаптированы под каждый возраст
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="group in ageGroups" :key="group.age"
            class="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform">
            <div :class="`p-8 text-white shadow-inner ${group.color}`">
              <h3 class="text-3xl font-bold mb-2 drop-shadow-md">{{ group.age }}</h3>
              <p class="text-lg drop-shadow-sm">{{ group.name }}</p>
            </div>
            <div class="p-8 bg-white">
              <ul class="space-y-3">
                <li v-for="item in group.features" :key="item" class="flex items-start gap-3">
                  <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
              <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-sm text-gray-500 mb-2">Расписание</p>
                <p class="font-semibold text-gray-900">{{ group.schedule }}</p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Что включено в занятия -->
    <section class="py-20 bg-white">
      <UContainer class="px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Что включено в занятия
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="activity in activities" :key="activity.title"
            class="flex items-start gap-4 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <div
              class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <UIcon :name="activity.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ activity.title }}</h3>
              <p class="text-gray-700">{{ activity.description }}</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Безопасность -->
    <section class="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <UContainer class="px-6">
        <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div class="text-center mb-12">
            <div class="inline-block p-4 bg-green-100 rounded-full mb-6">
              <UIcon name="i-heroicons-shield-check" class="w-16 h-16 text-green-600" />
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Безопасность превыше всего
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="safety in safetyFeatures" :key="safety.title" class="flex items-start gap-4">
              <UIcon name="i-heroicons-check-badge" class="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ safety.title }}</h3>
                <p class="text-gray-700">{{ safety.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA секция -->
    <section class="py-24 md:py-32 bg-gradient-to-r from-red-600 to-orange-600 text-white">
      <UContainer class="px-6">
        <div class="text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Готовы начать?
          </h2>
          <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Запишитесь на бесплатное пробное занятие прямо сейчас!
          </p>
          <UButton color="neutral" variant="solid" size="xl"
            class="bg-white !text-red-600 font-bold text-lg hover:bg-gray-100 shadow-xl" @click="openBooking">
            <UIcon name="i-heroicons-phone" class="w-6 h-6 mr-2" />
            Записаться на пробное занятие
          </UButton>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
const benefits = [
  {
    icon: 'i-heroicons-bolt',
    title: 'Физическое развитие',
    description: 'Улучшение координации, силы, гибкости и выносливости. Здоровое физическое развитие с раннего возраста.'
  },
  {
    icon: 'i-heroicons-academic-cap',
    title: 'Дисциплина',
    description: 'Обучение самоконтролю, уважению к старшим и соблюдению правил. Формирование ответственности.'
  },
  {
    icon: 'i-heroicons-star',
    title: 'Уверенность в себе',
    description: 'Преодоление страхов, достижение целей и развитие лидерских качеств.'
  },
  {
    icon: 'i-heroicons-shield-check',
    title: 'Самооборона',
    description: 'Навыки защиты себя в сложных ситуациях и умение избегать конфликтов.'
  },
  {
    icon: 'i-heroicons-users',
    title: 'Социализация',
    description: 'Работа в команде, новые друзья и умение находить общий язык с разными людьми.'
  },
  {
    icon: 'i-heroicons-heart',
    title: 'Здоровый образ жизни',
    description: 'Формирование привычки к регулярным тренировкам и здоровому питанию.'
  }
]

const ageGroups = [
  {
    age: '5-7 лет',
    name: 'Подготовительная группа',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    features: [
      'Игровая форма обучения',
      'Развитие координации',
      'Базовые техники',
      'Социальные навыки'
    ],
    schedule: 'Пн, Ср, Пт - 16:00-17:00'
  },
  {
    age: '8-11 лет',
    name: 'Младшая группа',
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    features: [
      'Изучение техник',
      'Спарринги в защите',
      'Развитие дисциплины',
      'Участие в соревнованиях'
    ],
    schedule: 'Пн, Ср, Пт - 17:00-18:30'
  },
  {
    age: '12-16 лет',
    name: 'Подростковая группа',
    color: 'bg-gradient-to-br from-orange-400 to-red-500',
    features: [
      'Продвинутые техники',
      'Полноценные спарринги',
      'Физическая подготовка',
      'Соревновательная практика'
    ],
    schedule: 'Пн, Ср, Пт - 18:30-20:00'
  }
]

const activities = [
  {
    icon: 'i-heroicons-fire',
    title: 'Разминка и растяжка',
    description: 'Подготовка мышц к нагрузкам и развитие гибкости'
  },
  {
    icon: 'i-heroicons-hand-raised',
    title: 'Техника ударов и защиты',
    description: 'Изучение правильных движений и позиций'
  },
  {
    icon: 'i-heroicons-user-group',
    title: 'Работа в парах',
    description: 'Отработка техник с партнёром под контролем тренера'
  },
  {
    icon: 'i-heroicons-trophy',
    title: 'Спарринги',
    description: 'Контролируемые учебные бои в защитном снаряжении'
  },
  {
    icon: 'i-heroicons-beaker',
    title: 'Функциональная подготовка',
    description: 'Упражнения на силу, скорость и выносливость'
  },
  {
    icon: 'i-heroicons-chat-bubble-left-right',
    title: 'Теория',
    description: 'Беседы о философии боевых искусств и ценностях'
  }
]

const safetyFeatures = [
  {
    title: 'Профессиональные тренеры',
    description: 'Опыт работы с детьми, педагогическое образование'
  },
  {
    title: 'Защитное снаряжение',
    description: 'Шлемы, перчатки, защита для всех видов тренировок'
  },
  {
    title: 'Медицинский контроль',
    description: 'Регулярные медосмотры и контроль нагрузок'
  },
  {
    title: 'Безопасное оборудование',
    description: 'Маты, мягкие стены, сертифицированный инвентарь'
  },
  {
    title: 'Малые группы',
    description: 'До 12 человек - индивидуальный подход к каждому'
  },
  {
    title: 'Страхование',
    description: 'Все занимающиеся застрахованы от несчастных случаев'
  }
]

const openBooking = () => {
  const event = new CustomEvent('openBookingModal')
  window.dispatchEvent(event)
}

// SEO
useSeoMeta({
  title: 'Боевые искусства для детей | Kamelot Fight Club',
  description: 'Детские секции боевых искусств в Москве. Развиваем силу, дисциплину и уверенность в себе. Группы для детей от 5 до 16 лет. Бесплатное пробное занятие!'
})
</script>