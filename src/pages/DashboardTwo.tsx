import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import monthlyCsvUrl from '../assets/Funding monthly data.csv?url'
import detailCsvUrl from '../assets/funding_information.csv?url'

const MONTH_MAP: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
}

interface PeriodDatum {
  id: string
  label: string
  allocation: number
  expended: number
  remaining: number
  year: number
  periodType: 'month' | 'quarter' | 'year'
}

interface FundingDetailRow {
  contractWbs: string
  pwbs: string
  fundingWbs: string
  costCenter: string
  fund: string
  pr: string
  pliAli: string
  poDoc: string
}

const parseNumber = (value: string) =>
  Number(value.replace(/[,$]/g, '').trim()) || 0

const parseCsvLines = (text: string) =>
  text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(','))

const useFundingData = () => {
  const [monthlyData, setMonthlyData] = useState<PeriodDatum[]>([])
  const [detailRows, setDetailRows] = useState<FundingDetailRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [monthlyRes, detailRes] = await Promise.all([
          fetch(monthlyCsvUrl),
          fetch(detailCsvUrl),
        ])
        const [monthlyText, detailText] = await Promise.all([
          monthlyRes.text(),
          detailRes.text(),
        ])
        setMonthlyData(parseMonthlyData(monthlyText))
        setDetailRows(parseDetailData(detailText))
      } catch (error) {
        console.error('Failed to load funding data', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const quarterlyData = useMemo(() => aggregateByQuarter(monthlyData), [monthlyData])
  const yearlyData = useMemo(() => aggregateByYear(monthlyData), [monthlyData])

  return { monthlyData, quarterlyData, yearlyData, detailRows, isLoading }
}

const parseMonthlyData = (text: string): PeriodDatum[] => {
  const rows = parseCsvLines(text)
  if (!rows.length) return []
  const headers = rows[0]
  const totals = headers.map(() => 0)

  rows.slice(1).forEach((values) => {
    values.forEach((value, idx) => {
      totals[idx] += parseNumber(value)
    })
  })

  const actuals: Record<string, number> = {}
  const estimates: Record<string, number> = {}
  headers.forEach((header, idx) => {
    if (header.startsWith('Current Month Actuals $')) {
      const key = header.replace('Current Month Actuals $', '').trim()
      actuals[key] = totals[idx]
    }
    if (header.startsWith('Current Month Estimates $')) {
      const key = header.replace('Current Month Estimates $', '').trim()
      estimates[key] = totals[idx]
    }
  })

  const months: PeriodDatum[] = Object.keys(actuals).map((label) => {
    const [monthName, yearShort] = label.split(' ')
    const monthNum = MONTH_MAP[monthName]
    const year = 2000 + Number(yearShort)
    const id = `${year}-${String(monthNum).padStart(2, '0')}`
    const allocation = estimates[label] || actuals[label]
    const expended = actuals[label]
    return {
      id,
      label,
      allocation,
      expended,
      remaining: Math.max(0, allocation - expended),
      year,
      periodType: 'month',
    }
  })

  return months.sort((a, b) => a.id.localeCompare(b.id))
}

const aggregateByQuarter = (months: PeriodDatum[]): PeriodDatum[] => {
  const quarterMap = new Map<string, PeriodDatum>()
  months.forEach((month) => {
    const monthNum = Number(month.id.split('-')[1])
    const quarter = Math.floor((monthNum - 1) / 3) + 1
    const key = `${month.year}-Q${quarter}`
    const existing = quarterMap.get(key) || {
      id: key,
      label: key,
      allocation: 0,
      expended: 0,
      remaining: 0,
      year: month.year,
      periodType: 'quarter' as const,
    }
    existing.allocation += month.allocation
    existing.expended += month.expended
    existing.remaining = Math.max(0, existing.allocation - existing.expended)
    quarterMap.set(key, existing)
  })
  return Array.from(quarterMap.values()).sort((a, b) => a.id.localeCompare(b.id))
}

const aggregateByYear = (months: PeriodDatum[]): PeriodDatum[] => {
  const yearMap = new Map<number, PeriodDatum>()
  months.forEach((month) => {
    const existing = yearMap.get(month.year) || {
      id: String(month.year),
      label: String(month.year),
      allocation: 0,
      expended: 0,
      remaining: 0,
      year: month.year,
      periodType: 'year' as const,
    }
    existing.allocation += month.allocation
    existing.expended += month.expended
    existing.remaining = Math.max(0, existing.allocation - existing.expended)
    yearMap.set(month.year, existing)
  })
  return Array.from(yearMap.values()).sort((a, b) => a.year - b.year)
}

const parseDetailData = (text: string): FundingDetailRow[] => {
  const rows = parseCsvLines(text)
  if (!rows.length) return []
  return rows.slice(1).map((values) => ({
    contractWbs: values[0] || '',
    pwbs: values[1] || '',
    fundingWbs: values[2] || '',
    costCenter: values[3] || '',
    fund: values[4] || '',
    pr: values[5] || '',
    pliAli: values[6] || '',
    poDoc: values[7] || '',
  }))
}

const PeriodOverview = ({
  monthly,
  quarterly,
  yearly,
  onSelectPeriod,
}: {
  monthly: PeriodDatum[]
  quarterly: PeriodDatum[]
  yearly: PeriodDatum[]
  onSelectPeriod: (period: PeriodDatum) => void
}) => {
  const [tab, setTab] = useState<'months' | 'quarters' | 'years'>('months')

  const chartData = {
    months: monthly,
    quarters: quarterly,
    years: yearly,
  }

  const handlePointClick = (entry: any) => {
    if (entry?.payload) {
      onSelectPeriod(entry.payload as PeriodDatum)
    }
  }

  return (
    <Card sx={{ width: 'clamp(900px, 92vw, 1400px)', borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Funding Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a period to drill into detailed funding data.
          </Typography>
        </Box>
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab label="Monthly" value="months" />
          <Tab label="Quarterly" value="quarters" />
          <Tab label="Yearly" value="years" />
        </Tabs>
        <Box sx={{ mt: 3, height: 360 }}>
          {tab === 'months' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar
                  dataKey="allocation"
                  name="Allocation"
                  fill="#42A5F5"
                  onClick={handlePointClick}
                  cursor="pointer"
                />
                <Bar
                  dataKey="expended"
                  name="Expended"
                  fill="#66BB6A"
                  onClick={handlePointClick}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          {tab === 'quarters' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.quarters} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis dataKey="label" type="category" />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar
                  dataKey="expended"
                  name="Expended"
                  fill="#66BB6A"
                  onClick={handlePointClick}
                  cursor="pointer"
                />
                <Bar
                  dataKey="remaining"
                  name="Remaining"
                  fill="#90A4AE"
                  onClick={handlePointClick}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
          {tab === 'years' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.years}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="allocation"
                  name="Allocation"
                  stroke="#42A5F5"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  onClick={handlePointClick}
                  cursor="pointer"
                />
                <Line
                  type="monotone"
                  dataKey="expended"
                  name="Expended"
                  stroke="#66BB6A"
                  strokeWidth={3}
                  onClick={handlePointClick}
                  cursor="pointer"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

const FundingDetail = ({
  period,
  detailRows,
  onBack,
}: {
  period: PeriodDatum
  detailRows: FundingDetailRow[]
  onBack: () => void
}) => (
  <Box sx={{ width: '100%' }}>
    <Button onClick={onBack} sx={{ mb: 2 }}>
      ← Back to Overview
    </Button>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Period
            </Typography>
            <Typography variant="h5">{period.label}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Allocation
            </Typography>
            <Typography variant="h5">
              ${period.allocation.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Expended
            </Typography>
            <Typography variant="h5">
              ${period.expended.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Funding Detail
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Contract WBS</TableCell>
                <TableCell>PWBS</TableCell>
                <TableCell>Funding WBS</TableCell>
                <TableCell>Cost Center</TableCell>
                <TableCell>Fund</TableCell>
                <TableCell>PR</TableCell>
                <TableCell>PLI ALI</TableCell>
                <TableCell>PO DOC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailRows.map((row, idx) => (
                <TableRow key={`${row.contractWbs}-${idx}`}>
                  <TableCell>{row.contractWbs}</TableCell>
                  <TableCell>{row.pwbs}</TableCell>
                  <TableCell>{row.fundingWbs}</TableCell>
                  <TableCell>{row.costCenter}</TableCell>
                  <TableCell>{row.fund}</TableCell>
                  <TableCell>{row.pr}</TableCell>
                  <TableCell>{row.pliAli}</TableCell>
                  <TableCell>{row.poDoc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Box>
)

const DashboardTwo = () => {
  const { monthlyData, quarterlyData, yearlyData, detailRows, isLoading } =
    useFundingData()
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodDatum | null>(null)

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, textAlign: 'center' }}>
        Funding Dashboard
      </Typography>
      {selectedPeriod ? (
        <FundingDetail
          period={selectedPeriod}
          detailRows={detailRows}
          onBack={() => setSelectedPeriod(null)}
        />
      ) : (
        <PeriodOverview
          monthly={monthlyData}
          quarterly={quarterlyData}
          yearly={yearlyData}
          onSelectPeriod={(period) => setSelectedPeriod(period)}
        />
      )}
    </Box>
  )
}

export default DashboardTwo
