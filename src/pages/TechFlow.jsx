import { useState } from 'react'
import StartTransfer from './StartTransfer'
import WarehouseReturn from './WarehouseReturn'

const BG_URL = 'https://www.dhpace.com/wp-content/uploads/2017/11/distribution-logistics-doors.jpg'

export default function TechFlow({ onBack }) {
  const [screen, setScreen] = useState('home')
  const [warehouseNumber, setWarehouseNumber] = useState('')

  const techUser = {
    id: null,
    name: `WH-${warehouseNumber}`,
    role: 'tech',
  }

  if (screen === 'transfer') {
    return (
      <StartTransfer
        user={techUser}
        warehouseNumber={warehouseNumber}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'return') {
    return (
      <WarehouseReturn
        user={techUser}
        warehouseNumber={warehouseNumber}
        onBack={() => setScreen('home')}
      />
    )
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
          <h2 style={styles.title}>Field Technician</h2>
          <p style={styles.subtitle}>Enter your warehouse number to begin</p>

          <div style={styles.field}>
            <label style={styles.label}>Warehouse Number</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. WH-042"
              value={warehouseNumber}
              onChange={e => setWarehouseNumber(e.target.value)}
              autoCapitalize="characters"
            />
          </div>

          <div style={styles.btnGroup}>
            <button
              style={{
                ...styles.actionBtn,
                background: '#1a1a2e',
                opacity: !warehouseNumber.trim() ? 0.4 : 1,
              }}
              disabled={!warehouseNumber.trim()}
              onClick={() => setScreen('transfer')}
            >
              <span style={styles.btnIcon}>📦</span>
              <span style={styles.btnLabel}>Transfer to Truck</span>
              <span style={styles.btnSub}>Log outgoing parts</span>
            </button>

            <button
              style={{
                ...styles.actionBtn,
                background: '#2d6a4f',
                opacity: !warehouseNumber.trim() ? 0.4 : 1,
              }}
              disabled={!warehouseNumber.trim()}
              onClick={() => setScreen('return')}
            >
              <span style={styles.btnIcon}>🔄</span>
              <span style={styles.btnLabel}>Return to Warehouse</span>
              <span style={styles.btnSub}>Log incoming parts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  logo: { height: 40, objectFit: 'contain', display: 'block' },
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
  field: { marginBottom: '1.5rem' },
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
  btnGroup: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  actionBtn: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '1.25rem 1.5rem',
    borderRadius: 12,
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
  },
  btnIcon: { fontSize: '1.5rem', marginBottom: '0.4rem' },
  btnLabel: { fontSize: '1rem', fontWeight: 800, marginBottom: '0.2rem' },
  btnSub: { fontSize: '0.8rem', opacity: 0.8 },
}