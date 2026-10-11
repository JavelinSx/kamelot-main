<template>
  <div aria-hidden="true" class="relative h-[120px] overflow-hidden sm:h-[190px]">
    <div class="absolute -inset-x-[6%] top-[34px] z-[2] -rotate-[2.5deg] overflow-hidden bg-cm-red py-2.5 sm:top-[50px] sm:py-3">
      <div class="cm-marquee-track cm-display text-[32px] leading-none text-[#0a0a0b] sm:text-[46px]">
        <span v-for="n in 2" :key="n" class="pr-7">{{ disciplinesLine }}</span>
      </div>
    </div>
    <div class="absolute -inset-x-[6%] top-[58px] z-[1] hidden rotate-[2deg] overflow-hidden bg-cm-inv py-2.5 sm:top-[72px] sm:block">
      <div class="cm-marquee-track cm-marquee-track-rev font-mono text-lg font-bold leading-[1.4] tracking-[0.14em] text-cm-on-inv">
        <span v-for="n in 2" :key="n" class="pr-7">{{ mottoLine }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const disciplines = ['ММА', 'Бокс', 'Кикбоксинг', 'Грэпплинг', 'БЖЖ', 'Панкратион']
const disciplinesLine = Array(3).fill(disciplines.join(' / ') + ' /').join(' ')
const mottoLine = Array(4).fill('ТРЕНИРУЙСЯ С ЛУЧШИМИ — СТАНОВИСЬ ЧЕМПИОНОМ —').join(' ')
</script>
