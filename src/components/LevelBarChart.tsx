import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'

interface Props {
  dataset: { level: string; count: number }[]
  title?: string
}

export const LevelBarChart = ({ dataset, title = 'CWBS Level Coverage' }: Props) => (
  <Card
    sx={{
      height: '100%',
      minHeight: 420,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardHeader title={title} subheader="Counts per level with formatting context." />
    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <BarChart
          height={320}
          dataset={dataset}
          yAxis={[{ scaleType: 'band', dataKey: 'level' }]}
          xAxis={[{ label: 'Definitions', min: 0 }]}
          margin={{ left: 120, right: 20, top: 20, bottom: 40 }}
          layout="horizontal"
          series={[
            {
              dataKey: 'count',
              label: 'Definitions',
              color: '#1976d2',
            },
          ]}
          grid={{ horizontal: true }}
        />
      </Box>
    </CardContent>
  </Card>
)
