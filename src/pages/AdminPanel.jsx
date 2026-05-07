import { useState } from 'react'
import AdminPendingTransfers from './AdminPendingTransfers'
import AdminTransferHistory from './AdminTransferHistory'
import AdminManageParts from './AdminManageParts'
import AdminDailySummary from './AdminDailySummary'
import AdminRecipients from './AdminRecipients'

const TABS = [
  { id: 'pending', label: 'Pending', icon: '🕐' },
  { id: 'history', label: 'History', icon: '🗂' },
  { id: 'parts', label: 'Parts', icon: '📦' },
  { id: 'daily', label: 'Daily', icon: '📤' },
  { id: 'recipients', label: 'Recipients', icon: '📬' },
]

const TAB_TITLES = {
  pending: 'Pending Transfers',
  history: 'Transfer History',
  parts: 'Manage Parts',
  daily: 'Daily Summary',
  recipients: 'Recipients',
}

export default function AdminPanel({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('pending')

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
          <button style={styles.logoutBtn} onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Page title bar */}
      <div style={styles.titleBar}>
        <h1 style={styles.pageTitle}>{TAB_TITLES[activeTab]}</h1>
      </div>

      {/* Content area */}
      <div style={styles.content}>
        {activeTab === 'pending' && <AdminPendingTransfers user={user} />}
        {activeTab === 'history' && <AdminTransferHistory />}
        {activeTab === 'parts' && <AdminManageParts />}
        {activeTab === 'daily' && <AdminDailySummary user={user} />}
        {activeTab === 'recipients' && <AdminRecipients />}
      </div>

      {/* Bottom nav */}
      <nav style={styles.bottomNav}>
        {TABS.map(tab => (
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

const styles = {
  root: {
    minHeight: '100vh',
    background: '#f5f6fa',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: 500,
    margin: '0 auto',
    position: 'relative',
  },
  topBar: {
    background: '#fff',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  topLogo: {
    height: 28,
    objectFit: 'contain',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1a1a2e',
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: 10,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  logoutBtn: {
    background: '#f5f6fa',
    border: '1px solid #e8eaed',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 700,
    color: '#555',
    cursor: 'pointer',
  },
  titleBar: {
    padding: '20px 20px 8px',
    background: '#f5f6fa',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#1a1a2e',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  content: {
    flex: 1,
    padding: '8px 16px 100px',
    overflowY: 'auto',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 500,
    background: '#fff',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    zIndex: 200,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
  },
  navBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    background: 'none',
    border: 'none',
    padding: '4px 0',
    cursor: 'pointer',
    position: 'relative',
  },
  navBtnActive: {},
  navIcon: {
    fontSize: 20,
    lineHeight: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#bbb',
    letterSpacing: '0.02em',
  },
  navLabelActive: {
    color: '#1a1a2e',
  },
  navIndicator: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 28,
    height: 3,
    background: '#1a1a2e',
    borderRadius: '0 0 3px 3px',
  },
}