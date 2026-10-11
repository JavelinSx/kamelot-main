<template>
  <div class="flex min-h-screen flex-col bg-cm-bg text-cm-text">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />

    <!-- Мобильная панель записи -->
    <Transition name="slide-up">
      <div v-if="showScrollTop"
        class="fixed inset-x-3 bottom-3 z-40 flex gap-2 border border-cm-line bg-cm-header p-2 shadow-[0_12px_30px_rgba(0,0,0,0.5)] backdrop-blur-md lg:hidden">
        <button type="button" class="cm-btn cm-btn-red h-12 flex-1 px-4 text-[21px]" @click="openBooking">
          Пробная — 0 ₽
        </button>
        <a :href="`tel:${phoneHref}`" aria-label="Позвонить"
          class="inline-flex h-12 w-12 items-center justify-center border border-cm-line-2 text-cm-text">
          <UIcon name="i-lucide-phone" class="h-5 w-5" />
        </a>
        <a :href="contacts.academy.socialLinks.telegram" target="_blank" rel="noopener noreferrer"
          aria-label="Telegram" class="inline-flex h-12 w-12 items-center justify-center border border-cm-line-2 text-cm-text">
          <IconTelegram class="h-5 w-5" />
        </a>
      </div>
    </Transition>

    <!-- Кнопка «Наверх» -->
    <Transition name="fade">
      <button v-if="showScrollTop" type="button" aria-label="Наверх"
        class="cm-cut fixed bottom-24 right-4 z-40 flex h-12 w-12 cursor-pointer items-center justify-center bg-cm-red text-white shadow-2xl transition-colors hover:bg-cm-red-hover lg:bottom-10 lg:right-8 lg:h-14 lg:w-14"
        @click="scrollToTop">
        <UIcon name="i-lucide-arrow-up" class="h-6 w-6" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const showScrollTop = ref(false)

const { contacts } = useContacts()
const phoneHref = computed(() => contacts.value.academy.phone.replace(/[^\d+]/g, ''))

const openBooking = () => {
  window.dispatchEvent(new CustomEvent('openBookingModal'))
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

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

const scrollToTop = () => {
  smoothScrollTo(0, 800)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(120%);
  opacity: 0;
}
</style>
