import { Paper, Stack, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import type { NamedValue } from '../types/cwbs'

interface Props {
  sources: NamedValue[]
  subSources: NamedValue[]
  activities: NamedValue[]
}

const donuts = [
  { key: 'sources', title: 'Funding Sources' },
  { key: 'subSources', title: 'Sub-Sources' },
  { key: 'activities', title: 'Activities' },
] as const

export const FundingDonutCharts = ({
  sources,
  subSources,
  activities,
}: Props) => {
  const datasets = { sources, subSources, activities }
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      {donuts.map((donut) => (
        <Paper
          key={donut.key}
          sx={{ flex: 1, minWidth: 0, p: 2, display: 'flex', flexDirection: 'column' }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {donut.title}
          </Typography>
          <PieChart
            height={280}
            series={[
              {
                data: datasets[donut.key].map((item) => ({
                  id: item.id,
                  value: item.value,
                  label: item.label,
                })),
                innerRadius: 60,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            slotProps={{
              legend: { direction: 'vertical', position: { vertical: 'bottom' } },
            }}
          />
        </Paper>
      ))}
    </Stack>
  )
}
