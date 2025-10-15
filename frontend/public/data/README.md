# Инструкция по настройке данных для Kamelot Fight Club

## Структура JSON файлов

Все данные хранятся в папке `/public/data/` в формате JSON:

- **contacts.json** - контактная информация академии
- **trainers.json** - данные о тренерах
- **fighters.json** - информация о выпускниках/бойцах
- **schedule.json** - расписание тренировок
- **gallery.json** - галерея фотографий

---

## Настройка Яндекс Object Storage

### Шаг 1: Создание бакета

1. Войдите в [Яндекс.Облако](https://console.cloud.yandex.ru/)
2. Перейдите в раздел **Object Storage**
3. Создайте новый бакет:
   - Имя: `kamelot-fight-club` (или свое)
   - Класс хранилища: **Стандартное**
   - Доступ: **Публичный**

### Шаг 2: Структура папок в бакете

Создайте следующую структуру:

```
kamelot-fight-club/
├── data/
│   ├── contacts.json
│   ├── trainers.json
│   ├── fighters.json
│   ├── schedule.json
│   └── gallery.json
├── trainers/
│   ├── trainer1.jpg
│   ├── trainer2.jpg
│   └── ...
├── fighters/
│   ├── fighter1.jpg
│   ├── fighter2.jpg
│   └── ...
└── gallery/
    ├── gallery-001.jpg
    ├── gallery-002.jpg
    ├── ...
    └── thumbs/
        ├── gallery-001.jpg
        └── gallery-002.jpg
```

### Шаг 3: Загрузка файлов

1. Загрузите JSON файлы из `/public/data/` в папку `data/` бакета
2. Загрузите фотографии тренеров в `trainers/`
3. Загрузите фотографии бойцов в `fighters/`
4. Загрузите фотографии галереи в `gallery/` и миниатюры в `gallery/thumbs/`

### Шаг 4: Получение публичных ссылок

После загрузки файлов, ссылки будут иметь формат:

```
https://storage.yandexcloud.net/kamelot-fight-club/data/trainers.json
https://storage.yandexcloud.net/kamelot-fight-club/trainers/trainer1.jpg
https://storage.yandexcloud.net/kamelot-fight-club/fighters/fighter1.jpg
https://storage.yandexcloud.net/kamelot-fight-club/gallery/gallery-001.jpg
```

### Шаг 5: Обновление ссылок в JSON

Замените `YOUR-BUCKET` в JSON файлах на имя вашего бакета:

**Было:**
```json
"avatar": "https://storage.yandexcloud.net/YOUR-BUCKET/trainers/trainer1.jpg"
```

**Стало:**
```json
"avatar": "https://storage.yandexcloud.net/kamelot-fight-club/trainers/trainer1.jpg"
```

### Шаг 6: Создание .env файла

Создайте файл `.env` в корне проекта:

```env
NUXT_PUBLIC_STORAGE_URL=https://storage.yandexcloud.net/kamelot-fight-club
```

---

## Альтернатива: GitHub для хранения

Если не хотите использовать Яндекс.Облако:

### Вариант 1: GitHub Repository

1. Создайте публичный репозиторий `kamelot-data`
2. Загрузите туда структуру папок
3. Ссылки будут:
```
https://raw.githubusercontent.com/username/kamelot-data/main/trainers/trainer1.jpg
```

### Вариант 2: Локальное хранение (только для разработки)

Храните фото в `/public/images/` проекта:

```
/public/images/
├── trainers/
├── fighters/
└── gallery/
```

Ссылки в JSON:
```json
"avatar": "/images/trainers/trainer1.jpg"
```

---

## Редактирование данных

### Как обновить информацию:

1. **Локально (для разработки):**
   - Отредактируйте JSON файлы в `/public/data/`
   - Перезапустите dev-сервер

2. **В продакшене (Яндекс.Облако):**
   - Скачайте JSON файл из бакета
   - Отредактируйте локально
   - Загрузите обратно в бакет (перезапишите старый)

### Примеры изменений:

**Изменить телефон:**
```json
// public/data/contacts.json
{
  "academy": {
    "phone": "+7 (999) 888-77-66"  // <-- измените здесь
  }
}
```

**Добавить нового тренера:**
```json
// public/data/trainers.json
{
  "trainers": [
    // ... существующие тренеры
    {
      "id": 5,  // следующий ID
      "firstName": "Новое",
      "lastName": "Имя",
      // ... остальные поля
    }
  ]
}
```

**Обновить расписание:**
```json
// public/data/schedule.json
{
  "schedule": [
    {
      "day": "Понедельник",
      "sessions": [
        {
          "time": "08:00-09:30",  // измените время
          "discipline": "Новая дисциплина"  // или дисциплину
        }
      ]
    }
  ]
}
```

---

## Оптимизация фотографий

### Рекомендуемые размеры:

- **Тренеры (аватары):** 800x800px, формат WebP/JPG, качество 85%
- **Бойцы (фото):** 600x800px, формат WebP/JPG, качество 85%
- **Галерея (полные):** 1920x1080px, формат WebP/JPG, качество 90%
- **Галерея (миниатюры):** 400x300px, формат WebP/JPG, качество 75%

### Инструменты для оптимизации:

- [Squoosh.app](https://squoosh.app/) - онлайн
- [TinyPNG](https://tinypng.com/) - онлайн
- ImageMagick (CLI):
```bash
# Конвертация в WebP
magick input.jpg -quality 85 -resize 800x800 output.webp

# Создание миниатюры
magick input.jpg -quality 75 -resize 400x300 thumb_output.jpg
```

---

## Частые вопросы

**Q: Как часто обновляются данные?**
A: По умолчанию - при каждой загрузке страницы. Можно настроить кеширование.

**Q: Можно ли использовать Excel вместо JSON?**
A: Нет, но можно конвертировать Excel → JSON через онлайн-конвертеры или скрипты.

**Q: Сколько стоит Яндекс Object Storage?**
A: Первые 10GB - бесплатно. Для 100 человек/день этого хватит надолго.

**Q: Что делать, если фото не загружается?**
A: Проверьте:
1. Публичный доступ к бакету включен
2. Путь к файлу правильный
3. Файл существует в бакете
4. CORS настроен (если нужно)

---

## Следующие шаги

После настройки хранилища переходите к интеграции:
1. Создание composables для загрузки данных
2. Обновление компонентов для использования API
3. Добавление обработки ошибок и loading состояний
