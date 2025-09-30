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
  monday: ScheduleSlot[];
  tuesday: ScheduleSlot[];
  wednesday: ScheduleSlot[];
  thursday: ScheduleSlot[];
  friday: ScheduleSlot[];
  saturday: ScheduleSlot[];
  sunday: ScheduleSlot[];
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
  specializations: WorkoutType[];
  experience: number;
  rating: number;
  reviewsCount: number;
  bio?: string;
  achievements?: string[];
  certifications?: string[];
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
