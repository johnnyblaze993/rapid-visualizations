import { Card, CardContent, Container, Typography } from '@mui/material'

const DashboardTwo = () => (
  <Container sx={{ py: 6 }}>
    <Card sx={{ maxWidth: 480, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Dashboard 2
        </Typography>
        <Typography color="text.secondary">
          Placeholder for Dashboard 2 content.
        </Typography>
      </CardContent>
    </Card>
  </Container>
)

export default DashboardTwo
