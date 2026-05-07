import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import { generateSingleLabelPDF, generateAllLabelsPDF } from '../lib/generateLabelPDF';

export default function AdminManageParts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPart, setNewPart] = useState({ part_number: '', description: '', qr_data: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [qrPreviewUrl, setQrPreviewUrl] = useState('');
  const [generatingSingle, setGeneratingSingle] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);

  useEffect(() => { fetchParts(); }, []);

  async function fetchParts() {
    setLoading(true);
    const { data } = await supabase.from('parts').select('*').order('part_number', { ascending: true });
    setParts(data || []);
    setLoading(false);
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleAddPart() {
    setAddError('');
    if (!newPart.part_number.trim()) { setAddError('Part number is required.'); return; }
    if (!newPart.qr_data.trim()) { setAddError('QR data is required.'); return; }

    setAdding(true);
    try {
      let photo_url = null;
      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const fileName = `parts/${newPart.part_number.trim().toUpperCase()}_${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('transfer-pdfs')
          .upload(fileName, photoFile, { contentType: photoFile.type, upsert: true });
        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);
        photo_url = fileName;
      }

      const { error } = await supabase.from('parts').insert({
        part_number: newPart.part_number.trim().toUpperCase(),
        description: newPart.description.trim(),
        qr_data: newPart.qr_data.trim().toUpperCase(),
        photo_url,
      });
      if (error) throw error;

      setNewPart({ part_number: '', description: '', qr_data: '' });
      setPhotoFile(null);
      setPhotoPreview('');
      setShowAddForm(false);
      await fetchParts();
    } catch (e) {
      setAddError(`Failed to add part: ${e.message}`);
    } finally {
      setAdding(false);
    }
  }

  async function handleOpenQR(part) {
    setSelectedPart(part);
    const url = await QRCode.toDataURL(part.qr_data, {
      width: 200, margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
    setQrPreviewUrl(url);
  }

  async function handlePrintSingle() {
    if (!selectedPart) return;
    setGeneratingSingle(true);
    try {
      const blob = await generateSingleLabelPDF(selectedPart.part_number, selectedPart.qr_data);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      alert(`Failed to generate label: ${e.message}`);
    } finally {
      setGeneratingSingle(false);
    }
  }

  async function handleGenerateAll() {
    setGeneratingAll(true);
    try {
      const blob = await generateAllLabelsPDF(parts);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      alert(`Failed to generate sheet: ${e.message}`);
    } finally {
      setGeneratingAll(false);
    }
  }

  const filtered = parts.filter(p =>
    p.part_number.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <p style={styles.subtitle}>Add parts, view QR codes, and print label sheets.</p>
        <button
          style={{ ...styles.generateAllBtn, opacity: generatingAll || parts.length === 0 ? 0.6 : 1 }}
          onClick={handleGenerateAll}
          disabled={generatingAll || parts.length === 0}
        >
          {generatingAll ? 'Generating...' : '🖨 All QR Codes'}
        </button>
      </div>

      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          placeholder="Search part number or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button style={styles.addBtn} onClick={() => { setShowAddForm(s => !s); setAddError(''); }}>
          {showAddForm ? '✕ Cancel' : '+ Add Part'}
        </button>
      </div>

      {showAddForm && (
        <div style={styles.addForm}>
          <h3 style={styles.addFormTitle}>New Part</h3>
          {addError && <div style={styles.errorBox}>{addError}</div>}
          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.label}>Part Number *</label>
              <input
                style={styles.input}
                placeholder="e.g. HV-4402"
                value={newPart.part_number}
                onChange={e => setNewPart({ ...newPart, part_number: e.target.value })}
              />
            </div>
            <div style={styles.formField}>
              <label style={styles.label}>QR Data *</label>
              <input
                style={styles.input}
                placeholder="Usually same as part number"
                value={newPart.qr_data}
                onChange={e => setNewPart({ ...newPart, qr_data: e.target.value })}
              />
            </div>
          </div>
          <div style={styles.formField}>
            <label style={styles.label}>Description</label>
            <input
              style={styles.input}
              placeholder="e.g. High Voltage Capacitor 440V 2MFD"
              value={newPart.description}
              onChange={e => setNewPart({ ...newPart, description: e.target.value })}
            />
          </div>
          <div style={styles.formField}>
            <label style={styles.label}>Photo (optional)</label>
            <div style={styles.photoUploadRow}>
              <label style={styles.photoUploadBtn}>
                {photoPreview ? '📷 Change Photo' : '📷 Upload Photo'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
              </label>
              {photoPreview && <img src={photoPreview} alt="preview" style={styles.photoThumb} />}
            </div>
          </div>
          <button
            style={{ ...styles.addBtn, marginTop: 12, opacity: adding ? 0.6 : 1 }}
            onClick={handleAddPart}
            disabled={adding}
          >
            {adding ? 'Saving...' : 'Save Part'}
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading parts...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No parts found.</div>
      ) : (
        <div style={styles.partsList}>
          {filtered.map(part => (
            <div key={part.id} style={styles.partRow}>
              <div style={styles.partLeft}>
                {part.photo_url ? (
                  <div style={styles.partThumbBox}>
                    <img src={part.photo_url} alt="" style={styles.partThumb} />
                  </div>
                ) : (
                  <div style={styles.partThumbPlaceholder}>🔩</div>
                )}
                <div style={styles.partInfo}>
                  <span style={styles.partNumber}>{part.part_number}</span>
                  {part.description && <span style={styles.partDesc}>{part.description}</span>}
                </div>
              </div>
              <button style={styles.qrBtn} onClick={() => handleOpenQR(part)}>QR Code</button>
            </div>
          ))}
        </div>
      )}

      {selectedPart && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{selectedPart.part_number}</h3>
              <button style={styles.closeBtn} onClick={() => { setSelectedPart(null); setQrPreviewUrl(''); }}>✕</button>
            </div>
            {selectedPart.description && <p style={styles.modalDesc}>{selectedPart.description}</p>}
            <div style={styles.qrPreviewBox}>
              {qrPreviewUrl
                ? <img src={qrPreviewUrl} alt="QR Code" style={styles.qrImage} />
                : <div style={styles.qrLoading}>Generating...</div>
              }
            </div>
            <p style={styles.qrHint}>QR data: <code>{selectedPart.qr_data}</code></p>
            <div style={styles.labelPreview}>
              <div style={styles.labelPreviewTitle}>Single Label Preview (Avery 5160)</div>
              <div style={styles.singleLabelPreviewBox}>
                {qrPreviewUrl && <img src={qrPreviewUrl} alt="" style={{ width: 44, height: 44 }} />}
                <div style={styles.labelPartNumber}>{selectedPart.part_number}</div>
              </div>
            </div>
            <button
              style={{ ...styles.printBtn, opacity: generatingSingle ? 0.6 : 1 }}
              onClick={handlePrintSingle}
              disabled={generatingSingle}
            >
              {generatingSingle ? 'Generating...' : '🖨 Print Single Label'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '8px 0' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' },
  subtitle: { fontSize: 13, color: '#666', margin: 0 },
  generateAllBtn: {
    padding: '10px 16px', background: '#2d6a4f', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  loading: { padding: 40, textAlign: 'center', color: '#888' },
  empty: { padding: 40, textAlign: 'center', color: '#aaa', fontSize: 14 },
  toolbar: { display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' },
  searchInput: {
    flex: 1, padding: '9px 12px', borderRadius: 8,
    border: '1.5px solid #ddd', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  },
  addBtn: {
    padding: '9px 16px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  addForm: {
    background: '#f8f9fb', border: '1.5px solid #e8eaed',
    borderRadius: 10, padding: 16, marginBottom: 20,
  },
  addFormTitle: { fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginTop: 0, marginBottom: 12 },
  formRow: { display: 'flex', gap: 12, marginBottom: 12 },
  formField: { flex: 1, marginBottom: 12 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 4 },
  input: {
    width: '100%', padding: '8px 10px', borderRadius: 7,
    border: '1.5px solid #ddd', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
  },
  photoUploadRow: { display: 'flex', alignItems: 'center', gap: 12 },
  photoUploadBtn: {
    padding: '8px 14px', background: '#f0f2f5', color: '#1a1a2e',
    border: '1.5px solid #ddd', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
  photoThumb: { width: 48, height: 48, borderRadius: 6, objectFit: 'cover', border: '1px solid #ddd' },
  errorBox: { background: '#fee2e2', color: '#dc2626', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 12 },
  partsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  partRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#fff', border: '1.5px solid #e8eaed', borderRadius: 10, padding: '10px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  partLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  partThumbBox: { width: 36, height: 36, borderRadius: 6, overflow: 'hidden', border: '1px solid #eee', flexShrink: 0 },
  partThumb: { width: '100%', height: '100%', objectFit: 'cover' },
  partThumbPlaceholder: {
    width: 36, height: 36, borderRadius: 6, background: '#f0f2f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
  },
  partInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  partNumber: { fontWeight: 700, fontSize: 14, color: '#1a1a2e' },
  partDesc: { fontSize: 12, color: '#888' },
  qrBtn: {
    padding: '7px 14px', background: '#f0f2f5', color: '#1a1a2e',
    border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
  },
  modal: {
    background: '#fff', borderRadius: 14, padding: '24px 20px',
    width: '100%', maxWidth: 380, maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modalTitle: { fontSize: 18, fontWeight: 800, color: '#1a1a2e', margin: 0 },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, color: '#999', cursor: 'pointer', padding: 0 },
  modalDesc: { fontSize: 13, color: '#666', marginBottom: 16, marginTop: 4 },
  qrPreviewBox: { display: 'flex', justifyContent: 'center', background: '#f8f9fb', borderRadius: 10, padding: 16, marginBottom: 8 },
  qrImage: { width: 160, height: 160 },
  qrLoading: { color: '#aaa', fontSize: 13, padding: 40 },
  qrHint: { fontSize: 11, color: '#aaa', textAlign: 'center', marginBottom: 16 },
  labelPreview: { background: '#f8f9fb', border: '1px solid #e8eaed', borderRadius: 10, padding: '12px 14px', marginBottom: 16 },
  labelPreviewTitle: { fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 8 },
  singleLabelPreviewBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  labelPartNumber: { textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#1a1a2e' },
  printBtn: {
    width: '100%', padding: '12px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
}