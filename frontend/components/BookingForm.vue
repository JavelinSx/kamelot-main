<template>
  <div class="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
    <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
      <!-- Выбор типа пользователя -->
      <fieldset class="m-0 flex flex-col gap-3 border-0 p-0">
        <legend class="cm-label mb-3 p-0 text-[11px] text-cm-muted">// Категория</legend>
        <div class="grid grid-cols-3 gap-2">
          <button v-for="option in userTypeOptions" :key="option.value" type="button"
            :aria-pressed="state.userType === option.value"
            class="relative flex min-h-[84px] cursor-pointer flex-col items-center justify-center gap-1 border-[1.5px] px-2 py-3 text-center transition-colors"
            :class="state.userType === option.value
              ? 'border-cm-red bg-cm-red/20 text-cm-text'
              : 'border-cm-line bg-cm-bg text-cm-text hover:border-cm-line-2'"
            @click="state.userType = option.value">
            <span class="font-display text-[22px] font-black uppercase leading-none sm:text-2xl">{{ option.label }}</span>
            <span class="font-mono text-[10px] tracking-[0.06em] text-cm-muted">{{ option.hint }}</span>
            <span v-if="state.userType === option.value" aria-hidden="true"
              class="absolute -right-px -top-px flex h-5 w-5 items-center justify-center bg-cm-red text-white">
              <UIcon name="i-lucide-check" class="h-3 w-3" />
            </span>
          </button>
        </div>
        <p v-if="!state.userType" class="m-0 text-sm text-cm-muted">Выбери категорию, чтобы продолжить.</p>
      </fieldset>

      <!-- Основная информация -->
      <fieldset v-if="state.userType" class="m-0 flex flex-col gap-4 border-0 border-t border-cm-line p-0 pt-6">
        <legend class="cm-label float-left mb-4 w-full p-0 text-[11px] text-cm-muted">// Контакты</legend>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label for="booking-first-name" class="text-[13px] font-semibold">Имя <span class="text-cm-red-ink">*</span></label>
            <UInput id="booking-first-name" v-model="state.firstName" placeholder="Введите имя" size="lg"
              :color="errors.firstName ? 'error' : 'neutral'" :highlight="!!errors.firstName" class="w-full" />
            <span v-if="errors.firstName" class="text-sm text-cm-red-ink">{{ errors.firstName }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="booking-last-name" class="text-[13px] font-semibold">Фамилия <span class="text-cm-red-ink">*</span></label>
            <UInput id="booking-last-name" v-model="state.lastName" placeholder="Введите фамилию" size="lg"
              :color="errors.lastName ? 'error' : 'neutral'" :highlight="!!errors.lastName" class="w-full" />
            <span v-if="errors.lastName" class="text-sm text-cm-red-ink">{{ errors.lastName }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="booking-contact-method" class="text-[13px] font-semibold">Способ связи <span
                class="text-cm-red-ink">*</span></label>
            <USelect id="booking-contact-method" v-model="state.contactMethod" :items="contactOptions" value-key="value"
              size="lg" class="relative z-[9999] w-full" :popper="{
                strategy: 'fixed',
                placement: 'bottom-start'
              }" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="booking-contact" class="text-[13px] font-semibold">
              {{ state.contactMethod === 'telegram' ? 'Telegram username' : 'Телефон' }} <span class="text-cm-red-ink">*</span>
            </label>
            <UInput id="booking-contact" v-model="state.contact"
              :placeholder="state.contactMethod === 'telegram' ? '@username или ссылка' : '+7 (999) 999-99-99'"
              :type="state.contactMethod === 'telegram' ? 'text' : 'tel'" size="lg"
              :color="errors.contact ? 'error' : 'neutral'" :highlight="!!errors.contact" class="w-full" />
            <span v-if="errors.contact" class="text-sm text-cm-red-ink">{{ errors.contact }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="booking-age" class="text-[13px] font-semibold">Возраст <span class="text-cm-red-ink">*</span></label>
            <UInput id="booking-age" v-model.number="state.age" placeholder="Возраст" type="number" min="5" max="99"
              size="lg" :color="errors.age ? 'error' : 'neutral'" :highlight="!!errors.age" class="w-full" />
            <span v-if="errors.age" class="text-sm text-cm-red-ink">{{ errors.age }}</span>
          </div>
        </div>
      </fieldset>

      <!-- Поля для ребёнка (только для родителей) -->
      <fieldset v-if="state.userType === 'parent'" class="m-0 flex flex-col gap-4 border-0 border-t border-cm-line p-0 pt-6">
        <legend class="cm-label float-left mb-4 w-full p-0 text-[11px] text-cm-muted">Данные ребёнка</legend>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label for="booking-child-first-name" class="text-[13px] font-semibold">Имя ребёнка <span
                class="text-cm-red-ink">*</span></label>
            <UInput id="booking-child-first-name" v-model="state.childFirstName" placeholder="Введите имя ребёнка"
              size="lg" :color="errors.childFirstName ? 'error' : 'neutral'" :highlight="!!errors.childFirstName"
              class="w-full" />
            <span v-if="errors.childFirstName" class="text-sm text-cm-red-ink">{{ errors.childFirstName }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="booking-child-last-name" class="text-[13px] font-semibold">Фамилия ребёнка <span
                class="text-cm-red-ink">*</span></label>
            <UInput id="booking-child-last-name" v-model="state.childLastName" placeholder="Введите фамилию ребёнка"
              size="lg" :color="errors.childLastName ? 'error' : 'neutral'" :highlight="!!errors.childLastName"
              class="w-full" />
            <span v-if="errors.childLastName" class="text-sm text-cm-red-ink">{{ errors.childLastName }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="booking-child-age" class="text-[13px] font-semibold">Возраст ребёнка <span
                class="text-cm-red-ink">*</span></label>
            <UInput id="booking-child-age" v-model.number="state.childAge" placeholder="Возраст ребёнка" type="number"
              min="3" max="17" size="lg" :color="errors.childAge ? 'error' : 'neutral'" :highlight="!!errors.childAge"
              class="w-full" />
            <span v-if="errors.childAge" class="text-sm text-cm-red-ink">{{ errors.childAge }}</span>
          </div>
        </div>
      </fieldset>

      <!-- Тренировки -->
      <fieldset class="m-0 flex flex-col gap-4 border-0 border-t border-cm-line p-0 pt-6">
        <legend class="cm-label float-left mb-4 w-full p-0 text-[11px] text-cm-muted">// Тренировки</legend>

        <div class="flex flex-col gap-1.5">
          <label for="booking-training" class="text-[13px] font-semibold">Направление <span class="text-cm-red-ink">*</span></label>
          <USelect id="booking-training" v-model="state.trainingType" :items="trainingOptions" value-key="value"
            placeholder="Выбери направление" size="lg" class="relative z-[9999] w-full" :popper="{
              strategy: 'fixed',
              placement: 'bottom-start'
            }" />
          <span v-if="errors.trainingType" class="text-sm text-cm-red-ink">{{ errors.trainingType }}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="booking-plan" class="text-[13px] font-semibold">Тариф <span class="text-cm-red-ink">*</span></label>
          <USelect id="booking-plan" v-model="state.pricingPlan" :items="pricingOptions" value-key="value"
            placeholder="Выбери тариф" size="lg" class="relative z-[9999] w-full" :popper="{
              strategy: 'fixed',
              placement: 'bottom-start'
            }" :loading="isLoadingPricing" />
          <span v-if="errors.pricingPlan" class="text-sm text-cm-red-ink">{{ errors.pricingPlan }}</span>

          <!-- Информация о выбранном тарифе -->
          <div v-if="selectedPlanInfo" class="mt-2 border-l-4 border-cm-red bg-cm-bg px-4 py-3">
            <p class="m-0 font-display text-xl font-extrabold uppercase">{{ selectedPlanInfo.name }} — {{
              selectedPlanInfo.price.toLocaleString('ru-RU') }} ₽</p>
            <p class="m-0 mt-1 text-sm text-cm-muted">{{ selectedPlanInfo.description }}</p>
          </div>
        </div>

        <div v-if="state.userType" class="border border-cm-line bg-cm-bg px-4 py-3.5">
          <UCheckbox v-model="state.isPrivate" color="primary" size="lg" label="Персональные тренировки"
            description="Индивидуальные занятия с тренером" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="booking-info" class="text-[13px] font-semibold">Дополнительная информация</label>
          <UTextarea id="booking-info" v-model="state.additionalInfo"
            placeholder="Цели, уровень подготовки, пожелания" :rows="3" size="lg" class="w-full" />
        </div>
      </fieldset>

      <!-- Согласие и важная информация -->
      <div v-if="state.userType" class="flex flex-col gap-4 border-t border-cm-line pt-6">
        <div class="flex flex-col gap-2 border border-[#3a2a1e] bg-[#17120f] px-4 py-4 text-[#d6d2ca]">
          <span class="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#ffb65c]">
            <UIcon name="i-lucide-triangle-alert" class="h-4 w-4" />
            Важно
          </span>
          <ul class="m-0 list-disc space-y-1 pl-5 text-[13px] leading-normal">
            <li>Перед началом занятий необходима медицинская справка</li>
            <li>Клуб не несёт ответственности за травмы при несоблюдении техники безопасности</li>
            <li>Вы подтверждаете отсутствие медицинских противопоказаний к занятиям</li>
          </ul>
        </div>

        <div class="flex flex-col gap-1">
          <UCheckbox v-model="state.agreeToTerms" color="primary" size="lg">
            <template #label>
              <span class="text-[13px] leading-normal text-cm-soft">
                Я согласен с
                <NuxtLink to="/privacy-policy" target="_blank" class="text-cm-red-ink underline">политикой
                  конфиденциальности</NuxtLink>
                и
                <NuxtLink to="/terms-of-service" target="_blank" class="text-cm-red-ink underline">пользовательским
                  соглашением</NuxtLink>
                <span class="text-cm-red-ink">*</span>
              </span>
            </template>
          </UCheckbox>
          <span v-if="errors.agreeToTerms" class="text-sm text-cm-red-ink">{{ errors.agreeToTerms }}</span>
        </div>
      </div>

      <!-- Кнопка отправки -->
      <button type="submit" class="cm-btn cm-btn-red cm-cut-lg h-[62px] w-full text-[26px]"
        :disabled="isSubmitting || !state.agreeToTerms">
        <span v-if="isSubmitting" class="h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent" />
        {{ isSubmitting ? 'Отправка' : 'Записаться на тренировку' }}
        <UIcon v-if="!isSubmitting" name="i-lucide-arrow-right" class="h-5 w-5" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import { z } from 'zod';

const emit = defineEmits<{
  bookingSuccess: []
}>()

const baseSchema = {
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
  contactMethod: z.string().min(1, 'Выберите способ связи'),
  contact: z.string().min(3, 'Введите корректные контактные данные'),
  age: z.number().min(5, 'Минимальный возраст 5 лет').max(99, 'Максимальный возраст 99 лет'),
  trainingType: z.string().min(1, 'Выберите направление тренировок'),
  pricingPlan: z.string().min(1, 'Выберите тариф'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'Необходимо согласиться с условиями'
  }),
  isPrivate: z.boolean().optional(),
  isParent: z.boolean().optional(),
  additionalInfo: z.string().optional()
}

const childSchema = {
  childFirstName: z.string().min(2, 'Имя ребёнка должно содержать минимум 2 символа'),
  childLastName: z.string().min(2, 'Фамилия ребёнка должна содержать минимум 2 символа'),
  childAge: z.number().min(3, 'Минимальный возраст ребёнка 3 года').max(17, 'Максимальный возраст ребёнка 17 лет')
}

const { selectedTrainingType, selectedSession, clearSelectedTrainingType } = useBooking()
const { pricingPlans, selectedPlan, fetchPricingPlans } = usePricing()

const state = reactive({
  userType: '', // 'teenager', 'parent', 'adult'
  firstName: '',
  lastName: '',
  contactMethod: 'phone',
  contact: '',
  age: 0,
  trainingType: '',
  pricingPlan: '',
  agreeToTerms: false,
  isPrivate: false,
  isParent: false,
  childFirstName: '',
  childLastName: '',
  childAge: 0,
  additionalInfo: ''
})

// Категории пользователя
const userTypeOptions = [
  { value: 'teenager', label: 'Подросток', hint: '5–17 лет' },
  { value: 'parent', label: 'Родитель', hint: 'за ребёнка' },
  { value: 'adult', label: 'Взрослый', hint: '18+ лет' }
]

// Загружаем тарифы
const isLoadingPricing = ref(false)
onMounted(async () => {
  if (selectedTrainingType.value) {
    state.trainingType = selectedTrainingType.value
  }

  // Загружаем тарифы
  isLoadingPricing.value = true
  await fetchPricingPlans()
  isLoadingPricing.value = false

  // Если уже выбран тариф, устанавливаем его
  if (selectedPlan.value) {
    state.pricingPlan = selectedPlan.value.id
  }
})

// Следим за изменением типа пользователя
watch(() => state.userType, (newType) => {
  // Очищаем поля ребёнка если выбран не родитель
  if (newType !== 'parent') {
    state.childFirstName = ''
    state.childLastName = ''
    state.childAge = 0
    errors.childFirstName = ''
    errors.childLastName = ''
    errors.childAge = ''
  }
})

// Устанавливаем выбранное единоборство при монтировании
watch(selectedTrainingType, (newValue) => {
  if (newValue) {
    state.trainingType = newValue
  }
})

// Следим за изменением выбранного тарифа
watch(selectedPlan, (newValue) => {
  if (newValue) {
    state.pricingPlan = newValue.id
  }
})

// Опции для выбора тарифов
const pricingOptions = computed(() => {
  return pricingPlans.value.map(plan => ({
    label: `${plan.name} - ${plan.price}₽`,
    value: plan.id
  }))
})

// Информация о выбранном тарифе
const selectedPlanInfo = computed(() => {
  if (!state.pricingPlan) return null
  return pricingPlans.value.find(plan => plan.id === state.pricingPlan)
})

const errors = reactive({
  firstName: '',
  lastName: '',
  contactMethod: '',
  contact: '',
  age: '',
  trainingType: '',
  pricingPlan: '',
  agreeToTerms: '',
  childFirstName: '',
  childLastName: '',
  childAge: ''
})

const isSubmitting = ref(false)

const contactOptions = ref<SelectItem[]>([
  { label: 'Телефон', value: 'phone' },
  { label: 'Telegram', value: 'telegram' }
])

const trainingOptions = ref<SelectItem[]>([
  { label: 'Бокс', value: 'boxing' },
  { label: 'Кикбоксинг', value: 'kickboxing' },
  { label: 'Грэпплинг', value: 'grappling' },
  { label: 'БЖЖ (Бразильское джиу-джитсу)', value: 'bjj' },
  { label: 'ММА', value: 'mma' },
  { label: 'Панкратион', value: 'pankration' }
])

function clearErrors() {
  errors.firstName = ''
  errors.lastName = ''
  errors.contactMethod = ''
  errors.contact = ''
  errors.age = ''
  errors.trainingType = ''
  errors.pricingPlan = ''
  errors.agreeToTerms = ''
  errors.childFirstName = ''
  errors.childLastName = ''
  errors.childAge = ''
}

function validateForm() {
  clearErrors()
  let isValid = true

  // Создаем схему валидации в зависимости от типа пользователя
  const schemaFields = { ...baseSchema }
  if (state.userType === 'parent') {
    Object.assign(schemaFields, childSchema)
  }

  const schema = z.object(schemaFields)

  try {
    schema.parse(state)
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: any) => {
        if (err.path[0] in errors) {
          errors[err.path[0] as keyof typeof errors] = err.message
          isValid = false
        }
      })
    }
  }

  return isValid
}

