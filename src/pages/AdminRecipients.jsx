import { recipientsStyles, shared } from '../styles'
const styles = { ...shared, ...recipientsStyles }

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