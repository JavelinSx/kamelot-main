<template>
  <section class="cm-hatch bg-cm-red text-white">
    <div class="cm-container flex flex-wrap items-end justify-between gap-10 py-16 sm:py-24">
      <div class="flex min-w-0 flex-[1_1_560px] flex-col gap-5">
        <span class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0a0a0b]">{{ kicker }}</span>
        <h2 class="cm-display m-0 text-[clamp(60px,9vw,150px)] leading-[0.82] text-[#0a0a0b]">
          <slot />
        </h2>
        <p v-if="description" class="m-0 max-w-[520px] text-lg leading-relaxed text-white">{{ description }}</p>
      </div>
      <div class="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[320px]">
        <button type="button"
          class="cm-btn cm-cut-lg h-[68px] justify-between bg-[#0a0a0b] px-7 text-[28px] text-white hover:bg-white hover:text-[#0a0a0b]"
          @click="openBooking">
          {{ buttonText }}
          <UIcon name="i-lucide-arrow-right" class="h-[22px] w-[22px]" />
        </button>
        <a :href="`tel:${phoneHref}`"
          class="inline-flex h-14 items-center justify-center border-[1.5px] border-[#0a0a0b] font-mono text-base font-bold tracking-[0.08em] text-[#0a0a0b] transition-colors hover:bg-[#0a0a0b] hover:text-white">
          {{ contacts.academy.phone }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  kicker?: string
  description?: string
  buttonText?: string
}>(), {
  kicker: '// Пробное занятие',
  buttonText: 'Записаться'
})

const { contacts } = useContacts()
const phoneHref = computed(() => contacts.value.academy.phone.replace(/[^\d+]/g, ''))

const openBooking = () => {
  window.dispatchEvent(new CustomEvent('openBookingModal'))
}
</script>
