import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const dashboards = [
  { title: 'Dashboard 1', description: 'Overview placeholder', path: '/dashboard-1' },
  { title: 'Dashboard 2', description: 'Overview placeholder', path: '/dashboard-2' },
  { title: 'Dashboard 3', description: 'Overview placeholder', path: '/dashboard-3' },
  { title: 'Mission Dashboard', description: 'Mock up examples', path: '/dashboard-4' },
]

const Home = () => (
  <Container sx={{ py: 6 }}>
    <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
      Dashboard Hub
    </Typography>
    <Grid container spacing={3}>
      {dashboards.map((dash) => (
        <Grid size={{ xs: 12, md: 6 }} key={dash.title}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Typography variant="h5">{dash.title}</Typography>
              <Typography color="text.secondary">{dash.description}</Typography>
            </CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <CardActions>
              <Button component={RouterLink} to={dash.path}>
                Open
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
)

export default Home
