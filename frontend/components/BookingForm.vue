<template>
  <div class="p-4 lg:p-0">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Выбор типа пользователя -->
      <div class="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Выберите категорию</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div @click="state.userType = 'teenager'" :class="['cursor-pointer p-4 border-2 rounded-lg transition-all',
            state.userType === 'teenager'
              ? 'border-red-500 bg-red-50 dark:bg-red-950'
              : 'border-gray-300 dark:border-gray-700 hover:border-red-300']">
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-gray-100">Подросток</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">5-17 лет</div>
            </div>
          </div>

          <div @click="state.userType = 'parent'" :class="['cursor-pointer p-4 border-2 rounded-lg transition-all',
            state.userType === 'parent'
              ? 'border-red-500 bg-red-50 dark:bg-red-950'
              : 'border-gray-300 dark:border-gray-700 hover:border-red-300']">
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-gray-100">Родитель</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Запись для ребёнка</div>
            </div>
          </div>

          <div @click="state.userType = 'adult'" :class="['cursor-pointer p-4 border-2 rounded-lg transition-all',
            state.userType === 'adult'
              ? 'border-red-500 bg-red-50 dark:bg-red-950'
              : 'border-gray-300 dark:border-gray-700 hover:border-red-300']">
            <div class="text-center">
              <div class="font-medium text-gray-900 dark:text-gray-100">Взрослый</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">18+ лет</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Основная информация -->
      <div v-if="state.userType" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Имя <span class="text-red-500">*</span>
          </label>
          <UInput v-model="state.firstName" placeholder="Введите имя" size="lg" :error="!!errors.firstName"
            class="dark:bg-gray-800 w-full" />
          <span v-if="errors.firstName" class="text-red-500 text-sm">{{ errors.firstName }}</span>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Фамилия <span class="text-red-500">*</span>
          </label>
          <UInput v-model="state.lastName" placeholder="Введите фамилию" size="lg" :error="!!errors.lastName"
            class="dark:bg-gray-800 w-full" />
          <span v-if="errors.lastName" class="text-red-500 text-sm">{{ errors.lastName }}</span>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Способ связи <span class="text-red-500">*</span>
          </label>
          <USelect v-model="state.contactMethod" :items="contactOptions" value-key="value"
            class="w-full relative z-[9999]" :popper="{
              strategy: 'fixed',
              placement: 'bottom-start'
            }" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ state.contactMethod === 'telegram' ? 'Telegram username' : 'Телефон' }} <span
              class="text-red-500">*</span>
          </label>
          <UInput v-model="state.contact"
            :placeholder="state.contactMethod === 'telegram' ? '@username или ссылка' : '+7 (999) 999-99-99'"
            :type="state.contactMethod === 'telegram' ? 'text' : 'tel'" size="lg" :error="!!errors.contact"
            class="dark:bg-gray-800 w-full" />
          <span v-if="errors.contact" class="text-red-500 text-sm">{{ errors.contact }}</span>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
            Возраст <span class="text-red-500">*</span>
          </label>
          <UInput v-model.number="state.age" placeholder="Возраст" type="number" min="5" max="99" size="lg"
            :error="!!errors.age" class="dark:bg-gray-800 w-full" />
          <span v-if="errors.age" class="text-red-500 text-sm">{{ errors.age }}</span>
        </div>
      </div>

      <!-- Чекбоксы -->
      <div v-if="state.userType" class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Дополнительные опции</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCheckbox v-model="state.isPrivate" color="error" size="lg" label="Персональные тренировки"
            description="Индивидуальные занятия с тренером" />
        </div>
      </div>

      <!-- Поля для ребёнка (только для родителей) -->
      <div v-if="state.userType === 'parent'" class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Данные ребёнка</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Имя ребёнка <span class="text-red-500">*</span>
            </label>
            <UInput v-model="state.childFirstName" placeholder="Введите имя ребёнка" size="lg"
              :error="!!errors.childFirstName" class="dark:bg-gray-800" />
            <span v-if="errors.childFirstName" class="text-red-500 text-sm">{{ errors.childFirstName }}</span>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Фамилия ребёнка <span class="text-red-500">*</span>
            </label>
            <UInput v-model="state.childLastName" placeholder="Введите фамилию ребёнка" size="lg"
              :error="!!errors.childLastName" class="dark:bg-gray-800" />
            <span v-if="errors.childLastName" class="text-red-500 text-sm">{{ errors.childLastName }}</span>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Возраст ребёнка <span class="text-red-500">*</span>
            </label>
            <UInput v-model.number="state.childAge" placeholder="Возраст ребёнка" type="number" min="3" max="17"
              size="lg" :error="!!errors.childAge" class="dark:bg-gray-800" />
            <span v-if="errors.childAge" class="text-red-500 text-sm">{{ errors.childAge }}</span>
          </div>
        </div>
      </div>

      <!-- Направление тренировок -->
      <div class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6">
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Направление тренировок <span class="text-red-500">*</span>
        </label>
        <USelect v-model="state.trainingType" :items="trainingOptions" value-key="value"
          class="w-full relative z-[9999]" :popper="{
            strategy: 'fixed',
            placement: 'bottom-start'
          }" />
        <span v-if="errors.trainingType" class="text-red-500 text-sm">{{ errors.trainingType }}</span>
      </div>

      <!-- Выбор тарифа -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Тариф <span class="text-red-500">*</span>
        </label>
        <USelect v-model="state.pricingPlan" :items="pricingOptions" value-key="value"
          class="w-full relative z-[9999]" :popper="{
            strategy: 'fixed',
            placement: 'bottom-start'
          }" :loading="isLoadingPricing" />
        <span v-if="errors.pricingPlan" class="text-red-500 text-sm">{{ errors.pricingPlan }}</span>

        <!-- Показываем информацию о выбранном тарифе -->
        <div v-if="selectedPlanInfo" class="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start gap-2">
            <UIcon name="i-heroicons-information-circle" class="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-red-900 dark:text-red-100">
              <p class="font-semibold">{{ selectedPlanInfo.name }} - {{ selectedPlanInfo.price }}₽</p>
              <p class="text-red-700 dark:text-red-300 mt-1">{{ selectedPlanInfo.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Дополнительная информация
        </label>
        <UTextarea v-model="state.additionalInfo" placeholder="Опишите цели, уровень подготовки или особые пожелания"
          :rows="4" size="lg" class="dark:bg-gray-800 w-full" />
      </div>

      <!-- Согласие с условиями -->
      <div v-if="state.userType" class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="space-y-3">
          <UCheckbox v-model="state.agreeToTerms" color="error" size="lg" :error="!!errors.agreeToTerms">
            <template #label>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Я согласен с
                <ULink to="/privacy-policy" target="_blank"
                  class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline">
                  политикой конфиденциальности
                </ULink>
                и
                <ULink to="/terms-of-service" target="_blank"
                  class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline">
                  пользовательским соглашением
                </ULink>
                <span class="text-red-500">*</span>
              </span>
            </template>
          </UCheckbox>
          <span v-if="errors.agreeToTerms" class="text-red-500 text-sm block -mt-2">{{ errors.agreeToTerms }}</span>
        </div>

        <div class="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-information-circle"
              class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div class="text-sm text-blue-800 dark:text-blue-300">
              <p class="font-medium mb-1">Важная информация:</p>
              <ul class="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                <li>Перед началом занятий необходима медицинская справка</li>
                <li>Клуб не несёт ответственности за травмы при несоблюдении техники безопасности</li>
                <li>Вы подтверждаете отсутствие медицинских противопоказаний к занятиям</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка отправки -->
      <div class="flex justify-center pt-6">
        <UButton type="submit" color="success" size="lg" :loading="isSubmitting"
          :disabled="isSubmitting || !state.agreeToTerms" class="px-8 py-3 text-black">
          {{ isSubmitting ? 'Отправка...' : 'Записаться на тренировку' }}
        </UButton>
      </div>
    </form>

  </div>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import type { PricingPlan } from '~/types';
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
  contactMethod: 'Телефон',
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
  } catch (error) {
    // Показываем уведомление об ошибке
    alert('Ошибка отправки. Попробуйте еще раз или свяжитесь с нами по телефону.')
  } finally {
    isSubmitting.value = false
  }
}


async function sendToTelegram(data: any) {
  const response = await $fetch('/api/booking', {
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