import { Box, Card, CardContent, CardHeader, Grid } from '@mui/material'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { PieLabelRenderProps } from 'recharts'
import type { ColoredValue } from '../types/cwbs'

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
  const numericValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value ?? 0))
  const isSmallSlice = safePercent < MIN_PERCENT
  const targetRadius = isSmallSlice
    ? outerRadius + 16
    : innerRadius + (outerRadius - innerRadius) * 0.5
  const angleInRad = -midAngle * RADIAN
  const x = cx + targetRadius * Math.cos(angleInRad)
  const y = cy + targetRadius * Math.sin(angleInRad)
  const connectorStartX = cx + outerRadius * Math.cos(angleInRad)
  const connectorStartY = cy + outerRadius * Math.sin(angleInRad)
  return (
    <>
      {isSmallSlice ? (
        <line
          x1={connectorStartX}
          y1={connectorStartY}
          x2={x}
          y2={y}
          stroke="#999"
          strokeWidth={1}
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
    </>
  )
}

interface DonutCardProps {
  title: string
  data: ColoredValue[]
}

const DonutCard = ({ title, data }: DonutCardProps) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    variant="outlined"
  >
    <CardHeader title={title} />
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ height: '100%', minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={1}
              labelLine={false}
              label={renderLabel}
            >
              {data.map((entry) => (
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
    </CardContent>
  </Card>
)

interface FundingDistributionPanelProps {
  sources: ColoredValue[]
  subSources: ColoredValue[]
  activities: ColoredValue[]
}

export const FundingDonutCharts = ({
  sources,
  subSources,
  activities,
}: FundingDistributionPanelProps) => (
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
      subheader="Breakdown by Source, Sub-Source, and Activity."
    />
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <DonutCard title="Funding Sources" data={sources} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <DonutCard title="Sub-Sources" data={subSources} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <DonutCard title="Activities" data={activities} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)
