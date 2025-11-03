<template>
  <footer class="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white pt-16 pb-8 transition-colors duration-300">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-6">
            <img :src="logo" alt="Kamelot" class="h-12 w-auto fill-white" />
            <span class="text-2xl font-bold text-gray-900 dark:text-white">KAMELOT</span>
          </div>

          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {{ contacts?.academy.description || defaultDescription }}
          </p>

          <div class="flex gap-4">
            <UButton icon="i-simple-icons-vk" color="neutral" variant="ghost" size="sm" class="hover:text-blue-400"
              @click="openSocialLink('vk')" />

            <UButton icon="i-simple-icons-telegram" color="neutral" variant="ghost" size="sm"
              class="hover:text-blue-400" @click="openSocialLink('telegram')" />

          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Навигация</h3>
          <ul class="space-y-3">
            <li>
              <ULink to="/"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Главная
              </ULink>
            </li>
            <li>
              <ULink to="/trainers"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Тренеры
              </ULink>
            </li>
            <li>
              <ULink to="/schedule"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Расписание
              </ULink>
            </li>
            <li>
              <ULink to="/blog"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Блог
              </ULink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Направления</h3>
          <ul class="space-y-3">
            <li>
              <a href="#"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Бокс
              </a>
            </li>
            <li>
              <a href="#"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Кикбоксинг
              </a>
            </li>
            <li>
              <a href="#"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                ММА
              </a>
            </li>
            <li>
              <a href="#"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Грэпплинг
              </a>
            </li>
            <li>
              <a href="#"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                Панкратион
              </a>
            </li>
            <li>
              <a href="#"
                class="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors">
                БЖЖ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Контакты</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-map-pin" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-gray-900 dark:text-white font-medium">Адрес</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ contacts?.academy.address || 'г. Москва, ул. Спортивная, 15' }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-phone" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-gray-900 dark:text-white font-medium">Телефон</p>
                <a :href="`tel:${contacts?.academy.phone || '+79001234567'}`"
                  class="text-gray-600 dark:text-gray-400 text-sm hover:text-red-600 dark:hover:text-white transition-colors">
                  {{ contacts?.academy.phone || '+7 (900) 123-45-67' }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-envelope" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-gray-900 dark:text-white font-medium">Email</p>
                <a :href="`mailto:${contacts?.academy.email || 'info@kamelot-club.ru'}`"
                  class="text-gray-600 dark:text-gray-400 text-sm hover:text-red-600 dark:hover:text-white transition-colors">
                  {{ contacts?.academy.email || 'info@kamelot-club.ru' }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-clock" class="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p class="text-gray-900 dark:text-white font-medium">Режим работы</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ contacts?.academy.workingHours.weekdays ||
                  'Пн-Пт: 7:00-23:00' }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ contacts?.academy.workingHours.weekend ||
                  'Сб-Вс:9:00-21:00' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-gray-300 dark:border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2025 Kamelot Fight Club. Все права защищены.</span>
            <div class="flex gap-4">
              <ULink to="/privacy-policy" class="hover:text-red-600 dark:hover:text-white transition-colors">
                Политика конфиденциальности
              </ULink>
              <ULink to="/terms-of-service" class="hover:text-red-600 dark:hover:text-white transition-colors">
                Пользовательское соглашение
              </ULink>
            </div>
          </div>

        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
import logo from '~/public/images/logo.png'

// Используем composable - данные теперь доступны сразу, без асинхронной загрузки
const { contacts } = useContacts()

// Дефолтное описание клуба
const defaultDescription = 'Профессиональный клуб боевых искусств. Тренируйся с лучшими, становись чемпионом.'

const openSocialLink = (platform: string) => {
  if (!contacts.value) return

  const links = contacts.value.academy.socialLinks
  const url = links[platform as keyof typeof links]

  if (url) {
    window.open(url, '_blank')
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>