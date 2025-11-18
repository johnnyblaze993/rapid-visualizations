import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardFour from './pages/DashboardFour'
import Dashboard1 from './pages/Dashboard1'
import DashboardThree from './pages/DashboardThree'
import DashboardTwo from './pages/DashboardTwo'
import Home from './pages/Home'
import AppLayout from './layouts/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard-1" element={<Dashboard1 />} />
          <Route path="/dashboard-2" element={<DashboardTwo />} />
          <Route path="/dashboard-3" element={<DashboardThree />} />
          <Route path="/dashboard-4" element={<DashboardFour />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
