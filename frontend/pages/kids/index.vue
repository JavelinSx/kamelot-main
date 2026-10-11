<template>
  <div class="min-h-screen pt-20">
    <!-- Hero -->
    <section class="border-b border-cm-line">
      <div class="cm-container flex flex-wrap items-center gap-10 py-12 sm:gap-12 sm:py-16">
        <div class="flex min-w-0 flex-[1_1_520px] flex-col gap-5 sm:gap-6">
          <span class="cm-kicker">// Детям и подросткам 5–16 лет</span>
          <h1 class="cm-display m-0 text-[clamp(60px,8.4vw,136px)] leading-[0.82]">
            Боевые искусства <span class="text-cm-red-title">для детей</span>
          </h1>
          <p class="m-0 max-w-[520px] text-lg leading-relaxed text-cm-soft sm:text-[19px]">
            Развиваем силу, дисциплину и уверенность в себе с ранних лет.
          </p>
          <div class="mt-1 flex flex-col gap-3 sm:flex-row">
            <button type="button" class="cm-btn cm-btn-red cm-cut-lg cm-btn-lg" @click="openBooking">
              Пробное занятие — 0 ₽
            </button>
            <a href="#groups" class="cm-btn cm-btn-outline cm-btn-lg">Группы и время</a>
          </div>
        </div>

        <div class="relative h-[380px] min-w-0 flex-[1_1_440px] overflow-hidden bg-[#f3efe7] sm:h-[500px]">
          <div aria-hidden="true" class="cm-hatch absolute inset-0 opacity-50" />
          <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-16 bg-cm-red" />
          <span class="cm-display absolute left-5 top-5 text-[30px] leading-[0.9] text-[#0a0a0b] sm:text-[34px]">
            Растём<br>по ступеням
          </span>
          <div class="absolute inset-x-0 bottom-10 top-24 flex items-end justify-center">
            <img v-for="step in steps" :key="step.label" :src="step.image" :alt="step.alt"
              class="w-[30%] object-cover object-bottom mix-blend-multiply" :style="{ height: step.height }"
              loading="lazy" />
          </div>
          <div
            class="absolute inset-x-0 bottom-[18px] flex justify-center font-mono text-[13px] font-bold tracking-[0.14em] text-white">
            <span v-for="step in steps" :key="step.label" class="w-[30%] text-center">{{ step.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Цифры -->
    <section class="border-b border-cm-line" aria-label="Наши достижения">
      <div ref="statsRef" class="mx-auto grid max-w-[1376px] grid-cols-2 lg:grid-cols-4">
        <div v-for="(stat, index) in stats" :key="stat.label" class="flex flex-col gap-1.5 border-cm-line px-4 py-6 sm:px-8 sm:py-8"
          :class="[index % 2 === 0 ? 'border-r' : '', index < 2 ? 'border-b lg:border-b-0' : '', index === 1 ? 'lg:border-r' : '']">
          <span class="cm-display text-[60px] leading-[0.85] sm:text-[84px]">
            {{ animatedValues[index] || 0 }}<span class="text-cm-red-title">{{ stat.suffix }}</span>
          </span>
          <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-cm-muted sm:text-xs">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- Почему это важно -->
    <section class="py-16 sm:py-[100px]">
      <div class="cm-container flex flex-col gap-10 sm:gap-12">
        <SectionHead kicker="[01] / Зачем"
          description="Боевые искусства — это не только физическая подготовка, но и развитие личности.">
          Почему это важно<br>для <span class="text-cm-red-title">вашего ребёнка</span>
        </SectionHead>
        <div class="grid grid-cols-1 gap-px border border-cm-line bg-cm-line md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(benefit, index) in benefits" :key="benefit.title" class="flex flex-col gap-3.5 bg-cm-bg p-7 sm:p-8">
            <div class="flex items-center justify-between">
              <span class="inline-flex h-[52px] w-[52px] items-center justify-center bg-cm-red text-white">
                <UIcon :name="benefit.icon" class="h-6 w-6" />
              </span>
              <span class="font-mono text-sm font-bold text-cm-dim">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <h3 class="cm-display m-0 text-[36px] leading-[0.92] sm:text-[38px]">{{ benefit.title }}</h3>
            <p class="m-0 text-[15px] leading-relaxed text-cm-muted">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Возрастные группы -->
    <section id="groups" class="scroll-mt-20 border-y border-cm-line bg-cm-section py-16 sm:py-[100px]">
      <div class="cm-container flex flex-col gap-10 sm:gap-12">
        <SectionHead kicker="[02] / Возрастные группы"
          description="Программы адаптированы под каждый возраст — от игровой формы до соревновательной практики.">
          Своя группа <span class="text-cm-red-title">на каждый возраст</span>
        </SectionHead>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article v-for="group in ageGroups" :key="group.age" class="flex flex-col border border-cm-line bg-cm-bg">
            <div class="relative h-[230px] overflow-hidden bg-[#f3efe7]">
              <img :src="group.image" alt="" class="absolute bottom-0 right-3 h-full w-[55%] object-cover object-[50%_30%] mix-blend-multiply"
                loading="lazy" />
              <div class="absolute left-[22px] top-5 flex flex-col gap-1.5 text-[#0a0a0b]">
                <span class="cm-display text-[88px] leading-[0.8] sm:text-[96px]">{{ group.age }}</span>
                <span class="font-mono text-xs font-bold tracking-[0.16em]">ЛЕТ</span>
              </div>
              <span class="absolute bottom-0 left-0 bg-[#0a0a0b] px-3.5 py-2 font-display text-[22px] font-black uppercase text-[#f3efe7]">
                {{ group.name }}
              </span>
            </div>
            <ul class="m-0 flex flex-1 list-none flex-col gap-3 p-6">
              <li v-for="item in group.features" :key="item" class="flex gap-3 text-[15px] text-cm-soft">
                <UIcon name="i-lucide-check" class="mt-0.5 h-[18px] w-[18px] shrink-0 text-cm-red-ink" />{{ item }}
              </li>
            </ul>
            <div class="flex items-center justify-between gap-3 border-t border-cm-line px-6 py-[18px]">
              <div>
                <div class="cm-label">Расписание</div>
                <div class="mt-1 font-mono text-[15px] font-bold">{{ group.schedule }}</div>
              </div>
              <button type="button" class="cm-btn cm-btn-red cm-btn-sm" @click="openBooking">Записать</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Что включено + безопасность -->
    <section class="py-16 sm:py-[100px]">
      <div class="cm-container flex flex-wrap gap-5">
        <div class="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
          <div class="flex flex-col gap-3.5">
            <span class="cm-kicker">[03] / Занятие</span>
            <h2 class="cm-display m-0 text-[clamp(48px,5.6vw,84px)]">Что включено</h2>
          </div>
          <ol class="m-0 flex list-none flex-col border-t border-cm-line p-0">
            <li v-for="(activity, index) in activities" :key="activity.title" class="flex gap-5 border-b border-cm-line py-[18px]">
              <span class="w-10 shrink-0 pt-1 font-mono text-sm font-bold text-cm-red-ink">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="flex flex-col gap-1">
                <span class="font-display text-[28px] font-black uppercase leading-none">{{ activity.title }}</span>
                <span class="text-sm leading-normal text-cm-muted">{{ activity.description }}</span>
              </span>
            </li>
          </ol>
        </div>

        <div class="flex min-w-0 flex-[1_1_520px] flex-col gap-6 bg-cm-inv p-7 text-cm-on-inv sm:p-10">
          <div class="flex items-center gap-4">
            <span class="inline-flex h-16 w-16 shrink-0 items-center justify-center bg-cm-on-inv text-cm-inv">
              <UIcon name="i-lucide-shield-check" class="h-[30px] w-[30px]" />
            </span>
            <h2 class="cm-display m-0 text-[44px] leading-[0.88] sm:text-[56px]">Безопасность<br>превыше всего</h2>
          </div>
          <div class="grid grid-cols-1 gap-x-7 gap-y-5 sm:grid-cols-2">
            <div v-for="safety in safetyFeatures" :key="safety.title"
              class="flex flex-col gap-1.5 border-t-2 border-cm-on-inv pt-3.5">
              <span class="font-display text-2xl font-black uppercase leading-none">{{ safety.title }}</span>
              <span class="text-sm leading-normal text-cm-on-inv-muted">{{ safety.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaBand kicker="// Готовы начать?" button-text="Записать ребёнка"
      description="Запишите ребёнка на бесплатное пробное занятие прямо сейчас.">
      Первая — <span class="text-white">бесплатно</span>
    </CtaBand>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Данные для анимированных счетчиков
const stats = [
  { value: 200, suffix: '+', label: 'Учеников' },
  { value: 50, suffix: '+', label: 'Призёров' },
  { value: 8, suffix: '+', label: 'Лет опыта' },
  { value: 100, suffix: '%', label: 'Довольных родителей' }
]

// Ступени в хиро: иллюстрации растут вместе с возрастом
const steps = [
  { label: '5–7', image: '/images/fight-category/kid.webp', alt: 'Ребёнок 5–7 лет в экипировке', height: '62%' },
  { label: '8–11', image: '/images/fight-category/kid.webp', alt: 'Ребёнок 8–11 лет в экипировке', height: '78%' },
  { label: '12–16', image: '/images/fight-category/teen.webp', alt: 'Подросток 12–16 лет в экипировке', height: '96%' }
]

// Реактивные значения для анимации
const animatedValues = ref<number[]>(stats.map(() => 0))
const statsRef = ref<HTMLElement | null>(null)

// Функция анимации счетчика
const animateCounter = (index: number, targetValue: number, duration: number = 2000) => {
  const startTime = Date.now()
  const startValue = 0

  const updateCounter = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3)

    animatedValues.value[index] = Math.floor(startValue + (targetValue - startValue) * easedProgress)

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  updateCounter()
}

// Запуск анимации при загрузке
onMounted(() => {
  // Используем Intersection Observer для запуска анимации при появлении секции
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Запускаем анимацию с задержкой для каждого счетчика
        stats.forEach((stat, index) => {
          setTimeout(() => {
            animateCounter(index, stat.value)
          }, index * 100)
        })
        observer.disconnect()
      }
    })
  }, { threshold: 0.3 })

  // Наблюдаем за блоком с цифрами
  if (statsRef.value) {
    observer.observe(statsRef.value)
  }
})

