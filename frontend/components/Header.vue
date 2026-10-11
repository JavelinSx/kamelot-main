<template>
  <div>
    <header class="fixed inset-x-0 top-0 z-50 border-b border-cm-line bg-cm-header backdrop-blur-md">
      <div class="cm-container flex h-20 items-center gap-4 lg:gap-6">
        <NuxtLink to="/" class="flex shrink-0 items-center gap-3 text-cm-text" aria-label="Camelot — на главную"
          @click="closeMenu">
          <img :src="logo" alt="" class="cm-logo h-10 w-10 object-contain lg:h-11 lg:w-11" width="44" height="44" />
          <span class="flex flex-col gap-1 leading-none">
            <span class="font-display text-[28px] font-black tracking-[0.03em] lg:text-[30px]">CAMELOT</span>
            <span class="hidden font-mono text-[10px] tracking-[0.24em] text-cm-muted sm:block">SPORT ACADEMY</span>
          </span>
        </NuxtLink>

        <nav class="ml-auto hidden items-center gap-7 lg:flex" aria-label="Основная навигация">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
            class="border-b-2 py-1.5 font-display text-[21px] font-extrabold uppercase tracking-[0.06em] transition-colors hover:text-cm-red-ink"
            :class="isActive(item.to) ? 'border-cm-red text-cm-text' : 'border-transparent text-cm-muted'">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <a :href="contacts.academy.socialLinks.vk" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте"
            class="hidden h-11 w-11 items-center justify-center border border-cm-line text-cm-text transition-colors hover:border-cm-red hover:text-cm-red-ink sm:inline-flex">
            <IconVk class="h-[22px] w-[22px]" />
          </a>
          <a :href="contacts.academy.socialLinks.telegram" target="_blank" rel="noopener noreferrer"
            aria-label="Telegram"
            class="hidden h-11 w-11 items-center justify-center border border-cm-line text-cm-text transition-colors hover:border-cm-red hover:text-cm-red-ink sm:inline-flex">
            <IconTelegram class="h-5 w-5" />
          </a>

          <ClientOnly>
            <button type="button" :aria-label="colorMode.value === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
              class="hidden h-11 w-11 cursor-pointer items-center justify-center border border-cm-line text-cm-text transition-colors hover:border-cm-red hover:text-cm-red-ink lg:inline-flex"
              @click="toggleColorMode">
              <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" class="h-5 w-5" />
            </button>
          </ClientOnly>

          <UModal v-model:open="isBookingOpen" :description="modalDescription" :ui="{
            overlay: 'fixed inset-0 bg-black/75 backdrop-blur-sm',
            content: 'fixed bg-cm-surface ring-0 border border-cm-line rounded-none divide-y divide-cm-line flex flex-col focus:outline-none sm:max-w-2xl',
            header: 'relative border-t-4 border-cm-red px-5 pt-6 pb-5 sm:px-7',
            title: 'font-display font-black italic uppercase text-[40px] sm:text-[48px] leading-[0.9] text-cm-text pr-12',
            description: 'mt-3 text-sm leading-relaxed text-cm-muted pr-12',
            body: 'p-0',
            close: 'absolute top-5 end-4'
          }">
            <button type="button" class="cm-btn cm-btn-red cm-cut ml-1 h-11 px-4 text-[19px] sm:px-5 lg:h-[46px] lg:text-[21px]">
              Записаться
              <UIcon name="i-lucide-arrow-right" class="hidden h-[18px] w-[18px] sm:block" />
            </button>

            <template #title>
              <span class="cm-kicker mb-2 block not-italic">// Первая тренировка — 0 ₽</span>
              Запись на тренировку
            </template>

            <template #body>
              <BookingForm @booking-success="handleBookingSuccess" />
            </template>
          </UModal>

          <button type="button"
            class="inline-flex h-11 w-11 cursor-pointer items-center justify-center border border-cm-line text-cm-text lg:hidden"
            :aria-expanded="isMenuOpen" aria-controls="mobile-menu" :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
            @click="isMenuOpen = !isMenuOpen">
            <span class="burger-icon">
              <span class="burger-line" :class="{ 'burger-line-open-top': isMenuOpen }"></span>
              <span class="burger-line" :class="{ 'burger-line-open-middle': isMenuOpen }"></span>
              <span class="burger-line" :class="{ 'burger-line-open-bottom': isMenuOpen }"></span>
            </span>
          </button>
        </div>
      </div>

      <!-- Мобильное меню -->
      <Transition enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4">
        <div v-if="isMenuOpen" id="mobile-menu"
          class="max-h-[calc(100svh-80px)] overflow-y-auto border-t border-cm-line bg-cm-bg lg:hidden">
          <nav class="cm-container flex flex-col py-4" aria-label="Мобильная навигация">
            <NuxtLink v-for="(item, index) in navItems" :key="item.to" :to="item.to"
              class="menu-item flex items-center justify-between border-b border-cm-line py-4 font-display text-[40px] font-black italic uppercase leading-none"
              :class="isActive(item.to) ? 'text-cm-red-title' : 'text-cm-text'"
              :style="{ animationDelay: `${index * 50}ms` }" @click="closeMenu">
              {{ item.label }}
              <span class="font-mono text-xs not-italic text-cm-dim">0{{ index + 1 }}</span>
            </NuxtLink>
          </nav>
          <div class="cm-container flex flex-wrap items-center gap-2 pb-6">
            <a :href="contacts.academy.socialLinks.vk" target="_blank" rel="noopener noreferrer"
              aria-label="ВКонтакте"
              class="inline-flex h-11 w-11 items-center justify-center border border-cm-line text-cm-text">
              <IconVk class="h-[22px] w-[22px]" />
            </a>
            <a :href="contacts.academy.socialLinks.telegram" target="_blank" rel="noopener noreferrer"
              aria-label="Telegram"
              class="inline-flex h-11 w-11 items-center justify-center border border-cm-line text-cm-text">
              <IconTelegram class="h-5 w-5" />
            </a>
            <ClientOnly>
              <button type="button"
                class="inline-flex h-11 cursor-pointer items-center gap-2 border border-cm-line px-4 font-mono text-xs uppercase tracking-[0.12em] text-cm-text"
                @click="toggleColorMode">
                <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" class="h-4 w-4" />
                {{ colorMode.value === 'dark' ? 'Тёмная тема' : 'Светлая тема' }}
              </button>
            </ClientOnly>
            <a :href="`tel:${phoneHref}`" class="ml-auto font-mono text-sm font-bold tracking-[0.06em] text-cm-text">
              {{ contacts.academy.phone }}
            </a>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Модалка успешной отправки -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isSuccessModalOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          @click="closeSuccessModal">
          <div role="dialog" aria-modal="true" aria-labelledby="success-title"
            class="relative w-full max-w-md border border-cm-line border-t-4 border-t-cm-red bg-cm-surface p-8 text-center"
            @click.stop>
            <div class="mb-6 flex justify-center">
              <span class="cm-cut-lg inline-flex h-20 w-20 items-center justify-center bg-cm-red text-white">
                <UIcon name="i-lucide-check" class="h-10 w-10" />
              </span>
            </div>
            <h3 id="success-title" class="cm-display mb-3 text-5xl text-cm-text">Заявка принята</h3>
            <p class="mb-8 text-lg text-cm-muted">Мы свяжемся с тобой в ближайшее время</p>
            <button type="button" class="cm-btn cm-btn-red cm-cut w-full" @click="closeSuccessModal">
              Отлично
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const logo = '/images/logo.webp'
const isMenuOpen = ref(false)
const route = useRoute()

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/trainers', label: 'Тренеры' },
  { to: '/fights', label: 'Бои' },
  { to: '/schedule', label: 'Расписание' },
  { to: '/pricing', label: 'Цены' },
  { to: '/kids', label: 'Детям' }
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

