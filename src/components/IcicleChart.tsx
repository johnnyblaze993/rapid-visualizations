import { Box } from '@mui/material'
import type { IcicleSegment } from '../types/cwbs'

interface IcicleChartProps {
  segments: IcicleSegment[]
  height?: number
}

export const IcicleChart = ({ segments, height = 360 }: IcicleChartProps) => {
  if (!segments.length) {
    return (
      <Box
        sx={{
          width: '100%',
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        No hierarchy data available.
      </Box>
    )
  }

  const maxDepth =
    segments.reduce((max, segment) => Math.max(max, segment.depth), 0) + 1
  const rowHeight = height / maxDepth

  return (
    <Box sx={{ width: '100%', height }}>
      <svg viewBox={`0 0 1000 ${height}`} width="100%" height="100%">
        {segments.map((segment) => {
          const widthRatio = segment.x1 - segment.x0
          if (widthRatio <= 0) return null
          const width = widthRatio * 1000
          const x = segment.x0 * 1000
          const y = segment.depth * rowHeight
          const showLabel = width > 90
          return (
            <g key={`${segment.key}-${segment.depth}-${segment.x0}`}>
              <rect
                x={x}
                y={y + 1}
                width={width}
                height={Math.max(rowHeight - 2, 2)}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth={0.5}
                rx={2}
                ry={2}
              >
                <title>{`${segment.name} • ${segment.value.toLocaleString()}`}</title>
              </rect>
              {showLabel ? (
                <text
                  x={x + 6}
                  y={y + rowHeight / 2 + 4}
                  fill="#ffffff"
                  fontSize={12}
                  style={{ pointerEvents: 'none' }}
                >
                  {segment.name}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
    </Box>
  )
}
