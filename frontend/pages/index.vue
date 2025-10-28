<template>
  <div class="-mt-20">
    <HeroVideo />
    <MartialArtsCards />
    <TrainersCards />
    <FightersCards />
    <Gallery
      :images="photos"
      :can-load-more="hasMore"
      :loading-more="loading"
      @load-more="handleLoadMore"
    />
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

// Инициализируем галерею с пагинацией
const { useGalleryPagination } = useGallery()
const { photos, hasMore, loading, initialize, loadMore } = useGalleryPagination()

// Обработчик кнопки "Показать еще"
const handleLoadMore = () => {
  loadMore()
}

// Загружаем первую порцию фотографий при монтировании
onMounted(() => {
  initialize()
})
</script>