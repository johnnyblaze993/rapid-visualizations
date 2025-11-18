import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Stack,
  Typography,
} from '@mui/material'
import './App.css'
import { useCwbsData } from './hooks/useCwbsData'
import { KpiSummaryCards } from './components/KpiSummaryCards'
import { LevelBarChart } from './components/LevelBarChart'
import { FundingDonutCharts } from './components/FundingDonutCharts'
import { HierarchySunburst } from './components/HierarchySunburst'
import { HeatmapCard } from './components/HeatmapCard'
import { DrilldownTree } from './components/DrilldownTree'
import { LEVEL_ORDER } from './types/cwbs'

function App() {
  const {
    stats,
    barDataset,
    fundingDonuts,
    hierarchySeries,
    orgSkillHeatmap,
    fundingActivityHeatmap,
    groups,
    totals,
    isLoading,
    error,
  } = useCwbsData()

  if (isLoading) {
    return (
      <>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">Loading CWBS levels…</Typography>
        </Box>
      </>
    )
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                NASA CWBS Explorer
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Rapid Material UI visualizations for the 7-level Contract Work Breakdown Structure.
                Load the CSV reference data once and explore KPIs, distributions, and drilldowns.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                color="primary"
                label={`PSID definitions: ${totals.psidCount}`}
              />
              <Chip
                color="secondary"
                label={`Funding definitions: ${totals.fundingCount}`}
              />
              <Chip
                variant="outlined"
                label={`Levels tracked: ${LEVEL_ORDER.length}`}
              />
            </Stack>
          </Stack>

          {error ? <Alert severity="warning">{error}</Alert> : null}

          <KpiSummaryCards stats={stats} />
          <LevelBarChart dataset={barDataset} />
          <FundingDonutCharts
            sources={fundingDonuts.sources}
            subSources={fundingDonuts.subSources}
            activities={fundingDonuts.activities}
          />
          <HierarchySunburst series={hierarchySeries} />
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            alignItems="stretch"
          >
            <HeatmapCard
              title="Org vs Skill Heatmap"
              subtitle="Heat intensity is derived from deterministic code relationships to highlight coverage."
              rows={orgSkillHeatmap.rows.map((row) => ({
                id: row.code,
                label: row.codeName ?? row.code,
              }))}
              columns={orgSkillHeatmap.columns.map((col) => ({
                id: col.code,
                label: col.codeName ?? col.code,
              }))}
              cells={orgSkillHeatmap.cells}
            />
            <HeatmapCard
              title="Funding vs Activity Heatmap"
              subtitle="Funding sources and activities share the same scoring logic for quick comparison."
              rows={fundingActivityHeatmap.rows.map((row) => ({
                id: row.code,
                label: row.codeName ?? row.code,
              }))}
              columns={fundingActivityHeatmap.columns.map((col) => ({
                id: col.code,
                label: col.codeName ?? col.code,
              }))}
              cells={fundingActivityHeatmap.cells}
            />
          </Stack>
          <DrilldownTree groups={groups} />
        </Stack>
      </Container>
    </>
  )
}

export default App
