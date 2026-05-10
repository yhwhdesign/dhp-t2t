import { manageUsersStyles, shared } from '../styles'
const styles = { ...shared, ...manageUsersStyles }

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ROLES = ['tech', 'manager', 'admin']

export default function AdminManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', pin: '', role: 'tech' })
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('role', { ascending: true })
      .order('name', { ascending: true })
    setUsers(data || [])
    setLoading(false)
  }

  async function handleAdd() {
    setAddError('')
    if (!newUser.name.trim()) { setAddError('Name is required.'); return }
    if (!newUser.email.trim() || !newUser.email.includes('@')) { setAddError('Valid email is required.'); return }
    if (!newUser.pin.trim()) { setAddError('PIN is required.'); return }

    setAdding(true)
    const { error } = await supabase.from('users').insert({
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      pin: newUser.pin.trim(),
      role: newUser.role,
      active: true,
    })
    setAdding(false)

    if (error) {
      setAddError(error.message.includes('unique') ? 'That email is already in use.' : error.message)
      return
    }

    setNewUser({ name: '', email: '', pin: '', role: 'tech' })
    setShowForm(false)
    await fetchUsers()
  }

  function startEdit(user) {
    setEditingId(user.id)
    setEditValues({ name: user.name, email: user.email, pin: user.pin, role: user.role })
  }

  async function saveEdit(id) {
    await supabase.from('users').update({
      name: editValues.name.trim(),
      email: editValues.email.trim().toLowerCase(),
      pin: editValues.pin.trim(),
      role: editValues.role,
    }).eq('id', id)
    setEditingId(null)
    await fetchUsers()
  }

  async function toggleActive(user) {
    await supabase.from('users').update({ active: !user.active }).eq('id', user.id)
    await fetchUsers()
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const roleColor = (role) => {
    if (role === 'admin') return { bg: '#fef3c7', color: '#92400e' }
    if (role === 'manager') return { bg: '#e0e7ff', color: '#3730a3' }
    return { bg: '#f0f2f5', color: '#555' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <p style={styles.subtitle}>Add and manage all system users.</p>
        <button
          style={styles.addBtn}
          onClick={() => { setShowForm(s => !s); setAddError('') }}
        >
          {showForm ? '✕ Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <div style={styles.addForm}>
          <h3 style={styles.addFormTitle}>New User</h3>
          {addError && <div style={styles.errorBox}>{addError}</div>}

          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.label}>Name *</label>
              <input
                style={styles.input}
                placeholder="Full name"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div style={styles.formField}>
              <label style={styles.label}>Role *</label>
              <select
                style={styles.input}
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.label}>Email *</label>
              <input
                style={styles.input}
                placeholder="email@dhpace.com"
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div style={styles.formField}>
              <label style={styles.label}>PIN *</label>
              <input
                style={styles.input}
                placeholder="e.g. 1234"
                value={newUser.pin}
                onChange={e => setNewUser({ ...newUser, pin: e.target.value })}
                inputMode="numeric"
              />
            </div>
          </div>

          <button
            style={{ ...styles.addBtn, opacity: adding ? 0.6 : 1 }}
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? 'Saving...' : 'Save User'}
          </button>
        </div>
      )}

      <input
        style={styles.searchInput}
        placeholder="Search by name, email, or role..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No users found.</div>
      ) : (
        <div style={styles.list}>
          {filtered.map(user => {
            const isEditing = editingId === user.id
            const rc = roleColor(user.role)

            return (
              <div key={user.id} style={{
                ...styles.card,
                opacity: user.active ? 1 : 0.6,
              }}>
                {isEditing ? (
                  // Edit mode
                  <div style={styles.editMode}>
                    <div style={styles.formRow}>
                      <div style={styles.formField}>
                        <label style={styles.label}>Name</label>
                        <input
                          style={styles.input}
                          value={editValues.name}
                          onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                        />
                      </div>
                      <div style={styles.formField}>
                        <label style={styles.label}>Role</label>
                        <select
                          style={styles.input}
                          value={editValues.role}
                          onChange={e => setEditValues({ ...editValues, role: e.target.value })}
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={styles.formRow}>
                      <div style={styles.formField}>
                        <label style={styles.label}>Email</label>
                        <input
                          style={styles.input}
                          value={editValues.email}
                          onChange={e => setEditValues({ ...editValues, email: e.target.value })}
                        />
                      </div>
                      <div style={styles.formField}>
                        <label style={styles.label}>PIN</label>
                        <input
                          style={styles.input}
                          value={editValues.pin}
                          onChange={e => setEditValues({ ...editValues, pin: e.target.value })}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    <div style={styles.editActions}>
                      <button style={styles.saveBtn} onClick={() => saveEdit(user.id)}>Save</button>
                      <button style={styles.cancelEditBtn} onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div style={styles.viewMode}>
                    <div style={styles.cardLeft}>
                      <div style={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.userInfo}>
                        <div style={styles.nameRow}>
                          <span style={styles.userName}>{user.name}</span>
                          <span style={{
                            ...styles.roleBadge,
                            background: rc.bg,
                            color: rc.color,
                          }}>
                            {user.role}
                          </span>
                        </div>
                        <span style={styles.userEmail}>{user.email}</span>
                        <span style={styles.userPin}>PIN: {user.pin}</span>
                      </div>
                    </div>
                    <div style={styles.cardActions}>
                      <button style={styles.editBtn} onClick={() => startEdit(user)}>Edit</button>
                      <button
                        style={user.active ? styles.deactivateBtn : styles.activateBtn}
                        onClick={() => toggleActive(user)}
                      >
                        {user.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p style={styles.hint}>
        {users.filter(u => u.active).length} of {users.length} users active
      </p>
    </div>
  )
}