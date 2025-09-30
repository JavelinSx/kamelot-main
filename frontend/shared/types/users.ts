import type { MartialArtsDiscipline } from "./martial-arts";

// Базовые типы пользователей
export interface BaseUser {
  id: string;
  email?: string;
  name: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Роли пользователей в системе
export type UserRole =
  | "guest" // Неавторизованный пользователь
  | "student-child" // Ученик-ребенок
  | "student-adult" // Ученик-взрослый
  | "trainer" // Тренер-ассистент
  | "head-trainer"; // Главный тренер

// Права доступа
export interface UserPermissions {
  // Расписание
  canViewPublicSchedule: boolean; // Просмотр общего расписания
  canViewPrivateSchedule: boolean; // Просмотр персонального расписания
  canCreateSchedule: boolean; // Создание тренировок (только главный)
  canUpdateScheduleStatus: boolean; // Изменение статуса занятия
  canDeleteSchedule: boolean; // Удаление тренировок (только главный)

  // Пользователи
  canViewStudents: boolean; // Просмотр списка учеников
  canCreateUsers: boolean; // Создание пользователей
  canUpdateUsers: boolean; // Редактирование пользователей
  canDeleteUsers: boolean; // Удаление пользователей

  // Техники и материалы
  canViewTechniques: boolean; // Просмотр техник
  canCreateTechniques: boolean; // Создание техник
  canUpdateTechniques: boolean; // Редактирование техник

  // Система поясов
  canViewBelts: boolean; // Просмотр системы поясов
  canAssignBelts: boolean; // Присвоение поясов
}

// Статус занятия для тренеров
export type TrainingStatus =
  | "scheduled" // Запланировано
  | "in-progress" // Идет занятие
  | "completed" // Завершено
  | "cancelled" // Отменено
  | "delayed" // Задерживается
  | "sick-leave"; // Тренер заболел

// Ученик-ребенок (до 16 лет)
export interface StudentChild extends BaseUser {
  role: "student-child";
  dateOfBirth: Date;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  emergencyContact: string;
  medicalInfo?: string;
  disciplines: MartialArtsDiscipline[];
  belt?: {
    discipline: MartialArtsDiscipline;
    rank: string;
    level: number;
    awardedDate: Date;
  }[];
  joinDate: Date;
  permissions: UserPermissions;
}

// Ученик-взрослый (16+ лет)
export interface StudentAdult extends BaseUser {
  role: "student-adult";
  dateOfBirth: Date;
  emergencyContact: string;
  medicalInfo?: string;
  disciplines: MartialArtsDiscipline[];
  belt?: {
    discipline: MartialArtsDiscipline;
    rank: string;
    level: number;
    awardedDate: Date;
  }[];
  joinDate: Date;
  permissions: UserPermissions;
}

// Тренер-ассистент
export interface Trainer extends BaseUser {
  role: "trainer";
  specializations: MartialArtsDiscipline[];
  experience: number; // лет опыта
  certifications: string[];
  bio?: string;
  workSchedule?: {
    availableDays: string[];
    availableHours: { start: string; end: string };
  };
  permissions: UserPermissions;
}

// Главный тренер
export interface HeadTrainer extends BaseUser {
  role: "head-trainer";
  specializations: MartialArtsDiscipline[];
  experience: number;
  certifications: string[];
  bio?: string;
  permissions: UserPermissions;
}

// Гость (неавторизованный)
export interface Guest {
  role: "guest";
  permissions: UserPermissions;
}

// Объединенный тип пользователя
export type User = StudentChild | StudentAdult | Trainer | HeadTrainer;

// Предустановленные права доступа по ролям
export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  guest: {
    canViewPublicSchedule: true,
    canViewPrivateSchedule: false,
    canCreateSchedule: false,
    canUpdateScheduleStatus: false,
    canDeleteSchedule: false,
    canViewStudents: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewTechniques: false,
    canCreateTechniques: false,
    canUpdateTechniques: false,
    canViewBelts: false,
    canAssignBelts: false,
  },

  "student-child": {
    canViewPublicSchedule: true,
    canViewPrivateSchedule: true,
    canCreateSchedule: false,
    canUpdateScheduleStatus: false,
    canDeleteSchedule: false,
    canViewStudents: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewTechniques: true,
    canCreateTechniques: false,
    canUpdateTechniques: false,
    canViewBelts: true,
    canAssignBelts: false,
  },

  "student-adult": {
    canViewPublicSchedule: true,
    canViewPrivateSchedule: true,
    canCreateSchedule: false,
    canUpdateScheduleStatus: false,
    canDeleteSchedule: false,
    canViewStudents: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewTechniques: true,
    canCreateTechniques: false,
    canUpdateTechniques: false,
    canViewBelts: true,
    canAssignBelts: false,
  },

  trainer: {
    canViewPublicSchedule: true,
    canViewPrivateSchedule: true,
    canCreateSchedule: false, // НЕ может создавать расписание
    canUpdateScheduleStatus: true, // МОЖЕТ изменять статус (задержка/болезнь)
    canDeleteSchedule: false,
    canViewStudents: true,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewTechniques: true,
    canCreateTechniques: true,
    canUpdateTechniques: true,
    canViewBelts: true,
    canAssignBelts: false,
  },

  "head-trainer": {
    canViewPublicSchedule: true,
    canViewPrivateSchedule: true,
    canCreateSchedule: true, // ТОЛЬКО главный может создавать расписание
    canUpdateScheduleStatus: true,
    canDeleteSchedule: true, // ТОЛЬКО главный может удалять
    canViewStudents: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: true,
    canViewTechniques: true,
    canCreateTechniques: true,
    canUpdateTechniques: true,
    canViewBelts: true,
    canAssignBelts: true, // ТОЛЬКО главный присваивает пояса
  },
};

// Хелперы для проверки ролей
export const isStudent = (user: User): user is StudentChild | StudentAdult =>
  user.role === "student-child" || user.role === "student-adult";

export const isTrainer = (user: User): user is Trainer | HeadTrainer =>
  user.role === "trainer" || user.role === "head-trainer";

export const isHeadTrainer = (user: User): user is HeadTrainer =>
  user.role === "head-trainer";

export const canManageSchedule = (user: User): boolean =>
  user.permissions.canCreateSchedule || user.permissions.canDeleteSchedule;

export const canUpdateScheduleStatus = (user: User): boolean =>
  user.permissions.canUpdateScheduleStatus;
