import { Box, Chip, Paper, Typography } from '@mui/material'
import type { LevelStat } from '../utils/cwbs'
import { PSID_LEVELS, FUNDING_LEVELS } from '../types/cwbs'

interface Props {
  stats: LevelStat[]
}

const formatBlockLabel = (level: string) =>
  PSID_LEVELS.includes(level as any)
    ? 'PSID'
    : FUNDING_LEVELS.includes(level as any)
      ? 'Funding'
      : 'CWBS'

export const KpiSummaryCards = ({ stats }: Props) => (
  <Box
    sx={{
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: 'minmax(140px, 1fr)',
      gap: 2,
      overflowX: 'auto',
      scrollbarWidth: 'thin',
      pb: 1,
    }}
  >
    {stats.map((stat) => (
      <Paper
        key={stat.description}
        variant="outlined"
        sx={{
          p: 1.5,
          minWidth: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Chip
          label={`${formatBlockLabel(stat.description)} Level`}
          size="small"
          sx={{ width: 'fit-content' }}
        />
        <Typography variant="subtitle2" color="text.secondary">
          {stat.description}
        </Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 600, lineHeight: 1 }}>
          {stat.count}
        </Typography>
      </Paper>
    ))}
  </Box>
)
