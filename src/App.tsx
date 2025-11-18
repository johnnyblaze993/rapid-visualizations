import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import './App.css'
import { useCwbsData } from './hooks/useCwbsData'
import { KpiSummaryCards } from './components/KpiSummaryCards'
import { LevelBarChart } from './components/LevelBarChart'
import { FundingDonutCharts } from './components/FundingDonutCharts'
import { HierarchyTreemapCard } from './components/HierarchyTreemapCard'
import { HeatmapCard } from './components/HeatmapCard'
import { DrilldownTree } from './components/DrilldownTree'
import { LEVEL_ORDER } from './types/cwbs'

function App() {
  const {
    stats,
    barDataset,
    hierarchyTree,
    hierarchyLegend,
    icicleSegments,
    orgSkillHeatmap,
    fundingActivityHeatmap,
    groups,
    totals,
    donutSeries,
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
                Mock up examples
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

          <Grid container spacing={3} alignItems="stretch">
            <Grid size={{ xs: 12 }}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardHeader
                  title="CWBS KPI Summary"
                  subheader="Counts per level, including formatting metadata."
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <KpiSummaryCards stats={stats} />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <LevelBarChart dataset={barDataset} />
            </Grid>
            <Grid size={{ xs: 12, sm: 8, md: 8 }}>
              <FundingDonutCharts
                sources={donutSeries.sources}
                subSources={donutSeries.subSources}
                activities={donutSeries.activities}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <HierarchyTreemapCard
                treeData={hierarchyTree}
                legend={hierarchyLegend}
                icicleSegments={icicleSegments}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <HeatmapCard
                title="Org vs Skill Heatmap"
                subtitle="Heat intensity uses deterministic pair scoring for compact insight."
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
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DrilldownTree groups={groups} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  )
}

export default App