const benefits = [
  {
    icon: 'i-lucide-zap',
    title: 'Физическое развитие',
    description: 'Улучшение координации, силы, гибкости и выносливости. Здоровое физическое развитие с раннего возраста.'
  },
  {
    icon: 'i-lucide-graduation-cap',
    title: 'Дисциплина',
    description: 'Обучение самоконтролю, уважению к старшим и соблюдению правил. Формирование ответственности.'
  },
  {
    icon: 'i-lucide-star',
    title: 'Уверенность в себе',
    description: 'Преодоление страхов, достижение целей и развитие лидерских качеств.'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'Самооборона',
    description: 'Навыки защиты себя в сложных ситуациях и умение избегать конфликтов.'
  },
  {
    icon: 'i-lucide-users',
    title: 'Социализация',
    description: 'Работа в команде, новые друзья и умение находить общий язык с разными людьми.'
  },
  {
    icon: 'i-lucide-heart',
    title: 'Здоровый образ жизни',
    description: 'Формирование привычки к регулярным тренировкам и здоровому питанию.'
  }
]

const ageGroups = [
  {
    age: '5–7',
    name: 'Подготовительная группа',
    image: '/images/fight-category/kid.webp',
    features: [
      'Игровая форма обучения',
      'Развитие координации',
      'Базовые техники',
      'Социальные навыки'
    ],
    schedule: 'Пн · Ср · Пт  16:00–17:00'
  },
  {
    age: '8–11',
    name: 'Младшая группа',
    image: '/images/fight-category/kid.webp',
    features: [
      'Изучение техник',
      'Спарринги в защите',
      'Развитие дисциплины',
      'Участие в соревнованиях'
    ],
    schedule: 'Пн · Ср · Пт  17:00–18:30'
  },
  {
    age: '12–16',
    name: 'Подростковая группа',
    image: '/images/fight-category/teen.webp',
    features: [
      'Продвинутые техники',
      'Полноценные спарринги',
      'Физическая подготовка',
      'Соревновательная практика'
    ],
    schedule: 'Пн · Ср · Пт  18:30–20:00'
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
  title: 'Боевые искусства для детей | Camelot Sport Academy',
  description: 'Детские секции боевых искусств в Санкт-Петербурге на Парнасе. Развиваем силу, дисциплину и уверенность в себе. Группы для детей от 5 до 16 лет. Бесплатное пробное занятие!'
})
</script>
