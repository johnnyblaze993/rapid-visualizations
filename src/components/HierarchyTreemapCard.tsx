import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DotProps } from 'recharts'
import type { ChartLegendEntry } from '../types/cwbs'

interface HierarchyTrendCardProps {
  legend: ChartLegendEntry[]
}

const ColorDot = (props: DotProps & { payload?: any }) => {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || !payload) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={payload.color}
      stroke="#fff"
      strokeWidth={2}
    />
  )
}

export const HierarchyTreemapCard = ({ legend }: HierarchyTrendCardProps) => {
  const dataset = legend.map((entry, index) => ({
    index,
    label: entry.label,
    value: entry.value,
    color: entry.color,
  }))

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
        title="CWBS Hierarchy Overview"
        subheader="Relative coverage for top centers"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems="stretch"
          sx={{ height: '100%' }}
        >
          <Box sx={{ flex: 1, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataset} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  interval={0}
                  height={60}
                  tick={{ fontSize: 12 }}
                  tickMargin={12}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis width={70} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#90caf9"
                  strokeWidth={3}
                  dot={<ColorDot />}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box
            sx={{
              flex: { xs: '1 1 auto', md: '0 0 280px' },
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              maxHeight: 320,
              overflowY: 'auto',
              p: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Top Centers
            </Typography>
            <Stack spacing={1}>
              {legend.map((entry) => (
                <Box
                  key={entry.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 14,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: entry.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    noWrap
                    title={entry.label}
                    sx={{ flexGrow: 1 }}
                  >
                    {entry.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {entry.value.toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
