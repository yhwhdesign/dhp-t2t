import { techFlowStyles, shared, BG_URL, LOGO_URL } from '../styles'
const styles = { ...shared, ...techFlowStyles, 
  root: shared.bgRoot,
  overlay: shared.bgOverlay,
  content: shared.bgContent,
}

import { useState } from 'react'
import StartTransfer from './StartTransfer'
import WarehouseReturn from './WarehouseReturn'

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