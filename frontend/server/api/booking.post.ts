export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()
  const TELEGRAM_BOT_TOKEN = config.telegramBotToken
  const TELEGRAM_CHAT_ID = config.telegramChatId

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Telegram configuration missing'
    })
  }

  try {
    const message = formatTelegramMessage(body)

    const response = await $fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      body: {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }
    })

    return { success: true, message: 'Booking request sent successfully' }
  } catch (error) {
    console.error('Telegram API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send booking request'
    })
  }
})

function formatTelegramMessage(data: any) {
  const privateText = data.isPrivate ? '✅ Да' : '❌ Нет'
  const parentText = data.isParent ? '✅ Да (запись для ребёнка)' : '❌ Нет'

  const trainingTypes = {
    'boxing': 'Бокс',
    'kickboxing': 'Кикбоксинг',
    'grappling': 'Грэпплинг',
    'bjj': 'БЖЖ (Бразильское джиу-джитсу)',
    'mma': 'ММА',
    'pankration': 'Панкратион'
  }

  const trainingLabel = trainingTypes[data.trainingType as keyof typeof trainingTypes] || data.trainingType

  const contactIcon = data.contactMethod === 'telegram' ? '💬' : '📱'
  const contactLabel = data.contactMethod === 'telegram' ? 'Telegram' : 'Телефон'

  let message = `🥊 <b>НОВАЯ ЗАЯВКА НА ТРЕНИРОВКУ</b>

👤 <b>Контактные данные${data.isParent ? ' (родитель)' : ''}:</b>
   Имя: ${data.firstName} ${data.lastName}
   ${contactIcon} ${contactLabel}: ${data.contact}
   🎂 Возраст: ${data.age} лет

🥋 <b>Направление:</b> ${trainingLabel}
🎯 <b>Персональные тренировки:</b> ${privateText}
👨‍👩‍👧‍👦 <b>Запись для ребёнка:</b> ${parentText}`

  if (data.isParent && data.childFirstName && data.childLastName) {
    message += `

👶 <b>Данные ребёнка:</b>
   Имя: ${data.childFirstName} ${data.childLastName}
   🎂 Возраст: ${data.childAge} лет`
  }

  if (data.additionalInfo) {
    message += `\n\n💬 <b>Дополнительно:</b> ${data.additionalInfo}`
  }

  message += `\n\n<i>Дата заявки: ${new Date().toLocaleString('ru-RU')}</i>`

  return message
}