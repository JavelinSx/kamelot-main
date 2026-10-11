<template>
  <section class="relative h-[100svh] min-h-[620px] overflow-hidden bg-black text-[#f3efe7]">
    <video v-if="props.videoSrc" autoplay muted loop playsinline preload="metadata"
      class="absolute inset-0 h-full w-full scale-110 object-cover">
      <source :src="props.videoSrc" type="video/mp4" />
    </video>
    <div v-else class="absolute inset-0 bg-gradient-to-br from-neutral-900 via-red-950 to-black" />

    <!-- Чёрные градиенты по бокам (скрывают края и водяной знак) — только на десктопе -->
    <div v-if="props.videoSrc" aria-hidden="true" class="pointer-events-none absolute inset-0 hidden lg:block">
      <div class="absolute inset-y-0 left-0 w-[30%] xl:w-[36%]"
        style="background: linear-gradient(90deg, #000 0%, #000 48%, rgba(0, 0, 0, 0) 100%)" />
      <div class="absolute inset-y-0 right-0 w-[30%] xl:w-[36%]"
        style="background: linear-gradient(270deg, #000 0%, #000 48%, rgba(0, 0, 0, 0) 100%)" />
    </div>

    <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-black/30" />
    <div aria-hidden="true" class="cm-scanlines pointer-events-none absolute inset-0" />
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-72 lg:h-56"
      style="background: linear-gradient(0deg, var(--cm-bg) 0%, transparent 100%)" />

    <!-- Левая колонка: дисциплины -->
    <div class="absolute left-8 top-1/2 hidden -translate-y-1/2 flex-col gap-1 xl:flex 2xl:left-14">
      <span class="cm-kicker mb-3.5 text-[#ff4436]">// Дисциплины</span>
      <span v-for="(item, index) in disciplines" :key="item"
        class="cm-display text-[46px] leading-[0.95] 2xl:text-[52px]"
        :class="index === 0 ? 'text-[#f3efe7]' : 'hero-outline'">
        {{ item }}
      </span>
    </div>

    <!-- Правая колонка: пробная тренировка -->
    <div
      class="absolute right-8 top-1/2 hidden w-[250px] -translate-y-1/2 flex-col items-end gap-3.5 text-right xl:flex 2xl:right-14 2xl:w-[270px]">
      <span class="cm-kicker text-[#ff4436]">// Первая тренировка</span>
      <span class="cm-display text-[150px] leading-[0.8]">0<span class="text-[72px] text-[#e8231a]"> ₽</span></span>
      <p class="m-0 text-[15px] leading-normal text-[#a8a49c]">Пробное занятие бесплатно. Любое направление, любой
        уровень.</p>
      <span class="h-px w-full bg-[#2a2a2e]" />
      <span class="font-mono text-xs uppercase leading-[1.7] tracking-[0.08em]">{{ contacts.academy.address }}</span>
    </div>

    <!-- Центр: заголовок и кнопки -->
    <div
      class="absolute inset-0 z-10 flex flex-col items-center justify-end gap-5 px-4 pb-24 text-center lg:justify-center lg:gap-7 lg:pb-0">
      <div class="cm-rise flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] lg:text-xs">
        <span class="h-0.5 w-6 bg-cm-red lg:w-9" />Клуб боевых искусств<span class="h-0.5 w-6 bg-cm-red lg:w-9" />
      </div>
      <h1 class="cm-display m-0 leading-[0.8]">
        <span class="cm-rise block text-[clamp(92px,14vw,210px)] tracking-[-0.01em] text-[#e8231a]"
          style="text-shadow: 0 10px 60px rgba(0, 0, 0, 0.7)">Camelot</span>
        <span class="cm-rise cm-rise-2 mt-2 block text-[clamp(46px,7vw,104px)] tracking-[0.04em]">Sport Academy</span>
      </h1>
      <div class="cm-rise cm-rise-3 mt-1 flex w-full max-w-md flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:gap-3">
        <button type="button" class="cm-btn cm-btn-red cm-cut-lg cm-btn-lg w-full justify-between sm:w-auto"
          @click="openBooking">
          Бесплатная тренировка
          <UIcon name="i-lucide-arrow-right" class="h-5 w-5" />
        </button>
        <NuxtLink to="/schedule"
          class="cm-btn cm-btn-lg w-full border-[1.5px] border-[#f3efe7] bg-black/35 text-[#f3efe7] hover:bg-[#f3efe7] hover:text-black sm:w-auto">
          Расписание
        </NuxtLink>
      </div>
    </div>

    <!-- Нижняя полоса -->
    <div
      class="absolute inset-x-0 bottom-0 z-10 hidden items-center justify-between gap-4 px-8 py-5 font-mono text-xs uppercase tracking-[0.16em] text-[#a8a49c] lg:flex 2xl:px-14">
      <span>Пн–Вс / 10:00–23:00</span>
      <span class="inline-flex items-center gap-2.5 text-[#f3efe7]">Листай
        <UIcon name="i-lucide-arrow-down" class="h-3.5 w-3.5 animate-bounce" />
      </span>
      <a :href="`tel:${phoneHref}`" class="text-[#a8a49c] hover:text-[#f3efe7]">{{ contacts.academy.phone }}</a>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  videoSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  videoSrc: '/video/header-video.mp4'
})

const { contacts } = useContacts()
const phoneHref = computed(() => contacts.value.academy.phone.replace(/[^\d+]/g, ''))

const disciplines = ['ММА', 'Бокс', 'Кикбоксинг', 'Грэпплинг', 'БЖЖ', 'Панкратион']

const openBooking = () => {
  window.dispatchEvent(new CustomEvent('openBookingModal'))
}
</script>

<style scoped>
.hero-outline {
  color: transparent;
  -webkit-text-stroke: 1.2px #f3efe7;
}
</style>
