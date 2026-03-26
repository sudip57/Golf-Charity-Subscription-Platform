import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/layout/PrivateRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Scores from './pages/dashboard/Scores'
import Charities from './pages/dashboard/Charities'
import Winnings from './pages/dashboard/Winnings'
import Success from './pages/Payment/Success'
import Cancel from './pages/Payment/Cancel'
import Subscription from './pages/Payment/Subscription'
// Admin Layout & Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminRoute from './components/layout/AdminRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOverview from './pages/admin/Overview'
import AdminUsers from './pages/admin/Users'
import AdminDraws from './pages/admin/Draws'
import AdminCharities from './pages/admin/Charities'
import AdminWinners from './pages/admin/Winners'
import Membership from './pages/Payment/Memebership'
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-coral-500 selection:text-white">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Dashboard Pages */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<Overview />} />
        <Route path="scores" element={<Scores />} />
        <Route path="charities" element={<Charities />} />
        <Route path="winnings" element={<Winnings />} />
        <Route path="membership" element={<Membership />} />
      </Route>
     <Route path="/payment" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
      {/* The 'index' route is what shows at exactly "/payment" */}
      <Route index element={<Subscription />} /> 
      <Route path="success" element={<Success />} />
      <Route path="cancel" element={<Cancel />} />
    </Route>
      {/* Admin Login (Public but separate) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Pages */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="draws" element={<AdminDraws />} />
        <Route path="charities" element={<AdminCharities />} />
        <Route path="winners" element={<AdminWinners />} />
      </Route>
    </Routes>
  )
}

export default App
