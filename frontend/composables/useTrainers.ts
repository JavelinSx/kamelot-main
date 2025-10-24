import type { Trainer } from '~/types'
import trainersData from '~/public/data/trainers.json'

export interface TrainersData {
  trainers: Trainer[]
}

export const useTrainers = () => {
  // Импортируем данные напрямую из JSON - они будут встроены в билд
  const trainers = ref<Trainer[]>(trainersData.trainers as Trainer[])

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
    getTrainerById,
    getTrainersBySpecialization
  }
}
