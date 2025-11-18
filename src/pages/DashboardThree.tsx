import { Card, CardContent, Container, Typography } from '@mui/material'

const DashboardThree = () => (
  <Container sx={{ py: 6 }}>
    <Card sx={{ maxWidth: 480, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Dashboard 3
        </Typography>
        <Typography color="text.secondary">
          Placeholder for Dashboard 3 content.
        </Typography>
      </CardContent>
    </Card>
  </Container>
)

export default DashboardThree
