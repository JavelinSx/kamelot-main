#!/bin/bash
# Скрипт для создания архива Cloud Function

cd booking
zip -r ../booking-function.zip index.js package.json
cd ..
echo "✅ Архив создан: booking-function.zip"
echo "Загрузите его в Yandex Cloud Functions"
