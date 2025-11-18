import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardFour from './pages/DashboardFour'
import DashboardOne from './pages/DashboardOne'
import DashboardThree from './pages/DashboardThree'
import DashboardTwo from './pages/DashboardTwo'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard-1" element={<DashboardOne />} />
        <Route path="/dashboard-2" element={<DashboardTwo />} />
        <Route path="/dashboard-3" element={<DashboardThree />} />
        <Route path="/dashboard-4" element={<DashboardFour />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
