import { historyStyles, shared } from '../styles'
const styles = { ...shared, ...historyStyles }

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