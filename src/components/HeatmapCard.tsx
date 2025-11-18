import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  useTheme,
} from '@mui/material'
import type { HeatmapCell } from '../utils/cwbs'

interface Props {
  title: string
  rows: { id: string; label: string }[]
  columns: { id: string; label: string }[]
  cells: HeatmapCell[]
  subtitle?: string
}

export const HeatmapCard = ({
  title,
  subtitle,
  rows,
  columns,
  cells,
}: Props) => {
  const theme = useTheme()
  const min = cells.length ? Math.min(...cells.map((cell) => cell.value)) : 0
  const max = cells.length ? Math.max(...cells.map((cell) => cell.value)) : 0
  const range = Math.max(max - min, 1)
  const cellMap = new Map(
    cells.map((cell) => [`${cell.rowId}-${cell.columnId}`, cell]),
  )

  const getColor = (value: number) => {
    const ratio = (value - min) / range
    const start = theme.palette.mode === 'dark' ? 90 : 230
    const lightness = start - ratio * 60
    return `hsl(211, 80%, ${lightness}%)`
  }

  return (
    <Card>
      <CardHeader title={title} subheader={subtitle} />
      <CardContent>
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `160px repeat(${columns.length}, 1fr)`,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Box sx={{ p: 1, bgcolor: 'background.paper' }} />
          {columns.map((col) => (
            <Box
              key={col.id}
              sx={{
                p: 1,
                bgcolor: 'background.paper',
                borderLeft: 1,
                borderColor: 'divider',
                fontWeight: 600,
              }}
            >
              {col.label}
            </Box>
          ))}
          {rows.map((row) => (
            <Box
              key={row.id}
              sx={{
                display: 'contents',
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                  fontWeight: 600,
                }}
              >
                {row.label}
              </Box>
              {columns.map((col) => {
                const cell = cellMap.get(`${row.id}-${col.id}`)
                if (!cell) return null
                const bg = getColor(cell.value)
                return (
                  <Tooltip
                    key={`${row.id}-${col.id}`}
                    title={`${cell.rowLabel} ↔ ${cell.columnLabel} • score ${cell.value}`}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderTop: 1,
                        borderLeft: 1,
                        borderColor: 'divider',
                        bgcolor: bg,
                        minHeight: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.primary',
                        fontWeight: 500,
                      }}
                    >
                      {cell.value}
                    </Box>
                  </Tooltip>
                )
              })}
            </Box>
          ))}
        </Box>
      </Box>
      </CardContent>
    </Card>
  )
}
