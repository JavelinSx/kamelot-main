export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const config = useRuntimeConfig();
  const TELEGRAM_BOT_TOKEN = config.telegramBotToken;
  const TELEGRAM_CHAT_ID = config.telegramChatId;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw createError({
      statusCode: 500,
      statusMessage: "Telegram configuration missing",
    });
  }

  try {
    const message = formatTelegramMessage(body);

    const response = await $fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        body: {
          chat_id: Number(TELEGRAM_CHAT_ID), // Преобразуем в число
          text: message,
          parse_mode: "HTML",
        },
      }
    );

    return { success: true, message: "Booking request sent successfully" };
  } catch (error: any) {
    console.error("Telegram API error:", error);
    console.error("Error details:", error.data || error.message);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send booking request",
      data: error.data || error.message,
    });
  }
});

function escapeHtml(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTelegramMessage(data: any) {
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

  const trainingLabel =
    trainingTypes[data.trainingType as keyof typeof trainingTypes] ||
    data.trainingType;

  const contactIcon = data.contactMethod === "telegram" ? "💬" : "📱";
  const contactLabel =
    data.contactMethod === "telegram" ? "Telegram" : "Телефон";

  let message = `🥊 <b>НОВАЯ ЗАЯВКА НА ТРЕНИРОВКУ</b>

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
    message += `\n\n💬 <b>Дополнительно:</b> ${escapeHtml(
      data.additionalInfo
    )}`;
  }

  // Добавляем информацию о согласии с условиями
  const agreementStatus = data.agreeToTerms ? "✅ Да" : "❌ Нет";
  message += `\n\n📋 <b>Согласие с условиями:</b> ${agreementStatus}`;

  message += `\n\n<i>Дата заявки: ${new Date().toLocaleString("ru-RU")}</i>`;

  return message;
}
