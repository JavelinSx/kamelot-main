<template>
  <section
    class="pb-20 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
    <UContainer>
      <!-- Заголовок секции -->
      <div class="flex flex-col items-center mb-16 text-center" data-aos="fade-down">
        <h2 class="pt-10 text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
            Абонементы
          </span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Выберите подходящий тариф и начните тренировки с профессионалами
        </p>
      </div>

      <!-- Лоадер -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Сетка карточек -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(plan, index) in pricingPlans" :key="plan.id" data-aos="fade-up" :data-aos-delay="index * 100"
          class="relative group">
          <!-- Карточка -->
          <div :class="[
            'relative h-full rounded-2xl p-8 transition-all duration-300',
            'border-2 backdrop-blur-sm flex flex-col',
            getCardClasses(plan),
            'hover:-translate-y-2 hover:shadow-2xl'
          ]">
            <!-- Бейдж "Популярный" / "Бесплатно" -->
            <div v-if="getBadge(plan)" class="absolute -top-4 left-1/2 -translate-x-1/2">
              <span :class="[
                'px-4 py-1 rounded-full text-sm font-bold',
                getBadgeColor(plan)
              ]">
                {{ getBadge(plan) }}
              </span>
            </div>

            <!-- Название -->
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ plan.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ plan.description }}
              </p>
            </div>

            <!-- Цена -->
            <div class="mb-6">
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-bold text-gray-900 dark:text-white">
                  {{ formatPrice(plan.price) }}
                </span>
                <span class="text-gray-600 dark:text-gray-400 text-lg">₽</span>
              </div>

              <!-- Детали -->
              <div class="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                <template v-if="plan.sessions_count > 0">
                  {{ plan.sessions_count }} {{ pluralizeSessions(plan.sessions_count) }}
                  <span v-if="plan.valid_days" class="text-gray-500 dark:text-gray-500">
                    на {{ plan.valid_days }} дней
                  </span>
                </template>
                <template v-else>
                  Безлимитные тренировки
                  <span v-if="plan.valid_days" class="text-gray-500 dark:text-gray-500">
                    на {{ plan.valid_days }} дней
                  </span>
                </template>
              </div>

              <!-- Цена за тренировку -->
              <div v-if="pricePerSession(plan)" class="mt-2">
                <span class="text-green-600 dark:text-green-400 font-semibold">
                  {{ pricePerSession(plan) }}₽ / тренировка
                </span>
              </div>

              <!-- Экономия -->
              <div v-if="savings(plan) > 0" class="mt-2">
                <span class="text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1">
                  <UIcon name="i-heroicons-arrow-trending-down" class="w-4 h-4" />
                  Экономия {{ savings(plan) }}₽
                </span>
              </div>
            </div>

            <!-- Особенности -->
            <div class="space-y-3 flex-grow">
              <!-- Для безлимитов -->
              <div v-if="plan.type.includes('unlimited')"
                class="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <UIcon name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <span class="text-sm">
                  {{ plan.trainer_limited ? trainerLimit[0] : trainerLimit[1] }}
                </span>
              </div>

              <!-- Для пакетов -->
              <div v-if="plan.type === 'package'" class="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <UIcon name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <span class="text-sm">Любое единоборство на выбор</span>
              </div>

              <!-- Пробное -->
              <div v-if="plan.trial_allowed" class="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <UIcon name="i-heroicons-gift"
                  class="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <span class="text-sm">Бесплатное пробное занятие</span>
              </div>
            </div>

            <!-- Кнопка -->
            <UButton color="error" size="lg" block @click="selectPlan(plan)" class="font-semibold mt-8 text-white" :class="[
              plan.type === 'trial' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                plan.name.includes('Дети') ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700' :
                  plan.name.includes('12 тренировок') ? 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 shadow-lg shadow-red-900/30' :
                    plan.type.includes('unlimited') ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 shadow-lg shadow-amber-900/40' :
                      'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 shadow-lg'
            ]">
              {{ plan.type === 'trial' ? 'Записаться бесплатно' : 'Выбрать тариф' }}
            </UButton>
          </div>
        </div>
      </div>

    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { PricingPlan } from '~/types'

const { pricingPlans, isLoading, error, fetchPricingPlans, setSelectedPlan, calculatePricePerSession, calculateSavings } = usePricing()
const { setSelectedTrainingType } = useBooking()
const trainerLimit = ['Все виды единоборств у одного тренера', 'Все виды единоборств увсехтренеров']
// Загрузить планы при монтировании
onMounted(async () => {
  await fetchPricingPlans()
})

// Форматирование цены
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

// Плюрализация "тренировка"
const pluralizeSessions = (count: number) => {
  if (count === 1) return 'тренировка'
  if (count >= 2 && count <= 4) return 'тренировки'
  return 'тренировок'
}

// Цена за тренировку
const pricePerSession = (plan: PricingPlan) => {
  const price = calculatePricePerSession(plan)
  return price ? price.toLocaleString('ru-RU') : null
}

// Экономия
const savings = (plan: PricingPlan) => {
  return calculateSavings(plan)
}

// Классы для карточки
const getCardClasses = (plan: PricingPlan) => {
  if (plan.type === 'trial') {
    return 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border-green-500/50 hover:border-green-400'
  }
  if (plan.name.includes('Дети')) {
    return 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/30 border-cyan-400/60 hover:border-cyan-300 ring-2 ring-cyan-400/30'
  }
  if (plan.name.includes('12 тренировок')) {
    return 'bg-gradient-to-br from-slate-100 to-zinc-100 dark:from-slate-900/60 dark:to-zinc-950/70 border-red-600/70 dark:border-red-600/60 hover:border-red-500 ring-2 ring-red-600/20'
  }
  if (plan.type.includes('unlimited')) {
    return 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/70 dark:to-yellow-950/80 border-amber-600/80 dark:border-amber-500/70 hover:border-amber-500 dark:hover:border-amber-400 ring-2 ring-amber-500/30 shadow-lg shadow-amber-900/20'
  }
  return 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-900/50 dark:to-slate-950/60 border-gray-400/70 dark:border-gray-600/60 hover:border-gray-500 dark:hover:border-gray-500'
}

// Бейдж
const getBadge = (plan: PricingPlan) => {
  if (plan.type === 'trial') return '🎁 Бесплатно'
  if (plan.name.includes('Дети')) return '🎈 Для детей'
  if (plan.name.includes('12 тренировок')) return '⭐ Популярный'
  if (plan.type === 'unlimited_full') return '👑 Премиум'
  return null
}

// Цвет бейджа
const getBadgeColor = (plan: PricingPlan) => {
  if (plan.type === 'trial') return 'bg-green-500 text-white'
  if (plan.name.includes('Дети')) return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
  if (plan.name.includes('12 тренировок')) return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50'
  if (plan.type === 'unlimited_full') return 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-500/50'
  if (plan.type.includes('unlimited')) return 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-500/50'
  return 'bg-gray-700 text-white'
}

// Выбор плана
const selectPlan = (plan: PricingPlan) => {
  setSelectedPlan(plan)

  // Открываем модалку записи
  const event = new CustomEvent('openBookingModal')
  window.dispatchEvent(event)
}
</script>

<style scoped>
/* Анимация градиента для популярной карточки */
@keyframes gradient-shift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.group:hover .ring-2 {
  animation: gradient-shift 3s ease infinite;
  background-size: 200% 200%;
}
</style>
