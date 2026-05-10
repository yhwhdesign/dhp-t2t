import { warehouseReturnStyles, shared } from '../styles'
const styles = { ...shared, ...warehouseReturnStyles }

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { generateTransferPDF } from '../lib/generatePDF';
import { uploadPDF } from '../lib/uploadPDF';
import PartPreviewModal from '../components/PartPreviewModal';

export default function WarehouseReturn({ user, warehouseNumber: initialWarehouse = '', onBack }) {
  const [warehouseNumber] = useState(initialWarehouse);
  const [notes, setNotes] = useState('');
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

  useEffect(() => {
    if (!scanning) return;
    let scanner;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode('qr-reader');
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

  const handleSubmit = async () => {
    setError('');
    if (!warehouseNumber.trim()) { setError('No warehouse number found.'); return; }
    if (confirmedParts.length === 0) { setError('Please add at least one part.'); return; }

    setSubmitting(true);
    try {
      const { data: returnRow, error: insertError } = await supabase
        .from('return_requests')
        .insert({
          tech_id: user.id,
          tech_name: user.name,
          warehouse_number: warehouseNumber.trim(),
          reason: notes.trim(),
          items: confirmedParts,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const pdfBlob = generateTransferPDF({
        type: 'warehouse_return',
        techName: user.name,
        warehouseNumber: warehouseNumber.trim(),
        notes: notes.trim(),
        date: returnRow.created_at,
        items: confirmedParts,
      });

      const storagePath = await uploadPDF(pdfBlob, 'warehouse_return', user.name, returnRow.id);

      await supabase
        .from('return_requests')
        .update({ pdf_url: storagePath })
        .eq('id', returnRow.id);

      setSubmitSuccess(true);
    } catch (err) {
      setError(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Return Submitted</h2>
          <p style={styles.successText}>
            Your warehouse return has been saved and is pending manager review.
          </p>
          <button style={styles.primaryBtn} onClick={onBack}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>← Back</button>
          <h1 style={styles.title}>Return to Warehouse</h1>
        </div>

        <div style={styles.warehouseBanner}>
          <span style={styles.warehouseLabel}>Warehouse</span>
          <span style={styles.warehouseValue}>{warehouseNumber}</span>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Notes (optional)</label>
          <textarea
            style={{ ...styles.input, height: 70, resize: 'vertical' }}
            placeholder="Reason for return, damage notes, etc."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

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

        <button
          style={styles.scanBtn}
          onClick={() => setScanning(s => !s)}
        >
          {scanning ? '✕ Stop Scanner' : '📷 Scan QR Code'}
        </button>
        {scanning && <div id="qr-reader" ref={scannerRef} style={styles.qrReader} />}

        {confirmedParts.length > 0 && (
          <div style={styles.partsList}>
            <h3 style={styles.partsTitle}>Parts to Return ({confirmedParts.length})</h3>
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
          {submitting ? 'Submitting...' : 'Submit Return'}
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