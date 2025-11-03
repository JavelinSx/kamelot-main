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
   * Загрузка всех боёв напрямую из Google Sheets
   */
  const loadFights = async (): Promise<Fight[]> => {
    try {
      const config = useRuntimeConfig()
      const googleSheetsId = config.public.googleSheetsId

      if (!googleSheetsId) {
        console.warn('Google Sheets ID not configured')
        return []
      }

      // Загружаем CSV напрямую из Google Sheets
      const csvUrl = `https://docs.google.com/spreadsheets/d/${googleSheetsId}/export?format=csv`
      const response = await fetch(csvUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`)
      }

      const csvText = await response.text()
      const fights = parseCSVToFights(csvText)

      return fights.map(fight => convertToFight(fight))
    } catch (error) {
      console.error('Error loading fights:', error)
      return []
    }
  }

  /**
   * Парсинг CSV в массив боёв (вертикальный формат)
   */
  const parseCSVToFights = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return []
    }

    const fightData: Record<string, string> = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue

      const values = parseCSVLine(line)

      if (values.length >= 2 && values[0] && values[1]) {
        let fieldName = values[0].trim()
        const fieldValue = values[1].trim()

        // Очищаем название поля от описаний в скобках
        const splitField = fieldName.split('(')[0]
        if (splitField) {
          fieldName = splitField.trim()
        }

        if (fieldName && fieldValue && fieldValue !== '' && fieldValue !== '-') {
          fightData[fieldName] = fieldValue
        }
      }
    }

    // Преобразуем в формат с нормализованными ключами
    const cleanData: Record<string, string> = {}
    Object.keys(fightData).forEach(key => {
      const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_')
      const value = fightData[key]
      if (value !== undefined) {
        cleanData[cleanKey] = value
      }
    })

    // Проверяем обязательные поля
    if (!cleanData.event_name || !cleanData.date) {
      return []
    }

    return [cleanData]
  }

  /**
   * Парсинг строки CSV с учетом кавычек
   */
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = i + 1 < line.length ? line[i + 1] : undefined

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }

    result.push(current)
    return result
  }

  /**
   * Преобразование данных из формата Google Sheets в формат Fight
   */
  const convertToFight = (data: any): Fight => {
    return {
      id: String(data.id || '1'),
      title: data.event_name || '',
      description: data.description || '',
      date: data.date ? `${data.date}${data.time ? `T${data.time}` : 'T00:00'}:00` : new Date().toISOString(),
      location: {
        venue: data.location || '',
        address: '',
        city: data.location || '',
      },
      fighters: [
        {
          name: data.fighter1_name || '',
          photo: '',
          record: data.fighter1_record || '',
          weight: data.weight_class || '',
          team: data.fighter1_club || '',
        },
        {
          name: data.fighter2_name || '',
          photo: '',
          record: data.fighter2_record || '',
          weight: data.weight_class || '',
          team: data.fighter2_club || '',
        },
      ],
      poster: data.poster_url || '',
      vkPost: '',
      status: (data.status || 'upcoming') as FightStatus,
      category: data.fight_type || 'MMA',
      weightClass: data.weight_class,
      rounds: data.rounds ? Number(data.rounds) : data.round ? Number(data.round) : undefined,
      ticketLink: data.tickets_url,
      streamLink: data.stream_url,
      featured: data.title_fight === 'yes',
      results: data.result ? parseResults(data.result) : undefined,
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
