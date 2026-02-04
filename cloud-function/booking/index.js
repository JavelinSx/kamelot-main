// Yandex Cloud Function для обработки бронирований
const https = require('https');

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTelegramMessage(data) {
  const privateText = data.isPrivate ? "✅ Да" : "❌ Нет";
  const parentText = data.isParent ? "✅ Да (запись для ребёнка)" : "❌ Нет";

  const trainingTypes = {
    boxing: "Бокс",
    kickboxing: "Кикбоксинг",
    grappling: "Грэпплинг",
    bjj: "БЖЖ (Бразильское джиу-джитсу)",
    mma: "ММА",
    pankration: "Панкратион",
  };

  const trainingLabel = trainingTypes[data.trainingType] || data.trainingType;
  const contactIcon = data.contactMethod === "telegram" ? "💬" : "📱";
  const contactLabel = data.contactMethod === "telegram" ? "Telegram" : "Телефон";

  let message = `🥊 <b>НОВАЯ ЗАЯВКА НА ТРЕНИРОВКУ</b>\n`;

  // Если есть информация о выбранной сессии из расписания
  if (data.sessionInfo) {
    message += `
📅 <b>Выбранная тренировка:</b>
   🥋 Дисциплина: ${escapeHtml(data.sessionInfo.discipline)}
   📆 День: ${escapeHtml(data.sessionInfo.day)}
   🕐 Время: ${escapeHtml(data.sessionInfo.time)}
   👨‍🏫 Тренер: ${escapeHtml(data.sessionInfo.trainer)}`;

    if (data.sessionInfo.ageGroup) {
      message += `\n   👥 Группа: ${escapeHtml(data.sessionInfo.ageGroup)}`;
    }
    if (data.sessionInfo.level) {
      message += `\n   🎓 Уровень: ${escapeHtml(data.sessionInfo.level)}`;
    }
    if (data.sessionInfo.zone) {
      message += `\n   📍 Зона: ${escapeHtml(data.sessionInfo.zone)}`;
    }
    message += `\n`;
  }

  // Если есть информация о выбранном тарифе
  if (data.pricingPlanInfo) {
    message += `
💰 <b>Выбранный тариф:</b>
   📋 ${escapeHtml(data.pricingPlanInfo.name)} - ${escapeHtml(data.pricingPlanInfo.price)}₽`;

    if (data.pricingPlanInfo.sessions_count > 0) {
      message += `\n   🎟️ Количество тренировок: ${escapeHtml(data.pricingPlanInfo.sessions_count)}`;
    } else if (data.pricingPlanInfo.sessions_count === -1) {
      message += `\n   ♾️ Безлимитные тренировки`;
    }

    if (data.pricingPlanInfo.valid_days) {
      message += `\n   📆 Срок действия: ${escapeHtml(data.pricingPlanInfo.valid_days)} дней`;
    }

    if (data.pricingPlanInfo.description) {
      message += `\n   ℹ️ ${escapeHtml(data.pricingPlanInfo.description)}`;
    }
    message += `\n`;
  }

  message += `
👤 <b>Контактные данные${data.isParent ? " (родитель)" : ""}:</b>
   Имя: ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}
   ${contactIcon} ${contactLabel}: ${escapeHtml(data.contact)}
   🎂 Возраст: ${escapeHtml(data.age)} лет

🥋 <b>Направление:</b> ${trainingLabel}
🎯 <b>Персональные тренировки:</b> ${privateText}
👨‍👩‍👧‍👦 <b>Запись для ребёнка:</b> ${parentText}`;

  if (data.isParent && data.childFirstName && data.childLastName) {
    message += `

👶 <b>Данные ребёнка:</b>
   Имя: ${escapeHtml(data.childFirstName)} ${escapeHtml(data.childLastName)}
   🎂 Возраст: ${escapeHtml(data.childAge)} лет`;
  }

  if (data.additionalInfo) {
    message += `\n\n💬 <b>Дополнительно:</b> ${escapeHtml(data.additionalInfo)}`;
  }

  const agreementStatus = data.agreeToTerms ? "✅ Да" : "❌ Нет";
  message += `\n\n📋 <b>Согласие с условиями:</b> ${agreementStatus}`;
  message += `\n\n<i>Дата заявки: ${new Date().toLocaleString("ru-RU")}</i>`;

  return message;
}

function sendToTelegram(botToken, chatId, message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: Number(chatId),
      text: message,
      parse_mode: 'HTML'
    });

    // ВАЖНО: для UTF-8 нужно считать байты, а не символы!
    const dataBuffer = Buffer.from(data, 'utf8');

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': dataBuffer.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Telegram API error: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(dataBuffer);
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
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);

    // Get environment variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Telegram configuration missing'
        })
      };
    }

    // Format and send message
    const message = formatTelegramMessage(body);

    if (!message || message.trim().length === 0) {
      throw new Error('Generated message is empty');
    }

    await sendToTelegram(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Booking request sent successfully'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
