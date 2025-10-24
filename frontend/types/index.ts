// Типы для пользователей системы
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  isActive: boolean;
  role: "user" | "trainer" | "admin";
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  patronymic?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы тренировок
export type WorkoutType =
  | "mma"
  | "wrestling"
  | "grappling"
  | "kickboxing"
  | "boxing"
  | "bjj"
  | "muay_thai"
  | "karate"
  | "judo"
  | "sambo";

// Временной слот в расписании
export interface ScheduleSlot {
  start: string; // формат "HH:mm"
  end: string; // формат "HH:mm"
  type: WorkoutType;
}

// Расписание тренера по дням недели
export interface TrainerSchedule {
  monday: readonly ScheduleSlot[];
  tuesday: readonly ScheduleSlot[];
  wednesday: readonly ScheduleSlot[];
  thursday: readonly ScheduleSlot[];
  friday: readonly ScheduleSlot[];
  saturday: readonly ScheduleSlot[];
  sunday: readonly ScheduleSlot[];
}

// Статистика тренера
export interface TrainerStats {
  totalStudents: number;
  sessionsCompleted: number;
  averageRating: number;
  yearsExperience: number;
}

// Интерфейс тренера
export interface Trainer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  isActive: boolean;
  specializations: readonly WorkoutType[];
  experience: number;
  rating: number;
  reviewsCount: number;
  bio?: string;
  achievements?: readonly string[];
  certifications?: readonly string[];
  schedule: TrainerSchedule;
  price: number; // цена за тренировку в рублях
  stats: TrainerStats;
  createdAt: string;
  updatedAt: string;
}

// Типы для бронирования тренировок
export interface Booking {
  id: number;
  userId: number;
  trainerId: number;
  date: string; // формат "YYYY-MM-DD"
  timeSlot: ScheduleSlot;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для отзывов
export interface Review {
  id: number;
  userId: number;
  trainerId: number;
  bookingId?: number;
  rating: number; // от 1 до 5
  comment?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Типы для галереи
export interface GalleryImage {
  id: number;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  trainerId?: number;
  createdAt: string;
}

// Фильтры для поиска тренеров
export interface TrainerFilters {
  specializations?: WorkoutType[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  experience?: number;
  availability?: {
    day: keyof TrainerSchedule;
    time?: string;
  };
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== Утилиты =====
export type colorBadge =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error";

// ===== Типы для боевых искусств =====
export type MartialArtsDiscipline =
  | 'boxing'
  | 'kickboxing'
  | 'grappling'
  | 'bjj'
  | 'mma'
  | 'pankration'

export interface Discipline {
  id: MartialArtsDiscipline
  name: string
  description: string
  ageGroups: AgeGroup[]
  hasBelts: boolean
  techniques: Technique[]
}

export type AgeGroup = 'children' | 'adults' | 'mixed'

export interface BeltRank {
  id: string
  name: string
  color: string
  level: number
  discipline: MartialArtsDiscipline
  requirements: string[]
  minTrainingHours: number
}

export interface Technique {
  id: string
  name: string
  discipline: MartialArtsDiscipline
  category: TechniqueCategory
  difficulty: number
  beltRequirement: number
  description: string
  videoUrl?: string
  steps: string[]
}

export type TechniqueCategory =
  | 'striking'      // Ударная техника (бокс, кикбоксинг)
  | 'grappling'     // Борьба (грэплинг, БЖЖ)
  | 'submission'    // Болевые/удушающие (БЖЖ, грэплинг)
  | 'takedown'      // Сваливание (все дисциплины)
  | 'ground'        // Партер (БЖЖ, грэплинг, МMA)
  | 'clinch'        // Клинч (МMA, панкратион)
  | 'combination'   // Комбинации (все)

// Конкретные дисциплины
export const DISCIPLINES: Record<MartialArtsDiscipline, Discipline> = {
  boxing: {
    id: 'boxing',
    name: 'Бокс',
    description: 'Английский бокс - искусство ударов руками',
    ageGroups: ['children', 'adults'],
    hasBelts: false,
    techniques: []
  },
  kickboxing: {
    id: 'kickboxing',
    name: 'Кикбоксинг',
    description: 'Кикбоксинг - удары руками и ногами',
    ageGroups: ['children', 'adults'],
    hasBelts: true,
    techniques: []
  },
  grappling: {
    id: 'grappling',
    name: 'Грэплинг',
    description: 'Спортивная борьба без ударов',
    ageGroups: ['children', 'adults'],
    hasBelts: true,
    techniques: []
  },
  bjj: {
    id: 'bjj',
    name: 'Бразильское Джиу-Джитсу',
    description: 'БЖЖ - искусство наземной борьбы',
    ageGroups: ['children', 'adults'],
    hasBelts: true,
    techniques: []
  },
  mma: {
    id: 'mma',
    name: 'Смешанные боевые искусства',
    description: 'ММА - комбинация всех единоборств',
    ageGroups: ['adults'],
    hasBelts: false,
    techniques: []
  },
  pankration: {
    id: 'pankration',
    name: 'Панкратион',
    description: 'Древнегреческое боевое искусство',
    ageGroups: ['adults'],
    hasBelts: true,
    techniques: []
  }
}
