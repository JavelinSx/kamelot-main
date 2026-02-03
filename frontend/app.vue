<template>
  <div>
    <NuxtLayout>
      <NuxtPage :transition="{
        name: 'page',
        mode: 'out-in'
      }" />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Подключаем useBooking для управления модалкой
const { openBookingModal } = useBooking()

// Яндекс.Метрика
useHead({
  script: [
    {
      innerHTML: `
(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106614140', 'ym');

    ym(106614140, 'init', {ssr:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `,
      type: 'text/javascript',
      tagPosition: 'bodyClose'
    }
  ],
  noscript: [
    {
      innerHTML: '<div><img src="https://mc.yandex.ru/watch/106614140" style="position:absolute; left:-9999px;" alt="" /></div>',
      tagPosition: 'bodyClose'
    }
  ]
})

// Принудительно устанавливаем smooth scroll через JS
onMounted(() => {
  if (typeof window !== 'undefined') {
    document.documentElement.style.scrollBehavior = 'smooth'
    document.body.style.scrollBehavior = 'smooth'

    // Слушаем событие openBookingModal для открытия формы записи
    const handleOpenBookingModal = () => {
      openBookingModal()
    }
    window.addEventListener('openBookingModal', handleOpenBookingModal)

    // Очищаем listener при unmount
    onUnmounted(() => {
      window.removeEventListener('openBookingModal', handleOpenBookingModal)
    })
  }
})
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>