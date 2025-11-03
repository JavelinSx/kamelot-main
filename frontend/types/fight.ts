/**
 * Типы данных для анонсов боёв
 */

export type FightStatus = 'upcoming' | 'completed' | 'cancelled';

export type FightType = 'MMA' | 'Kickboxing' | 'Boxing' | 'Grappling' | 'Muay Thai';

export interface FightAnnouncement {
  id: string | number;
  status: FightStatus;
  event_name: string;
  fight_type: FightType;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  location: string;
  fighter1_name: string;
  fighter1_club?: string;
  fighter1_record?: string; // Формат: "W-L-D" (wins-losses-draws)
  fighter2_name: string;
  fighter2_club?: string;
  fighter2_record?: string;
  weight_class?: string;
  rounds?: number;
  title_fight?: 'yes' | 'no';
  description?: string;
  poster_url?: string;
  tickets_url?: string;
  stream_url?: string;
  result?: string; // Для completed боёв
  highlight_url?: string; // Для completed боёв
}

/**
 * Ответ API со списком боёв
 */
export interface FightsResponse {
  fights: FightAnnouncement[];
  total: number;
  source: 'google_sheets' | 'excel' | 'local';
  lastUpdated?: string;
}
