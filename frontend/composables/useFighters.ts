import fightersData from '~/public/data/fighters.json'

export interface FighterRecord {
  wins: number
  losses: number
  draws: number
  knockouts: number
}

export interface ClubFighter {
  id: number
  name: string
  nickname: string
  photo: string
  discipline: string
  weightClass: string
  age: number
  experience: string
  record: FighterRecord
  achievements: string[]
  isCurrentChampion: boolean
}

export interface FightersData {
  fighters: ClubFighter[]
}

export const useFighters = () => {
  // Импортируем данные напрямую из JSON - они будут встроены в билд
  const fighters = ref<ClubFighter[]>(fightersData.fighters as ClubFighter[])

  const getChampions = () => {
    return fighters.value.filter(fighter => fighter.isCurrentChampion)
  }

  const getFightersByDiscipline = (discipline: string) => {
    return fighters.value.filter(fighter =>
      fighter.discipline.toLowerCase().includes(discipline.toLowerCase())
    )
  }

  const getWinPercentage = (record: FighterRecord) => {
    const total = record.wins + record.losses + record.draws
    if (total === 0) return 0
    return Math.round((record.wins / total) * 100)
  }

  return {
    fighters: readonly(fighters),
    getChampions,
    getFightersByDiscipline,
    getWinPercentage
  }
}
