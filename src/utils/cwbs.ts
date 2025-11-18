import type {
  CwbsRow,
  LevelDescription,
  LevelGroupMap,
} from '../types/cwbs'
import { LEVEL_ORDER } from '../types/cwbs'

const NULL_VALUES = new Set(['null', 'n/a', ''])

export const parseCsvLine = (line: string): string[] => {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  values.push(current.trim())
  return values
}

export const parseCwbsCsv = (text: string): CwbsRow[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length <= 1) {
    return []
  }

  return lines.slice(1).map((line) => {
    const [
      level,
      codeFormat,
      characters,
      format,
      description,
      code,
      codeName,
    ] = parseCsvLine(line)
    const cleanName = codeName?.trim() ?? ''
    return {
      level: Number(level),
      codeFormat,
      characters: Number(characters),
      format,
      description: description as LevelDescription,
      code,
      codeName: NULL_VALUES.has(cleanName.toLowerCase()) ? null : cleanName,
    }
  })
}

export const createLevelGroups = (rows: CwbsRow[]): LevelGroupMap => {
  const base: LevelGroupMap = LEVEL_ORDER.reduce((acc, description) => {
    acc[description] = []
    return acc
  }, {} as LevelGroupMap)

  rows.forEach((row) => {
    if (base[row.description]) {
      base[row.description].push(row)
    }
  })

  return base
}

export interface LevelStat {
  description: LevelDescription
  count: number
  codeFormat: string
  characters: number
  format: string
}

export const buildLevelStats = (groups: LevelGroupMap): LevelStat[] =>
  LEVEL_ORDER.map((description) => {
    const entries = groups[description] ?? []
    const [sample] = entries
    return {
      description,
      count: entries.length,
      codeFormat: sample?.codeFormat ?? '',
      characters: sample?.characters ?? 0,
      format: sample?.format ?? '',
    }
  })

const hashString = (value: string): number => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export interface HeatmapCell {
  rowId: string
  columnId: string
  value: number
  rowLabel: string
  columnLabel: string
}

export const buildHeatmap = (
  rowsA: CwbsRow[],
  rowsB: CwbsRow[],
  limit = 8,
): {
  rows: CwbsRow[]
  columns: CwbsRow[]
  cells: HeatmapCell[]
} => {
  const rowSubset = rowsA.slice(0, limit)
  const columnSubset = rowsB.slice(0, limit)

  const cells: HeatmapCell[] = []
  rowSubset.forEach((rowEntry) => {
    columnSubset.forEach((colEntry) => {
      const raw = hashString(`${rowEntry.code}-${colEntry.code}`)
      const value = (raw % 15) + 1
      cells.push({
        rowId: rowEntry.code,
        columnId: colEntry.code,
        value,
        rowLabel: rowEntry.codeName ?? rowEntry.code,
        columnLabel: colEntry.codeName ?? colEntry.code,
      })
    })
  })

  return {
    rows: rowSubset,
    columns: columnSubset,
    cells,
  }
}
