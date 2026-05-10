// ============================================================
// DHP T2T — Global Stylesheet
// src/styles.js
//
// All component styles live here, organized by page/component.
// Shared/reusable styles are defined once at the top and
// referenced throughout. Each page section is clearly labeled.
// ============================================================

// ─────────────────────────────────────────────────────────────
// SHARED CONSTANTS — colors, spacing, fonts used app-wide
// ─────────────────────────────────────────────────────────────
export const COLORS = {
  navy: '#1a1a2e',
  green: '#2d6a4f',
  red: '#dc2626',
  redLight: '#fee2e2',
  greenLight: '#e8f5e9',
  yellowLight: '#fef3c7',
  yellowDark: '#92400e',
  gray: '#f0f2f5',
  grayBorder: '#e8eaed',
  grayText: '#888',
  grayLight: '#f8f9fb',
  white: '#fff',
  textDark: '#1a1a2e',
  textMid: '#555',
  textLight: '#aaa',
}

// Background image URLs used on landing, tech, and manager screens
export const BG_URL = 'https://www.dhpace.com/wp-content/uploads/2017/11/distribution-logistics-doors.jpg'
export const LOGO_URL = 'https://www.dhpace.com/wp-content/uploads/2026/01/DHP-100-Years-RGB_FULL-COLOR_368x60px.jpg'

