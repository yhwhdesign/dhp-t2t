import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ActivityLogModal({ onClose }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const { data } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    setLogs(data || [])
    setLoading(false)
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })
  }

  function actionColor(action) {
    if (action.includes('deleted')) return { bg: '#fee2e2', color: '#dc2626' }
    if (action.includes('duplicate')) return { bg: '#fef3c7', color: '#92400e' }
    if (action.includes('added')) return { bg: '#e8f5e9', color: '#2d6a4f' }
    if (action.includes('updated')) return { bg: '#e0e7ff', color: '#3730a3' }
    return { bg: '#f0f2f5', color: '#555' }
  }

  function actionIcon(action) {
    if (action.includes('deleted')) return '🗑'
    if (action.includes('duplicate')) return '⚠️'
    if (action.includes('added')) return '✓'
    if (action.includes('updated')) return '✏️'
    return '•'
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Activity Log</h3>
            <p style={styles.subtitle}>Parts changes — last 30 days</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : logs.length === 0 ? (
          <div style={styles.empty}>No activity yet.</div>
        ) : (
          <div style={styles.list}>
            {logs.map(log => {
              const ac = actionColor(log.action)
              return (
                <div key={log.id} style={styles.entry}>
                  <div style={styles.entryLeft}>
                    <div style={{
                      ...styles.iconBadge,
                      background: ac.bg,
                      color: ac.color,
                    }}>
                      {actionIcon(log.action)}
                    </div>
                    <div style={styles.entryInfo}>
                      <div style={styles.entryTop}>
                        <span style={{
                          ...styles.actionBadge,
                          background: ac.bg,
                          color: ac.color,
                        }}>
                          {log.action}
                        </span>
                        {log.details?.part_number && (
                          <span style={styles.partNumber}>
                            {log.details.part_number}
                          </span>
                        )}
                      </div>
                      {log.details?.description && (
                        <p style={styles.entryDesc}>{log.details.description}</p>
                      )}
                      {log.details?.note && (
                        <p style={styles.entryNote}>{log.details.note}</p>
                      )}
                      <div style={styles.entryMeta}>
                        <span>{log.performed_by}</span>
                        <span>·</span>
                        <span>{formatDate(log.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, padding: 16,
  },
  modal: {
    background: '#fff', borderRadius: 14, width: '100%',
    maxWidth: 480, maxHeight: '85vh', display: 'flex',
    flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: '20px 20px 16px',
    borderBottom: '1px solid #f0f0f0',
    flexShrink: 0,
  },
  title: { fontSize: 18, fontWeight: 800, color: '#1a1a2e', margin: 0 },
  subtitle: { fontSize: 12, color: '#aaa', margin: '4px 0 0' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 18,
    color: '#999', cursor: 'pointer', padding: 0, flexShrink: 0,
  },
  list: { overflowY: 'auto', padding: '12px 20px', flex: 1 },
  empty: { padding: 40, textAlign: 'center', color: '#aaa', fontSize: 14 },
  entry: {
    paddingBottom: 14, marginBottom: 14,
    borderBottom: '1px solid #f5f5f5',
  },
  entryLeft: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  iconBadge: {
    width: 32, height: 32, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, flexShrink: 0,
  },
  entryInfo: { flex: 1 },
  entryTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  actionBadge: {
    fontSize: 10, fontWeight: 700, padding: '2px 8px',
    borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  partNumber: { fontSize: 13, fontWeight: 700, color: '#1a1a2e' },
  entryDesc: { fontSize: 12, color: '#666', margin: '0 0 4px' },
  entryNote: {
    fontSize: 12, color: '#888', margin: '0 0 4px',
    fontStyle: 'italic',
  },
  entryMeta: {
    display: 'flex', gap: 6, fontSize: 11, color: '#aaa',
  },
}