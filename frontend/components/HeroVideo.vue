<template>
  <section class="relative h-screen flex items-center justify-center overflow-hidden mt-20">
    <video v-if="videoSrc" autoplay muted loop playsinline
      class="absolute inset-0 w-full h-full object-cover  scale-110 ">
      <source :src="videoSrc" type="video/mp4" />
    </video>

    <!-- Фоновый градиент если нет видео -->
    <div v-else class="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-black" />

    <!-- Стеклянный эффект по бокам -->
    <div v-if="videoSrc" class="absolute inset-0">
      <!-- Левая сторона -->
      <div
        class="absolute left-0 top-0 w-1/10 lg:w-1/4 h-full bg-gradient-to-r from-black/60 to-transparent backdrop-blur-sm">
      </div>
      <!-- Правая сторона -->
      <div
        class="absolute right-0 top-0 w-1/10 lg:w-1/4 h-full bg-gradient-to-l from-black/60 to-transparent backdrop-blur-sm">
      </div>
    </div>

    <!-- Дополнительное затемнение для читаемости текста -->
    <div class="absolute inset-0 bg-black/20" />

    <!-- Контент поверх всего -->
    <div class="absolute inset-0 flex items-center justify-center z-20">
      <div class="text-center text-white max-w-4xl mx-auto px-4">
        <h1 class="font-bold mb-6 leading-tight">
          <span data-aos="fade-down" data-aos-duration="300" data-aos-easing="ease-out-back"
            class="inline-block text-red-500 text-6xl lg:text-7xl">KAMELOT</span><br>
          <span data-aos="fade-up" data-aos-duration="300" data-aos-delay="200" data-aos-easing="ease-out-back"
            class="inline-block text-white text-6xl lg:text-7xl">FIGHT CLUB</span>
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  videoSrc?: string
  logoSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  videoSrc: '/video/header-video.mp4',
  logoSrc: '/images/logo.jpg'
})
</script>