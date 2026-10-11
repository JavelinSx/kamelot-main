<template>
  <section class="cm-container pb-20 pt-12 sm:pb-24">
    <!-- Лоадер -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <span class="h-14 w-14 animate-spin rounded-full border-2 border-cm-red border-b-transparent" />
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="border border-dashed border-cm-line-2 px-7 py-12 text-center text-cm-red-ink">
      {{ error }}
    </div>

    <div v-else class="flex flex-col gap-4">
      <!-- Пробное занятие — широкий баннер -->
      <article v-for="plan in trialPlans" :key="plan.id"
        class="relative flex flex-wrap items-center justify-between gap-x-12 gap-y-7 overflow-hidden bg-cm-inv px-6 py-8 text-cm-on-inv sm:px-10 sm:py-9">
        <div aria-hidden="true" class="cm-hatch absolute inset-y-0 right-0 w-1/3 opacity-60" />
        <div class="relative flex flex-col gap-2.5">
          <span
            class="self-start bg-cm-on-inv px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-cm-inv">
            Бесплатно · только 1 раз
          </span>
          <h2 class="cm-display m-0 text-[52px] leading-[0.9] sm:text-[64px]">{{ plan.name }}</h2>
          <span class="text-base text-cm-on-inv-muted">{{ plan.description }}</span>
        </div>
        <div class="relative flex flex-wrap items-center gap-8">
          <span class="cm-display text-[120px] leading-[0.78] sm:text-[150px]">
            {{ formatPrice(plan.price) }}<span class="text-[56px] text-cm-red sm:text-[64px]"> ₽</span>
          </span>
          <button type="button" class="cm-btn cm-btn-red cm-cut-lg cm-btn-lg" @click="selectPlan(plan)">
            Записаться бесплатно
            <UIcon name="i-lucide-arrow-right" class="h-5 w-5" />
          </button>
        </div>
      </article>

      <!-- Остальные тарифы -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="plan in regularPlans" :key="plan.id" class="relative flex flex-col gap-5 p-7 sm:p-8"
          :class="cardClass(plan)">
          <span v-if="badge(plan)" class="absolute right-0 top-0 px-3.5 py-2 font-mono text-[11px] font-bold tracking-[0.18em]"
            :class="variant(plan) === 'hit' ? 'bg-[#0a0a0b] text-[#f3efe7]' : 'bg-cm-inv text-cm-on-inv'">
            {{ badge(plan) }}
          </span>

          <span class="font-mono text-[11px] uppercase tracking-[0.18em]"
            :class="variant(plan) === 'hit' ? 'text-[#ffe1de]' : 'text-cm-muted'">
            {{ planKicker(plan) }}
          </span>
          <h3 class="cm-display m-0 pr-16 text-[44px] leading-[0.9] sm:text-[48px]">{{ plan.name }}</h3>
          <div class="cm-display text-[96px] leading-[0.8] sm:text-[112px]">
            {{ formatPrice(plan.price) }}<span class="text-[44px]"
              :class="variant(plan) === 'hit' ? 'text-[#0a0a0b]' : 'text-cm-red-title'"> ₽</span>
          </div>

          <div v-if="pricePerSession(plan) || savings(plan) > 0" class="flex flex-wrap gap-2 font-mono text-xs tracking-[0.06em]">
            <span v-if="pricePerSession(plan)" class="border px-2.5 py-1.5"
              :class="variant(plan) === 'hit' ? 'border-white' : 'border-cm-line-2'">
              {{ pricePerSession(plan) }} ₽ / ТРЕНИРОВКА
            </span>
            <span v-if="savings(plan) > 0" class="px-2.5 py-1.5 font-bold"
              :class="variant(plan) === 'hit' ? 'bg-[#0a0a0b] text-white' : 'bg-cm-inv text-cm-on-inv'">
              ЭКОНОМИЯ {{ formatPrice(savings(plan)) }} ₽
            </span>
          </div>

          <ul class="m-0 flex list-none flex-col gap-2.5 border-t p-0 pt-5 text-[15px]"
            :class="variant(plan) === 'hit' ? 'border-white/30' : 'border-cm-line text-cm-soft'">
            <li v-for="feature in features(plan)" :key="feature" class="flex gap-2.5">
              <UIcon name="i-lucide-check" class="mt-0.5 h-[18px] w-[18px] shrink-0"
                :class="variant(plan) === 'hit' ? 'text-white' : 'text-cm-red-ink'" />
              {{ feature }}
            </li>
          </ul>

          <button type="button" class="cm-btn mt-auto w-full" :class="buttonClass(plan)" @click="selectPlan(plan)">
            Выбрать тариф
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PricingPlan } from '~/types'

