<template>
  <div class="p-4 lg:p-0">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Основная информация -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Дополнительные опции</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <UCheckbox v-model="state.isPrivate" color="error" size="lg" label="Персональные тренировки"
            description="Индивидуальные занятия с тренером" />


          <UCheckbox v-model="state.isParent" color="error" size="lg" @change="handleParentChange"
            label="Запись для ребёнка" description="Вы записываете ребёнка на тренировку" />

        </div>
      </div>

      <!-- Поля для ребёнка -->
      <div v-if="state.isParent" class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
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

      <!-- Дополнительная информация -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
          Дополнительная информация
        </label>
        <UTextarea v-model="state.additionalInfo" placeholder="Опишите цели, уровень подготовки или особые пожелания"
          :rows="4" size="lg" class="dark:bg-gray-800 w-full" />
      </div>

      <!-- Кнопка отправки -->
      <div class="flex justify-center pt-6">
        <UButton type="submit" color="success" size="lg" :loading="isSubmitting" :disabled="isSubmitting"
          class="px-8 py-3 text-black">
          {{ isSubmitting ? 'Отправка...' : 'Записаться на тренировку' }}
        </UButton>
      </div>
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
  isPrivate: z.boolean().optional(),
  isParent: z.boolean().optional(),
  additionalInfo: z.string().optional()
}

const childSchema = {
  childFirstName: z.string().min(2, 'Имя ребёнка должно содержать минимум 2 символа'),
  childLastName: z.string().min(2, 'Фамилия ребёнка должна содержать минимум 2 символа'),
  childAge: z.number().min(3, 'Минимальный возраст ребёнка 3 года').max(17, 'Максимальный возраст ребёнка 17 лет')
}

const { selectedTrainingType, clearSelectedTrainingType } = useBooking()

const state = reactive({
  firstName: '',
  lastName: '',
  contactMethod: 'Телефон',
  contact: '',
  age: 0,
  trainingType: '',
  isPrivate: false,
  isParent: false,
  childFirstName: '',
  childLastName: '',
  childAge: 0,
  additionalInfo: ''
})

// Устанавливаем выбранное единоборство при монтировании
watch(selectedTrainingType, (newValue) => {
  if (newValue) {
    state.trainingType = newValue
  }
})

// Инициализируем при монтировании, если уже что-то выбрано
onMounted(() => {
  if (selectedTrainingType.value) {
    state.trainingType = selectedTrainingType.value
  }
})

const errors = reactive({
  firstName: '',
  lastName: '',
  contactMethod: '',
  contact: '',
  age: '',
  trainingType: '',
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
  errors.childFirstName = ''
  errors.childLastName = ''
  errors.childAge = ''
}

function validateForm() {
  clearErrors()
  let isValid = true

  // Создаем схему валидации в зависимости от isParent
  const schemaFields = { ...baseSchema }
  if (state.isParent) {
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

function handleParentChange() {
  if (!state.isParent) {
    // Очищаем поля ребёнка если чекбокс выключен
    state.childFirstName = ''
    state.childLastName = ''
    state.childAge = 0
    errors.childFirstName = ''
    errors.childLastName = ''
    errors.childAge = ''
  }
}

async function onSubmit() {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await sendToTelegram(state)

    // Показываем уведомление об успехе
    console.log('Заявка успешно отправлена!')

    resetForm()
    emit('bookingSuccess')
  } catch (error) {
    console.error('Ошибка отправки:', error)
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
  state.firstName = ''
  state.lastName = ''
  state.contactMethod = 'phone'
  state.contact = ''
  state.age = 0
  state.trainingType = ''
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