import { pendingStyles, shared } from '../styles'
const styles = { ...shared, ...pendingStyles }

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateTransferPDF } from '../lib/generatePDF';
import { uploadPDF } from '../lib/uploadPDF';

export default function AdminPendingTransfers({ user }) {
  const [returns, setReturns] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [editNotes, setEditNotes] = useState('');
  const [editWarehouse, setEditWarehouse] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [returnsOpen, setReturnsOpen] = useState(true);
  const [transfersOpen, setTransfersOpen] = useState(true);

  useEffect(() => { fetchPending(); }, []);

  async function fetchPending() {
    setLoading(true);
    const [{ data: r }, { data: t }] = await Promise.all([
      supabase.from('return_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('transfers').select('*, transfer_items(*)').eq('status', 'pending').order('created_at', { ascending: false }),
    ]);
    setReturns(r || []);
    setTransfers(t || []);
    setLoading(false);
  }

  function openEdit(record, type) {
    const items = type === 'warehouse_return' ? record.items : record.transfer_items;
    setEditItem({ ...record, _type: type });
    setEditItems(items.map(i => ({ ...i })));
    setEditNotes(record.reason || record.notes || '');
    setEditWarehouse(record.warehouse_number || '');
  }

  function closeEdit() {
    setEditItem(null);
    setEditItems([]);
    setActionMsg('');
  }

  function updateQty(index, val) {
    const updated = [...editItems];
    updated[index].quantity = Math.max(1, parseInt(val) || 1);
    setEditItems(updated);
  }

  function updatePartNumber(index, val) {
    const updated = [...editItems];
    updated[index].part_number = val;
    setEditItems(updated);
  }

  function removePart(index) {
    setEditItems(editItems.filter((_, i) => i !== index));
  }

  function handlePreview() {
    setPreviewing(true);
    try {
      const blob = generateTransferPDF({
        type: editItem._type,
        techName: editItem.tech_name,
        warehouseNumber: editWarehouse,
        notes: editNotes,
        date: editItem.created_at,
        items: editItems,
      });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      setActionMsg(`Preview failed: ${e.message}`);
    } finally {
      setPreviewing(false);
    }
  }

  async function handleApprove() {
    if (editItems.length === 0) { setActionMsg('Cannot approve with no parts.'); return; }
    setSaving(true);
    setActionMsg('');
    try {
      const table = editItem._type === 'warehouse_return' ? 'return_requests' : 'transfers';

      const blob = generateTransferPDF({
        type: editItem._type,
        techName: editItem.tech_name,
        warehouseNumber: editWarehouse,
        notes: editNotes,
        date: editItem.created_at,
        items: editItems,
      });

      const storagePath = await uploadPDF(blob, editItem._type, editItem.tech_name, editItem.id);

      const updatePayload = {
        status: 'approved',
        pdf_url: storagePath,
        warehouse_number: editWarehouse,
        actioned_by: user?.name || 'Manager',
        ...(editItem._type === 'warehouse_return'
          ? { reason: editNotes, items: editItems }
          : { notes: editNotes }),
      };

      await supabase.from(table).update(updatePayload).eq('id', editItem.id);

      if (editItem._type === 'truck_transfer') {
        for (const item of editItems) {
          await supabase.from('transfer_items')
            .update({ quantity: item.quantity, part_number: item.part_number })
            .eq('id', item.id);
        }
      }

      setActionMsg('✓ Approved successfully.');
      await fetchPending();
      setTimeout(closeEdit, 1500);
    } catch (e) {
      setActionMsg(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm('Cancel this transfer? This cannot be undone.')) return;
    setSaving(true);
    try {
      const table = editItem._type === 'warehouse_return' ? 'return_requests' : 'transfers';
      await supabase.from(table).update({
        status: 'cancelled',
        actioned_by: user?.name || 'Manager',
      }).eq('id', editItem.id);
      await fetchPending();
      closeEdit();
    } catch (e) {
      setActionMsg(`Error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function TransferCard({ record, type }) {
    const items = type === 'warehouse_return' ? record.items : record.transfer_items;
    return (
      <div style={styles.card} onClick={() => openEdit(record, type)}>
        <div style={styles.cardTop}>
          <div>
            <span style={styles.techName}>{record.tech_name}</span>
            <span style={styles.warehouseBadge}>WH: {record.warehouse_number}</span>
          </div>
          <span style={styles.pendingBadge}>Pending</span>
        </div>
        <div style={styles.cardMeta}>
          {formatDate(record.created_at)} · {items?.length || 0} part{items?.length !== 1 ? 's' : ''}
        </div>
        <div style={styles.cardHint}>Tap to review & approve →</div>
      </div>
    );
  }

  function Section({ title, color, items, type, open, onToggle }) {
    return (
      <div style={styles.section}>
        <div style={{ ...styles.sectionHeader, borderLeftColor: color }} onClick={onToggle}>
          <div style={styles.sectionTitle}>
            <span style={{ color }}>{title}</span>
            <span style={styles.countBadge}>{items.length}</span>
          </div>
          <span style={styles.chevron}>{open ? '▲' : '▼'}</span>
        </div>
        {open && (
          items.length === 0
            ? <p style={styles.emptyMsg}>No pending {title.toLowerCase()}.</p>
            : items.map(r => <TransferCard key={r.id} record={r} type={type} />)
        )}
      </div>
    );
  }

  if (loading) return <div style={styles.loading}>Loading pending transfers…</div>;

  return (
    <div style={styles.container}>
      <Section
        title="Warehouse Returns"
        color="#2d6a4f"
        items={returns}
        type="warehouse_return"
        open={returnsOpen}
        onToggle={() => setReturnsOpen(o => !o)}
      />
      <Section
        title="Truck Transfers"
        color="#1a1a2e"
        items={transfers}
        type="truck_transfer"
        open={transfersOpen}
        onToggle={() => setTransfersOpen(o => !o)}
      />

      {editItem && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editItem._type === 'warehouse_return' ? 'Warehouse Return' : 'Truck Transfer'}
                <span style={styles.modalMeta}> · {editItem.tech_name}</span>
              </h3>
              <button style={styles.closeBtn} onClick={closeEdit}>✕</button>
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Warehouse #</label>
              <input
                style={styles.fieldInput}
                value={editWarehouse}
                onChange={e => setEditWarehouse(e.target.value)}
              />
            </div>

            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Notes</label>
              <input
                style={styles.fieldInput}
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
              />
            </div>

            <div style={styles.partsHeader}>
              <span style={styles.fieldLabel}>Parts</span>
            </div>
            {editItems.map((item, i) => (
              <div key={i} style={styles.partEditRow}>
                <input
                  style={{ ...styles.fieldInput, flex: 2, marginRight: 8 }}
                  value={item.part_number}
                  onChange={e => updatePartNumber(i, e.target.value)}
                  placeholder="Part #"
                />
                <input
                  style={{ ...styles.fieldInput, width: 60, textAlign: 'center' }}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQty(i, e.target.value)}
                />
                <button style={styles.removeBtn} onClick={() => removePart(i)}>✕</button>
              </div>
            ))}

            {actionMsg && (
              <div style={{
                ...styles.actionMsg,
                background: actionMsg.startsWith('✓') ? '#dcfce7' : '#fee2e2',
                color: actionMsg.startsWith('✓') ? '#166534' : '#dc2626',
              }}>
                {actionMsg}
              </div>
            )}

            <div style={styles.modalActions}>
              <button style={styles.previewBtn} onClick={handlePreview} disabled={previewing || saving}>
                {previewing ? 'Opening…' : '👁 Preview PDF'}
              </button>
              <button style={styles.approveBtn} onClick={handleApprove} disabled={saving}>
                {saving ? 'Saving…' : '✓ Approve'}
              </button>
              <button style={styles.cancelBtn} onClick={handleCancel} disabled={saving}>
                Cancel Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}