// ─────────────────────────────────────────────────────────────
// SHARED — reusable across multiple pages
// ─────────────────────────────────────────────────────────────
export const shared = {

  // Full screen root with blurred background image
  // Used by: LandingScreen, TechFlow, ManagerLogin
  bgRoot: {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // The blurred background image layer
  // Used by: LandingScreen, TechFlow, ManagerLogin
  bgImage: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${BG_URL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(6px)',
    transform: 'scale(1.05)',
    zIndex: 0,
  },

  // Semi-transparent white overlay over background
  // Used by: LandingScreen, TechFlow, ManagerLogin
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,0.82)',
    zIndex: 1,
  },

  // Centered content column over background
  // Used by: LandingScreen, TechFlow, ManagerLogin
  bgContent: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: 420,
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    justifyContent: 'center',
    gap: '1.25rem',
  },

  // White logo container card
  // Used by: LandingScreen, TechFlow, ManagerLogin
  logoWrap: {
    background: '#fff',
    borderRadius: 12,
    padding: '14px 20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },

  // DH Pace logo image
  // Used by: LandingScreen, TechFlow, ManagerLogin, AdminPanel
  logo: {
    height: 40,
    objectFit: 'contain',
    display: 'block',
  },

  // Back button on background screens
  // Used by: TechFlow, ManagerLogin
  backBtn: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a2e',
    cursor: 'pointer',
  },

  // White floating card on background screens
  // Used by: TechFlow, ManagerLogin
  floatingCard: {
    width: '100%',
    background: '#fff',
    borderRadius: 16,
    padding: '2rem 1.5rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  },

  // Card title (large heading inside floating card)
  // Used by: TechFlow, ManagerLogin
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#1a1a2e',
    margin: '0 0 0.25rem',
    textAlign: 'center',
  },

  // Card subtitle (smaller text under title)
  // Used by: TechFlow, ManagerLogin
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },

  // Form field label (uppercase small text)
  // Used by: TechFlow, ManagerLogin, and all admin forms
  fieldLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#555',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Standard text input
  // Used by: ManagerLogin, TechFlow, all admin forms
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: 10,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#fafafa',
  },

  // Small admin-style input (used inside admin panels)
  // Used by: all admin tab pages
  adminInput: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 7,
    border: '1.5px solid #ddd',
    fontSize: 13,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
  },

  // Primary dark button (navy)
  // Used by: ManagerLogin, StartTransfer, AdminManageParts, AdminManageUsers, AdminRecipients
  primaryBtn: {
    width: '100%',
    padding: '13px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
  },

  // Primary green button
  // Used by: WarehouseReturn
  primaryBtnGreen: {
    width: '100%',
    padding: '13px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
  },

  // Error message box (red background)
  // Used by: StartTransfer, WarehouseReturn, AdminManageParts, AdminManageUsers, AdminRecipients
  errorBox: {
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    marginBottom: 16,
  },

  // Full screen fixed overlay (dark backdrop for modals)
  // Used by: AdminPendingTransfers, AdminManageParts, PartPreviewModal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },

  // Modal card inside overlay
  // Used by: AdminPendingTransfers, AdminManageParts
  modal: {
    background: '#fff',
    borderRadius: 14,
    padding: '24px 20px',
    width: '100%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
  },

  // Modal header row (title + close button)
  // Used by: AdminPendingTransfers, AdminManageParts
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  // Modal close (✕) button
  // Used by: AdminPendingTransfers, AdminManageParts
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    color: '#999',
    cursor: 'pointer',
    padding: 0,
  },

  // Add/save form container (light gray box)
  // Used by: AdminManageParts, AdminManageUsers, AdminRecipients
  addForm: {
    background: '#f8f9fb',
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },

  // Add form title
  // Used by: AdminManageParts, AdminManageUsers, AdminRecipients
  addFormTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1a1a2e',
    marginTop: 0,
    marginBottom: 12,
  },

  // Side-by-side form row
  // Used by: AdminManageParts, AdminManageUsers, AdminRecipients
  formRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },

  // Form field wrapper (flex: 1)
  // Used by: AdminManageParts, AdminManageUsers, AdminRecipients
  formField: {
    flex: 1,
    minWidth: 140,
    marginBottom: 12,
  },

  // Small label inside add form
  // Used by: AdminManageParts, AdminManageUsers, AdminRecipients
  formLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#666',
    marginBottom: 4,
  },

  // Small navy add/save button
  // Used by: AdminManageParts, AdminManageUsers, AdminRecipients, AdminTransferHistory
  addBtn: {
    padding: '9px 16px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // Search input (full width)
  // Used by: AdminManageParts, AdminManageUsers
  searchInput: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
  },

  // Empty state message
  // Used by: all admin pages
  empty: {
    padding: 40,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
  },

  // Loading state message
  // Used by: all admin pages
  loading: {
    padding: 40,
    textAlign: 'center',
    color: '#888',
  },

  // Hint/footer note text
  // Used by: AdminRecipients, AdminManageUsers
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Success screen box (centered card after form submission)
  // Used by: StartTransfer, WarehouseReturn
  successBox: {
    maxWidth: 400,
    margin: '80px auto',
    background: '#fff',
    borderRadius: 16,
    padding: '40px 32px',
    textAlign: 'center',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  },

  // Success icon circle
  // Used by: StartTransfer, WarehouseReturn
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: '#fff',
  },

  // Success title text
  // Used by: StartTransfer, WarehouseReturn
  successTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: 10,
  },

  // Success body text
  // Used by: StartTransfer, WarehouseReturn
  successText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.6,
    marginBottom: 24,
  },

  // Parts list container (scanned parts in tech forms)
  // Used by: StartTransfer, WarehouseReturn
  partsList: {
    background: '#f8f9fb',
    borderRadius: 8,
    padding: '12px 14px',
    marginBottom: 20,
    border: '1px solid #e8eaed',
  },

  // Individual part row in scanned list
  // Used by: StartTransfer, WarehouseReturn
  partRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottom: '1px solid #eee',
  },

  // Part number text in scanned list
  // Used by: StartTransfer, WarehouseReturn, AdminManageParts
  partNumber: {
    fontWeight: 700,
    fontSize: 13,
    color: '#1a1a2e',
  },

  // Part description text in scanned list
  // Used by: StartTransfer, WarehouseReturn
  partDesc: {
    fontSize: 13,
    color: '#666',
  },

  // Right side of part row (qty badge + remove button)
  // Used by: StartTransfer, WarehouseReturn
  partRowRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  // Remove part button (red X)
  // Used by: StartTransfer, WarehouseReturn, AdminPendingTransfers
  removeBtn: {
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 6,
    width: 26,
    height: 26,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
  },

  // QR scanner container div
  // Used by: StartTransfer, WarehouseReturn
  qrReader: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Part search dropdown container
  // Used by: StartTransfer, WarehouseReturn
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#fff',
    border: '1.5px solid #ddd',
    borderRadius: 8,
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },

  // Individual dropdown item
  // Used by: StartTransfer, WarehouseReturn
  dropdownItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: 13,
    borderBottom: '1px solid #f0f0f0',
  },

  // Refresh button (light gray)
  // Used by: AdminTransferHistory, AdminDailySummary
  refreshBtn: {
    padding: '8px 14px',
    background: '#f0f2f5',
    color: '#1a1a2e',
    border: '1.5px solid #ddd',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // Section label (small uppercase heading)
  // Used by: AdminTransferHistory, AdminDailySummary
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
    marginTop: 0,
  },

  // Status badge base
  // Used by: AdminTransferHistory, AdminPendingTransfers
  statusBadge: {
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  // Approved status badge
  // Used by: AdminTransferHistory
  statusApproved: {
    background: '#e8f5e9',
    color: '#2d6a4f',
  },

  // Cancelled status badge
  // Used by: AdminTransferHistory
  statusCancelled: {
    background: '#fee2e2',
    color: '#dc2626',
  },

  // User avatar circle (initial letter)
  // Used by: AdminRecipients, AdminManageUsers
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#1a1a2e',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
  },

  // Active toggle button (green)
  // Used by: AdminRecipients, AdminManageUsers
  activeToggle: {
    padding: '5px 12px',
    background: '#e8f5e9',
    color: '#2d6a4f',
    border: 'none',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Inactive toggle button (gray)
  // Used by: AdminRecipients, AdminManageUsers
  inactiveToggle: {
    padding: '5px 12px',
    background: '#f0f2f5',
    color: '#999',
    border: 'none',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Delete button (red trash icon)
  // Used by: AdminRecipients
  deleteBtn: {
    background: '#fee2e2',
    border: 'none',
    borderRadius: 7,
    padding: '5px 9px',
    cursor: 'pointer',
    fontSize: 14,
  },
}

// ─────────────────────────────────────────────────────────────
// LANDING SCREEN — src/pages/LandingScreen.jsx
// Full screen branded landing with two role cards
// ─────────────────────────────────────────────────────────────
export const landingStyles = {
  // App name badge below logo
  appBadge: {
    background: '#1a1a2e',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: 20,
  },

  // Container for the two role cards
  cards: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  // Individual role selection card (Tech or Management)
  card: {
    width: '100%',
    background: '#fff',
    border: 'none',
    borderRadius: 16,
    padding: '1.75rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  },

  // Large emoji icon inside role card
  cardIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.25rem',
  },

  // Role card title (e.g. "Field Technician")
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#1a1a2e',
  },

  // Role card subtitle (e.g. "Log a parts transfer")
  cardSub: {
    fontSize: '0.82rem',
    color: '#888',
    fontWeight: 500,
  },

  // Copyright footer
  footer: {
    fontSize: 11,
    color: '#aaa',
    marginTop: '1rem',
  },
}

