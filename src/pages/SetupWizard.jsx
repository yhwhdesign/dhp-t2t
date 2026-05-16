import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveConfig } from '../lib/config'
import DefaultLogo from '../components/DefaultLogo'

const TOTAL_STEPS = 7

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Step 1 — Branding
  const [companyName, setCompanyName] = useState('')
  const [appName, setAppName] = useState('T2T')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  // Step 2 — Database (pre-filled from .env)
  const [supabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '')
  const [supabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '')
  const [dbTested, setDbTested] = useState(false)
  const [dbTesting, setDbTesting] = useState(false)

  // Step 3 — Admin account
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPin, setAdminPin] = useState('')

  // Step 4 — Location
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [warehouseNumbers, setWarehouseNumbers] = useState([''])

  // Step 5 — Parts import
  const [partsFile, setPartsFile] = useState(null)
  const [partsPreview, setPartsPreview] = useState([])
  const [partsError, setPartsError] = useState('')

  // Step 6 — Email
  const [resendKey, setResendKey] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')

  function nextStep() {
    setError('')

    if (step === 3) {
      if (!adminName.trim() || !adminEmail.trim() || !adminPin.trim()) {
        setError('Please fill in all admin account fields.')
        return
      }
    }

    if (step === 4) {
      if (!locationName.trim()) {
        setError('Please enter a location name.')
        return
      }
    }

    setStep(s => Math.min(s + 1, TOTAL_STEPS))
  }

  function prevStep() {
    setError('')
    setStep(s => Math.max(s - 1, 1))
  }

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleTestConnection() {
    setDbTesting(true)
    setError('')
    try {
      const { error } = await supabase.from('users').select('id').limit(1)
      if (error) throw error
      setDbTested(true)
    } catch (e) {
      setError(`Connection failed: ${e.message}`)
      setDbTested(false)
    } finally {
      setDbTesting(false)
    }
  }

  async function handlePartsFile(e) {
    setPartsError('')
    const file = e.target.files[0]
    if (!file) return
    setPartsFile(file)

    try {
      const { read, utils } = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const wb = read(buffer)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = utils.sheet_to_json(ws, { header: 1 })

      // Skip header row, map to parts
      const parts = rows.slice(1)
        .filter(row => row[0])
        .map(row => ({
          part_number: String(row[0] || '').trim().toUpperCase(),
          description: String(row[1] || '').trim(),
          qr_data: String(row[2] || row[0] || '').trim().toUpperCase(),
          include: true,
        }))

      setPartsPreview(parts)
    } catch (e) {
      setPartsError(`Failed to parse file: ${e.message}`)
    }
  }

  function removePartFromPreview(index) {
    setPartsPreview(prev => prev.filter((_, i) => i !== index))
  }

  function addWarehouseNumber() {
    setWarehouseNumbers(prev => [...prev, ''])
  }

  function updateWarehouseNumber(index, value) {
    setWarehouseNumbers(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  function removeWarehouseNumber(index) {
    setWarehouseNumbers(prev => prev.filter((_, i) => i !== index))
  }

  async function handleFinish() {
    setSaving(true)
    setError('')

    try {
      // 1. Upload logo if provided
      let logoUrl = null
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        const path = `config/logo.${ext}`
        await supabase.storage.from('transfer-pdfs').upload(path, logoFile, {
          contentType: logoFile.type, upsert: true,
        })
        const { data: urlData } = supabase.storage
          .from('transfer-pdfs')
          .getPublicUrl(path)
        logoUrl = urlData?.publicUrl || null
      }

      // 2. Save config.json
      await saveConfig({
        companyName: companyName.trim() || 'T2T',
        appName: appName.trim() || 'T2T',
        primaryColor: '#1a1a2e',
        accentColor: '#2d6a4f',
        logoUrl,
        locationName: locationName.trim(),
        locationAddress: locationAddress.trim(),
        setupComplete: true,
      })

      // 3. Create admin account
      if (adminName.trim() && adminEmail.trim() && adminPin.trim()) {
        await supabase.from('users').insert({
          name: adminName.trim(),
          email: adminEmail.trim().toLowerCase(),
          pin: adminPin.trim(),
          role: 'admin',
          active: true,
        })
      }

      // 4. Create warehouse numbers
      const validWarehouses = warehouseNumbers.filter(w => w.trim())
      if (validWarehouses.length > 0) {
        await supabase.from('warehouses').insert(
          validWarehouses.map(w => ({
            warehouse_number: w.trim().toUpperCase(),
            location: locationName.trim(),
            active: true,
          }))
        )
      }

      // 5. Import parts
      if (partsPreview.length > 0) {
        await supabase.from('parts').insert(
          partsPreview.map(p => ({
            part_number: p.part_number,
            description: p.description,
            qr_data: p.qr_data,
          }))
        )
      }

      // 6. Add recipient if provided
      if (recipientEmail.trim() && recipientName.trim()) {
        await supabase.from('recipients').insert({
          name: recipientName.trim(),
          email: recipientEmail.trim().toLowerCase(),
          active: true,
        })
      }

      onComplete()
    } catch (e) {
      setError(`Setup failed: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Progress bar
  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div style={styles.root}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <DefaultLogo size="small" />
          <div style={styles.headerText}>
            <h1 style={styles.headerTitle}>Welcome to T2T</h1>
            <p style={styles.headerSub}>Parts Transfer System — Initial Setup</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.stepLabel}>Step {step} of {TOTAL_STEPS}</p>

        {/* Step content */}
        <div style={styles.card}>

          {/* ── Step 1 — Branding ── */}
          {step === 1 && (
            <div>
              <h2 style={styles.stepTitle}>Branding</h2>
              <p style={styles.stepDesc}>Customize the app with your company name and logo.</p>

              <div style={styles.field}>
                <label style={styles.label}>Company Name *</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Company Name"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>App Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. T2T"
                  value={appName}
                  onChange={e => setAppName(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Company Logo (optional)</label>
                <div style={styles.logoUploadArea}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" style={styles.logoPreview} />
                  ) : (
                    <DefaultLogo size="medium" />
                  )}
                  <label style={styles.uploadBtn}>
                    {logoPreview ? '📷 Change Logo' : '📷 Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleLogoChange}
                    />
                  </label>
                  {logoPreview && (
                    <button
                      style={styles.removeLogoBtn}
                      onClick={() => { setLogoFile(null); setLogoPreview(null) }}
                    >
                      Use Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2 — Database ── */}
          {step === 2 && (
            <div>
              <h2 style={styles.stepTitle}>Database Connection</h2>
              <p style={styles.stepDesc}>Your Supabase credentials are pre-filled from your environment. Test the connection to continue.</p>

              <div style={styles.field}>
                <label style={styles.label}>Supabase URL</label>
                <input
                  style={{ ...styles.input, background: '#f5f5f5', color: '#888' }}
                  value={supabaseUrl}
                  disabled
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Supabase Anon Key</label>
                <input
                  style={{ ...styles.input, background: '#f5f5f5', color: '#888' }}
                  value={supabaseKey ? '••••••••••••••••••••' : 'Not set'}
                  disabled
                />
              </div>

              <button
                style={{
                  ...styles.testBtn,
                  background: dbTested ? '#2d6a4f' : '#1a1a2e',
                  opacity: dbTesting ? 0.7 : 1,
                }}
                onClick={handleTestConnection}
                disabled={dbTesting || dbTested}
              >
                {dbTesting ? 'Testing...' : dbTested ? '✓ Connected' : 'Test Connection'}
              </button>

              {!dbTested && !dbTesting && (
                <p style={styles.hint}>You must test the connection before continuing.</p>
              )}
            </div>
          )}

          {/* ── Step 3 — Admin Account ── */}
          {step === 3 && (
            <div>
              <h2 style={styles.stepTitle}>Admin Account</h2>
              <p style={styles.stepDesc}>Create the main administrator account for this installation.</p>

              <div style={styles.field}>
                <label style={styles.label}>Full Name *</label>
                <input
                  style={styles.input}
                  placeholder="e.g. John Smith"
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Email *</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="admin@company.com"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  autoCapitalize="none"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>PIN *</label>
                <input
                  style={styles.input}
                  placeholder="Choose a PIN (e.g. 1234)"
                  value={adminPin}
                  onChange={e => setAdminPin(e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
          )}

          {/* ── Step 4 — Location + Warehouses ── */}
          {step === 4 && (
            <div>
              <h2 style={styles.stepTitle}>Location & Warehouses</h2>
              <p style={styles.stepDesc}>Set up this location and the warehouse numbers your techs will use.</p>

              <div style={styles.field}>
                <label style={styles.label}>Location Name *</label>
                <input
                  style={styles.input}
                  placeholder="Little Rock Location ( LIT )"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Address (optional)</label>
                <input
                  style={styles.input}
                  placeholder="e.g. 123 Main St, Kansas City, MO"
                  value={locationAddress}
                  onChange={e => setLocationAddress(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Warehouse Numbers</label>
                <p style={styles.fieldHint}>Add all warehouse numbers techs will use at this location.</p>
                {warehouseNumbers.map((wh, index) => (
                  <div key={index} style={styles.warehouseRow}>
                    <input
                      style={{ ...styles.input, flex: 1 }}
                      placeholder="e.g. WH-001"
                      value={wh}
                      onChange={e => updateWarehouseNumber(index, e.target.value)}
                      autoCapitalize="characters"
                    />
                    {warehouseNumbers.length > 1 && (
                      <button
                        style={styles.removeWhBtn}
                        onClick={() => removeWarehouseNumber(index)}
                      >✕</button>
                    )}
                  </div>
                ))}
                <button style={styles.addWhBtn} onClick={addWarehouseNumber}>
                  + Add Warehouse
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5 — Parts Import ── */}
          {step === 5 && (
            <div>
              <h2 style={styles.stepTitle}>Parts Import</h2>
              <p style={styles.stepDesc}>Upload an Excel or CSV file to bulk import your parts list. You can skip this and add parts manually later.</p>

              <div style={styles.field}>
                <label style={styles.label}>Parts File (Excel or CSV)</label>
                <p style={styles.fieldHint}>Columns: Part Number, Description, QR Data</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={styles.fileUploadBtn}>
                    📂 {partsFile ? 'Change File' : 'Choose File'}
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      style={{ display: 'none' }}
                      onChange={handlePartsFile}
                    />
                  </label>
                  {partsFile && (
                    <button
                      style={styles.clearFileBtn}
                      onClick={() => {
                        setPartsFile(null)
                        setPartsPreview([])
                        setPartsError('')
                      }}
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
                {partsFile && (
                  <p style={styles.fileName}>{partsFile.name} — {partsPreview.length} parts found</p>
                )}
                {partsError && <p style={styles.errorText}>{partsError}</p>}
              </div>

              {partsPreview.length > 0 && (
                <div style={styles.partsPreview}>
                  <div style={styles.previewHeader}>
                    <span style={styles.previewTitle}>Preview — {partsPreview.length} parts</span>
                    <span style={styles.previewHint}>Tap 🗑 to remove a part</span>
                  </div>
                  <div style={styles.previewList}>
                    {partsPreview.map((part, index) => (
                      <div key={index} style={styles.previewRow}>
                        <div style={styles.previewInfo}>
                          <span style={styles.previewPartNumber}>{part.part_number}</span>
                          <span style={styles.previewDesc}>{part.description}</span>
                        </div>
                        <button
                          style={styles.removePartBtn}
                          onClick={() => removePartFromPreview(index)}
                        >🗑</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 6 — Email Setup ── */}
          {step === 6 && (
            <div>
              <h2 style={styles.stepTitle}>Email Setup</h2>
              <p style={styles.stepDesc}>Configure email delivery for daily transfer summaries. You can skip this and set it up later in the admin panel.</p>

              <div style={styles.field}>
                <label style={styles.label}>From Email Address</label>
                <input
                  style={styles.input}
                  placeholder="e.g. transfers@yourcompany.com"
                  value={fromEmail}
                  onChange={e => setFromEmail(e.target.value)}
                  autoCapitalize="none"
                />
                <p style={styles.fieldHint}>Must be a verified domain in your Resend account.</p>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>First Recipient Name (optional)</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Jane Smith"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>First Recipient Email (optional)</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="jane@company.com"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  autoCapitalize="none"
                />
              </div>
            </div>
          )}

          {/* ── Step 7 — Review + Launch ── */}
          {step === 7 && (
            <div>
              <h2 style={styles.stepTitle}>Review & Launch</h2>
              <p style={styles.stepDesc}>Everything looks good. Review your setup and launch the app.</p>

              <div style={styles.reviewList}>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Company</span>
                  <span style={styles.reviewValue}>{companyName || '—'}</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>App Name</span>
                  <span style={styles.reviewValue}>{appName || 'T2T'}</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Logo</span>
                  <span style={styles.reviewValue}>{logoFile ? logoFile.name : 'Default T2T logo'}</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Admin</span>
                  <span style={styles.reviewValue}>{adminName || '—'} ({adminEmail || '—'})</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Location</span>
                  <span style={styles.reviewValue}>{locationName || '—'}</span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Warehouses</span>
                  <span style={styles.reviewValue}>
                    {warehouseNumbers.filter(w => w.trim()).length} configured
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Parts</span>
                  <span style={styles.reviewValue}>
                    {partsPreview.length > 0 ? `${partsPreview.length} to import` : 'None — add manually later'}
                  </span>
                </div>
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Email Recipient</span>
                  <span style={styles.reviewValue}>{recipientEmail || 'None — add later'}</span>
                </div>
              </div>

              {error && <p style={styles.errorText}>{error}</p>}

              <button
                style={{ ...styles.launchBtn, opacity: saving ? 0.7 : 1 }}
                onClick={handleFinish}
                disabled={saving}
              >
                {saving ? 'Setting up...' : '🚀 Launch App'}
              </button>
            </div>
          )}

          {error && step !== 7 && <p style={styles.errorText}>{error}</p>}

        </div>

        {/* Navigation */}
        <div style={styles.navRow}>
          {step > 1 && (
            <button style={styles.backBtn} onClick={prevStep}>← Back</button>
          )}
          {step < TOTAL_STEPS && (
            <button
              style={{
                ...styles.nextBtn,
                opacity: (step === 2 && !dbTested) ? 0.4 : 1,
                marginLeft: step === 1 ? 'auto' : 0,
              }}
              onClick={nextStep}
              disabled={step === 2 && !dbTested}
            >
              {step === 5 ? (partsPreview.length > 0 ? 'Import & Continue →' : 'Skip →') :
               step === 6 ? 'Continue →' : 'Next →'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  container: {
    width: '100%',
    maxWidth: 480,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  headerText: {},
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 800,
    margin: 0,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    margin: '4px 0 0',
  },
  progressBar: {
    height: 4,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#2d6a4f',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    textAlign: 'right',
    marginBottom: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '24px 20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#1a1a2e',
    margin: '0 0 6px',
  },
  stepDesc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  field: { marginBottom: 16 },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#555',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #e0e0e0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#fafafa',
  },
  fieldHint: {
    fontSize: 11,
    color: '#aaa',
    margin: '4px 0 8px',
  },
  logoUploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '20px',
    background: '#f8f9fb',
    borderRadius: 10,
    border: '1.5px dashed #ddd',
  },
  logoPreview: {
    height: 60,
    objectFit: 'contain',
    borderRadius: 8,
  },
  uploadBtn: {
    padding: '8px 16px',
    background: '#1a1a2e',
    color: '#fff',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  removeLogoBtn: {
    padding: '6px 12px',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 12,
    color: '#888',
    cursor: 'pointer',
  },
  testBtn: {
    width: '100%',
    padding: '12px',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  warehouseRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  removeWhBtn: {
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 6,
    width: 32,
    height: 40,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  addWhBtn: {
    padding: '8px 14px',
    background: '#f0f2f5',
    border: '1.5px dashed #ccc',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    cursor: 'pointer',
  },
  fileUploadBtn: {
    display: 'inline-block',
    padding: '10px 16px',
    background: '#1a1a2e',
    color: '#fff',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 8,
  },
  fileName: {
    fontSize: 12,
    color: '#2d6a4f',
    fontWeight: 600,
    margin: '4px 0 0',
  },
  partsPreview: {
    border: '1.5px solid #e8eaed',
    borderRadius: 10,
    overflow: 'hidden',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#f8f9fb',
    borderBottom: '1px solid #e8eaed',
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  previewHint: {
    fontSize: 11,
    color: '#aaa',
  },
  previewList: {
    maxHeight: 200,
    overflowY: 'auto',
  },
  previewRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 14px',
    borderBottom: '1px solid #f5f5f5',
    background: '#fff',
  },
  previewInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  previewPartNumber: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  previewDesc: {
    fontSize: 11,
    color: '#888',
  },
  removePartBtn: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    padding: '4px',
  },
  reviewList: {
    background: '#f8f9fb',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  reviewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid #f0f0f0',
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  reviewValue: {
    fontSize: 13,
    color: '#1a1a2e',
    fontWeight: 600,
    textAlign: 'right',
    maxWidth: '60%',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  launchBtn: {
    width: '100%',
    padding: '14px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  nextBtn: {
    padding: '10px 24px',
    background: '#fff',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },

  clearFileBtn: {
    padding: '10px 16px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
}