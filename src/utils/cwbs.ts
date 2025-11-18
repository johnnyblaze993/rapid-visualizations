import type {
  ChartLegendEntry,
  ColoredValue,
  CwbsRow,
  HierarchyNode,
  IcicleSegment,
  LevelDescription,
  LevelGroupMap,
  NamedValue,
  SunburstSeries,
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

export const CENTER_COLORS = [
  '#1976d2',
  '#2e7d32',
  '#9c27b0',
  '#ed6c02',
  '#d32f2f',
  '#00838f',
  '#6d4c41',
  '#5e35b1',
  '#00796b',
  '#c2185b',
]

const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, value))

export const lightenHex = (hex: string, amount: number): string => {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  const r = clamp((num >> 16) + (255 - (num >> 16)) * amount)
  const g = clamp(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount)
  const b = clamp((num & 0xff) + (255 - (num & 0xff)) * amount)
  const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const createNode = (
  row: CwbsRow,
  level: LevelDescription,
  color: string,
): HierarchyNode => ({
  key: `${level}-${row.code}`,
  name: row.codeName ? `${row.code} ${row.codeName}` : row.code,
  level,
  value: Math.max(row.codeName?.length ?? row.code.length, 1),
  color,
  children: [],
})

const propagateValues = (nodes: HierarchyNode[]): number =>
  nodes.reduce((total, node) => {
    const childTotal = node.children.length
      ? propagateValues(node.children)
      : 0
    const resolved = childTotal > 0 ? childTotal : node.value
    node.value = resolved
    return total + resolved
  }, 0)

export const buildHierarchyTree = (
  groups: LevelGroupMap,
  levels: LevelDescription[] = LEVEL_ORDER,
): HierarchyNode[] => {
  if (!levels.length) return []
  const [firstLevel, ...restLevels] = levels
  const roots =
    groups[firstLevel]?.map((row, index) =>
      createNode(row, firstLevel, CENTER_COLORS[index % CENTER_COLORS.length]),
    ) ?? []

  let parentLevel = roots

  restLevels.forEach((level, index) => {
    const levelRows = groups[level] ?? []
    const nextLevelNodes: HierarchyNode[] = []
    levelRows.forEach((row) => {
      let parent: HierarchyNode | undefined
      if (parentLevel.length) {
        const parentIndex = hashString(row.code) % parentLevel.length
        parent = parentLevel[parentIndex]
      } else if (roots.length) {
        const rootIndex = hashString(`${level}-${row.code}`) % roots.length
        parent = roots[rootIndex]
      }
      const baseColor =
        parent?.color ??
        CENTER_COLORS[hashString(row.code) % CENTER_COLORS.length]
      const lightenAmount = Math.min(0.7, 0.18 * (index + 1))
      const node = createNode(row, level, lightenHex(baseColor, lightenAmount))
      if (parent) {
        parent.children.push(node)
      } else {
        roots.push(node)
      }
      nextLevelNodes.push(node)
    })
    parentLevel = nextLevelNodes
  })

  propagateValues(roots)
  return roots
}

export const buildReducedHierarchyTree = (
  groups: LevelGroupMap,
): HierarchyNode[] =>
  buildHierarchyTree(groups, [
    'Center',
    'Performing Organization',
    'Skill',
    'Funding Source',
  ])

export const flattenHierarchyForIcicle = (
  nodes: HierarchyNode[],
): IcicleSegment[] => {
  const total = nodes.reduce((sum, node) => sum + node.value, 0) || 1
  const segments: IcicleSegment[] = []

  const traverse = (
    items: HierarchyNode[],
    parentTotal: number,
    depth: number,
    startX: number,
  ) => {
    let cursor = startX
    items.forEach((node) => {
      const widthRatio = parentTotal === 0 ? 0 : node.value / parentTotal
      const x0 = cursor
      const x1 = cursor + widthRatio
      const segment: IcicleSegment = {
        key: node.key,
        name: node.name,
        color: node.color,
        depth,
        value: node.value,
        level: node.level,
        x0,
        x1,
      }
      segments.push(segment)
      if (node.children.length > 0) {
        traverse(node.children, node.value || 1, depth + 1, x0)
      }
      cursor = x1
    })
  }

  traverse(nodes, total, 0, 0)
  return segments
}

export const buildLegendEntries = (
  nodes: HierarchyNode[],
  limit = 10,
): ChartLegendEntry[] => {
  const sorted = [...nodes].sort((a, b) => b.value - a.value)
  const limited = sorted.slice(0, limit)
  const entries: ChartLegendEntry[] = limited.map((node) => ({
    label: node.name,
    value: node.value,
    color: node.color,
  }))
  if (sorted.length > limit) {
    const otherValue = sorted.slice(limit).reduce((sum, node) => sum + node.value, 0)
    entries.push({
      label: 'Other',
      value: otherValue,
      color: '#bdbdbd',
    })
  }
  return entries
}

export const buildReducedSunburstSeries = (
  tree: HierarchyNode[],
): SunburstSeries => {
  const center = tree.map<ColoredValue>((node) => ({
    id: node.key,
    label: node.name,
    value: node.value,
    color: node.color,
  }))

  const collectLevel = (
    nodes: HierarchyNode[],
    level: LevelDescription,
  ): ColoredValue[] => {
    const collection: ColoredValue[] = []
    const traverse = (items: HierarchyNode[]) => {
      items.forEach((node) => {
        if (node.level === level) {
          collection.push({
            id: node.key,
            label: node.name,
            value: node.value,
            color: node.color,
          })
        } else if (node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(nodes)
    return collection
  }

  return {
    center,
    orgs: collectLevel(tree, 'Performing Organization'),
    skills: collectLevel(tree, 'Skill'),
    fundingSources: collectLevel(tree, 'Funding Source'),
  }
}

const DONUT_COLORS = [
  '#1e88e5',
  '#43a047',
  '#f4511e',
  '#6d4c41',
  '#8e24aa',
  '#00acc1',
  '#c0ca33',
  '#fb8c00',
  '#8d6e63',
  '#5c6bc0',
]

export const buildDonutSeries = (values: NamedValue[]): ColoredValue[] =>
  values.map((value, index) => ({
    ...value,
    color: DONUT_COLORS[index % DONUT_COLORS.length],
  }))

export const CWBS_LEVELS_FOR_REDUCED_SUNBURST: LevelDescription[] = [
  'Center',
  'Performing Organization',
  'Skill',
  'Funding Source',
]

export const buildHierarchySummaries = (groups: LevelGroupMap) => {
  const fullTree = buildHierarchyTree(groups, LEVEL_ORDER)
  const reducedTree = buildReducedHierarchyTree(groups)

  return {
    fullTree,
    reducedTree,
    icicleSegments: flattenHierarchyForIcicle(fullTree),
    legend: buildLegendEntries(fullTree),
    reducedSunburstSeries: buildReducedSunburstSeries(reducedTree),
  }
}
