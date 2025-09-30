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
import { useGallery } from '~/shared/composables/useGallery'
useSeoMeta({
  title: 'Kamelot Fight Club - Клуб боевых искусств',
  description: 'Профессиональный клуб боевых искусств в Москве. Бокс, кикбоксинг, ММА, муай тай, джиу-джитсу, каратэ. Тренировки для всех уровней подготовки.',
  ogTitle: 'Kamelot Fight Club - Клуб боевых искусств',
  ogDescription: 'Тренируйся с профессионалами. Развивай силу, дисциплину и характер в лучшем клубе боевых искусств города.',
  ogImage: '/og-image.jpg'
})
const { loadGalleryImages } = useGallery()
const imageGallery = ref<string[]>([])
onMounted(async () => {
  try {
    const images = await loadGalleryImages()
    imageGallery.value = Array.isArray(images) ? images.filter(img => typeof img === 'string') : []
  } catch (error) {
    console.error('Error loading images:', error)
    imageGallery.value = []
  }
})
</script>