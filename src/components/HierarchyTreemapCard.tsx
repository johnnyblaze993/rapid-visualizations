import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts'
import type { TreemapNode } from 'recharts/types/chart/Treemap'
import type {
  ChartLegendEntry,
  HierarchyNode,
  IcicleSegment,
} from '../types/cwbs'
import { IcicleChart } from './IcicleChart'

interface HierarchyTreemapCardProps {
  treeData: HierarchyNode[]
  legend: ChartLegendEntry[]
  icicleSegments: IcicleSegment[]
  height?: number
}

const TreemapTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="subtitle2">{data.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {data.level} • {data.value.toLocaleString()}
      </Typography>
    </Box>
  )
}

const renderTreemapNode = (props: TreemapNode) => {
  const { x, y, width, height } = props
  const payload = (props as TreemapNode & { payload?: any }).payload ?? {}
  if (width <= 0 || height <= 0) return <g />
  const minForLabel = width > 80 && height > 36
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ fill: payload.color, stroke: '#fff', strokeWidth: 1 }}
        rx={4}
        ry={4}
      />
      {minForLabel ? (
        <text
          x={x + 8}
          y={y + 20}
          fill="#fff"
          fontSize={12}
          fontWeight={600}
          pointerEvents="none"
        >
          {payload.name}
        </text>
      ) : null}
    </g>
  )
}

export const HierarchyTreemapCard = ({
  treeData,
  legend,
  icicleSegments,
  height = 420,
}: HierarchyTreemapCardProps) => {
  const [mode, setMode] = useState<'treemap' | 'icicle'>('treemap')
  const handleModeChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) setMode(value as 'treemap' | 'icicle')
  }

  const layout = useMemo(
    () => (
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems="stretch"
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {mode === 'treemap' ? (
            <ResponsiveContainer width="100%" height={height}>
              <Treemap
                data={treeData}
                dataKey="value"
                nameKey="name"
                content={renderTreemapNode}
                animationDuration={600}
                fill="#1976d2"
              >
                <Tooltip content={<TreemapTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          ) : (
            <IcicleChart segments={icicleSegments} height={height} />
          )}
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: 260 },
            maxHeight: height,
            overflowY: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Top Centers
          </Typography>
          <List dense disablePadding>
            {legend.map((entry) => (
              <ListItem key={entry.label}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: entry.color,
                      width: 28,
                      height: 28,
                    }}
                  >
                    &nbsp;
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={entry.label}
                  secondary={`${entry.value.toLocaleString()} defs`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Stack>
    ),
    [height, icicleSegments, legend, mode, treeData],
  )

  return (
    <Card>
      <CardHeader
        title="CWBS Hierarchy Overview"
        subheader="Compact treemap and icicle views for the 7-level CWBS structure."
        action={
          <ToggleButtonGroup
            exclusive
            size="small"
            value={mode}
            onChange={handleModeChange}
          >
            <ToggleButton value="treemap">Treemap</ToggleButton>
            <ToggleButton value="icicle">Icicle</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>{layout}</CardContent>
    </Card>
  )
}
