import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import type { CwbsRow, LevelDescription, LevelGroupMap } from '../types/cwbs'
import { LEVEL_ORDER, PSID_LEVELS } from '../types/cwbs'

interface Props {
  groups: LevelGroupMap
}

type SelectionState = Partial<Record<LevelDescription, CwbsRow>>

export const DrilldownTree = ({ groups }: Props) => {
  const [selection, setSelection] = useState<SelectionState>({})

  const handleSelect = (level: LevelDescription, row: CwbsRow) => {
    setSelection((prev) => ({
      ...prev,
      [level]: prev[level]?.code === row.code ? undefined : row,
    }))
  }

  const codeString = useMemo(() => {
    const psid = PSID_LEVELS.map((level) => selection[level]?.code ?? '__').join(
      '-',
    )
    const funding = LEVEL_ORDER.slice(4)
      .map((level) => selection[level]?.code ?? '__')
      .join('-')
    return `${psid} | ${funding}`
  }, [selection])

  return (
    <Card>
      <CardHeader
        title="Drilldown Explorer"
        subheader="Select one code per level to mirror the full CWBS path."
      />
      <CardContent>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {LEVEL_ORDER.map((level) => (
              <Grid
                key={level}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                sx={{ display: 'flex' }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    flex: 1,
                    p: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    minHeight: 320,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {level}
                    </Typography>
                    <Chip
                      label={
                        PSID_LEVELS.includes(level as LevelDescription)
                          ? 'PSID'
                          : 'Funding'
                      }
                      size="small"
                      color={
                        PSID_LEVELS.includes(level as LevelDescription)
                          ? 'primary'
                          : 'secondary'
                      }
                      variant="outlined"
                    />
                  </Stack>
                  <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    <List dense disablePadding>
                      {groups[level as LevelDescription]?.map((row) => (
                        <ListItemButton
                          key={row.code}
                          onClick={() => handleSelect(level as LevelDescription, row)}
                          selected={selection[level as LevelDescription]?.code === row.code}
                        >
                      <ListItemText
                        primary={`${row.code} ${row.codeName ?? ''}`.trim()}
                      />
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Selected CWBS Path
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {codeString}
            </Typography>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  )
}
