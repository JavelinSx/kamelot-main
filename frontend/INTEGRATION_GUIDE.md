# Руководство по интеграции данных

## Что было сделано

### 1. Созданы JSON файлы данных в `/public/data/`:
- ✅ `contacts.json` - контакты академии
- ✅ `trainers.json` - данные о тренерах
- ✅ `fighters.json` - информация о бойцах
- ✅ `schedule.json` - расписание по зонам (Зона Борьбы, Ударная Зона)
- ✅ `gallery.json` - галерея фотографий

### 2. Созданы Composables в `/composables/`:
- ✅ `useContacts.ts` - загрузка контактов
- ✅ `useTrainers.ts` - загрузка тренеров + методы фильтрации
- ✅ `useFighters.ts` - загрузка бойцов + методы фильтрации
- ✅ `useSchedule.ts` - загрузка расписания + методы фильтрации
- ✅ `useGallery.ts` - загрузка галереи + фильтрация по категориям

### 3. Обновлены компоненты:
- ✅ `Footer.vue` - использует `useContacts()`
- ✅ `TrainersCards.vue` - использует `useTrainers()`
- ✅ `FightersCards.vue` - использует `useFighters()`

### 4. Настройка конфигурации:
- ✅ Добавлен `NUXT_PUBLIC_STORAGE_URL` в `nuxt.config.ts`
- ✅ Создан `.env.example` с примерами переменных

---

## Как это работает

### Локальная разработка (без внешнего хранилища)

По умолчанию данные загружаются из `/public/data/`:

```ts
// Composable автоматически определяет источник
const url = baseUrl ? `${baseUrl}/data/trainers.json` : '/data/trainers.json'
```

### Продакшн с Яндекс Object Storage

1. Создайте `.env` файл:
```env
NUXT_PUBLIC_STORAGE_URL=https://storage.yandexcloud.net/kamelot-fight-club
```

2. Загрузите JSON файлы и фото в бакет
3. Обновите ссылки в JSON файлах

Composables автоматически будут загружать данные из бакета.

---

## Использование в компонентах

### Пример: Загрузка контактов

```vue
<script setup lang="ts">
const { contacts, loading, error, fetchContacts } = useContacts()

onMounted(async () => {
  await fetchContacts()
})
</script>

<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else-if="error">Ошибка: {{ error.message }}</div>
  <div v-else>
    <p>{{ contacts?.academy.phone }}</p>
    <p>{{ contacts?.academy.email }}</p>
  </div>
</template>
```

### Пример: Загрузка тренеров с фильтрацией

```vue
<script setup lang="ts">
const { trainers, fetchTrainers, getTrainersBySpecialization } = useTrainers()

onMounted(async () => {
  await fetchTrainers()
})

const mmaTrainers = computed(() => getTrainersBySpecialization('mma'))
</script>

<template>
  <div v-for="trainer in trainers" :key="trainer.id">
    {{ trainer.firstName }} {{ trainer.lastName }}
  </div>
</template>
```

### Пример: Расписание на сегодня

```vue
<script setup lang="ts">
const { fetchSchedule, getCurrentDaySchedule } = useSchedule()

onMounted(async () => {
  await fetchSchedule()
})

const todayWrestling = computed(() => getCurrentDaySchedule('ЗОНА БОРЬБЫ'))
const todayStriking = computed(() => getCurrentDaySchedule('УДАРНАЯ ЗОНА'))
</script>
```

---

## Доступные методы Composables

### useContacts()
```ts
{
  contacts: Ref<ContactsData | null>,
  loading: Ref<boolean>,
  error: Ref<Error | null>,
  fetchContacts: () => Promise<ContactsData>
}
```

### useTrainers()
```ts
{
  trainers: Ref<Trainer[]>,
  loading: Ref<boolean>,
  error: Ref<Error | null>,
  fetchTrainers: () => Promise<Trainer[]>,
  getTrainerById: (id: number) => Trainer | undefined,
  getTrainersBySpecialization: (spec: string) => Trainer[]
}
```

### useFighters()
```ts
{
  fighters: Ref<Fighter[]>,
  loading: Ref<boolean>,
  error: Ref<Error | null>,
  fetchFighters: () => Promise<Fighter[]>,
  getChampions: () => Fighter[],
  getFightersByDiscipline: (discipline: string) => Fighter[],
  getWinPercentage: (record: FighterRecord) => number
}
```

### useSchedule()
```ts
{
  scheduleData: Ref<ScheduleData | null>,
  loading: Ref<boolean>,
  error: Ref<Error | null>,
  fetchSchedule: () => Promise<ScheduleData>,
  getZoneByName: (name: string) => Zone | undefined,
  getScheduleByDay: (zone: string, day: string) => Session[],
  getCurrentDaySchedule: (zone: string) => Session[],
  getSessionsByTrainer: (trainer: string) => Session[]
}
```

