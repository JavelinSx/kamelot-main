<template>
  <section class="relative overflow-hidden border-b border-cm-line">
    <div v-if="ghost" aria-hidden="true"
      class="cm-ghost-text pointer-events-none absolute -right-6 -top-10 select-none font-mono text-[160px] font-bold leading-none tracking-[-0.04em] sm:text-[300px]">
      {{ ghost }}
    </div>
    <div class="cm-container relative flex flex-col gap-[18px] pb-12 pt-14 sm:pb-14 sm:pt-[72px]">
      <span class="cm-kicker">{{ kicker }}</span>
      <h1 class="cm-h1 m-0 text-cm-text">
        <slot />
      </h1>
      <p v-if="description" class="m-0 max-w-[620px] text-lg leading-relaxed text-cm-muted">{{ description }}</p>
      <slot name="meta" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  kicker: string
  description?: string
  ghost?: string
}>()
</script>
