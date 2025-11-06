<template>
  <div class="min-h-screen flex flex-col scroll-smooth">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />

    <!-- Фиксированная кнопка "Наверх" -->
    <Transition name="fade">
      <div v-if="showScrollTop" class="fixed bottom-12 right-8 z-[9999]">
        <UButton @click="scrollToTop" color="error" size="lg" icon="i-heroicons-arrow-up"
          class="cursor-pointer shadow-2xl rounded-full w-14 h-14 p-0 justify-center items-center" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const showScrollTop = ref(false)

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
  window.addEventListener('scroll', handleScroll)
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
</style>