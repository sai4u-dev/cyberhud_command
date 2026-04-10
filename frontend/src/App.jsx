import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import AchievementsMissions from './pages/AchievementsMissions'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/achievementsmissions' element={<AchievementsMissions />} />
      </Routes>
    </>
  )
}

export default App