// ─────────────────────────────────────────────────────────────
// TECH FLOW — src/pages/TechFlow.jsx
// Warehouse number entry + Transfer or Return buttons
// ─────────────────────────────────────────────────────────────
export const techFlowStyles = {
  // Field wrapper with bottom margin
  field: {
    marginBottom: '1.5rem',
  },

  // Group containing the two action buttons
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  // Large action button (Transfer to Truck / Return to Warehouse)
  actionBtn: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '1.25rem 1.5rem',
    borderRadius: 12,
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
  },

  // Large emoji icon inside action button
  btnIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.4rem',
  },

  // Action button main label
  btnLabel: {
    fontSize: '1rem',
    fontWeight: 800,
    marginBottom: '0.2rem',
  },

  // Action button subtitle
  btnSub: {
    fontSize: '0.8rem',
    opacity: 0.8,
  },
}

// ─────────────────────────────────────────────────────────────
// MANAGER LOGIN — src/pages/ManagerLogin.jsx
// Email + PIN login for manager and admin roles
// ─────────────────────────────────────────────────────────────
export const managerLoginStyles = {
  // Individual form field wrapper
  field: {
    marginBottom: '1rem',
  },

  // Error message text
  error: {
    color: '#e53e3e',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: '0.75rem',
  },

  // Sign in button
  loginBtn: {
    width: '100%',
    padding: '0.85rem',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    background: '#1a1a2e',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
}

// ─────────────────────────────────────────────────────────────
// START TRANSFER — src/pages/StartTransfer.jsx
// Tech form to log outgoing parts to truck
// ─────────────────────────────────────────────────────────────
export const startTransferStyles = {
  // Page background container
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: '20px 16px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // White card wrapping the form
  card: {
    maxWidth: 540,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 12,
    padding: '24px 20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },

  // Header row with back button and title
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  // Back button (text only, no background)
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#1a1a2e',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    padding: 0,
  },

  // Page title
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  },

  // Navy banner showing pre-filled warehouse number
  warehouseBanner: {
    background: '#1a1a2e',
    borderRadius: 8,
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  // "Warehouse" label inside banner
  warehouseLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  // Warehouse number value inside banner
  warehouseValue: {
    fontSize: 15,
    fontWeight: 800,
    color: '#fff',
  },

  // Form field wrapper
  field: {
    marginBottom: 16,
    position: 'relative',
  },

  // Field label
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    marginBottom: 6,
  },

  // Standard text input
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },

  // QR scan toggle button
  scanBtn: {
    width: '100%',
    padding: '10px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 16,
  },

  // Parts list title
  partsTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1a1a2e',
    marginTop: 0,
    marginBottom: 10,
  },

  // Quantity badge (navy pill)
  qtyBadge: {
    background: '#1a1a2e',
    color: '#fff',
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 600,
  },
}

