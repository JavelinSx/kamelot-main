export interface FighterRecord {
  wins: number
  losses: number
  draws: number
  knockouts: number
}

export interface Fighter {
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
  fighters: Fighter[]
}

export const useFighters = () => {
  const fighters = useState<Fighter[]>('fighters', () => [])
  const loading = useState<boolean>('fighters-loading', () => false)
  const error = useState<Error | null>('fighters-error', () => null)

  const fetchFighters = async () => {
    if (fighters.value.length > 0) return fighters.value

    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.storageUrl || ''
      const url = baseUrl ? `${baseUrl}/data/fighters.json` : '/data/fighters.json'

      const response = await $fetch<FightersData>(url)
      fighters.value = response.fighters
      return response.fighters
    } catch (err) {
      error.value = err as Error
      console.error('Error fetching fighters:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

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
    loading: readonly(loading),
    error: readonly(error),
    fetchFighters,
    getChampions,
    getFightersByDiscipline,
    getWinPercentage
  }
}
