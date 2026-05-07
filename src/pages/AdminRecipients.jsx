import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminRecipients() {
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  useEffect(() => { fetchRecipients() }, [])

  async function fetchRecipients() {
    setLoading(true)
    const { data } = await supabase.from('recipients').select('*').order('name', { ascending: true })
    setRecipients(data || [])
    setLoading(false)
  }

  async function handleAdd() {
    setAddError('')
    if (!newName.trim()) { setAddError('Name is required.'); return }
    if (!newEmail.trim() || !newEmail.includes('@')) { setAddError('Valid email is required.'); return }

    setAdding(true)
    const { error } = await supabase.from('recipients').insert({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      active: true,
    })
    setAdding(false)

    if (error) {
      setAddError(error.message.includes('unique') ? 'That email is already in the list.' : error.message)
      return
    }

    setNewName('')
    setNewEmail('')
    setShowForm(false)
    await fetchRecipients()
  }

  async function toggleActive(recipient) {
    await supabase.from('recipients').update({ active: !recipient.active }).eq('id', recipient.id)
    await fetchRecipients()
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this recipient?')) return
    await supabase.from('recipients').delete().eq('id', id)
    await fetchRecipients()
  }

  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <p style={styles.subtitle}>These people receive the PDF email when daily summary is sent.</p>
        <button style={styles.addBtn} onClick={() => { setShowForm(s => !s); setAddError('') }}>
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div style={styles.addForm}>
          <h3 style={styles.addFormTitle}>New Recipient</h3>
          {addError && <div style={styles.errorBox}>{addError}</div>}
          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.label}>Name *</label>
              <input style={styles.input} placeholder="e.g. Jane Smith" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div style={styles.formField}>
              <label style={styles.label}>Email *</label>
              <input style={styles.input} placeholder="jane@company.com" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </div>
          </div>
          <button style={{ ...styles.addBtn, opacity: adding ? 0.6 : 1 }} onClick={handleAdd} disabled={adding}>
            {adding ? 'Saving...' : 'Save Recipient'}
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : recipients.length === 0 ? (
        <div style={styles.empty}>No recipients yet. Add one above.</div>
      ) : (
        <div style={styles.list}>
          {recipients.map(r => (
            <div key={r.id} style={styles.row}>
              <div style={styles.rowLeft}>
                <div style={styles.avatar}>{r.name.charAt(0).toUpperCase()}</div>
                <div style={styles.rowInfo}>
                  <span style={styles.rowName}>{r.name}</span>
                  <span style={styles.rowEmail}>{r.email}</span>
                </div>
              </div>
              <div style={styles.rowRight}>
                <button style={r.active ? styles.activeToggle : styles.inactiveToggle} onClick={() => toggleActive(r)}>
                  {r.active ? '● Active' : '○ Inactive'}
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(r.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {recipients.length > 0 && (
        <p style={styles.hint}>
          {recipients.filter(r => r.active).length} active recipient{recipients.filter(r => r.active).length !== 1 ? 's' : ''} will receive daily summary emails.
        </p>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '8px 0' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' },
  subtitle: { fontSize: 13, color: '#666', margin: 0, flex: 1 },
  addBtn: {
    padding: '9px 16px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  addForm: { background: '#f8f9fb', border: '1.5px solid #e8eaed', borderRadius: 10, padding: 16, marginBottom: 20 },
  addFormTitle: { fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginTop: 0, marginBottom: 12 },
  formRow: { display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' },
  formField: { flex: 1, minWidth: 180 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 },
  input: {
    width: '100%', padding: '8px 10px', borderRadius: 7,
    border: '1.5px solid #ddd', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
  },
  errorBox: { background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 12 },
  empty: { padding: 40, textAlign: 'center', color: '#aaa', fontSize: 14 },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#fff', border: '1.5px solid #e8eaed', borderRadius: 10, padding: '12px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexWrap: 'wrap', gap: 10,
  },
  rowLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: {
    width: 38, height: 38, borderRadius: '50%', background: '#1a1a2e', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0,
  },
  rowInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  rowName: { fontSize: 14, fontWeight: 700, color: '#1a1a2e' },
  rowEmail: { fontSize: 12, color: '#888' },
  rowRight: { display: 'flex', alignItems: 'center', gap: 8 },
  activeToggle: { padding: '5px 12px', background: '#e8f5e9', color: '#2d6a4f', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  inactiveToggle: { padding: '5px 12px', background: '#f0f2f5', color: '#999', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  deleteBtn: { background: '#fee2e2', border: 'none', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', fontSize: 14 },
  hint: { marginTop: 16, fontSize: 12, color: '#888', textAlign: 'center', fontStyle: 'italic' },
}