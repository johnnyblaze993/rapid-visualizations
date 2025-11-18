import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'

const Navbar = () => (
  <AppBar
    position="static"
    elevation={0}
    sx={{
      bgcolor: '#fff',
      color: '#333',
      borderBottom: '1px solid #e0e0e0',
      height: 64,
      justifyContent: 'center',
    }}
  >
    <Toolbar
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 64,
        px: { xs: 1.5, md: 3 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton edge="start" color="inherit" size="large">
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
            ATOMS
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Lorem Ipsum
          </Typography>
        </Box>
      </Box>
      <Avatar sx={{ bgcolor: '#1976d2', width: 36, height: 36 }}>AI</Avatar>
    </Toolbar>
  </AppBar>
)

export default Navbar
