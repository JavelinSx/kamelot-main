<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 overflow-hidden">
    <UContainer class="py-4 relative">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <ClientOnly>
            <div v-motion-fade-visible-once :delay="0">
              <img :src="logo" alt="Kamelot" class="h-10 w-auto" />
            </div>
            <span v-motion-fade-visible-once :delay="100" class="text-xl font-bold text-white">KAMELOT</span>
            <template #fallback>
              <img :src="logo" alt="Kamelot" class="h-10 w-auto" />
              <span class="text-xl font-bold text-white">KAMELOT</span>
            </template>
          </ClientOnly>
        </div>

        <nav class="hidden lg:flex items-center gap-8 ">
          <ULink to="/" class="nav-link">
            Главная
          </ULink>
          <a href="/#trainers" class="nav-link" @click.prevent="scrollToTrainers">
            Тренеры
          </a>
          <ULink to="/schedule" class="nav-link">
            Расписание
          </ULink>
          <ULink to="/kids" class="nav-link">
            Детям
          </ULink>
          <ULink to="/blog" class="nav-link">
            Блог
          </ULink>
        </nav>

        <div class="flex items-center gap-4 ">
          <!-- Переключатель темы -->
          <ClientOnly>
            <UButton :icon="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              color="neutral" variant="ghost" aria-label="Переключить тему" @click="toggleColorMode"
              class="hidden lg:flex items-center justify-center text-white hover:text-red-500 transition-colors" />
          </ClientOnly>

          <UModal v-model:open="isBookingOpen" title="Запись на тренировку"
            description="Заполните форму для записи на тренировку. Мы свяжемся с вами в ближайшее время." :ui="{
              overlay: 'fixed inset-0 bg-elevated/75',
              content: 'fixed bg-default divide-y divide-default flex flex-col focus:outline-none min-w-[650]px',
              title: 'text-highlighted font-semibold pr-8',
              description: 'mt-1 text-muted text-sm pr-8',
              body: 'p-0',
              header: 'px-4 pt-4 pb-2 min-h-36',
              close: 'absolute top-2 end-2'
            }">
            <UButton color="error"
              class="relative text-white font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 border-0"
              size="lg">
              <span class="relative z-10 flex items-center gap-2">
                <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
                Записаться
              </span>
            </UButton>

            <template #body>
              <BookingForm @booking-success="handleBookingSuccess" />
            </template>
          </UModal>

          <UButton variant="ghost" icon="i-heroicons-bars-3" class="lg:hidden text-white"
            @click="isMenuOpen = !isMenuOpen" />
        </div>
      </div>

      <div v-show="isMenuOpen" class="lg:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
        <nav class="flex flex-col gap-4">
          <ULink to="/" class="text-white hover:text-red-500 transition-colors">
            Главная
          </ULink>
          <a href="/#trainers" class="text-white hover:text-red-500 transition-colors "
            @click.prevent="scrollToTrainers">
            Тренеры
          </a>
          <ULink to="/schedule" class="text-white hover:text-red-500 transition-colors">
            Расписание
          </ULink>
          <ULink to="/kids" class="text-white hover:text-red-500 transition-colors">
            Детям
          </ULink>
          <ULink to="/blog" class="text-white hover:text-red-500 transition-colors">
            Блог
          </ULink>

          <!-- Переключатель темы для мобильного меню -->
          <ClientOnly>
            <button @click="toggleColorMode"
              class="flex items-center gap-2 text-white hover:text-red-500 transition-colors">
              <UIcon :name="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                class="w-5 h-5" />
              <span>{{ colorMode.value === 'dark' ? 'Темная тема' : 'Светлая тема' }}</span>
            </button>
          </ClientOnly>
        </nav>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const logo = '/images/logo.png';
const isMenuOpen = ref(false)
const isBookingOpen = ref(false)

// Переключатель темы
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handleBookingSuccess() {
  isBookingOpen.value = false
}

// Слушаем событие открытия модалки бронирования
onMounted(() => {
  window.addEventListener('openBookingModal', () => {
    isBookingOpen.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('openBookingModal', () => {
    isBookingOpen.value = true
  })
})

function smoothScrollTo(targetPosition: number, duration: number = 1000) {
  const startPosition = window.scrollY
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    // Easing function (ease-in-out)
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    window.scrollTo(0, startPosition + distance * ease)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

function scrollToTrainers() {
  isMenuOpen.value = false

  const route = useRoute()

  // Если мы не на главной странице, сначала переходим на неё
  if (route.path !== '/') {
    navigateTo('/')
    // Ждём загрузки страницы и потом скроллим
    setTimeout(() => {
      const element = document.getElementById('trainers')
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY
        smoothScrollTo(top, 1000)
      }
    }, 500)
  } else {
    // Если уже на главной, просто скроллим
    const element = document.getElementById('trainers')
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY
      smoothScrollTo(top, 1000)
    }
  }
}
</script>

<style scoped>
.nav-link {
  color: white;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ef4444;
}
</style>