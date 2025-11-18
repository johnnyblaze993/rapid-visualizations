import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { PieLabelRenderProps } from 'recharts'
import type { ColoredValue } from '../types/cwbs'

const CHARTS = [
  { key: 'sources', title: 'Funding Sources' },
  { key: 'subSources', title: 'Sub-Sources' },
  { key: 'activities', title: 'Activities' },
] as const

interface Props {
  sources: ColoredValue[]
  subSources: ColoredValue[]
  activities: ColoredValue[]
}

const RADIAN = Math.PI / 180
const MIN_PERCENT = 0.08

const renderLabel = (props: PieLabelRenderProps) => {
  const {
    cx,
    cy,
    innerRadius = 0,
    outerRadius = 0,
    percent,
    value,
    midAngle = 0,
  } = props
  if (!cx || !cy || outerRadius === undefined) return null
  const safePercent = percent ?? 0
  const percentageText = `${(safePercent * 100).toFixed(1)}%`
  const numericValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value ?? 0))
  const isSmallSlice = safePercent < MIN_PERCENT
  const insideRadius = innerRadius + (outerRadius - innerRadius) * 0.5
  const angleInRad = -midAngle * RADIAN
  const targetRadius = isSmallSlice ? outerRadius + 20 : insideRadius
  const x = cx + targetRadius * Math.cos(angleInRad)
  const y = cy + targetRadius * Math.sin(angleInRad)
  return (
    <>
      {isSmallSlice ? (
        <polyline
          points={`${cx + innerRadius * Math.cos(angleInRad)},${cy + innerRadius * Math.sin(angleInRad)} ${cx + (outerRadius + 6) * Math.cos(angleInRad)},${cy + (outerRadius + 6) * Math.sin(angleInRad)} ${x},${y}`}
          stroke="#ccc"
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
        />
      ) : null}
      <text
        x={x}
        y={y}
        fill={isSmallSlice ? '#111' : '#fff'}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
        fontWeight={600}
      >
        {numericValue}
      </text>
      {isSmallSlice ? (
        <text
          x={x}
          y={y + 14}
          fill="#555"
          textAnchor="middle"
          fontSize={10}
        >
          {percentageText}
        </text>
      ) : null}
    </>
  )
}

export const FundingDonutCharts = ({
  sources,
  subSources,
  activities,
}: Props) => {
  const datasets: Record<(typeof CHARTS)[number]['key'], ColoredValue[]> = {
    sources,
    subSources,
    activities,
  }

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title="Funding Distribution"
        subheader="Donut charts show code definitions by Funding Source, Sub-Source, and Activity."
      />
      <CardContent
        sx={{
          flexGrow: 1,
          p: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        {CHARTS.map((chart) => (
          <Box
            key={chart.key}
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography variant="subtitle1">{chart.title}</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datasets[chart.key]}
                    dataKey="value"
                    nameKey="label"
                    innerRadius="50%"
                    outerRadius="75%"
                    paddingAngle={1}
                    labelLine={false}
                    label={renderLabel}
                  >
                    {datasets[chart.key].map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _, payload) => [
                      `${value}`,
                      payload?.payload?.label ?? payload?.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}
