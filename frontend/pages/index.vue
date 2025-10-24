<template>
  <div class="-mt-20">
    <HeroVideo />
    <MartialArtsCards />
    <TrainersCards />
    <FightersCards />
    <Gallery :images="imageGallery" />
  </div>
</template>

<script setup lang="ts">
import Gallery from '~/components/Gallery.vue'
import { useGallery } from '~/composables/useGallery'

useSeoMeta({
  title: 'Kamelot Fight Club - Клуб боевых искусств',
  description: 'Профессиональный клуб боевых искусств в Москве. Бокс, кикбоксинг, ММА, муай тай, джиу-джитсу, каратэ. Тренировки для всех уровней подготовки.',
  ogTitle: 'Kamelot Fight Club - Клуб боевых искусств',
  ogDescription: 'Тренируйся с профессионалами. Развивай силу, дисциплину и характер в лучшем клубе боевых искусств города.',
  ogImage: '/og-image.jpg'
})

// Загружаем изображения галереи только на клиенте
const imageGallery = ref<string[]>([])

onMounted(() => {
  const { loadGalleryImages } = useGallery()
  const images = loadGalleryImages()
  imageGallery.value = Array.isArray(images) ? images.filter(img => typeof img === 'string') : []
})
</script>