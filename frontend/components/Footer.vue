<template>
  <footer class="overflow-hidden bg-cm-bg pt-16 text-cm-text sm:pt-20">
    <div class="cm-container">
      <div class="grid grid-cols-1 gap-10 border-b border-cm-line pb-12 sm:grid-cols-2 sm:pb-14 lg:grid-cols-4">
        <div class="flex flex-col gap-[18px]">
          <div class="flex items-center gap-3">
            <img :src="logo" alt="" class="cm-logo h-[52px] w-[52px] object-contain" loading="lazy" width="52"
              height="52" />
            <span class="font-display text-[30px] font-black uppercase leading-[0.95]">
              Camelot<br><span class="text-xl font-extrabold tracking-[0.08em] text-cm-muted">Sport Academy</span>
            </span>
          </div>
          <p class="m-0 text-sm leading-relaxed text-cm-muted">
            {{ contacts.academy.description }}
          </p>
          <div class="flex gap-2">
            <a :href="contacts.academy.socialLinks.vk" target="_blank" rel="noopener noreferrer"
              aria-label="ВКонтакте"
              class="inline-flex h-11 w-11 items-center justify-center border border-cm-line text-cm-text transition-colors hover:border-cm-red hover:text-cm-red-ink">
              <IconVk class="h-[22px] w-[22px]" />
            </a>
            <a :href="contacts.academy.socialLinks.telegram" target="_blank" rel="noopener noreferrer"
              aria-label="Telegram"
              class="inline-flex h-11 w-11 items-center justify-center border border-cm-line text-cm-text transition-colors hover:border-cm-red hover:text-cm-red-ink">
              <IconTelegram class="h-5 w-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Навигация в подвале" class="flex flex-col gap-3">
          <span class="cm-kicker mb-1.5 text-[11px]">Навигация</span>
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
            class="text-[15px] text-cm-soft transition-colors hover:text-cm-red-ink">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex flex-col gap-3">
          <span class="cm-kicker mb-1.5 text-[11px]">Направления</span>
          <NuxtLink v-for="item in directions" :key="item" to="/#directions"
            class="text-[15px] text-cm-soft transition-colors hover:text-cm-red-ink">
            {{ item }}
          </NuxtLink>
        </div>

        <div class="flex flex-col gap-4">
          <span class="cm-kicker text-[11px]">Контакты</span>
          <div>
            <div class="cm-label">Адрес</div>
            <div class="mt-1 text-[15px] leading-normal text-cm-soft">{{ contacts.academy.address }}</div>
          </div>
          <div>
            <div class="cm-label">Телефон</div>
            <a :href="`tel:${phoneHref}`"
              class="mt-1 block text-[15px] leading-normal text-cm-soft hover:text-cm-red-ink">
              {{ contacts.academy.phone }}
            </a>
          </div>
          <div>
            <div class="cm-label">Режим работы</div>
            <div class="mt-1 text-[15px] leading-normal text-cm-soft">
              {{ contacts.academy.workingHours.weekdays }}<br>{{ contacts.academy.workingHours.weekend }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-x-7 gap-y-3 py-5 text-[13px] text-cm-dim">
        <span>© {{ year }} Camelot Sport Academy. Все права защищены.</span>
        <NuxtLink to="/privacy-policy" class="text-cm-dim hover:text-cm-red-ink">Политика конфиденциальности</NuxtLink>
        <NuxtLink to="/terms-of-service" class="text-cm-dim hover:text-cm-red-ink">Пользовательское соглашение</NuxtLink>
      </div>
    </div>

    <div aria-hidden="true"
      class="cm-display cm-ghost-text -mb-4 whitespace-nowrap text-center text-[clamp(120px,24vw,360px)] leading-[0.74]">
      Camelot
    </div>
  </footer>
</template>

<script setup lang="ts">
const logo = '/images/logo.webp'
const year = new Date().getFullYear()

// Данные встроены в билд — доступны сразу
const { contacts } = useContacts()
const phoneHref = computed(() => contacts.value.academy.phone.replace(/[^\d+]/g, ''))

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/trainers', label: 'Тренеры' },
  { to: '/fights', label: 'Бои' },
  { to: '/schedule', label: 'Расписание' },
  { to: '/pricing', label: 'Цены' },
  { to: '/kids', label: 'Детям' }
]

const directions = ['Бокс', 'Кикбоксинг', 'ММА', 'Грэпплинг', 'Панкратион', 'БЖЖ']
</script>
