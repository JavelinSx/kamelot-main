<template>
  <div class="flex flex-wrap items-end justify-between gap-6 border-b border-cm-line pb-7">
    <div class="flex flex-col gap-3.5">
      <span v-if="kicker" class="cm-kicker">{{ kicker }}</span>
      <component :is="as" class="cm-h2 m-0 text-cm-text">
        <slot />
      </component>
    </div>
    <p v-if="description" class="m-0 max-w-[420px] text-[17px] leading-relaxed text-cm-muted">
      {{ description }}
    </p>
    <slot name="aside" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  kicker?: string
  description?: string
  as?: 'h1' | 'h2'
}>(), {
  as: 'h2'
})
</script>
