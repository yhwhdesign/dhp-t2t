import { partPreviewStyles, shared } from '../styles'
const styles = { ...shared, ...partPreviewStyles }

import PartPhotoPlaceholder from './PartPhotoPlaceholder'

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
            <PartPhotoPlaceholder size="large" />
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