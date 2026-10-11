<template>
  <div class="min-h-screen pt-20">
    <PageHead kicker="// Анонсы боёв" ghost="VS"
      description="Следи за предстоящими боями и результатами турниров бойцов Camelot Sport Academy.">
      Ночь <span class="text-cm-red-title">боя</span>
    </PageHead>

    <section class="cm-container flex flex-col gap-6 pb-24 pt-10">
      <!-- Фильтры -->
      <div role="tablist" aria-label="Фильтр боёв" class="flex flex-wrap gap-1.5">
        <button v-for="filter in filters" :key="filter.value" type="button" role="tab"
          :aria-selected="activeFilter === filter.value"
          class="h-12 cursor-pointer border px-5 font-display text-[21px] font-black uppercase tracking-[0.06em] transition-colors"
          :class="activeFilter === filter.value
            ? 'border-cm-red bg-cm-red text-white'
            : 'border-cm-line bg-cm-surface text-cm-text hover:border-cm-line-2'"
          @click="activeFilter = filter.value">
          {{ filter.label }}
        </button>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <span class="h-14 w-14 animate-spin rounded-full border-2 border-cm-red border-b-transparent" />
      </div>

      <!-- Список боёв -->
      <div v-else-if="filteredFights.length > 0" class="flex flex-col gap-3">
        <FightCard v-for="fight in filteredFights" :key="fight.id" :fight="fight" />
      </div>

      <!-- Пусто -->
      <div v-else class="flex flex-col items-start gap-2.5 border border-dashed border-cm-line-2 px-7 py-14 sm:px-8">
        <span class="cm-display text-[44px] sm:text-[48px]">Нет боёв</span>
        <span class="text-[15px] text-cm-muted">{{ emptyMessage }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Fight } from '~/composables/useFights'

useSeoMeta({
  title: 'Анонсы боёв - Camelot Sport Academy',
  description: 'Следите за предстоящими боями, турнирами и результатами в Camelot Sport Academy. Профессиональные бои по ММА, боксу и кикбоксингу.',
  ogTitle: 'Анонсы боёв - Camelot Sport Academy',
  ogDescription: 'Расписание предстоящих боёв и турниров в лучшем клубе боевых искусств',
  ogImage: '/og-fights.jpg'
})

const { loadFights } = useFights()

// Состояние
const fights = ref<Fight[]>([])
const loading = ref(true)
const activeFilter = ref<'all' | 'upcoming' | 'completed'>('all')

// Фильтры
const filters: Array<{ label: string; value: 'all' | 'upcoming' | 'completed' }> = [
  { label: 'Все бои', value: 'all' },
  { label: 'Предстоящие', value: 'upcoming' },
  { label: 'Завершённые', value: 'completed' },
]

// Отфильтрованные бои
const filteredFights = computed(() => {
  const now = new Date()

  if (activeFilter.value === 'all') {
    return fights.value
  }

  if (activeFilter.value === 'upcoming') {
    return fights.value.filter(fight =>
      fight.status === 'upcoming' && new Date(fight.date) > now
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  if (activeFilter.value === 'completed') {
    return fights.value.filter(fight =>
      fight.status === 'completed' || (fight.status === 'upcoming' && new Date(fight.date) <= now)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return fights.value.filter(fight => fight.status === activeFilter.value)
})

// Сообщение о пустом списке
const emptyMessage = computed(() => {
  const messages = {
    all: 'На данный момент нет анонсов боёв',
    upcoming: 'Нет предстоящих боёв. Следи за обновлениями в ВК и Telegram!',
    completed: 'Нет завершённых боёв',
  }
  return messages[activeFilter.value]
})

// Загрузка данных
onMounted(async () => {
  try {
    fights.value = await loadFights()
  } catch (error) {
    // Silent error
  } finally {
    loading.value = false
  }
})
</script>
