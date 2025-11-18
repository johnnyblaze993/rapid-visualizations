import { Paper, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import type { PieSeriesType } from '@mui/x-charts/models'

interface Props {
  series: PieSeriesType[]
}

export const HierarchySunburst = ({ series }: Props) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 1 }}>
      CWBS Hierarchy Sunburst
    </Typography>
    <PieChart
      height={420}
      series={series}
      slotProps={{
        legend: {
          direction: 'vertical',
          position: { vertical: 'bottom', horizontal: 'center' },
        },
      }}
    />
  </Paper>
)
