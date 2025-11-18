import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const AppLayout = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-content">
      <Outlet />
    </main>
  </div>
)

export default AppLayout
