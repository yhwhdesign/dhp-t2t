export default function PartPreviewModal({ part, quantity, onQuantityChange, onConfirm, onCancel }) {
  if (!part) return null

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.matchLabel}>✅ Part Found</p>

        <div style={styles.photoBox}>
          {part.photo_url ? (
            <img src={part.photo_url} alt={part.part_number} style={styles.photo} />
          ) : (
            <div style={styles.photoPlaceholder}>
              <span style={styles.photoIcon}>🖼️</span>
              <span style={styles.photoText}>No photo yet</span>
            </div>
          )}
        </div>

        <div style={styles.partInfo}>
          <p style={styles.partNumber}>{part.part_number}</p>
          <p style={styles.partDesc}>{part.description || 'No description available'}</p>
        </div>

        <div style={styles.qtyRow}>
          <button style={styles.qtyBtn} onClick={() => onQuantityChange(Math.max(1, quantity - 1))}>−</button>
          <span style={styles.qtyValue}>{quantity}</span>
          <button style={styles.qtyBtn} onClick={() => onQuantityChange(quantity + 1)}>+</button>
        </div>

        <p style={styles.confirmQuestion}>Is this the correct part?</p>

        <div style={styles.btnRow}>
          <button style={styles.confirmBtn} onClick={onConfirm}>✓ Yes, correct</button>
          <button style={styles.dismissBtn} onClick={onCancel}>✕ Wrong part</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    background: '#fff',
    borderRadius: '14px',
    padding: '1.75rem',
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  matchLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2d6a4f',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  photoBox: {
    width: '100%',
    height: '180px',
    background: '#f5f5f5',
    borderRadius: '10px',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' },
  photoPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  photoIcon: { fontSize: '2.5rem', opacity: 0.4 },
  photoText: { fontSize: '0.8rem', color: '#aaa', fontWeight: '500' },
  partInfo: { marginBottom: '1rem' },
  partNumber: { fontSize: '1.4rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '0.3rem' },
  partDesc: { fontSize: '0.9rem', color: '#555', lineHeight: 1.4 },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '2px solid #1a1a2e',
    background: '#fff',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    color: '#1a1a2e',
  },
  qtyValue: { fontSize: '1.5rem', fontWeight: '800', color: '#1a1a2e', minWidth: 30 },
  confirmQuestion: { fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '1rem' },
  btnRow: { display: 'flex', gap: '0.75rem' },
  confirmBtn: {
    flex: 1,
    padding: '0.75rem',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  dismissBtn: {
    flex: 1,
    padding: '0.75rem',
    background: '#fff',
    color: '#e53e3e',
    border: '1.5px solid #e53e3e',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
}