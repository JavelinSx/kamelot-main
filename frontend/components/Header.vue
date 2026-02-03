<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 overflow-hidden">
    <UContainer class="py-4 relative">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">

          <div v-motion-fade-visible-once :delay="0">
            <ULink to="/" class="nav-link hover:cursor-pointer flex flex-row justify-center items-center gap-2">
              <img :src="logo" alt="Kamelot" class="h-8 lg:h-10 w-auto" />
              <span v-motion-fade-visible-once :delay="100" class="text-lg lg:text-xl font-bold center text-white">CAMELOT</span>
            </ULink>
          </div>


        </div>

        <nav class="hidden lg:flex items-center gap-8 ">
          <ULink to="/" class="nav-link">
            Главная
          </ULink>
          <a href="/#trainers" class="nav-link" @click.prevent="scrollToTrainers">
            Тренеры
          </a>
          <ULink to="/fights" class="nav-link">
            Бои
          </ULink>
          <ULink to="/schedule" class="nav-link">
            Расписание
          </ULink>
          <ULink to="/pricing" class="nav-link">
            Цены
          </ULink>
          <ULink to="/kids" class="nav-link">
            Детям
          </ULink>
          <!-- <ULink to="/blog" class="nav-link">
            Блог
          </ULink> -->
        </nav>

        <div class="flex items-center gap-2 lg:gap-4">
          <!-- Социальные сети -->
          <div class="flex items-center gap-1">
            <UButton
              icon="i-simple-icons-vk"
              color="neutral"
              variant="ghost"
              size="md"
              aria-label="ВКонтакте"
              @click="openSocialLink('vk')"
              class="text-blue-500 hover:text-blue-600 transition-colors [&_svg]:!w-5 [&_svg]:!h-5" />
            <UButton
              icon="i-simple-icons-telegram"
              color="neutral"
              variant="ghost"
              size="md"
              aria-label="Telegram"
              @click="openSocialLink('telegram')"
              class="text-sky-500 hover:text-sky-600 transition-colors [&_svg]:!w-5 [&_svg]:!h-5" />
          </div>

          <!-- Переключатель темы -->
          <ClientOnly>
            <UButton :icon="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              color="neutral" variant="ghost" aria-label="Переключить тему" @click="toggleColorMode"
              class="hidden lg:flex items-center justify-center text-white hover:text-red-500 transition-colors" />
          </ClientOnly>

          <UModal v-model:open="isBookingOpen" title="Запись на тренировку"
            :description="modalDescription" :ui="{
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
              :size="isMobile ? 'md' : 'lg'">
              <span class="relative z-10 flex items-center gap-1 lg:gap-2">
                <UIcon name="i-heroicons-calendar-days" class="hidden lg:block w-5 h-5" />
                <span class="hidden sm:inline">Записаться</span>
                <span class="sm:hidden">Запись</span>
              </span>
            </UButton>

            <template #body>
              <BookingForm @booking-success="handleBookingSuccess" />
            </template>
          </UModal>

          <!-- Анимированная кнопка бургера -->
          <button class="lg:hidden p-2 text-white hover:text-red-500 transition-colors focus:outline-none"
            @click="isMenuOpen = !isMenuOpen" aria-label="Меню">
            <div class="burger-icon">
              <span class="burger-line" :class="{ 'burger-line-open-top': isMenuOpen }"></span>
              <span class="burger-line" :class="{ 'burger-line-open-middle': isMenuOpen }"></span>
              <span class="burger-line" :class="{ 'burger-line-open-bottom': isMenuOpen }"></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Мобильное меню с анимацией -->
      <Transition enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0" leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4">
        <div v-if="isMenuOpen" class="lg:hidden mt-4 pb-4 border-t border-gray-700 pt-4 overflow-hidden">
          <nav class="flex flex-col gap-4">
            <ULink to="/"
              class="menu-item text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
              :style="{ animationDelay: '0ms' }" @click="closeMenu">
              Главная
            </ULink>
            <a href="/#trainers"
              class="menu-item text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
              :style="{ animationDelay: '50ms' }" @click.prevent="scrollToTrainers">
              Тренеры
            </a>
            <ULink to="/fights"
              class="menu-item text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
              :style="{ animationDelay: '100ms' }" @click="closeMenu">
              Бои
            </ULink>
            <ULink to="/schedule"
              class="menu-item text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
              :style="{ animationDelay: '150ms' }" @click="closeMenu">
              Расписание
            </ULink>
            <ULink to="/pricing"
              class="menu-item text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
              :style="{ animationDelay: '200ms' }" @click="closeMenu">
              Цены
            </ULink>
            <ULink to="/kids"
              class="menu-item text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
              :style="{ animationDelay: '250ms' }" @click="closeMenu">
              Детям
            </ULink>
            <!-- <ULink
              to="/blog"
              class="menu-item text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
              :style="{ animationDelay: '250ms' }"
              @click="closeMenu">
              Блог
            </ULink> -->

            <!-- Переключатель темы для мобильного меню -->
            <ClientOnly>
              <button @click="toggleColorMode"
                class="menu-item flex items-center gap-2 text-white hover:text-red-500 transition-all duration-300 hover:translate-x-2"
                :style="{ animationDelay: '300ms' }">
                <UIcon :name="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                  class="w-5 h-5" />
                <span>{{ colorMode.value === 'dark' ? 'Темная тема' : 'Светлая тема' }}</span>
              </button>
            </ClientOnly>
          </nav>
        </div>
      </Transition>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const logo = '/images/logo.webp';
