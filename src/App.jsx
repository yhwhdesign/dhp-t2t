import { useState } from 'react'
import LandingScreen from './pages/LandingScreen'
import ManagerLogin from './pages/ManagerLogin'
import TechFlow from './pages/TechFlow'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [manager, setManager] = useState(null)

  if (screen === 'landing') {
    return (
      <LandingScreen
        onTech={() => setScreen('techFlow')}
        onManager={() => setScreen('managerLogin')}
      />
    )
  }

  if (screen === 'managerLogin') {
    return (
      <ManagerLogin
        onLogin={(user) => { setManager(user); setScreen('admin') }}
        onBack={() => setScreen('landing')}
      />
    )
  }

  if (screen === 'techFlow') {
    return <TechFlow onBack={() => setScreen('landing')} />
  }

  if (screen === 'admin') {
    return (
      <AdminPanel
        user={manager}
        onLogout={() => { setManager(null); setScreen('landing') }}
      />
    )
  }
}