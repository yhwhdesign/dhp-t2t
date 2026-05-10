import { startTransferStyles, shared } from '../styles'
const styles = { ...shared, ...startTransferStyles }

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { generateTransferPDF } from '../lib/generatePDF';
import { uploadPDF } from '../lib/uploadPDF';
import PartPreviewModal from '../components/PartPreviewModal';

export default function StartTransfer({ user, warehouseNumber: initialWarehouse = '', onBack }) {
  const [warehouseNumber] = useState(initialWarehouse);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [confirmedParts, setConfirmedParts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const searchTimeout = useRef(null);
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  // ── Debounced part search ──────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      const { data } = await supabase
        .from('parts')
        .select('*')
        .ilike('part_number', `%${searchQuery}%`)
        .limit(5);
      setSearchResults(data || []);
    }, 500);
    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  // ── QR Scanner ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!scanning) return;
    let scanner;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode('qr-reader-transfer');
      html5QrRef.current = scanner;
      scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await scanner.stop();
          setScanning(false);
          const { data } = await supabase
            .from('parts')
            .select('*')
            .eq('qr_data', decodedText)
            .single();
          if (data) { setSelectedPart(data); setShowModal(true); }
          else setError(`No part found for QR: ${decodedText}`);
        },
        () => {}
      ).catch(() => setScanning(false));
    });
    return () => { if (html5QrRef.current) html5QrRef.current.stop().catch(() => {}); };
  }, [scanning]);

  const handleSelectPart = (part) => {
    setSelectedPart(part);
    setSearchResults([]);
    setSearchQuery('');
    setShowModal(true);
  };

  const handleConfirmPart = () => {
    const existing = confirmedParts.find(p => p.part_id === selectedPart.id);
    if (existing) {
      setConfirmedParts(confirmedParts.map(p =>
        p.part_id === selectedPart.id
          ? { ...p, quantity: p.quantity + quantity }
          : p
      ));
    } else {
      setConfirmedParts([...confirmedParts, {
        part_id: selectedPart.id,
        part_number: selectedPart.part_number,
        description: selectedPart.description,
        quantity,
      }]);
    }
    setShowModal(false);
    setSelectedPart(null);
    setQuantity(1);
  };

  const handleRemovePart = (partId) => {
    setConfirmedParts(confirmedParts.filter(p => p.part_id !== partId));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!warehouseNumber.trim()) { setError('No warehouse number found.'); return; }
    if (confirmedParts.length === 0) { setError('Please add at least one part.'); return; }

    setSubmitting(true);
    try {
      const { data: transferRow, error: transferError } = await supabase
        .from('transfers')
        .insert({
          warehouse_number: warehouseNumber.trim(),
          tech_id: user.id,
          tech_name: user.name,
          notes: '',
          status: 'pending',
        })
        .select()
        .single();

      if (transferError) throw transferError;

      const itemsToInsert = confirmedParts.map(p => ({
        transfer_id: transferRow.id,
        part_id: p.part_id,
        part_number: p.part_number,
        description: p.description,
        quantity: p.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('transfer_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      const pdfBlob = generateTransferPDF({
        type: 'truck_transfer',
        techName: user.name,
        warehouseNumber: warehouseNumber.trim(),
        notes: '',
        date: transferRow.created_at,
        items: confirmedParts,
      });

      const storagePath = await uploadPDF(pdfBlob, 'truck_transfer', user.name, transferRow.id);

      await supabase
        .from('transfers')
        .update({ pdf_url: storagePath })
        .eq('id', transferRow.id);

      setSubmitSuccess(true);
    } catch (err) {
      setError(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Transfer Submitted</h2>
          <p style={styles.successText}>
            Your truck transfer has been saved and is pending manager review.
          </p>
          <button style={styles.primaryBtn} onClick={onBack}>Back to Home</button>
        </div>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>← Back</button>
          <h1 style={styles.title}>Transfer to Truck</h1>
        </div>

        <div style={styles.warehouseBanner}>
          <span style={styles.warehouseLabel}>Warehouse</span>
          <span style={styles.warehouseValue}>{warehouseNumber}</span>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Part search */}
        <div style={styles.field}>
          <label style={styles.label}>Search Parts</label>
          <input
            style={styles.input}
            placeholder="Type part number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div style={styles.dropdown}>
              {searchResults.map(part => (
                <div
                  key={part.id}
                  style={styles.dropdownItem}
                  onClick={() => handleSelectPart(part)}
                >
                  <strong>{part.part_number}</strong> — {part.description}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Scan button */}
        <button
          style={styles.scanBtn}
          onClick={() => setScanning(s => !s)}
        >
          {scanning ? '✕ Stop Scanner' : '📷 Scan QR Code'}
        </button>
        {scanning && <div id="qr-reader-transfer" ref={scannerRef} style={styles.qrReader} />}

        {/* Confirmed parts list */}
        {confirmedParts.length > 0 && (
          <div style={styles.partsList}>
            <h3 style={styles.partsTitle}>Parts to Transfer ({confirmedParts.length})</h3>
            {confirmedParts.map(part => (
              <div key={part.part_id} style={styles.partRow}>
                <div>
                  <span style={styles.partNumber}>{part.part_number}</span>
                  <span style={styles.partDesc}> — {part.description}</span>
                </div>
                <div style={styles.partRowRight}>
                  <span style={styles.qtyBadge}>Qty: {part.quantity}</span>
                  <button
                    style={styles.removeBtn}
                    onClick={() => handleRemovePart(part.part_id)}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          style={{ ...styles.primaryBtn, opacity: submitting ? 0.6 : 1 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Transfer'}
        </button>
      </div>

      {showModal && selectedPart && (
        <PartPreviewModal
          part={selectedPart}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onConfirm={handleConfirmPart}
          onCancel={() => { setShowModal(false); setSelectedPart(null); }}
        />
      )}
    </div>
  );
}