export type LevelDescription =
  | 'Center'
  | 'Performing Organization'
  | 'Skill'
  | 'Task ID'
  | 'Funding Source'
  | 'Funding Sub-Source'
  | 'Activity'

export interface CwbsRow {
  level: number
  codeFormat: string
  characters: number
  format: string
  description: LevelDescription
  code: string
  codeName: string | null
}

export type LevelGroupMap = Record<LevelDescription, CwbsRow[]>

export const LEVEL_ORDER: LevelDescription[] = [
  'Center',
  'Performing Organization',
  'Skill',
  'Task ID',
  'Funding Source',
  'Funding Sub-Source',
  'Activity',
]

export const PSID_LEVELS = LEVEL_ORDER.slice(0, 4)
export const FUNDING_LEVELS = LEVEL_ORDER.slice(4)

export interface NamedValue {
  id: string
  label: string
  value: number
}
