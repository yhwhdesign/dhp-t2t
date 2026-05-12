import { adminPanelStyles, shared, LOGO_URL } from '../styles'
const styles = { ...shared, ...adminPanelStyles }

import ActivityLogModal from '../components/ActivityLogModal'
import { useState } from 'react'
import AdminPendingTransfers from './AdminPendingTransfers'
import AdminTransferHistory from './AdminTransferHistory'
import AdminManageParts from './AdminManageParts'
import AdminDailySummary from './AdminDailySummary'
import AdminRecipients from './AdminRecipients'
import AdminManageUsers from './AdminManageUsers'

const TABS = [
  { id: 'pending', label: 'Pending', icon: '🕐' },
  { id: 'history', label: 'History', icon: '🗂' },
  { id: 'parts', label: 'Parts', icon: '📦' },
  { id: 'daily', label: 'Daily', icon: '📤' },
  { id: 'recipients', label: 'Recipients', icon: '📬' },
  { id: 'users', label: 'Users', icon: '👤', adminOnly: true },
]

const TAB_TITLES = {
  pending: 'Pending Transfers',
  history: 'Transfer History',
  parts: 'Manage Parts',
  daily: 'Daily Summary',
  recipients: 'Recipients',
  users: 'Manage Users',
}

export default function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('pending')
  const [showLog, setShowLog] = useState(false)

  return (
    <div style={styles.root}>
      {/* Top header */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <img
            src="https://www.dhpace.com/wp-content/uploads/2026/01/DHP-100-Years-RGB_FULL-COLOR_368x60px.jpg"
            alt="DH Pace"
            style={styles.topLogo}
          />
        </div>
        <div style={styles.topBarRight}>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name}</span>
            <span style={styles.userRole}>Manager</span>
          </div>
          <button style={styles.logBtn} onClick={() => setShowLog(true)}>
            📋 Log
          </button>
          <button style={styles.logoutBtn} onClick={onLogout}>
            Sign Out
          </button>
        </div>
        {showLog && <ActivityLogModal onClose={() => setShowLog(false)} />}
      </div>

      {/* Page title bar */}
      <div style={styles.titleBar}>
        <h1 style={styles.pageTitle}>{TAB_TITLES[activeTab]}</h1>
      </div>

      {/* Content area */}
      <div style={styles.content}>
        {activeTab === 'users' && user?.role === 'admin' && <AdminManageUsers />}
        {activeTab === 'pending' && <AdminPendingTransfers user={user} />}
        {activeTab === 'history' && <AdminTransferHistory />}
        {activeTab === 'parts' && <AdminManageParts />}
        {activeTab === 'daily' && <AdminDailySummary user={user} />}
        {activeTab === 'recipients' && <AdminRecipients />}
      </div>

      {/* Bottom nav */}
      <nav style={styles.bottomNav}>
        {TABS.filter(tab => !tab.adminOnly || user?.role === 'admin').map(tab => (
          <button
            key={tab.id}
            style={activeTab === tab.id
              ? { ...styles.navBtn, ...styles.navBtnActive }
              : styles.navBtn}
            onClick={() => setActiveTab(tab.id)}
          >
            {activeTab === tab.id && <div style={styles.navIndicator} />}
            <span style={styles.navIcon}>{tab.icon}</span>
            <span style={activeTab === tab.id
              ? { ...styles.navLabel, ...styles.navLabelActive }
              : styles.navLabel}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}