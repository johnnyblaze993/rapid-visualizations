import { Card, CardContent, Chip, Grid, Typography } from '@mui/material'
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
  <Grid container spacing={2}>
    {stats.map((stat) => (
      <Grid key={stat.description} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Chip
              label={`${formatBlockLabel(stat.description)} Level`}
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="h6">{stat.description}</Typography>
            <Typography variant="h3" component="p" sx={{ my: 1, fontWeight: 600 }}>
              {stat.count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.format} • {stat.codeFormat.toUpperCase()} • {stat.characters}{' '}
              chars
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)
