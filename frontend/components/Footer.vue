<template>
  <footer class="bg-gray-900 text-white pt-16 pb-8">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-6">
            <img :src="logo" alt="Kamelot" class="h-12 w-auto" />
            <span class="text-2xl font-bold">KAMELOT</span>
          </div>

          <p class="text-gray-400 mb-6 leading-relaxed">
            Профессиональный клуб боевых искусств. Тренируйся с лучшими,
            становись чемпионом.
          </p>

          <div class="flex gap-4">
            <UButton icon="i-simple-icons-vk" color="neutral" variant="ghost" size="sm" class="hover:text-blue-400"
              @click="openSocialLink('vk')" />

            <UButton icon="i-simple-icons-telegram" color="neutral" variant="ghost" size="sm"
              class="hover:text-blue-400" @click="openSocialLink('telegram')" />

            <UButton icon="i-simple-icons-instagram" color="neutral" variant="ghost" size="sm"
              class="hover:text-pink-400" @click="openSocialLink('instagram')" />

            <UButton icon="i-simple-icons-youtube" color="neutral" variant="ghost" size="sm" class="hover:text-red-400"
              @click="openSocialLink('youtube')" />
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-6">Навигация</h3>
          <ul class="space-y-3">
            <li>
              <ULink to="/" class="text-gray-400 hover:text-white transition-colors">
                Главная
              </ULink>
            </li>
            <li>
              <ULink to="/trainers" class="text-gray-400 hover:text-white transition-colors">
                Тренеры
              </ULink>
            </li>
            <li>
              <ULink to="/schedule" class="text-gray-400 hover:text-white transition-colors">
                Расписание
              </ULink>
            </li>
            <li>
              <ULink to="/blog" class="text-gray-400 hover:text-white transition-colors">
                Блог
              </ULink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-6">Направления</h3>
          <ul class="space-y-3">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Бокс
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Кикбоксинг
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                ММА
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Грэпплинг
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Панкратион
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                БЖЖ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-6">Контакты</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-map-pin" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-white font-medium">Адрес</p>
                <p class="text-gray-400 text-sm">
                  г. Москва, ул. Спортивная, 15
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-phone" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-white font-medium">Телефон</p>
                <a href="tel:+79001234567" class="text-gray-400 text-sm hover:text-white transition-colors">
                  +7 (900) 123-45-67
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-envelope" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-white font-medium">Email</p>
                <a href="mailto:info@kamelot-club.ru" class="text-gray-400 text-sm hover:text-white transition-colors">
                  info@kamelot-club.ru
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-clock" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-white font-medium">Режим работы</p>
                <p class="text-gray-400 text-sm">Пн-Пт: 7:00-23:00</p>
                <p class="text-gray-400 text-sm">Сб-Вс: 9:00-21:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
            <span>© 2024 Kamelot Fight Club. Все права защищены.</span>
            <div class="flex gap-4">
              <a href="#" class="hover:text-white transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" class="hover:text-white transition-colors">
                Пользовательское соглашение
              </a>
            </div>
          </div>

        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const logo = '/images/logo.jpg';
const openSocialLink = (platform: string) => {
  const links = {
    vk: 'https://vk.com/kamelot_club',
    telegram: 'https://t.me/kamelot_club',
    instagram: 'https://instagram.com/kamelot_club',
    youtube: 'https://youtube.com/@kamelot_club'
  }

  if (links[platform as keyof typeof links]) {
    window.open(links[platform as keyof typeof links], '_blank')
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>