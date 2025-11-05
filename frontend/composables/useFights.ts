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
  // Получаем config один раз при инициализации composable
  const config = useRuntimeConfig()
  const googleSheetsId = config.public.googleSheetsId

  console.log('[useFights] Runtime config:', {
    googleSheetsId,
    allPublicConfig: config.public
  })

  /**
   * Получение списка всех листов из Google Sheets
   */
  const getWorksheetList = async (sheetId: string): Promise<Array<{title: string, gid: string}>> => {
    const feedUrl = `https://spreadsheets.google.com/feeds/worksheets/${sheetId}/public/basic?alt=json`
    console.log('[useFights] Fetching worksheets from:', feedUrl)

    try {
      const response = await fetch(feedUrl)
      if (!response.ok) {
        console.warn('[useFights] Failed to fetch worksheet list, using first sheet only')
        return [{ title: 'Sheet1', gid: '0' }]
      }

      const data = await response.json()
      const entries = data.feed?.entry || []

      const worksheets = entries.map((entry: any) => {
        const title = entry.title?.$t || 'Untitled'
        const link = entry.link?.find((l: any) => l.rel === 'http://schemas.google.com/spreadsheets/2006#cellsfeed')
        const gid = link?.href?.match(/\/([^\/]+)$/)?.[1] || '0'
        return { title, gid }
      })

      console.log('[useFights] Found', worksheets.length, 'worksheets')
      return worksheets
    } catch (error) {
      console.error('[useFights] Error fetching worksheets:', error)
      return [{ title: 'Sheet1', gid: '0' }]
    }
  }

  /**
   * Загрузка всех боёв из всех листов Google Sheets
   * Каждый лист = один бой
   */
  const loadFights = async (): Promise<Fight[]> => {
    try {
      console.log('[useFights] loadFights called, googleSheetsId:', googleSheetsId)

      if (!googleSheetsId) {
        console.warn('[useFights] ❌ Google Sheets ID not configured')
        return []
      }

      console.log('[useFights] ✅ Google Sheets ID is set:', googleSheetsId)

      // Получаем список всех листов
      const worksheets = await getWorksheetList(googleSheetsId)
      console.log('[useFights] Processing', worksheets.length, 'worksheets')

      const allFights: Fight[] = []

      // Загружаем каждый лист отдельно
      for (let i = 0; i < worksheets.length; i++) {
        const worksheet = worksheets[i]
        console.log(`[useFights] Loading worksheet ${i + 1}/${worksheets.length}: "${worksheet.title}"`)

        try {
          const csvUrl = `https://docs.google.com/spreadsheets/d/${googleSheetsId}/export?format=csv&gid=${worksheet.gid}`
          const response = await fetch(csvUrl)

          if (!response.ok) {
            console.error(`[useFights] ❌ Failed to fetch worksheet "${worksheet.title}":`, response.status)
            continue
          }

          const csvText = await response.text()
          console.log(`[useFights] Worksheet "${worksheet.title}" CSV length:`, csvText.length, 'chars')

          const fights = parseCSVToFights(csvText)

          if (fights.length > 0) {
            console.log(`[useFights] ✅ Parsed ${fights.length} fight(s) from "${worksheet.title}"`)
            allFights.push(...fights.map(fight => convertToFight(fight)))
          } else {
            console.log(`[useFights] ⚠️ No fights in "${worksheet.title}"`)
          }
        } catch (error) {
          console.error(`[useFights] Error loading worksheet "${worksheet.title}":`, error)
          continue
        }
      }

      console.log('[useFights] Total fights loaded:', allFights.length)
      return allFights
    } catch (error) {
      console.error('[useFights] ❌ Error loading fights:', error)
      return []
    }
  }

  /**
   * Парсинг CSV в массив боёв (горизонтальный формат)
   * Первая строка - заголовки, остальные - данные
   */
  const parseCSVToFights = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return []
    }

    // Первая строка - заголовки
    const headers = parseCSVLine(lines[0])
    console.log('[useFights] CSV headers:', headers)

    const fights: any[] = []

    // Остальные строки - данные
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      const values = parseCSVLine(line)

      // Создаём объект из заголовков и значений
      const rowData: Record<string, string> = {}
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || ''
        if (value && value !== '-') {
          rowData[header.trim()] = value
        }
      })

      // Нормализуем ключи
      const cleanData: Record<string, string> = {}
      Object.keys(rowData).forEach(key => {
        const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_')
        cleanData[cleanKey] = rowData[key]
      })

      // Проверяем обязательные поля
      if (cleanData.event_name && cleanData.date) {
        fights.push(cleanData)
      }
    }

    return fights
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
