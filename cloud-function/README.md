# Настройка Yandex Cloud Function для бронирований

## Шаг 1: Создание Cloud Function

1. Откройте [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Перейдите в **Cloud Functions** → **Функции**
3. Нажмите **Создать функцию**
4. Введите имя: `camelot-booking`
5. Нажмите **Создать**

## Шаг 2: Загрузка кода функции

1. В открывшейся функции перейдите в **Редактор**
2. Выберите **Способ создания**: **Zip-архив**
3. Создайте ZIP-архив из папки `cloud-function/booking/`:
   - Файлы `index.js` и `package.json` должны быть в корне архива
   - НЕ архивируйте саму папку, только её содержимое
4. Загрузите архив
5. Укажите **Точку входа**: `index.handler`
6. **Среда выполнения**: Node.js 18
7. **Таймаут**: 10 секунд
8. **Память**: 128 МБ

## Шаг 3: Настройка переменных окружения

В разделе **Переменные окружения** добавьте:

```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
```

Где взять:
- `TELEGRAM_BOT_TOKEN` - из GitHub Secrets `NUXT_TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID` - из GitHub Secrets `NUXT_TELEGRAM_CHAT_ID`

## Шаг 4: Настройка доступа

1. В разделе **Общие параметры** найдите **Публичная функция**
2. Включите переключатель **Публичная функция**
3. Нажмите **Создать версию**

После создания версии вы получите **URL функции**, например:
```
https://functions.yandexcloud.net/d4e...
```

## Шаг 5: Создание API Gateway (Опционально, но рекомендуется)

Для красивого URL можно создать API Gateway:

1. Перейдите в **API Gateway**
2. Нажмите **Создать API-шлюз**
3. Имя: `camelot-api`
4. В спецификации укажите:

```yaml
openapi: 3.0.0
info:
  title: Camelot API
  version: 1.0.0

paths:
  /booking:
    post:
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: <ID_ВАШЕЙ_ФУНКЦИИ>
        service_account_id: <ID_СЕРВИСНОГО_АККАУНТА>
      operationId: booking
```

5. Нажмите **Создать**

## Шаг 6: Обновление фронтенда

После получения URL функции (или API Gateway), добавьте в GitHub Secrets:

```
NUXT_PUBLIC_BOOKING_API_URL=https://functions.yandexcloud.net/d4e...
```

Или если используете API Gateway:
```
NUXT_PUBLIC_BOOKING_API_URL=https://d5d...apigw.yandexcloud.net/booking
```

## Шаг 7: Тестирование

Протестируйте функцию с помощью curl:

```bash
curl -X POST https://ваш-url/booking \
  -H "Content-Type: application/json" \
  -d '{
    "userType": "adult",
    "firstName": "Тест",
    "lastName": "Тестов",
    "contactMethod": "phone",
    "contact": "+79991234567",
    "age": 25,
    "trainingType": "boxing",
    "pricingPlan": "1",
    "agreeToTerms": true,
    "isPrivate": false
  }'
```

Если всё настроено правильно, в ваш Telegram чат придёт сообщение!

## Стоимость

- Первые 1 млн вызовов в месяц - **бесплатно**
- До 128 МБ памяти - **бесплатно**
- Далее ~0.35₽ за 1 млн вызовов

Для вашего сайта с записью на тренировки это практически бесплатно!
