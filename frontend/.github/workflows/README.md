# GitHub Actions Workflows

Этот репозиторий использует GitHub Actions для автоматического развертывания.

## Workflows

### Deploy to Yandex Object Storage
- **Файл:** `deploy.yml`
- **Триггер:** Push в ветку `main` или ручной запуск
- **Описание:** Автоматически собирает проект и загружает в Yandex Object Storage

## Секреты

Для работы требуются следующие секреты:
- `YC_KEY_ID` - ID ключа доступа Yandex Cloud
- `YC_SECRET_KEY` - Секретный ключ доступа
- `YC_BUCKET_NAME` - Имя bucket в Object Storage

## Запуск

Workflow запускается автоматически при push в main или вручную через вкладку Actions.