const isMenuOpen = ref(false)

// Используем глобальное состояние для модалки записи
const { isBookingModalOpen, closeBookingModal, selectedSession, clearBookingData } = useBooking()
const isBookingOpen = isBookingModalOpen

// Contacts data for social links
const { contacts } = useContacts()

// Mobile detection
const isMobile = ref(false)

onMounted(() => {
  // Check if mobile on mount
  isMobile.value = window.innerWidth < 1024

  // Update on resize
  const handleResize = () => {
    isMobile.value = window.innerWidth < 1024
  }
  window.addEventListener('resize', handleResize)

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

// Open social media links
function openSocialLink(platform: 'vk' | 'telegram') {
  if (!contacts.value) return

  const url = contacts.value.academy.socialLinks[platform]
  if (url) {
    window.open(url, '_blank')
  }
}

// Формируем описание модалки в зависимости от выбранной сессии
const modalDescription = computed(() => {
  if (selectedSession.value) {
    return `${selectedSession.value.discipline} • ${selectedSession.value.day}, ${selectedSession.value.time} • Тренер: ${selectedSession.value.trainer}`
  }
  return 'Заполните форму для записи на тренировку. Мы свяжемся с вами в ближайшее время.'
})

// Переключатель темы
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handleBookingSuccess() {
  closeBookingModal()

  // Показываем уведомление
  const toast = useToast()
  toast.add({
    title: 'Заявка отправлена!',
    description: 'Мы свяжемся с вами в ближайшее время',
    icon: 'i-heroicons-check-circle',
    color: 'success'
  })

  // Очищаем данные после небольшой задержки
  setTimeout(() => {
    clearBookingData()
  }, 500)
}

function closeMenu() {
  isMenuOpen.value = false
}

// Очищаем данные при закрытии модалки
watch(isBookingOpen, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      clearBookingData()
    }, 300)
  }
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

/* Анимация бургер-иконки */
.burger-icon {
  width: 24px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.burger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

/* Верхняя линия - поворот в верхнюю часть X */
.burger-line-open-top {
  transform: translateY(9px) rotate(45deg);
}

/* Средняя линия - исчезает */
.burger-line-open-middle {
  opacity: 0;
  transform: scaleX(0);
}

/* Нижняя линия - поворот в нижнюю часть X */
.burger-line-open-bottom {
  transform: translateY(-9px) rotate(-45deg);
}

/* Анимация появления пунктов меню */
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
  animation: slideInFromLeft 0.4s ease-out forwards;
  opacity: 0;
}

/* Эффект при hover - дополнительное свечение */
.menu-item:hover {
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}
</style>