// ─────────────────────────────────────────────────────────────
// WAREHOUSE RETURN — src/pages/WarehouseReturn.jsx
// Tech form to log parts being returned to warehouse
// Same structure as StartTransfer but green themed
// ─────────────────────────────────────────────────────────────
export const warehouseReturnStyles = {
  // Page background container
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: '20px 16px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // White card wrapping the form
  card: {
    maxWidth: 540,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 12,
    padding: '24px 20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },

  // Header row
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  // Back button (green)
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#2d6a4f',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    padding: 0,
  },

  // Page title
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  },

  // Green banner showing pre-filled warehouse number
  warehouseBanner: {
    background: '#2d6a4f',
    borderRadius: 8,
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  // "Warehouse" label inside banner
  warehouseLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  // Warehouse number value inside banner
  warehouseValue: {
    fontSize: 15,
    fontWeight: 800,
    color: '#fff',
  },

  // Form field wrapper
  field: {
    marginBottom: 16,
    position: 'relative',
  },

  // Field label
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    marginBottom: 6,
  },

  // Standard text/textarea input
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },

  // QR scan toggle button (green)
  scanBtn: {
    width: '100%',
    padding: '10px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 16,
  },

  // Parts list title (green)
  partsTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#2d6a4f',
    marginTop: 0,
    marginBottom: 10,
  },

  // Quantity badge (green pill)
  qtyBadge: {
    background: '#2d6a4f',
    color: '#fff',
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 600,
  },
}

// ─────────────────────────────────────────────────────────────
// ADMIN PANEL — src/pages/AdminPanel.jsx
// Manager/Admin shell with top bar and bottom navigation
// ─────────────────────────────────────────────────────────────
export const adminPanelStyles = {
  // Full page root container
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

  // Sticky top bar with logo and user info
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

  // Left side of top bar (logo)
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
  },

  // Small logo in top bar
  topLogo: {
    height: 28,
    objectFit: 'contain',
  },

  // Right side of top bar (user info + sign out)
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  // User name and role stacked
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  // Manager name text
  userName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1a1a2e',
    lineHeight: 1.2,
  },

  // "Manager" role label
  userRole: {
    fontSize: 10,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  // Sign out button
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

  // Page title bar below top bar
  titleBar: {
    padding: '20px 20px 8px',
    background: '#f5f6fa',
  },

  // Current tab page title
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#1a1a2e',
    margin: 0,
    letterSpacing: '-0.01em',
  },

  // Scrollable content area above bottom nav
  content: {
    flex: 1,
    padding: '8px 16px 100px',
    overflowY: 'auto',
  },

  // Fixed bottom navigation bar
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

  // Individual nav tab button
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

  // Nav tab icon (emoji)
  navIcon: {
    fontSize: 20,
    lineHeight: 1,
  },

  // Nav tab label (inactive)
  navLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#bbb',
    letterSpacing: '0.02em',
  },

  // Nav tab label (active)
  navLabelActive: {
    color: '#1a1a2e',
  },

  // Active tab indicator bar at top of nav button
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

