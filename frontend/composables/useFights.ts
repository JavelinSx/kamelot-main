// composables/useFights.ts

/**
 * Интерфейс для бойца
 */
export interface Fighter {
  name: string
  photo: string
  record: string // Формат: "W-L-D" (Wins-Losses-Draws)
  weight: string
  team: string
}

/**
 * Интерфейс для локации боя
 */
export interface FightLocation {
  venue: string
  address: string
  city: string
}

/**
 * Интерфейс для результатов боя
 */
export interface FightResults {
  winner: string
  method: string // KO, TKO, Decision, Submission, etc.
  round: number
  time: string // Формат: "MM:SS"
}

/**
 * Статус боя
 */
export type FightStatus = 'upcoming' | 'live' | 'completed' | 'cancelled'

/**
 * Интерфейс для боя
 */
export interface Fight {
  id: string
  title: string
  description: string
  date: string // ISO 8601 format
  location: FightLocation
  fighters: Fighter[]
  poster: string
  vkPost?: string
  status: FightStatus
  category?: string
  weightClass?: string
  rounds?: number
  ticketLink?: string
  streamLink?: string
  featured?: boolean
  results?: FightResults
  createdAt: string // ISO 8601 format
}

/**
 * Интерфейс для данных из fights.json
 */
export interface FightsData {
  fights: Fight[]
}

export const useFights = () => {
  /**
   * Загрузка всех боёв из API (Excel или локальные данные)
   */
  const loadFights = async (): Promise<Fight[]> => {
    try {
      // Используем новый API endpoint /api/fights
      // который загружает данные из Excel на Яндекс.Диске
      const response = await $fetch<any>('/api/fights')

      // Преобразуем данные из нового формата в старый для совместимости
      return response.fights?.map((fight: any) => convertToFight(fight)) || []
    } catch (error) {
      console.error('Error loading fights:', error)
      return []
    }
  }

  /**
   * Преобразование данных из нового формата FightAnnouncement в старый формат Fight
   */
  const convertToFight = (announcement: any): Fight => {
    return {
      id: String(announcement.id),
      title: announcement.event_name || '',
      description: announcement.description || '',
      date: announcement.date ? `${announcement.date}${announcement.time ? `T${announcement.time}` : 'T00:00'}:00` : new Date().toISOString(),
      location: {
        venue: announcement.location || '',
        address: '',
        city: announcement.location || '',
      },
      fighters: [
        {
          name: announcement.fighter1_name || '',
          photo: '',
          record: announcement.fighter1_record || '',
          weight: announcement.weight_class || '',
          team: announcement.fighter1_club || '',
        },
        {
          name: announcement.fighter2_name || '',
          photo: '',
          record: announcement.fighter2_record || '',
          weight: announcement.weight_class || '',
          team: announcement.fighter2_club || '',
        },
      ],
      poster: announcement.poster_url || '',
      vkPost: '',
      status: announcement.status || 'upcoming',
      category: announcement.fight_type || 'MMA',
      weightClass: announcement.weight_class,
      rounds: announcement.rounds,
      ticketLink: announcement.tickets_url,
      streamLink: announcement.stream_url,
      featured: announcement.title_fight === 'yes',
      results: announcement.result ? parseResults(announcement.result) : undefined,
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Парсинг результата боя из строки
   */
  const parseResults = (resultString: string): FightResults | undefined => {
    try {
      // Пример: "Победа Иванова (TKO, R2)"
      const match = resultString.match(/Победа\s+(.+?)\s+\((.+?),\s+R(\d+)\)/)
      if (match && match[1] && match[2] && match[3]) {
        return {
          winner: match[1],
          method: match[2],
          round: parseInt(match[3]),
          time: '00:00',
        }
      }
    } catch (e) {
      console.error('Error parsing result:', e)
    }
    return undefined
  }

  /**
   * Загрузка предстоящих боёв
   */
  const loadUpcomingFights = async (): Promise<Fight[]> => {
    const fights = await loadFights()
    const now = new Date()

    return fights
      .filter(fight => fight.status === 'upcoming' && new Date(fight.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  /**
   * Загрузка завершенных боёв
   */
  const loadCompletedFights = async (): Promise<Fight[]> => {
    const fights = await loadFights()

    return fights
      .filter(fight => fight.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  /**
   * Загрузка выделенных боёв (для главной страницы)
   */
  const loadFeaturedFights = async (): Promise<Fight[]> => {
    const fights = await loadFights()
    const now = new Date()

    return fights
      .filter(fight => fight.featured && fight.status === 'upcoming' && new Date(fight.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3) // Показываем только 3 ближайших выделенных боя
  }

  /**
   * Загрузка боя по ID
   */
  const loadFightById = async (id: string): Promise<Fight | null> => {
    const fights = await loadFights()
    return fights.find(fight => fight.id === id) || null
  }

  /**
   * Форматирование даты боя
   */
  const formatFightDate = (dateString: string, format: 'full' | 'short' = 'full'): string => {
    const date = new Date(dateString)

    const options: Intl.DateTimeFormatOptions = format === 'full'
      ? {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      : {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }

    return date.toLocaleDateString('ru-RU', options)
  }

  /**
   * Получение цвета статуса боя
   */
  const getStatusColor = (status: FightStatus): string => {
    const colors: Record<FightStatus, string> = {
      upcoming: 'blue',
      live: 'red',
      completed: 'green',
      cancelled: 'gray',
    }
    return colors[status] || 'gray'
  }

  /**
   * Получение текста статуса боя
   */
  const getStatusText = (status: FightStatus): string => {
    const texts: Record<FightStatus, string> = {
      upcoming: 'Скоро',
      live: 'Идет сейчас',
      completed: 'Завершен',
      cancelled: 'Отменен',
    }
    return texts[status] || 'Неизвестно'
  }

  /**
   * Проверка, является ли бой ближайшим (в течение 7 дней)
   */
  const isUpcoming = (fight: Fight): boolean => {
    const now = new Date()
    const fightDate = new Date(fight.date)
    const diff = fightDate.getTime() - now.getTime()
    const daysUntilFight = diff / (1000 * 60 * 60 * 24)

    return fight.status === 'upcoming' && daysUntilFight > 0 && daysUntilFight <= 7
  }

  /**
   * Получение времени до боя
   */
  const getTimeUntilFight = (dateString: string): string => {
    const now = new Date()
    const fightDate = new Date(dateString)
    const diff = fightDate.getTime() - now.getTime()

    if (diff < 0) return 'Бой прошел'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
      return `Через ${days} ${getDaysText(days)}`
    } else if (hours > 0) {
      return `Через ${hours} ${getHoursText(hours)}`
    } else {
      return 'Сегодня'
    }
  }

  /**
   * Склонение слова "день"
   */
  const getDaysText = (days: number): string => {
    if (days % 10 === 1 && days % 100 !== 11) return 'день'
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня'
    return 'дней'
  }

  /**
   * Склонение слова "час"
   */
  const getHoursText = (hours: number): string => {
    if (hours % 10 === 1 && hours % 100 !== 11) return 'час'
    if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) return 'часа'
    return 'часов'
  }

  return {
    loadFights,
    loadUpcomingFights,
    loadCompletedFights,
    loadFeaturedFights,
    loadFightById,
    formatFightDate,
    getStatusColor,
    getStatusText,
    isUpcoming,
    getTimeUntilFight,
  }
}
