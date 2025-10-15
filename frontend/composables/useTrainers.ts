import type { Trainer } from '~/types'

export interface TrainersData {
  trainers: Trainer[]
}

export const useTrainers = () => {
  const trainers = useState<Trainer[]>('trainers', () => [])
  const loading = useState<boolean>('trainers-loading', () => false)
  const error = useState<Error | null>('trainers-error', () => null)

  const fetchTrainers = async () => {
    if (trainers.value.length > 0) return trainers.value

    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.storageUrl || ''
      const url = baseUrl ? `${baseUrl}/data/trainers.json` : '/data/trainers.json'

      const response = await $fetch<TrainersData>(url)
      trainers.value = response.trainers
      return response.trainers
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching trainers:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTrainerById = (id: number) => {
    return trainers.value.find(trainer => trainer.id === id)
  }

  const getTrainersBySpecialization = (specialization: any) => {
    return trainers.value.filter(trainer =>
      trainer.specializations.includes(specialization)
    )
  }

  return {
    trainers: readonly(trainers),
    loading: readonly(loading),
    error: readonly(error),
    fetchTrainers,
    getTrainerById,
    getTrainersBySpecialization
  }
}
