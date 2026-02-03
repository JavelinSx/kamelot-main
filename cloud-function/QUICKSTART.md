# Быстрый старт

## 1. Создайте ZIP-архив

В папке `cloud-function/booking/` создайте ZIP-архив:
- Windows: Выделите файлы `index.js` и `package.json` → Правый клик → Отправить → Сжатая ZIP-папка
- Mac/Linux: `cd cloud-function/booking && zip -r ../booking.zip index.js package.json`

**Важно:** Архивируйте ФАЙЛЫ, а не папку!

## 2. Создайте Cloud Function

1. [Yandex Cloud Console](https://console.cloud.yandex.ru/) → **Cloud Functions** → **Создать функцию**
2. Имя: `camelot-booking`
3. **Редактор** → Загрузите ZIP
4. **Точка входа:** `index.handler`
5. **Среда:** Node.js 18
6. **Таймаут:** 10 сек
7. **Память:** 128 МБ

## 3. Переменные окружения

Добавьте в функции:
```
TELEGRAM_BOT_TOKEN=<из GitHub Secrets>
TELEGRAM_CHAT_ID=<из GitHub Secrets>
```

## 4. Сделайте публичной

**Общие параметры** → Включите **Публичная функция** → **Создать версию**

Скопируйте URL функции (например: `https://functions.yandexcloud.net/d4e...`)

## 5. Добавьте в GitHub Secrets

**GitHub** → **Settings** → **Secrets** → **New secret**:
```
Name: NUXT_PUBLIC_BOOKING_API_URL
Value: https://functions.yandexcloud.net/d4e... (ваш URL)
```

## 6. Деплой

Сделайте коммит и пуш → GitHub Action автоматически задеплоит с новым URL!

## Тестирование

```bash
curl -X POST https://ваш-url \
  -H "Content-Type: application/json" \
  -d '{"userType":"adult","firstName":"Тест","lastName":"Тестов","contactMethod":"phone","contact":"+79991234567","age":25,"trainingType":"boxing","pricingPlan":"1","agreeToTerms":true,"isPrivate":false}'
```

Должно прийти сообщение в Telegram!
