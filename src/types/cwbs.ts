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
  [key: string]: string | number
}

export interface ColoredValue extends NamedValue {
  color: string
}

export interface HierarchyNode {
  key: string
  name: string
  level: LevelDescription
  value: number
  color: string
  children: HierarchyNode[]
  [key: string]: unknown
}

export interface ChartLegendEntry {
  label: string
  value: number
  color: string
}

export interface IcicleSegment {
  key: string
  name: string
  color: string
  depth: number
  value: number
  level: LevelDescription
  x0: number
  x1: number
}

export interface SunburstSeries {
  center: ColoredValue[]
  orgs: ColoredValue[]
  skills: ColoredValue[]
  fundingSources: ColoredValue[]
}