// ─────────────────────────────────────────────────────────────
// ADMIN PENDING TRANSFERS — src/pages/AdminPendingTransfers.jsx
// Lists pending transfers/returns, opens edit/approve modal
// ─────────────────────────────────────────────────────────────
export const pendingStyles = {
  // Page container
  container: { padding: '8px 0' },

  // Collapsible section (Warehouse Returns / Truck Transfers)
  section: { marginBottom: 28 },

  // Section header row (colored left border, toggle open/close)
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '4px solid',
    paddingLeft: 12,
    marginBottom: 12,
    cursor: 'pointer',
    userSelect: 'none',
  },

  // Section title with count badge
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 700,
    fontSize: 15,
  },

  // Count badge (number of pending items)
  countBadge: {
    background: '#f0f2f5',
    color: '#555',
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 600,
  },

  // Expand/collapse chevron
  chevron: { color: '#999', fontSize: 12 },

  // Empty section message
  emptyMsg: { color: '#aaa', fontSize: 13, paddingLeft: 16 },

  // Pending transfer card (tappable)
  card: {
    background: '#fff',
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    padding: '14px 16px',
    marginBottom: 10,
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },

  // Card top row (tech name + pending badge)
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  // Tech name text on card
  techName: { fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginRight: 8 },

  // Warehouse number badge on card
  warehouseBadge: {
    fontSize: 12,
    color: '#555',
    background: '#f0f2f5',
    borderRadius: 6,
    padding: '2px 8px',
  },

  // "Pending" status badge (yellow)
  pendingBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: '#92400e',
    background: '#fef3c7',
    borderRadius: 20,
    padding: '3px 10px',
  },

  // Card date + part count line
  cardMeta: { fontSize: 12, color: '#888', marginBottom: 4 },

  // "Tap to review" hint text
  cardHint: { fontSize: 12, color: '#2d6a4f', fontWeight: 600 },

  // Modal title text
  modalTitle: { fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: 0 },

  // Tech name in modal subtitle
  modalMeta: { fontWeight: 400, color: '#888', fontSize: 14 },

  // Field row inside modal
  fieldRow: { marginBottom: 12 },

  // Field label inside modal
  fieldLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#666',
    marginBottom: 4,
  },

  // Field input inside modal
  fieldInput: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 7,
    border: '1.5px solid #ddd',
    fontSize: 13,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    outline: 'none',
  },

  // Parts list header inside modal
  partsHeader: { marginTop: 16, marginBottom: 8 },

  // Individual editable part row inside modal
  partEditRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  // Remove part button inside modal
  removePartBtn: {
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 6,
    width: 30,
    height: 34,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },

  // Action message box (success or error)
  actionMsg: {
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 4,
  },

  // Modal action buttons container
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
  },

  // Preview PDF button (light gray)
  previewBtn: {
    padding: '11px',
    background: '#f0f2f5',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  // Approve button (green)
  approveBtn: {
    padding: '11px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Cancel transfer button (red)
  cancelBtn: {
    padding: '11px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
}

// ─────────────────────────────────────────────────────────────
// ADMIN TRANSFER HISTORY — src/pages/AdminTransferHistory.jsx
// Approved and cancelled transfers with expandable detail rows
// ─────────────────────────────────────────────────────────────
export const historyStyles = {
  // Page container
  container: { padding: '8px 0' },

  // Title row with subtitle and refresh button
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Subtitle text
  subtitle: { fontSize: 13, color: '#666', margin: 0 },

  // Sub-tab row (Truck Transfers / Warehouse Returns)
  subTabRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    borderBottom: '2px solid #e8eaed',
  },

  // Sub-tab button (inactive)
  subTab: {
    padding: '8px 16px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: 13,
    fontWeight: 600,
    color: '#888',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: '-2px',
  },

  // Sub-tab button (active)
  subTabActive: {
    color: '#1a1a2e',
    borderBottom: '3px solid #1a1a2e',
  },

  // Count badge on sub-tab (inactive)
  badge: {
    background: '#e8eaed',
    color: '#888',
    borderRadius: 10,
    padding: '1px 7px',
    fontSize: 11,
    fontWeight: 700,
  },

  // Count badge on sub-tab (active)
  badgeActive: { background: '#1a1a2e', color: '#fff' },

  // List of history cards
  list: { display: 'flex', flexDirection: 'column', gap: 8 },

  // Individual history card
  card: {
    background: '#fff',
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },

  // Tappable card header row
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
  },

  // Left side of card header
  cardLeft: { display: 'flex', alignItems: 'center', gap: 10 },

  // Warehouse + tech name stacked
  cardMeta: { display: 'flex', flexDirection: 'column', gap: 2 },

  // Warehouse number text
  cardWarehouse: { fontSize: 14, fontWeight: 700, color: '#1a1a2e' },

  // Tech name text
  cardTech: { fontSize: 12, color: '#888' },

  // Right side of card header
  cardRight: { display: 'flex', alignItems: 'center', gap: 10 },

  // Date text
  cardDate: { fontSize: 12, color: '#aaa' },

  // Expand/collapse chevron
  chevron: { fontSize: 11, color: '#aaa' },

  // Expanded body section
  expandedBody: {
    borderTop: '1px solid #f0f2f5',
    padding: '14px 16px',
    background: '#fafafa',
  },

  // Parts table section
  itemsSection: { marginBottom: 14 },

  // Parts table container
  itemsTable: {
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #e8eaed',
  },

  // Parts table header row
  itemsHeader: {
    display: 'flex',
    background: '#f0f2f5',
    padding: '7px 12px',
    gap: 8,
  },

  // Parts table data row
  itemsRow: {
    display: 'flex',
    padding: '7px 12px',
    borderTop: '1px solid #f0f2f5',
    gap: 8,
    background: '#fff',
  },

  // Part number column
  colPart: { flex: '0 0 100px', fontSize: 12, fontWeight: 700, color: '#1a1a2e' },

  // Description column
  colDesc: { flex: 1, fontSize: 12, color: '#555' },

  // Quantity column
  colQty: { flex: '0 0 40px', fontSize: 12, fontWeight: 700, color: '#1a1a2e', textAlign: 'right' },

  // No items message
  noItems: { fontSize: 13, color: '#aaa', marginBottom: 12 },

  // Reason/notes section
  reasonSection: { marginBottom: 14 },

  // Reason/notes text box
  reasonText: {
    fontSize: 13,
    color: '#444',
    background: '#fff',
    border: '1px solid #e8eaed',
    borderRadius: 8,
    padding: '8px 12px',
    margin: 0,
  },

  // View PDF button
  pdfBtn: {
    padding: '8px 16px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
}

// ─────────────────────────────────────────────────────────────
// ADMIN MANAGE PARTS — src/pages/AdminManageParts.jsx
// Parts list, add form, QR preview modal, label printing
// ─────────────────────────────────────────────────────────────
export const managePartsStyles = {
  // Page container
  container: { padding: '8px 0' },

  // Title row with subtitle and Generate All button
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
    flexWrap: 'wrap',
  },

  // Subtitle text
  subtitle: { fontSize: 13, color: '#666', margin: 0 },

  // Generate All QR Codes button (green)
  generateAllBtn: {
    padding: '10px 16px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // Search + Add button toolbar
  toolbar: { display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' },

  // Photo upload row
  photoUploadRow: { display: 'flex', alignItems: 'center', gap: 12 },

  // Photo upload label/button
  photoUploadBtn: {
    padding: '8px 14px',
    background: '#f0f2f5',
    color: '#1a1a2e',
    border: '1.5px solid #ddd',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },

  // Photo thumbnail preview
  photoThumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    objectFit: 'cover',
    border: '1px solid #ddd',
  },

  // Parts list container
  partsList: { display: 'flex', flexDirection: 'column', gap: 8 },

  // Individual part row
  partRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    padding: '10px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },

  // Left side of part row (photo + info)
  partLeft: { display: 'flex', alignItems: 'center', gap: 12 },

  // Part photo thumbnail box
  partThumbBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid #eee',
    flexShrink: 0,
  },

  // Part photo image
  partThumb: { width: '100%', height: '100%', objectFit: 'cover' },

  // Part photo placeholder (no photo)
  partThumbPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 6,
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
  },

  // Part info column
  partInfo: { display: 'flex', flexDirection: 'column', gap: 2 },

  // Part description text
  partDesc: { fontSize: 12, color: '#888' },

  // QR Code button on part row
  qrBtn: {
    padding: '7px 14px',
    background: '#f0f2f5',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // QR modal (narrower than standard modal)
  qrModal: {
    background: '#fff',
    borderRadius: 14,
    padding: '24px 20px',
    width: '100%',
    maxWidth: 380,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
  },

  // QR modal title
  modalTitle: { fontSize: 18, fontWeight: 800, color: '#1a1a2e', margin: 0 },

  // Part description in QR modal
  modalDesc: { fontSize: 13, color: '#666', marginBottom: 16, marginTop: 4 },

  // QR code preview box (centered gray area)
  qrPreviewBox: {
    display: 'flex',
    justifyContent: 'center',
    background: '#f8f9fb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },

  // QR code image
  qrImage: { width: 160, height: 160 },

  // QR generating placeholder text
  qrLoading: { color: '#aaa', fontSize: 13, padding: 40 },

  // QR data hint text
  qrHint: { fontSize: 11, color: '#aaa', textAlign: 'center', marginBottom: 16 },

  // Label preview box
  labelPreview: {
    background: '#f8f9fb',
    border: '1px solid #e8eaed',
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 16,
  },

  // Label preview title
  labelPreviewTitle: { fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 8 },

  // Single label preview box content
  singleLabelPreviewBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },

  // Part number text inside label preview
  labelPartNumber: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: '#1a1a2e',
  },

  // Print single label button
  printBtn: {
    width: '100%',
    padding: '12px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
}

