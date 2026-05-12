import { dailyStyles, shared } from '../styles'
const styles = { ...shared, ...dailyStyles }

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { generateCombinedPDF } from '../lib/generatePDF'

export default function AdminDailySummary({ user }) {
  const [truckTransfers, setTruckTransfers] = useState([])
  const [warehouseReturns, setWarehouseReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [emailNotes, setEmailNotes] = useState('')
  const [sending, setSending] = useState(false)
  const [statusMsg, setStatusMsg] = useState(null)

  useEffect(() => { fetchTodayApproved() }, [])

  async function fetchTodayApproved() {
    setLoading(true)
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999)

    const [{ data: transfers }, { data: returns }] = await Promise.all([
      supabase.from('transfers').select('*, transfer_items(*)').eq('status', 'approved')
        .gte('created_at', startOfDay.toISOString()).lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: true }),
      supabase.from('return_requests').select('*').eq('status', 'approved')
        .gte('created_at', startOfDay.toISOString()).lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: true }),
    ])

    setTruckTransfers(transfers || [])
    setWarehouseReturns(returns || [])
    setLoading(false)
  }

  async function handleSend() {
    if (truckTransfers.length === 0 && warehouseReturns.length === 0) {
      setStatusMsg({ type: 'error', text: 'No approved transfers today to send.' })
      return
    }

    setSending(true)
    setStatusMsg(null)

    try {
      const { data: recipientRows } = await supabase.from('recipients').select('email').eq('active', true)

      if (!recipientRows || recipientRows.length === 0) {
        setStatusMsg({ type: 'error', text: 'No active recipients found.' })
        setSending(false)
        return
      }

      const emails = recipientRows.map(r => r.email)
      const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })

      const attachments = []

      if (truckTransfers.length > 0) {
        const blob = generateCombinedPDF('truck_transfer', truckTransfers)
        const arrayBuffer = await blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        let binary = ''
        uint8Array.forEach(byte => binary += String.fromCharCode(byte))
        attachments.push({
          filename: `DHP_T2T_Truck_Transfers_${new Date().toISOString().slice(0, 10)}.pdf`,
          content: btoa(binary),
        })
      }

      if (warehouseReturns.length > 0) {
        const blob = generateCombinedPDF('warehouse_return', warehouseReturns)
        const arrayBuffer = await blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        let binary = ''
        uint8Array.forEach(byte => binary += String.fromCharCode(byte))
        attachments.push({
          filename: `DHP_T2T_Warehouse_Returns_${new Date().toISOString().slice(0, 10)}.pdf`,
          content: btoa(binary),
        })
      }

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #1a1a2e; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 20px;">DHP T2T</h1>
            <p style="color: #a0aec0; margin: 4px 0 0; font-size: 13px;">Daily Transfer Summary</p>
          </div>
          <div style="background: #f8f9fb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e8eaed;">
            <p style="font-size: 15px; margin-top: 0;">
              Please find attached the daily transfer summary for <strong>${today}</strong>.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
              <tr style="background: #f0f2f5;">
                <td style="padding: 8px 12px; font-weight: 700;">Truck Transfers</td>
                <td style="padding: 8px 12px; text-align: right;">${truckTransfers.length} record${truckTransfers.length !== 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 700;">Warehouse Returns</td>
                <td style="padding: 8px 12px; text-align: right;">${warehouseReturns.length} record${warehouseReturns.length !== 1 ? 's' : ''}</td>
              </tr>
            </table>
            ${emailNotes ? `
            <div style="background: #fff; border-left: 4px solid #1a1a2e; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 0; font-size: 13px; font-weight: 700; color: #666; margin-bottom: 4px;">MANAGER NOTES</p>
              <p style="margin: 0; font-size: 14px; color: #333;">${emailNotes}</p>
            </div>` : ''}
            <p style="font-size: 13px; color: #888; margin-bottom: 0;">
              Sent by ${user?.name || 'Manager'} via DHP T2T Parts Transfer System.
            </p>
          </div>
        </div>
      `

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // logging errors
      console.log('Supabase URL:', supabaseUrl)
      console.log('Anon key present:', !!supabaseAnonKey)

      const response = await fetch(`${supabaseUrl}/functions/v1/send-approval-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          recipients: emails,
          attachments,
          subject: `DHP T2T — Daily Transfer Summary · ${today}`,
          htmlBody,
        }),
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Email failed to send.')

      setStatusMsg({ type: 'success', text: `✓ Daily summary sent to ${emails.length} recipient${emails.length !== 1 ? 's' : ''}.` })
      setEmailNotes('')
    } catch (e) {
      setStatusMsg({ type: 'error', text: `Failed to send: ${e.message}` })
    } finally {
      setSending(false)
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <p style={styles.subtitle}>{today}</p>
        <button style={styles.refreshBtn} onClick={fetchTodayApproved}>↻ Refresh</button>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : (
        <>
          <div style={styles.cardRow}>
            <div style={{ ...styles.summaryCard, borderTop: '4px solid #1a1a2e' }}>
              <span style={styles.cardCount}>{truckTransfers.length}</span>
              <span style={styles.cardLabel}>Truck Transfer{truckTransfers.length !== 1 ? 's' : ''}</span>
              <span style={styles.cardSub}>approved today</span>
            </div>
            <div style={{ ...styles.summaryCard, borderTop: '4px solid #2d6a4f' }}>
              <span style={styles.cardCount}>{warehouseReturns.length}</span>
              <span style={styles.cardLabel}>Warehouse Return{warehouseReturns.length !== 1 ? 's' : ''}</span>
              <span style={styles.cardSub}>approved today</span>
            </div>
          </div>

          {truckTransfers.length > 0 && (
            <div style={styles.section}>
              <p style={styles.sectionLabel}>Truck Transfers</p>
              {truckTransfers.map(t => (
                <div key={t.id} style={styles.recordRow}>
                  <span style={styles.recordTech}>{t.tech_name}</span>
                  <span style={styles.recordWH}>WH {t.warehouse_number}</span>
                  <span style={styles.recordItems}>{(t.transfer_items || []).length} part{(t.transfer_items || []).length !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}

          {warehouseReturns.length > 0 && (
            <div style={styles.section}>
              <p style={styles.sectionLabel}>Warehouse Returns</p>
              {warehouseReturns.map(r => (
                <div key={r.id} style={styles.recordRow}>
                  <span style={styles.recordTech}>{r.tech_name}</span>
                  <span style={styles.recordWH}>WH {r.warehouse_number}</span>
                  <span style={styles.recordItems}>{(r.items || []).length} part{(r.items || []).length !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}

          {truckTransfers.length === 0 && warehouseReturns.length === 0 && (
            <div style={styles.empty}>No approved transfers yet today.</div>
          )}

          <div style={styles.notesSection}>
            <label style={styles.notesLabel}>
              Notes to include in email <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              style={styles.notesInput}
              placeholder="e.g. Please review before end of day..."
              value={emailNotes}
              onChange={e => setEmailNotes(e.target.value)}
              rows={3}
            />
          </div>

          {statusMsg && (
            <div style={{
              ...styles.statusMsg,
              background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: statusMsg.type === 'success' ? '#166534' : '#dc2626',
            }}>
              {statusMsg.text}
            </div>
          )}

          <button
            style={{ ...styles.sendBtn, opacity: sending || (truckTransfers.length === 0 && warehouseReturns.length === 0) ? 0.6 : 1 }}
            onClick={handleSend}
            disabled={sending || (truckTransfers.length === 0 && warehouseReturns.length === 0)}
          >
            {sending ? 'Sending...' : '📧 Send Daily Transfers'}
          </button>
        </>
      )}
    </div>
  )
}