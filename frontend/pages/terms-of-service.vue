<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-16">
    <UContainer>
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
        <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Пользовательское соглашение
        </h1>

        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Дата последнего обновления: {{ lastUpdated }}
          </p>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">1. Общие положения</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между Спортивным клубом
              «Kamelot Fight Club» (далее — Клуб) и физическим лицом (далее — Клиент), использующим услуги Клуба.
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Начало использования услуг Клуба означает полное и безоговорочное принятие Клиентом условий настоящего
              Соглашения в соответствии со ст. 438 Гражданского кодекса Российской Федерации.
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Если Клиент не согласен с условиями Соглашения, он обязан прекратить использование услуг Клуба.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">2. Предмет соглашения</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Клуб обязуется оказывать Клиенту услуги в области физической культуры и спорта, а Клиент обязуется оплачивать
              услуги и соблюдать правила Клуба.
            </p>

            <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white">2.1. Виды услуг:</h3>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Групповые занятия по боевым искусствам (ММА, бокс, кикбоксинг, грэпплинг, БЖЖ)</li>
              <li>Персональные тренировки</li>
              <li>Посещение тренажерного зала</li>
              <li>Участие в спортивных мероприятиях и семинарах</li>
              <li>Дополнительные услуги (по согласованию сторон)</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. Права и обязанности Клуба</h2>

            <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white">3.1. Клуб обязуется:</h3>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Предоставлять услуги надлежащего качества</li>
              <li>Обеспечить безопасные условия для проведения занятий</li>
              <li>Обеспечить наличие квалифицированных тренеров</li>
              <li>Предоставить спортивный инвентарь и оборудование</li>
              <li>Соблюдать конфиденциальность персональных данных Клиента</li>
              <li>Своевременно информировать об изменениях в расписании</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white">3.2. Клуб имеет право:</h3>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Вносить изменения в расписание занятий</li>
              <li>Отказать в предоставлении услуг при нарушении Клиентом правил Клуба</li>
              <li>Прекратить действие договора в одностороннем порядке при систематическом нарушении Клиентом условий
                Соглашения</li>
              <li>Использовать фото- и видеоматериалы с участием Клиента в рекламных целях (при наличии согласия)</li>
              <li>Проводить акции и специальные предложения</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. Права и обязанности Клиента</h2>

            <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white">4.1. Клиент обязуется:</h3>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Своевременно оплачивать услуги Клуба</li>
              <li>Соблюдать правила посещения и внутренний распорядок Клуба</li>
              <li>Иметь при себе медицинскую справку о допуске к занятиям спортом</li>
              <li>Бережно относиться к имуществу Клуба</li>
              <li>Соблюдать технику безопасности и выполнять указания тренера</li>
              <li>Предоставлять достоверную информацию о состоянии здоровья</li>
              <li>Информировать Клуб об изменении контактных данных</li>
              <li>Не передавать членскую карту третьим лицам</li>
            </ul>

            <h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900 dark:text-white">4.2. Клиент имеет право:</h3>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Получать качественные услуги в соответствии с условиями договора</li>
              <li>Пользоваться спортивным оборудованием и инвентарём Клуба</li>
              <li>Получать консультации тренеров</li>
              <li>Требовать возврата денежных средств в случаях, предусмотренных законом</li>
              <li>Расторгнуть договор в порядке, предусмотренном настоящим Соглашением</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">5. Стоимость услуг и порядок оплаты</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Стоимость услуг определяется действующим прейскурантом Клуба и может быть изменена Клубом в одностороннем
              порядке.
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Оплата услуг производится наличным или безналичным способом в кассе Клуба или через платёжные системы на сайте.
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Оплаченные услуги не подлежат возврату, за исключением случаев, предусмотренных законодательством РФ.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Ответственность сторон</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Клуб не несёт ответственности за:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Вред здоровью Клиента при несоблюдении им правил техники безопасности</li>
              <li>Травмы, полученные в результате несоблюдения рекомендаций тренера</li>
              <li>Утрату или повреждение личных вещей Клиента</li>
              <li>Невозможность предоставления услуг вследствие форс-мажорных обстоятельств</li>
            </ul>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Клиент несёт полную ответственность за причинение вреда имуществу Клуба или третьим лицам.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              7. Медицинские противопоказания
            </h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Клиент обязан уведомить Клуб о наличии хронических заболеваний, травм и других медицинских противопоказаниях.
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Занятия спортом противопоказаны при следующих состояниях:
            </p>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Острые инфекционные заболевания</li>
              <li>Обострение хронических заболеваний</li>
              <li>Повышенная температура тела</li>
              <li>Серьёзные травмы и послеоперационный период</li>
              <li>Другие противопоказания по состоянию здоровья</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">8. Порядок разрешения споров</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Все споры и разногласия решаются путём переговоров. При недостижении согласия спор передаётся на рассмотрение
              в суд в соответствии с действующим законодательством Российской Федерации.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">9. Срок действия и изменение соглашения</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Настоящее Соглашение вступает в силу с момента начала использования услуг Клуба и действует до полного
              исполнения обязательств сторонами.
            </p>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Клуб оставляет за собой право в одностороннем порядке вносить изменения в настоящее Соглашение. Измененное
              Соглашение вступает в силу с момента его размещения на сайте.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">10. Защита прав потребителей</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              Настоящее Соглашение регулируется и толкуется в соответствии с законодательством РФ. Вопросы, не
              урегулированные настоящим Соглашением, подлежат разрешению в соответствии с законодательством РФ, в том числе
              Законом РФ «О защите прав потребителей».
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">11. Контактная информация</h2>
            <p class="mb-4 text-gray-700 dark:text-gray-300">
              По всем вопросам, связанным с применением настоящего Соглашения, Клиент может обратиться в Клуб:
            </p>
            <ul class="list-none mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Email: <a href="mailto:info@kamelot-club.ru" class="text-red-600 hover:text-red-700 dark:text-red-400">
                  info@kamelot-club.ru
                </a>
              </li>
              <li>Телефон: +7 (900) 123-45-67</li>
            </ul>
          </section>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <UButton to="/" color="neutral" variant="soft" size="lg">
            <UIcon name="i-heroicons-arrow-left" class="mr-2" />
            Вернуться на главную
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Пользовательское соглашение - Kamelot Fight Club',
  description: 'Пользовательское соглашение спортивного клуба Kamelot Fight Club',
})

const lastUpdated = '01 января 2025 г.'
</script>
