export const useBooking = () => {
  const selectedTrainingType = useState<string>('selectedTrainingType', () => '')

  const setSelectedTrainingType = (type: string) => {
    selectedTrainingType.value = type
  }

  const clearSelectedTrainingType = () => {
    selectedTrainingType.value = ''
  }

  return {
    selectedTrainingType,
    setSelectedTrainingType,
    clearSelectedTrainingType
  }
}