<template>
  <section class="relative h-screen flex items-center justify-center overflow-hidden mt-20">
    <video v-if="props.videoSrc" autoplay muted loop playsinline preload="metadata"
      class="absolute inset-0 w-full h-full object-cover  scale-110 ">
      <source :src="props.videoSrc" type="video/mp4" />
    </video>

    <!-- Фоновый градиент если нет видео -->
    <div v-else
      class="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-black dark:from-gray-950 dark:via-red-950 dark:to-black" />

    <!-- Градиенты по бокам -->
    <div v-if="props.videoSrc" class="absolute inset-0">
      <!-- Градиент для скрытия watermark - правая сторона -->
      <ClientOnly :key="`gradient-right-${colorMode.value}`">
        <div class="absolute top-0 right-0 w-0 md:w-0 lg:w-0 xl:w-[350px] 2xl:w-[500px] h-full pointer-events-none"
          :style="{
            background: `linear-gradient(to left, ${colorMode.value === 'dark' ? 'black' : 'white'} 0%, ${colorMode.value === 'dark' ? 'black' : 'white'} 20%, transparent 100%)`
          }">
        </div>
      </ClientOnly>

      <!-- Градиент для скрытия watermark - левая сторона -->
      <ClientOnly :key="`gradient-left-${colorMode.value}`">
        <div class="absolute top-0 left-0 w-0 md:w-0 lg:w-0 xl:w-[350px] 2xl:w-[500px] h-full pointer-events-none"
          :style="{
            background: `linear-gradient(to right, ${colorMode.value === 'dark' ? 'black' : 'white'} 0%, ${colorMode.value === 'dark' ? 'black' : 'white'} 60%, transparent 100%)`
          }">
        </div>
      </ClientOnly>
    </div>

    <!-- Дополнительное затемнение для читаемости текста -->
    <div class="absolute inset-0 bg-black/20" />

    <!-- Контент поверх всего -->
    <div class="absolute inset-0 flex items-center justify-center z-20">
      <div class="text-center text-white max-w-4xl mx-auto px-4">
        <h1 class="font-bold mb-6 leading-tight">
          <span class="inline-block text-red-500 text-6xl lg:text-7xl hero-title-line1">CAMELOT</span><br>
          <span class="inline-block text-white text-6xl lg:text-7xl hero-title-line2">SPORT ACADEMY</span>
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
  logoSrc: '/images/logo.webp'
})

const colorMode = useColorMode()
</script>