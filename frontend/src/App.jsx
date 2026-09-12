import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchMe } from './features/auth/authSlice'

import Navbar from './components/ui/Navbar'
import ProtectedRoute from './components/ui/ProtectedRoute'

import EnhancedLandingPage from './pages/EnhancedLandingPage'
import LandingPage from './pages/LandingPage'
import AchievementsMissions from './pages/AchievementsMissions'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import AdminPanel from './pages/admin/AdminPanel'
import BattleZone from './pages/BattleZone'
import Unauthorized from './pages/Unauthorized'

// New pages
import Settings from './pages/Settings'
import BattleLobby from './pages/battles/BattleLobby'
import OneToOne from './pages/battles/OneToOne'
import OneToMany from './pages/battles/OneToMany'
import BattleRoom from './pages/battles/BattleRoom'
import Market from './pages/market/Market'
import Arsenal from './pages/arsenal/Arsenal'
import Leaderboard from './pages/leaderboard/Leaderboard'
import Profile from './pages/profile/Profile'
import Tournament from './pages/tournament/Tournament'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) dispatch(fetchMe());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path='/' element={<EnhancedLandingPage />} />
        <Route path='/legacy' element={<LandingPage />} />
        <Route path='/achievementsmissions' element={<AchievementsMissions />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/battlezone' element={<BattleZone />} />
        <Route path='/market' element={<Market />} />
        <Route path='/arsenal' element={<Arsenal />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/tournament' element={<Tournament />} />
        <Route path='/settings' element={<Settings />} />

        {/* Battles - public lobby but actions require auth (handled inside) */}
        <Route path='/battles' element={<BattleLobby />} />
        <Route path='/battles/one-to-one' element={<OneToOne />} />
        <Route path='/battles/one-to-many' element={<OneToMany />} />
        <Route path='/battles/:id' element={<BattleRoom />} />

        {/* Protected - any authenticated */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Moderator+ */}
        <Route path='/moderator' element={
          <ProtectedRoute requireAtLeast="moderator">
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path='/admin' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Organizer */}
        <Route path='/organizer' element={
          <ProtectedRoute requireAtLeast="organizer">
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path='*' element={
          <div className="min-h-screen flex items-center justify-center bg-background pt-16">
            <div className="text-center">
              <h2 className="font-display text-4xl text-primary">404 • SECTOR_NOT_FOUND</h2>
              <p className="text-slate-400 mt-2">The requested neural path does not exist.</p>
            </div>
          </div>
        } />
      </Routes>
    </>
  )
}

export default App