// ─────────────────────────────────────────────────────────────
// ADMIN RECIPIENTS — src/pages/AdminRecipients.jsx
// Email recipient list management
// ─────────────────────────────────────────────────────────────
export const recipientsStyles = {
  // Page container
  container: { padding: '8px 0' },

  // Title row
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
    flexWrap: 'wrap',
  },

  // Subtitle
  subtitle: { fontSize: 13, color: '#666', margin: 0, flex: 1 },

  // Recipients list
  list: { display: 'flex', flexDirection: 'column', gap: 8 },

  // Individual recipient row
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    padding: '12px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    flexWrap: 'wrap',
    gap: 10,
  },

  // Left side of row (avatar + info)
  rowLeft: { display: 'flex', alignItems: 'center', gap: 12 },

  // Recipient info column
  rowInfo: { display: 'flex', flexDirection: 'column', gap: 2 },

  // Recipient name
  rowName: { fontSize: 14, fontWeight: 700, color: '#1a1a2e' },

  // Recipient email
  rowEmail: { fontSize: 12, color: '#888' },

  // Right side of row (toggle + delete)
  rowRight: { display: 'flex', alignItems: 'center', gap: 8 },
}

// ─────────────────────────────────────────────────────────────
// ADMIN DAILY SUMMARY — src/pages/AdminDailySummary.jsx
// Shows today's approved transfers and sends combined PDF email
// ─────────────────────────────────────────────────────────────
export const dailyStyles = {
  // Page container
  container: { padding: '8px 0' },

  // Title row with date and refresh
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },

  // Today's date subtitle
  subtitle: { fontSize: 13, color: '#666', margin: 0 },

  // Summary cards row (two stat cards side by side)
  cardRow: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },

  // Individual stat card
  summaryCard: {
    flex: 1,
    minWidth: 140,
    background: '#fff',
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },

  // Large count number
  cardCount: { fontSize: 36, fontWeight: 800, color: '#1a1a2e', lineHeight: 1 },

  // Stat label
  cardLabel: { fontSize: 13, fontWeight: 700, color: '#333', textAlign: 'center' },

  // "approved today" sub-label
  cardSub: { fontSize: 11, color: '#aaa' },

  // Section (truck / warehouse list)
  section: { marginBottom: 20 },

  // Individual record row in list
  recordRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fff',
    border: '1.5px solid #e8eaed',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 6,
    flexWrap: 'wrap',
  },

  // Tech name in record row
  recordTech: { fontWeight: 700, fontSize: 13, color: '#1a1a2e', flex: 1 },

  // Warehouse badge in record row
  recordWH: {
    fontSize: 12,
    color: '#555',
    background: '#f0f2f5',
    borderRadius: 6,
    padding: '2px 8px',
  },

  // Part count in record row
  recordItems: { fontSize: 12, color: '#888' },

  // Email notes textarea section
  notesSection: { marginBottom: 16 },

  // Email notes label
  notesLabel: { display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 },

  // Email notes textarea
  notesInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 13,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
  },

  // Status message box (success or error)
  statusMsg: { borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 12 },

  // Send Daily Transfers button
  sendBtn: {
    width: '100%',
    padding: '13px',
    background: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
}

