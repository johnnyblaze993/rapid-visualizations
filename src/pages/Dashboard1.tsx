import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import csvUrl from '../assets/task_order_routing_data_mockup.csv?url'

interface TaskOrder {
  id: number
  title: string
  requestingOrg: string
  lastAction: string
  pendingActionBy: string
  status: string
}

const STATUS_COLORS: Record<string, string> = {
  'Pending Manager Approval': '#FDD835',
  'Pending CO Approval': '#FDD835',
  'Pending Approval': '#FDD835',
  Approved: '#66BB6A',
  'Awaiting CO Approval': '#42A5F5',
  'In Routing': '#42A5F5',
  'In Review': '#78909C',
  'Awaiting Inputs': '#00ACC1',
  'Awaiting Input': '#00ACC1',
  'Returned for Revision': '#FF7043',
  'Returned for Clarification': '#FF7043',
}

const parseCsv = (text: string): TaskOrder[] => {
  const lines = text.trim().split(/\r?\n/)
  const header = lines.shift()
  if (!header) return []
  const headers = header.split(',').map((h) => h.trim())

  return lines
    .map((line, index) => {
      const values = line.split(',').map((value) => value.trim())
      const record: Record<string, string> = {}
      headers.forEach((key, idx) => {
        record[key] = values[idx] ?? ''
      })
      return {
        id: index + 1,
        title: record['TO Title'] ?? '',
        requestingOrg: record['Performing Organization'] ?? '',
        lastAction: record['Last Action'] ?? '',
        pendingActionBy: record['Pending Action By'] ?? '',
        status: record['Status'] ?? '',
      }
    })
    .filter((row) => row.title)
}

const rowsPerPage = 10

const Dashboard1 = () => {
  const [rows, setRows] = useState<TaskOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(csvUrl)
        const text = await response.text()
        setRows(parseCsv(text))
      } catch (error) {
        console.error('Failed to load CSV', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const pageCount = Math.ceil(rows.length / rowsPerPage)
  const paginatedRows = useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, page],
  )

  const from = page * rowsPerPage + 1
  const to = Math.min(rows.length, (page + 1) * rowsPerPage)

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Task Orders in Process
      </Typography>
      <Card
        sx={{
          width: 'clamp(900px, 90vw, 1400px)',
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
              <Table stickyHeader size="small">
                <TableHead
                  sx={{
                    '& .MuiTableCell-root': {
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: 14,
                    },
                  }}
                >
                  <TableRow>
                    <TableCell>TO ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Requesting Org</TableCell>
                    <TableCell>Last Action</TableCell>
                    <TableCell>Pending Action By</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: rowsPerPage }).map((_, idx) => (
                        <TableRow key={`skeleton-${idx}`}>
                          {Array.from({ length: 6 }).map((__, cellIdx) => (
                            <TableCell key={`skeleton-cell-${cellIdx}`}>
                              <Skeleton variant="rounded" height={24} />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : paginatedRows.map((row) => (
                        <TableRow key={`${row.id}-${row.title}`}>
                          <TableCell>{row.id.toString().padStart(4, '0')}</TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>{row.requestingOrg}</TableCell>
                          <TableCell>{row.lastAction}</TableCell>
                          <TableCell>{row.pendingActionBy}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              size="small"
                              sx={{
                                bgcolor:
                                  STATUS_COLORS[row.status] || 'grey.400',
                                color: '#000',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
          </TableContainer>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {rows.length === 0 ? '0 results' : `${from}–${to} of ${rows.length}`}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setPage((prev) => Math.min(pageCount - 1, prev + 1))}
              disabled={page >= pageCount - 1}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard1
