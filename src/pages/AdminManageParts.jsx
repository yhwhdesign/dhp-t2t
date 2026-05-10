import { managePartsStyles, shared } from '../styles'
const styles = { ...shared, ...managePartsStyles }

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