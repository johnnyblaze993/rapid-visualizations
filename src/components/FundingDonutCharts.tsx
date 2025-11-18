import {
  Card,
  CardContent,
  CardHeader,
  Grid,
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
    name,
    value,
    midAngle = 0,
  } = props
  if (!percent || percent < MIN_PERCENT) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const percentageText = `${(percent * 100).toFixed(1)}%`
  const numericValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value ?? 0))
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={12}
      fontWeight={600}
    >
      {`${String(name ?? '')}: ${numericValue} (${percentageText})`}
    </text>
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
    <Card>
      <CardHeader
        title="Funding Distribution"
        subheader="Donut charts show code definitions by Funding Source, Sub-Source, and Activity."
      />
      <CardContent>
        <Grid container spacing={2}>
          {CHARTS.map((chart) => (
            <Grid size={{ xs: 12, md: 4 }} key={chart.key}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {chart.title}
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Tooltip
                    formatter={(value: number, _, payload) =>
                      [`${value}`, payload?.name]
                    }
                  />
                  <Pie
                    data={datasets[chart.key]}
                    dataKey="value"
                    nameKey="label"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={2}
                    labelLine={false}
                    label={renderLabel}
                  >
                    {datasets[chart.key].map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
