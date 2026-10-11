<template>
  <section class="border-y border-cm-line" aria-label="Клуб в цифрах">
    <div class="mx-auto grid max-w-[1376px] grid-cols-2 lg:grid-cols-4">
      <div v-for="(stat, index) in stats" :key="stat.label"
        class="flex flex-col gap-1.5 border-cm-line px-4 py-6 sm:px-8 sm:py-8"
        :class="[index % 2 === 0 ? 'border-r' : '', index < 2 ? 'border-b lg:border-b-0' : '', index === 1 ? 'lg:border-r' : '']">
        <span class="cm-display text-[60px] leading-[0.85] sm:text-[88px]">
          {{ stat.value }}<span class="text-cm-red-title">{{ stat.suffix }}</span>
        </span>
        <span class="font-mono text-[10px] uppercase tracking-[0.16em] text-cm-muted sm:text-xs">{{ stat.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { fighters } = useFighters()

const stats = computed(() => [
  { value: '200', suffix: '+', label: 'Учеников в зале' },
  { value: '50', suffix: '+', label: 'Призёров турниров' },
  { value: String(fighters.value.length), suffix: '', label: 'Чемпионов из клуба' },
  { value: '8', suffix: '+', label: 'Лет опыта' }
])
</script>
