import { Card, CardContent, CardHeader } from '@mui/material'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { SunburstSeries } from '../types/cwbs'

interface Props {
  data: SunburstSeries
  title?: string
  height?: number
}

export const ReducedSunburst = ({
  data,
  title = 'Reduced CWBS Sunburst',
  height = 360,
}: Props) => (
  <Card>
    <CardHeader
      title={title}
      subheader="Center → Org → Skill → Funding Source view."
    />
    <CardContent sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data.center}
            dataKey="value"
            nameKey="label"
            outerRadius={60}
            stroke="#fff"
            labelLine={false}
          >
            {data.center.map((slice) => (
              <Cell key={slice.id} fill={slice.color} />
            ))}
          </Pie>
          <Pie
            data={data.orgs}
            dataKey="value"
            nameKey="label"
            innerRadius={70}
            outerRadius={110}
            stroke="#fff"
            labelLine={false}
          >
            {data.orgs.map((slice) => (
              <Cell key={slice.id} fill={slice.color} />
            ))}
          </Pie>
          <Pie
            data={data.skills}
            dataKey="value"
            nameKey="label"
            innerRadius={120}
            outerRadius={150}
            stroke="#fff"
            labelLine={false}
          >
            {data.skills.map((slice) => (
              <Cell key={slice.id} fill={slice.color} />
            ))}
          </Pie>
          <Pie
            data={data.fundingSources}
            dataKey="value"
            nameKey="label"
            innerRadius={160}
            outerRadius={190}
            stroke="#fff"
            label
            labelLine={false}
          >
            {data.fundingSources.map((slice) => (
              <Cell key={slice.id} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