const { pricingPlans, isLoading, error, fetchPricingPlans, setSelectedPlan, calculatePricePerSession, calculateSavings } = usePricing()

// Загрузить планы при монтировании
onMounted(async () => {
  await fetchPricingPlans()
})

const trialPlans = computed(() => pricingPlans.value.filter(plan => plan.type === 'trial'))
const regularPlans = computed(() => pricingPlans.value.filter(plan => plan.type !== 'trial'))

type Variant = 'hit' | 'premium' | 'kids' | 'default'

const variant = (plan: PricingPlan): Variant => {
  if (plan.name.includes('Дети')) return 'kids'
  if (plan.name.includes('12 тренировок')) return 'hit'
  if (plan.type === 'unlimited_full') return 'premium'
  return 'default'
}

const badge = (plan: PricingPlan) => ({
  hit: 'ХИТ',
  premium: 'ПРЕМИУМ',
  kids: 'ДЛЯ ДЕТЕЙ',
  default: null
})[variant(plan)]

const cardClass = (plan: PricingPlan) => ({
  hit: 'bg-cm-red text-white',
  premium: 'border-2 border-cm-text bg-cm-bg text-cm-text',
  kids: 'border border-cm-line bg-cm-surface text-cm-text',
  default: 'border border-cm-line bg-cm-surface text-cm-text'
})[variant(plan)]

const buttonClass = (plan: PricingPlan) => ({
  hit: 'cm-cut bg-[#0a0a0b] text-white hover:bg-white hover:text-[#0a0a0b]',
  premium: 'cm-btn-inv',
  kids: 'cm-btn-outline',
  default: 'cm-btn-outline'
})[variant(plan)]

// Форматирование цены
const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU')
}

// Плюрализация "тренировка"
const pluralizeSessions = (count: number) => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'тренировка'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'тренировки'
  return 'тренировок'
}

// Склонение «день»
const daysWord = (days: number) => {
  const mod10 = days % 10
  const mod100 = days % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дня'
  return 'дней'
}

const validity = (plan: PricingPlan) => plan.valid_days ? `${plan.valid_days} ${daysWord(plan.valid_days)}` : ''

const planKicker = (plan: PricingPlan) => {
  const days = plan.valid_days ? ` · ${validity(plan)}` : ''
  if (plan.type === 'single') return 'Разовое посещение'
  if (plan.type.includes('unlimited')) return `Безлимит${days}`
  return `Абонемент${days}`
}

const features = (plan: PricingPlan) => {
  const list: string[] = []
  if (plan.sessions_count > 0) {
    list.push(`${plan.sessions_count} ${pluralizeSessions(plan.sessions_count)}${plan.valid_days ? ` на ${validity(plan)}` : ''}`)
  } else {
    list.push(`Безлимитные тренировки${plan.valid_days ? ` на ${validity(plan)}` : ''}`)
  }
  if (plan.type.includes('unlimited')) {
    list.push(plan.trainer_limited ? 'Все виды единоборств у одного тренера' : 'Все виды единоборств у всех тренеров')
  }
  if (plan.type === 'package') list.push('Любое единоборство на выбор')
  if (plan.trial_allowed) list.push('Бесплатное пробное занятие')
  if (plan.description && variant(plan) === 'kids') list.push(plan.description)
  return list
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

// Выбор плана
const selectPlan = (plan: PricingPlan) => {
  setSelectedPlan(plan)

  // Открываем модалку записи
  window.dispatchEvent(new CustomEvent('openBookingModal'))
}
</script>
