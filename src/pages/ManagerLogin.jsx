import { managerLoginStyles as styles } from '../styles';
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ManagerLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)

    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('pin', pin.trim())
      .in('role', ['manager', 'admin'])
      .eq('active', true)
      .single()

    setLoading(false)

    if (dbError || !data) {
      setError('Invalid email or PIN.')
      return
    }

    onLogin(data)
  }

  return (
    <div style={styles.root}>
      <div style={styles.bgImage} />
      <div style={styles.overlay} />

      <div style={styles.content}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>

        <div style={styles.logoWrap}>
          <img
            src="https://www.dhpace.com/wp-content/uploads/2026/01/DHP-100-Years-RGB_FULL-COLOR_368x60px.jpg"
            alt="DH Pace"
            style={styles.logo}
          />
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Management Login</h2>
          <p style={styles.subtitle}>Enter your credentials to continue</p>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@dhpace.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoCapitalize="none"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>PIN</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              inputMode="numeric"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

const BG_URL = 'https://www.dhpace.com/wp-content/uploads/2017/11/distribution-logistics-doors.jpg'