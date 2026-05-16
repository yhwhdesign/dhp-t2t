import { useState, useEffect } from 'react'
import { loadConfig } from './lib/config'
import LandingScreen from './pages/LandingScreen'
import ManagerLogin from './pages/ManagerLogin'
import TechFlow from './pages/TechFlow'
import AdminPanel from './pages/AdminPanel'
import SetupWizard from './pages/SetupWizard'

export default function App() {
  const [screen, setScreen] = useState('loading')
  const [manager, setManager] = useState(null)
  const [config, setConfig] = useState(null)

  useEffect(() => {
    async function init() {
      const cfg = await loadConfig()
      //console.log('Config loaded:', cfg)
      //console.log('Setup complete:', cfg.setupComplete)
      setConfig(cfg)
      if (!cfg.setupComplete) {
        setScreen('setup')
      } else {
        setScreen('landing')
      }
    }
    init()
  }, [])

  async function handleSetupComplete() {
    const cfg = await loadConfig()
    setConfig(cfg)
    setScreen('landing')
  }

  if (screen === 'loading') {
    return (
      <div style={loadingStyles.root}>
        <div style={loadingStyles.spinner} />
        <p style={loadingStyles.text}>Loading...</p>
      </div>
    )
  }

  if (screen === 'setup') {
    return <SetupWizard onComplete={handleSetupComplete} />
  }

  if (screen === 'landing') {
    return (
      <LandingScreen
        config={config}
        onTech={() => setScreen('techFlow')}
        onManager={() => setScreen('managerLogin')}
      />
    )
  }

  if (screen === 'managerLogin') {
    return (
      <ManagerLogin
        config={config}
        onLogin={(user) => { setManager(user); setScreen('admin') }}
        onBack={() => setScreen('landing')}
      />
    )
  }

  if (screen === 'techFlow') {
    return <TechFlow config={config} onBack={() => setScreen('landing')} />
  }

  if (screen === 'admin') {
    return (
      <AdminPanel
        user={manager}
        config={config}
        onLogout={() => { setManager(null); setScreen('landing') }}
      />
    )
  }
}

const loadingStyles = {
  root: {
    minHeight: '100vh',
    background: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(255,255,255,0.2)',
    borderTop: '3px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: 500,
  },
}