// Используем глобальное состояние для модалки записи
const { isBookingModalOpen, closeBookingModal, selectedSession, clearBookingData } = useBooking()
const isBookingOpen = isBookingModalOpen

// Модалка успешной отправки
const isSuccessModalOpen = ref(false)

const { contacts } = useContacts()
const phoneHref = computed(() => contacts.value.academy.phone.replace(/[^\d+]/g, ''))

// Формируем описание модалки в зависимости от выбранной сессии
const modalDescription = computed(() => {
  if (selectedSession.value) {
    return `${selectedSession.value.discipline} • ${selectedSession.value.day}, ${selectedSession.value.time} • Тренер: ${selectedSession.value.trainer}`
  }
  return 'Заполни форму — мы свяжемся с тобой в ближайшее время.'
})

// Переключатель темы
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handleBookingSuccess() {
  closeBookingModal()

  setTimeout(() => {
    isSuccessModalOpen.value = true
  }, 300)

  setTimeout(() => {
    clearBookingData()
  }, 500)
}

function closeSuccessModal() {
  isSuccessModalOpen.value = false
}

function closeMenu() {
  isMenuOpen.value = false
}

// Закрываем меню при переходе
watch(() => route.path, closeMenu)

// Очищаем данные при закрытии модалки
watch(isBookingOpen, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      clearBookingData()
    }, 300)
  }
})
</script>

<style scoped>
.burger-icon {
  width: 22px;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.burger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

.burger-line-open-top {
  transform: translateY(7px) rotate(45deg);
}

.burger-line-open-middle {
  opacity: 0;
  transform: scaleX(0);
}

.burger-line-open-bottom {
  transform: translateY(-7px) rotate(-45deg);
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-item {
  animation: slideInFromLeft 0.4s ease-out both;
}
</style>
