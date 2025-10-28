# Настройка GitHub Actions для Yandex Object Storage

## Что делает GitHub Actions

При каждом push в ветку `main`:
1. Автоматически собирает проект (`npm run generate`)
2. Загружает собранные файлы в Yandex Object Storage
3. Сайт обновляется автоматически через 2-5 минут

---

## Шаг 1: Создание сервисного аккаунта в Yandex Cloud

### 1.1. Войдите в Yandex Cloud Console
Откройте: https://console.cloud.yandex.ru/

### 1.2. Создайте сервисный аккаунт

1. Перейдите в раздел **"Сервисные аккаунты"**
2. Нажмите **"Создать сервисный аккаунт"**
3. Укажите имя: `github-actions-deploy`
4. Добавьте роль: **`storage.editor`** (для загрузки файлов)
5. Нажмите **"Создать"**

### 1.3. Создайте статический ключ доступа

1. Откройте созданный сервисный аккаунт
2. Перейдите на вкладку **"Ключи доступа"**
3. Нажмите **"Создать новый ключ"**
4. Выберите **"Статический ключ доступа"**
5. **Сохраните:**
   - **Идентификатор ключа** (access_key_id)
   - **Секретный ключ** (secret_access_key)

⚠️ **Важно:** Секретный ключ показывается только один раз! Сохраните его в надежном месте.

---

## Шаг 2: Создание Object Storage Bucket

### 2.1. Создайте новый bucket

1. Перейдите в раздел **"Object Storage"**
2. Нажмите **"Создать бакет"**
3. Укажите параметры:
   - **Имя:** `kamelot-fight-club` (или любое другое уникальное имя)
   - **Доступ:** Публичный (для чтения)
   - **Класс хранилища:** Стандартное
4. Нажмите **"Создать бакет"**

### 2.2. Настройте bucket для веб-хостинга

1. Откройте созданный bucket
2. Перейдите на вкладку **"Веб-сайт"**
3. Включите **"Хостинг статического сайта"**
4. Укажите:
   - **Главная страница:** `index.html`
   - **Страница ошибки:** `404.html` (опционально)
5. Сохраните настройки

### 2.3. Настройте CORS (если нужно)

Если планируете загружать данные с другого домена, настройте CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## Шаг 3: Настройка GitHub Secrets

### 3.1. Откройте настройки репозитория

1. Перейдите в ваш репозиторий на GitHub
2. Откройте **Settings** (Настройки)
3. В левом меню выберите **Secrets and variables** → **Actions**

### 3.2. Добавьте секреты

Нажмите **"New repository secret"** и добавьте следующие секреты:

#### 1. YC_KEY_ID
- **Name:** `YC_KEY_ID`
- **Secret:** Идентификатор ключа доступа (из Шага 1.3)
- Пример: `AQVN1234567890abcdef`

#### 2. YC_SECRET_KEY
- **Name:** `YC_SECRET_KEY`
- **Secret:** Секретный ключ доступа (из Шага 1.3)
- Пример: `YCAbcDefGhI1234567890JkLmNoPqRsTuVwXyZ`

#### 3. YC_BUCKET_NAME
- **Name:** `YC_BUCKET_NAME`
- **Secret:** Имя вашего bucket (из Шага 2.1)
- Пример: `kamelot-fight-club`

---

## Шаг 4: Проверка работы

### 4.1. Сделайте commit

```bash
git add .
git commit -m "Setup GitHub Actions deploy"
git push origin main
```

### 4.2. Проверьте выполнение Action

1. Перейдите в репозиторий на GitHub
2. Откройте вкладку **"Actions"**
3. Вы увидите запущенный workflow **"Deploy to Yandex Object Storage"**
4. Кликните на него, чтобы посмотреть прогресс

### 4.3. Проверьте сайт

После успешного выполнения откройте:
```
https://ваш-bucket.storage.yandexcloud.net
```

Замените `ваш-bucket` на имя вашего bucket.

---

## Шаг 5: Настройка собственного домена (опционально)

### 5.1. В Yandex Cloud

1. Откройте ваш bucket
2. Перейдите на вкладку **"HTTPS"**
3. Добавьте ваш домен (например: `kamelot-club.ru`)
4. Yandex Cloud выдаст вам CNAME запись

### 5.2. В настройках DNS

Добавьте CNAME запись:
```
Тип: CNAME
Имя: @ (или www)
Значение: ваш-bucket.storage.yandexcloud.net
```

### 5.3. Настройте SSL

Yandex Cloud автоматически выпустит Let's Encrypt сертификат для вашего домена.

---

## Устранение проблем

### Ошибка: "Access Denied"
- Проверьте правильность `YC_KEY_ID` и `YC_SECRET_KEY`
- Убедитесь, что у сервисного аккаунта есть роль `storage.editor`

### Ошибка: "Bucket not found"
- Проверьте правильность `YC_BUCKET_NAME`
- Убедитесь, что bucket создан

### Ошибка: "npm ci failed"
- Проверьте файл `package-lock.json` в репозитории
- Убедитесь, что все зависимости корректны

### Сайт не открывается
- Проверьте настройки веб-хостинга в bucket
- Убедитесь, что bucket публичный
- Проверьте, что файл `index.html` существует

### Deploy не запускается автоматически
- Проверьте файл `.github/workflows/deploy.yml`
- Убедитесь, что push был в ветку `main`
- Проверьте наличие всех секретов в GitHub

---

## Ручной запуск deploy

Вы можете запустить deploy вручную:

1. Откройте **Actions** в GitHub
2. Выберите workflow **"Deploy to Yandex Object Storage"**
3. Нажмите **"Run workflow"**
4. Выберите ветку `main`
5. Нажмите **"Run workflow"**

---

## Мониторинг и логи

### Просмотр логов GitHub Actions

1. Откройте **Actions** в GitHub
2. Выберите нужный запуск workflow
3. Кликните на каждый шаг, чтобы увидеть детальные логи

### Проверка содержимого bucket

1. Откройте Yandex Cloud Console
2. Перейдите в **Object Storage**
3. Откройте ваш bucket
4. Вы увидите все загруженные файлы

---

## Стоимость

### Yandex Object Storage

- **Хранение:** ~0.7₽ за ГБ в месяц
- **Исходящий трафик:** от 1.53₽ за ГБ (первые 10 ТБ)
- **Операции:** ~0.003₽ за 1000 запросов

Для небольшого сайта стоимость составит **50-200₽ в месяц**.

### GitHub Actions

- **Бесплатно:** 2000 минут в месяц для публичных репозиториев
- **Бесплатно:** неограниченно для публичных репозиториев

Один deploy занимает ~3-5 минут.

---

## Дополнительные настройки

### Оптимизация deploy

Добавьте кэширование в `.github/workflows/deploy.yml`:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Уведомления об успешном deploy

Добавьте шаг отправки уведомления в Telegram:

```yaml
- name: Send Telegram notification
  if: success()
  run: |
    curl -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
      -d chat_id=${{ secrets.TELEGRAM_CHAT_ID }} \
      -d text="✅ Сайт успешно обновлен!"
```

---

## Полезные ссылки

- [Документация Yandex Object Storage](https://cloud.yandex.ru/docs/storage/)
- [Документация GitHub Actions](https://docs.github.com/en/actions)
- [AWS CLI для Yandex Cloud](https://cloud.yandex.ru/docs/storage/tools/aws-cli)

**Текущая версия:** 1.0
**Дата создания:** 2025-10-28
