// Yandex Cloud Function для обработки бронирований — отправка в VK
// (вместо Telegram — Telegram API нестабильно доступен с российских
// серверов Yandex Cloud).

const https = require('https');

function formatVkMessage(data) {
  const privateText = data.isPrivate ? 'Да' : 'Нет';
  const parentText = data.isParent ? 'Да (запись для ребёнка)' : 'Нет';

  const trainingTypes = {
    boxing: 'Бокс',
    kickboxing: 'Кикбоксинг',
    grappling: 'Грэпплинг',
    bjj: 'БЖЖ (Бразильское джиу-джитсу)',
    mma: 'ММА',
    pankration: 'Панкратион',
  };

  const trainingLabel = trainingTypes[data.trainingType] || data.trainingType;
  const contactIcon = data.contactMethod === 'telegram' ? '💬' : '📱';
  const contactLabel = data.contactMethod === 'telegram' ? 'Telegram' : 'Телефон';

  let message = `🥊 НОВАЯ ЗАЯВКА НА ТРЕНИРОВКУ\n`;

  // Если есть информация о выбранной сессии из расписания
  if (data.sessionInfo) {
    message += `
📅 Выбранная тренировка:
   🥋 Дисциплина: ${data.sessionInfo.discipline}
   📆 День: ${data.sessionInfo.day}
   🕐 Время: ${data.sessionInfo.time}
   👨‍🏫 Тренер: ${data.sessionInfo.trainer}`;

    if (data.sessionInfo.ageGroup) {
      message += `\n   👥 Группа: ${data.sessionInfo.ageGroup}`;
    }
    if (data.sessionInfo.level) {
      message += `\n   🎓 Уровень: ${data.sessionInfo.level}`;
    }
    if (data.sessionInfo.zone) {
      message += `\n   📍 Зона: ${data.sessionInfo.zone}`;
    }
    message += `\n`;
  }

  // Если есть информация о выбранном тарифе
  if (data.pricingPlanInfo) {
    message += `
💰 Выбранный тариф:
   📋 ${data.pricingPlanInfo.name} - ${data.pricingPlanInfo.price}₽`;

    if (data.pricingPlanInfo.sessions_count > 0) {
      message += `\n   🎟️ Количество тренировок: ${data.pricingPlanInfo.sessions_count}`;
    } else if (data.pricingPlanInfo.sessions_count === -1) {
      message += `\n   ♾️ Безлимитные тренировки`;
    }

    if (data.pricingPlanInfo.valid_days) {
      message += `\n   📆 Срок действия: ${data.pricingPlanInfo.valid_days} дней`;
    }

    if (data.pricingPlanInfo.description) {
      message += `\n   ℹ️ ${data.pricingPlanInfo.description}`;
    }
    message += `\n`;
  }

  message += `
👤 Контактные данные${data.isParent ? ' (родитель)' : ''}:
   Имя: ${data.firstName} ${data.lastName}
   ${contactIcon} ${contactLabel}: ${data.contact}
   🎂 Возраст: ${data.age} лет

🥋 Направление: ${trainingLabel}
🎯 Персональные тренировки: ${privateText}
👨‍👩‍👧‍👦 Запись для ребёнка: ${parentText}`;

  if (data.isParent && data.childFirstName && data.childLastName) {
    message += `

👶 Данные ребёнка:
   Имя: ${data.childFirstName} ${data.childLastName}
   🎂 Возраст: ${data.childAge} лет`;
  }

  if (data.additionalInfo) {
    message += `\n\n💬 Дополнительно: ${data.additionalInfo}`;
  }

  const agreementStatus = data.agreeToTerms ? 'Да' : 'Нет';
  message += `\n\n📋 Согласие с условиями: ${agreementStatus}`;
  message += `\n\nДата заявки: ${new Date().toLocaleString('ru-RU')}`;

  return message;
}

function sendToVk(communityToken, userId, message) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      user_id: String(userId),
      message,
      random_id: String(Date.now()),
      access_token: communityToken,
      v: '5.199',
    });

    const payload = params.toString();

    const options = {
      hostname: 'api.vk.ru',
      port: 443,
      path: '/method/messages.send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.error) {
            reject(new Error(`VK API error: ${JSON.stringify(data.error)}`));
          } else {
            resolve(data);
          }
        } catch (e) {
          reject(new Error(`Bad response from VK: ${body}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('VK request timed out'));
    });
    req.on('error', reject);

    req.write(payload);
    req.end();
  });
}

module.exports.handler = async function (event, context) {
  // Расширенные CORS headers для всех доменов
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);

    // Get environment variables
    const VK_COMMUNITY_TOKEN = process.env.VK_COMMUNITY_TOKEN;
    const VK_USER_ID = process.env.VK_USER_ID;

    if (!VK_COMMUNITY_TOKEN || !VK_USER_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'VK configuration missing',
        }),
      };
    }

    // Format and send message
    const message = formatVkMessage(body);

    if (!message || message.trim().length === 0) {
      throw new Error('Generated message is empty');
    }

    await sendToVk(VK_COMMUNITY_TOKEN, VK_USER_ID, message);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Booking request sent successfully',
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
