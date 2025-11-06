export interface BookingSessionData {
  discipline: string
  time: string
  day: string
  trainer: string
  ageGroup?: string
  level?: string
  zone?: string
}

export const useBooking = () => {
  // Хранит выбранный тип тренировки (для совместимости)
  const selectedTrainingType = useState<string>('selectedTrainingType', () => '')

  // Хранит полные данные о выбранной сессии из расписания
  const selectedSession = useState<BookingSessionData | null>('selectedSession', () => null)

  // Управление модальным окном записи
  const isBookingModalOpen = useState<boolean>('isBookingModalOpen', () => false)

  const setSelectedTrainingType = (type: string) => {
    selectedTrainingType.value = type
  }

  const clearSelectedTrainingType = () => {
    selectedTrainingType.value = ''
  }

  const openBookingModal = (sessionData?: BookingSessionData) => {
    if (sessionData) {
      selectedSession.value = sessionData
      selectedTrainingType.value = sessionData.discipline
    }
    isBookingModalOpen.value = true
  }

  const closeBookingModal = () => {
    isBookingModalOpen.value = false
  }

  const clearBookingData = () => {
    selectedSession.value = null
    selectedTrainingType.value = ''
  }

  return {
    selectedTrainingType,
    selectedSession,
    isBookingModalOpen,
    setSelectedTrainingType,
    clearSelectedTrainingType,
    openBookingModal,
    closeBookingModal,
    clearBookingData
  }
}