async function onSubmit() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Подготавливаем данные для отправки
    const bookingData = {
      ...state,
      sessionInfo: selectedSession.value, // Добавляем информацию о выбранной тренировке
      pricingPlanInfo: selectedPlanInfo.value // Добавляем информацию о выбранном тарифе
    }

    await sendToTelegram(bookingData)

    resetForm()
    emit('bookingSuccess')
  } catch (error: any) {
    // Показываем уведомление об ошибке
    alert(`Ошибка отправки: ${error.message || 'Неизвестная ошибка'}. Попробуйте еще раз или свяжитесь с нами по телефону.`)
  } finally {
    isSubmitting.value = false
  }
}


async function sendToTelegram(data: any) {
  const config = useRuntimeConfig()
  const apiUrl = config.public.bookingApiUrl

  const response = await $fetch<{ success: boolean; message?: string; error?: string }>(apiUrl, {
    method: 'POST',
    body: data
  })

  if (!response.success) {
    throw new Error('Ошибка отправки в Telegram')
  }
}

function resetForm() {
  state.userType = ''
  state.firstName = ''
  state.lastName = ''
  state.contactMethod = 'phone'
  state.contact = ''
  state.age = 0
  state.trainingType = ''
  state.pricingPlan = ''
  state.agreeToTerms = false
  state.isPrivate = false
  state.isParent = false
  state.childFirstName = ''
  state.childLastName = ''
  state.childAge = 0
  state.additionalInfo = ''
  clearErrors()
  clearSelectedTrainingType()
}
</script>

<style>
/* Ensure USelect dropdown is visible in modal */
.ui-select-menu-options,
[data-popper-placement],
.ui-combobox-options,
.ui-select-options {
  z-index: 10000 !important;
  position: fixed !important;
}

/* Alternative approach - ensure dropdown container has high z-index */
[data-headlessui-state="open"]>div,
.headlessui-combobox-options {
  z-index: 10000 !important;
}
</style>