### useGallery()
```ts
{
  images: Ref<GalleryImage[]>,
  categories: Ref<GalleryCategory[]>,
  filteredImages: ComputedRef<GalleryImage[]>,
  selectedCategory: Ref<string | null>,
  loading: Ref<boolean>,
  error: Ref<Error | null>,
  fetchGallery: () => Promise<GalleryData>,
  getImagesByCategory: (id: string) => GalleryImage[],
  setCategory: (id: string | null) => void,
  getImageById: (id: number) => GalleryImage | undefined
}
```

---

## Следующие шаги

### 1. Настройка Яндекс Object Storage
Следуйте инструкциям в `/public/data/README.md`

### 2. Обновление данных
Редактируйте JSON файлы локально, затем загружайте в бакет

### 3. Создание страницы расписания
```vue
<!-- pages/schedule/index.vue -->
<script setup lang="ts">
const { scheduleData, fetchSchedule } = useSchedule()

onMounted(async () => {
  await fetchSchedule()
})
</script>

<template>
  <div v-for="zone in scheduleData?.zones" :key="zone.id">
    <h2>{{ zone.name }}</h2>
    <p>{{ zone.description }}</p>

    <!-- Отображение расписания по дням -->
    <div v-for="(sessions, day) in zone.schedule" :key="day">
      <h3>{{ day }}</h3>
      <div v-for="session in sessions" :key="session.id">
        {{ session.time }} - {{ session.discipline }}
        ({{ session.trainer }})
      </div>
    </div>
  </div>
</template>
```

### 4. Создание страницы галереи
```vue
<!-- pages/gallery/index.vue -->
<script setup lang="ts">
const { images, categories, fetchGallery, setCategory, selectedCategory } = useGallery()

onMounted(async () => {
  await fetchGallery()
})
</script>

<template>
  <!-- Фильтр по категориям -->
  <div>
    <button @click="setCategory(null)">Все</button>
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="setCategory(cat.id)"
    >
      {{ cat.name }} ({{ cat.count }})
    </button>
  </div>

  <!-- Галерея -->
  <div class="grid">
    <div v-for="img in filteredImages" :key="img.id">
      <img :src="img.thumbnail" :alt="img.title" />
      <h3>{{ img.title }}</h3>
      <p>{{ img.description }}</p>
    </div>
  </div>
</template>
```

---

## Кеширование

Все composables используют `useState()` для кеширования данных:

```ts
const trainers = useState<Trainer[]>('trainers', () => [])
```

Это означает:
- ✅ Данные загружаются **один раз** за сессию
- ✅ Повторные вызовы `fetchTrainers()` возвращают кешированные данные
- ✅ Данные сохраняются при навигации между страницами

Для принудительного обновления очистите кеш:

```ts
const { trainers } = useTrainers()
trainers.value = [] // Очистка кеша
await fetchTrainers() // Повторная загрузка
```

---

## Обработка ошибок

Все composables возвращают `error`:

```vue
<script setup lang="ts">
const { contacts, error, fetchContacts } = useContacts()

onMounted(async () => {
  try {
    await fetchContacts()
  } catch (err) {
    console.error('Ошибка загрузки:', err)
    // Показать уведомление пользователю
  }
})
</script>

<template>
  <div v-if="error" class="alert-error">
    Не удалось загрузить данные: {{ error.message }}
  </div>
</template>
```

---

## TypeScript типы

Все типы данных экспортируются из composables:

```ts
import type { Trainer } from '~/composables/useTrainers'
import type { Fighter, FighterRecord } from '~/composables/useFighters'
import type { ScheduleSession, Zone } from '~/composables/useSchedule'
import type { GalleryImage, GalleryCategory } from '~/composables/useGallery'
import type { ContactsData } from '~/composables/useContacts'
```

---

## Производительность

### Рекомендации:
1. **Используйте SSR** для SEO (сейчас отключено)
2. **Добавьте прелоадеры** для улучшения UX
3. **Оптимизируйте изображения** (WebP, сжатие)
4. **Используйте CDN** для Яндекс Object Storage

### Пример с прелоадером:

```vue
<template>
  <div v-if="loading">
    <USkeleton class="h-20 w-full" />
  </div>
  <div v-else>
    <!-- Контент -->
  </div>
</template>
```

---

## Вопросы?

Читайте подробную документацию:
- `/public/data/README.md` - настройка хранилища
- Примеры использования в компонентах `Footer.vue`, `TrainersCards.vue`, `FightersCards.vue`
