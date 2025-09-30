// Типы для конкретных боевых искусств

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