// ─────────────────────────────────────────────────────────────
// ADMIN MANAGE USERS — src/pages/AdminManageUsers.jsx
// Admin-only user management (add, edit inline, deactivate)
// ─────────────────────────────────────────────────────────────
export const manageUsersStyles = {
  // Page container
  container: { padding: '8px 0' },

  // Title row
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
    flexWrap: 'wrap',
  },

  // Subtitle
  subtitle: { fontSize: 13, color: '#666', margin: 0, flex: 1 },

  // Search input (full width, above list)
  searchInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    marginBottom: 16,
    boxSizing: 'border-box',
  },

  // Users list
  list: { display: 'flex', flexDirection: 'column', gap: 8 },

  // Individual user card
  card: {
    background: '#fff',
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    padding: '14px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },

  // View mode layout (info + action buttons)
  viewMode: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },

  // Left side of view mode (avatar + info)
  cardLeft: { display: 'flex', alignItems: 'center', gap: 12 },

  // User info column
  userInfo: { display: 'flex', flexDirection: 'column', gap: 2 },

  // Name + role badge row
  nameRow: { display: 'flex', alignItems: 'center', gap: 8 },

  // User name text
  userName: { fontSize: 14, fontWeight: 700, color: '#1a1a2e' },

  // Role badge (colored by role)
  roleBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // User email text
  userEmail: { fontSize: 12, color: '#888' },

  // User PIN text (subtle)
  userPin: { fontSize: 11, color: '#bbb' },

  // Action buttons on right of card
  cardActions: { display: 'flex', gap: 8, flexShrink: 0 },

  // Edit button (gray)
  editBtn: {
    padding: '6px 12px',
    background: '#f0f2f5',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Deactivate button (red)
  deactivateBtn: {
    padding: '6px 12px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Activate button (green)
  activateBtn: {
    padding: '6px 12px',
    background: '#e8f5e9',
    color: '#2d6a4f',
    border: 'none',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Edit mode layout
  editMode: { display: 'flex', flexDirection: 'column' },

  // Edit mode action buttons row
  editActions: { display: 'flex', gap: 8, marginTop: 4 },

  // Save button (green)
  saveBtn: {
    padding: '8px 16px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Cancel edit button (gray)
  cancelEditBtn: {
    padding: '8px 16px',
    background: '#f0f2f5',
    color: '#555',
    border: 'none',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
}

// ─────────────────────────────────────────────────────────────
// PART PREVIEW MODAL — src/components/PartPreviewModal.jsx
// Modal showing part photo, info, qty selector, confirm/dismiss
// ─────────────────────────────────────────────────────────────
export const partPreviewStyles = {
  // Full screen overlay
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

  // Modal card
  modal: {
    background: '#fff',
    borderRadius: '14px',
    padding: '1.75rem',
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },

  // "Part Found" label
  matchLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#2d6a4f',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Photo display box
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

  // Part photo image
  photo: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' },

  // Photo placeholder (no photo)
  photoPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },

  // Photo placeholder icon
  photoIcon: { fontSize: '2.5rem', opacity: 0.4 },

  // Photo placeholder text
  photoText: { fontSize: '0.8rem', color: '#aaa', fontWeight: '500' },

  // Part info section
  partInfo: { marginBottom: '1rem' },

  // Part number (large)
  partNumber: { fontSize: '1.4rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '0.3rem' },

  // Part description
  partDesc: { fontSize: '0.9rem', color: '#555', lineHeight: 1.4 },

  // Quantity selector row
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },

  // +/- quantity button
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

  // Quantity number display
  qtyValue: { fontSize: '1.5rem', fontWeight: '800', color: '#1a1a2e', minWidth: 30 },

  // "Is this correct?" question
  confirmQuestion: { fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '1rem' },

  // Confirm/dismiss button row
  btnRow: { display: 'flex', gap: '0.75rem' },

  // Confirm button (green)
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

  // Dismiss button (red outline)
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