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
      .eq('role', 'manager')
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

const styles = {
  root: {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgImage: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${BG_URL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(6px)',
    transform: 'scale(1.05)',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,0.82)',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: 420,
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    justifyContent: 'center',
    gap: '1.25rem',
  },
  backBtn: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a2e',
    cursor: 'pointer',
  },
  logoWrap: {
    background: '#fff',
    borderRadius: 12,
    padding: '14px 20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  logo: {
    height: 40,
    objectFit: 'contain',
    display: 'block',
  },
  card: {
    width: '100%',
    background: '#fff',
    borderRadius: 16,
    padding: '2rem 1.5rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#1a1a2e',
    margin: '0 0 0.25rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  field: { marginBottom: '1rem' },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#555',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: 10,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#fafafa',
  },
  error: {
    color: '#e53e3e',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: '0.75rem',
  },
  loginBtn: {
    width: '100%',
    padding: '0.85rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    background: '#1a1a2e',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
}