import { Card, CardContent, Container, Typography } from '@mui/material'

const DashboardOne = () => (
  <Container sx={{ py: 6 }}>
    <Card sx={{ maxWidth: 480, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Dashboard 1
        </Typography>
        <Typography color="text.secondary">
          Placeholder for Dashboard 1 content.
        </Typography>
      </CardContent>
    </Card>
  </Container>
)

export default DashboardOne
