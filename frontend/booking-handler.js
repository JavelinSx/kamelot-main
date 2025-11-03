module.exports.handler = async function (event, context) {
    // Обработка предварительных запросов OPTIONS для CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: ''
        };
    }

    // Заголовки CORS для ответа
    const headers = {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Проверка наличия данных запроса
    if (!event) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'No event data provided' }),
        };
    }

    // Парсинг тела запроса
    let parsedBody;
    try {
        parsedBody = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: "Invalid JSON format" })
        };
    }

    // Получение данных из переменных окружения
    const token = process.env.TELEGRAM_BOT_TOKEN; // Токен бота Telegram
    const chatId = process.env.TELEGRAM_CHAT_ID; // ID чата для отправки уведомлений
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    // Функция для получения текстового представления типа пользователя
    function getUserTypeText(userType) {
        const types = {
            'teenager': '👦 Подросток',
            'parent': '👨‍👧 Родитель (запись для ребёнка)',
            'adult': '👨 Взрослый'
        };
        return types[userType] || userType;
    }

    // Функция для получения текстового представления направления тренировок
    function getTrainingTypeText(trainingType) {
        const types = {
            'boxing': '🥊 Бокс',
            'kickboxing': '🦵 Кикбоксинг',
            'grappling': '🤼 Грэпплинг',
            'bjj': '🥋 БЖЖ (Бразильское джиу-джитсу)',
            'mma': '🥊 ММА',
            'pankration': '⚔️ Панкратион'
        };
        return types[trainingType] || trainingType;
    }

    // Функция для получения текстового представления способа связи
    function getContactMethodText(contactMethod) {
        const methods = {
            'phone': '📱 Телефон',
            'telegram': '💬 Telegram'
        };
        return methods[contactMethod] || contactMethod;
    }

    // Функция отправки сообщения в Telegram
    async function sendToTelegram() {
        try {
            // Формирование текста сообщения в формате HTML
            let messageText = `<b>🔔 Новая заявка на тренировку</b>\n\n`;

            // Информация о типе записи
            messageText += `<b>Категория</b>: ${getUserTypeText(parsedBody.userType)}\n\n`;

            // Основная информация о записавшемся
            messageText += `<b>📋 Контактная информация</b>\n`;
            messageText += `<b>Имя</b>: ${parsedBody.firstName}\n`;
            messageText += `<b>Фамилия</b>: ${parsedBody.lastName}\n`;
            messageText += `<b>Возраст</b>: ${parsedBody.age} лет\n`;
            messageText += `<b>Способ связи</b>: ${getContactMethodText(parsedBody.contactMethod)}\n`;

            // Контактные данные
            if (parsedBody.contactMethod === 'telegram') {
                messageText += `<b>Telegram</b>: ${parsedBody.contact}\n\n`;
            } else {
                messageText += `<b>Телефон</b>: <code>${parsedBody.contact}</code>\n\n`;
            }

            // Если это родитель - добавляем информацию о ребёнке
            if (parsedBody.userType === 'parent') {
                messageText += `<b>👶 Данные ребёнка</b>\n`;
                messageText += `<b>Имя</b>: ${parsedBody.childFirstName}\n`;
                messageText += `<b>Фамилия</b>: ${parsedBody.childLastName}\n`;
                messageText += `<b>Возраст</b>: ${parsedBody.childAge} лет\n\n`;
            }

            // Информация о тренировках
            messageText += `<b>🥋 Информация о тренировках</b>\n`;
            messageText += `<b>Направление</b>: ${getTrainingTypeText(parsedBody.trainingType)}\n`;
            messageText += `<b>Тип тренировок</b>: ${parsedBody.isPrivate ? '🎯 Персональные' : '👥 Групповые'}\n`;

            // Дополнительная информация
            if (parsedBody.additionalInfo) {
                messageText += `\n<b>💬 Дополнительная информация</b>\n`;
                messageText += `${parsedBody.additionalInfo}\n`;
            }

            // Согласие с условиями
            const agreementStatus = parsedBody.agreeToTerms ? '✅ Да' : '❌ Нет';
            messageText += `\n<b>📋 Согласие с условиями</b>: ${agreementStatus}\n`;

            // Дата и время заявки
            const now = new Date();
            const dateStr = now.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            messageText += `\n<i>📅 Дата заявки: ${dateStr}</i>`;

            // Отправка сообщения в Telegram
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: messageText,
                    parse_mode: 'HTML'
                })
            });

            const responseData = await response.json();

            if (!responseData.ok) {
                throw new Error(`Telegram API Error: ${JSON.stringify(responseData)}`);
            }

            return { success: true, data: responseData };
        } catch (error) {
            console.error("Error sending message to Telegram:", error);
            throw error;
        }
    }

    // Отправка сообщения и обработка ответа
    try {
        await sendToTelegram();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Заявка на тренировку успешно отправлена'
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Ошибка при отправке заявки',
                error: error.message
            })
        };
    }
};
