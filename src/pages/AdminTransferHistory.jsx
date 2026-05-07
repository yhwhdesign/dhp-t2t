import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TABS = ['Truck Transfers', 'Warehouse Returns']

export default function AdminTransferHistory() {
  const [activeTab, setActiveTab] = useState('Truck Transfers')
  const [transfers, setTransfers] = useState([])
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: t }, { data: r }] = await Promise.all([
      supabase.from('transfers').select('*, transfer_items(*)').in('status', ['approved', 'cancelled']).order('created_at', { ascending: false }),
      supabase.from('return_requests').select('*').in('status', ['approved', 'cancelled']).order('created_at', { ascending: false }),
    ])
    setTransfers(t || [])
    setReturns(r || [])
    setLoading(false)
  }

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id)
  }

  function formatDate(ts) {
    if (!ts) return '—'
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })
  }

  async function handleViewPDF(path) {
    const { data } = await supabase.storage.from('transfer-pdfs').createSignedUrl(path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else alert('PDF not available.')
  }

  const activeList = activeTab === 'Truck Transfers' ? transfers : returns

  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <p style={styles.subtitle}>Approved and cancelled transfers.</p>
        <button style={styles.refreshBtn} onClick={fetchAll}>↻ Refresh</button>
      </div>

      <div style={styles.subTabRow}>
        {TABS.map(tab => (
          <button
            key={tab}
            style={activeTab === tab ? { ...styles.subTab, ...styles.subTabActive } : styles.subTab}
            onClick={() => { setActiveTab(tab); setExpandedId(null) }}
          >
            {tab}
            <span style={activeTab === tab ? { ...styles.badge, ...styles.badgeActive } : styles.badge}>
              {tab === 'Truck Transfers' ? transfers.length : returns.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : activeList.length === 0 ? (
        <div style={styles.empty}>No records found.</div>
      ) : (
        <div style={styles.list}>
          {activeList.map(record => {
            const isExpanded = expandedId === record.id
            const isCancelled = record.status === 'cancelled'
            const items = activeTab === 'Truck Transfers'
              ? (record.transfer_items || [])
              : (record.items || [])

            return (
              <div key={record.id} style={styles.card}>
                <div style={styles.cardHeader} onClick={() => toggleExpand(record.id)}>
                  <div style={styles.cardLeft}>
                    <span style={isCancelled ? { ...styles.statusBadge, ...styles.statusCancelled } : { ...styles.statusBadge, ...styles.statusApproved }}>
                      {isCancelled ? 'Cancelled' : 'Approved'}
                    </span>
                    <div style={styles.cardMeta}>
                      <span style={styles.cardWarehouse}>WH {record.warehouse_number}</span>
                      <span style={styles.cardTech}>{record.tech_name}</span>
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    <span style={styles.cardDate}>{formatDate(record.created_at)}</span>
                    <span style={styles.chevron}>{isExpanded ? '▲' : '▽'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={styles.expandedBody}>
                    {items.length > 0 ? (
                      <div style={styles.itemsSection}>
                        <p style={styles.sectionLabel}>Parts</p>
                        <div style={styles.itemsTable}>
                          <div style={styles.itemsHeader}>
                            <span style={styles.colPart}>Part #</span>
                            <span style={styles.colDesc}>Description</span>
                            <span style={styles.colQty}>Qty</span>
                          </div>
                          {items.map((item, i) => (
                            <div key={i} style={styles.itemsRow}>
                              <span style={styles.colPart}>{item.part_number || item.partNumber || '—'}</span>
                              <span style={styles.colDesc}>{item.description || '—'}</span>
                              <span style={styles.colQty}>{item.quantity || '—'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p style={styles.noItems}>No items recorded.</p>
                    )}

                    {activeTab === 'Warehouse Returns' && record.reason && (
                      <div style={styles.reasonSection}>
                        <p style={styles.sectionLabel}>Reason</p>
                        <p style={styles.reasonText}>{record.reason}</p>
                      </div>
                    )}

                    {activeTab === 'Truck Transfers' && record.notes && (
                      <div style={styles.reasonSection}>
                        <p style={styles.sectionLabel}>Notes</p>
                        <p style={styles.reasonText}>{record.notes}</p>
                      </div>
                    )}

                    {record.actioned_by && (
                      <div style={styles.reasonSection}>
                        <p style={styles.sectionLabel}>{record.status === 'approved' ? 'Approved by' : 'Cancelled by'}</p>
                        <p style={styles.reasonText}>{record.actioned_by}</p>
                      </div>
                    )}

                    {record.pdf_url && (
                      <button style={styles.pdfBtn} onClick={() => handleViewPDF(record.pdf_url)}>
                        📄 View PDF
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '8px 0' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  subtitle: { fontSize: 13, color: '#666', margin: 0 },
  refreshBtn: {
    padding: '8px 14px', background: '#f0f2f5', color: '#1a1a2e',
    border: '1.5px solid #ddd', borderRadius: 8, fontSize: 13,
    fontWeight: 700, cursor: 'pointer',
  },
  subTabRow: {
    display: 'flex', gap: 8, marginBottom: 16,
    borderBottom: '2px solid #e8eaed',
  },
  subTab: {
    padding: '8px 16px', background: 'none', border: 'none',
    borderBottom: '3px solid transparent', fontSize: 13,
    fontWeight: 600, color: '#888', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: '-2px',
  },
  subTabActive: { color: '#1a1a2e', borderBottom: '3px solid #1a1a2e' },
  badge: {
    background: '#e8eaed', color: '#888',
    borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700,
  },
  badgeActive: { background: '#1a1a2e', color: '#fff' },
  empty: { padding: 40, textAlign: 'center', color: '#aaa', fontSize: 14 },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  card: {
    background: '#fff', border: '1.5px solid #e8eaed',
    borderRadius: 10, overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 16px', cursor: 'pointer',
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  cardMeta: { display: 'flex', flexDirection: 'column', gap: 2 },
  cardWarehouse: { fontSize: 14, fontWeight: 700, color: '#1a1a2e' },
  cardTech: { fontSize: 12, color: '#888' },
  cardRight: { display: 'flex', alignItems: 'center', gap: 10 },
  cardDate: { fontSize: 12, color: '#aaa' },
  chevron: { fontSize: 11, color: '#aaa' },
  statusBadge: {
    fontSize: 11, fontWeight: 700, padding: '3px 8px',
    borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  statusApproved: { background: '#e8f5e9', color: '#2d6a4f' },
  statusCancelled: { background: '#fee2e2', color: '#dc2626' },
  expandedBody: { borderTop: '1px solid #f0f2f5', padding: '14px 16px', background: '#fafafa' },
  sectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#888',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    marginBottom: 8, marginTop: 0,
  },
  itemsSection: { marginBottom: 14 },
  itemsTable: { borderRadius: 8, overflow: 'hidden', border: '1px solid #e8eaed' },
  itemsHeader: { display: 'flex', background: '#f0f2f5', padding: '7px 12px', gap: 8 },
  itemsRow: {
    display: 'flex', padding: '7px 12px',
    borderTop: '1px solid #f0f2f5', gap: 8, background: '#fff',
  },
  colPart: { flex: '0 0 100px', fontSize: 12, fontWeight: 700, color: '#1a1a2e' },
  colDesc: { flex: 1, fontSize: 12, color: '#555' },
  colQty: { flex: '0 0 40px', fontSize: 12, fontWeight: 700, color: '#1a1a2e', textAlign: 'right' },
  noItems: { fontSize: 13, color: '#aaa', marginBottom: 12 },
  reasonSection: { marginBottom: 14 },
  reasonText: {
    fontSize: 13, color: '#444', background: '#fff',
    border: '1px solid #e8eaed', borderRadius: 8,
    padding: '8px 12px', margin: 0,
  },
  pdfBtn: {
    padding: '8px 16px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
  },
}