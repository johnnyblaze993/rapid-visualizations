import { useEffect, useMemo, useState } from 'react'
import cwbsCsvUrl from '../assets/cwbs_levels.csv?url'
import type {
  CwbsRow,
  LevelDescription,
  LevelGroupMap,
  NamedValue,
} from '../types/cwbs'
import { PSID_LEVELS, FUNDING_LEVELS } from '../types/cwbs'
import {
  buildHeatmap,
  buildLevelStats,
  createLevelGroups,
  parseCwbsCsv,
  buildHierarchySummaries,
  buildDonutSeries,
} from '../utils/cwbs'

export const useCwbsData = () => {
  const [rows, setRows] = useState<CwbsRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch(cwbsCsvUrl)
        const csvText = await response.text()
        setRows(parseCwbsCsv(csvText))
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCsv()
  }, [])

  const groups: LevelGroupMap = useMemo(
    () => createLevelGroups(rows),
    [rows],
  )

  const stats = useMemo(() => buildLevelStats(groups), [groups])

  const barDataset = useMemo(
    () =>
      stats.map((stat) => ({
        level: stat.description,
        count: stat.count,
      })),
    [stats],
  )

  const fundingDonuts = useMemo(() => {
    const makeValues = (level: LevelDescription): NamedValue[] =>
      groups[level]?.map((entry) => ({
        id: entry.code,
        label: entry.codeName ? `${entry.code} ${entry.codeName}` : entry.code,
        value: (entry.codeName?.length ?? entry.code.length) || 1,
      })) ?? []

    return {
      sources: makeValues('Funding Source'),
      subSources: makeValues('Funding Sub-Source'),
      activities: makeValues('Activity'),
    }
  }, [groups])

  const donutSeries = useMemo(
    () => ({
      sources: buildDonutSeries(fundingDonuts.sources),
      subSources: buildDonutSeries(fundingDonuts.subSources),
      activities: buildDonutSeries(fundingDonuts.activities),
    }),
    [fundingDonuts],
  )

  const hierarchySummaries = useMemo(() => buildHierarchySummaries(groups), [groups])

  const orgSkillHeatmap = useMemo(
    () => buildHeatmap(groups['Performing Organization'], groups.Skill),
    [groups],
  )

  const fundingActivityHeatmap = useMemo(
    () => buildHeatmap(groups['Funding Source'], groups.Activity),
    [groups],
  )

  const totals = useMemo(() => {
    const psidCount = PSID_LEVELS.reduce(
      (total, level) => total + (groups[level]?.length ?? 0),
      0,
    )
    const fundingCount = FUNDING_LEVELS.reduce(
      (total, level) => total + (groups[level]?.length ?? 0),
      0,
    )

    return { psidCount, fundingCount }
  }, [groups])

  return {
    rows,
    groups,
    stats,
    barDataset,
    hierarchyTree: hierarchySummaries.fullTree,
    hierarchyLegend: hierarchySummaries.legend,
    icicleSegments: hierarchySummaries.icicleSegments,
    reducedSunburstSeries: hierarchySummaries.reducedSunburstSeries,
    orgSkillHeatmap,
    fundingActivityHeatmap,
    totals,
    donutSeries,
    isLoading,
    error,
  }
}
