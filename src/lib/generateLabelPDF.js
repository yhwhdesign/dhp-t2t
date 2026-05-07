import jsPDF from 'jspdf'
import QRCode from 'qrcode'

export async function generateSingleLabelPDF(partNumber, qrData) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [25.4, 76.2] })

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    width: 200, margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  })

  doc.addImage(qrDataUrl, 'PNG', 1, 1, 23, 23)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)

  const lines = doc.splitTextToSize(partNumber, 48)
  doc.text(lines, 26, 8)

  return doc.output('blob')
}

export async function generateAllLabelsPDF(parts) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })

  const labelW = 66.7
  const labelH = 25.4
  const cols = 3
  const rows = 10
  const marginLeft = 4.8
  const marginTop = 12.7

  let col = 0
  let row = 0
  let pageCount = 0

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    if (i > 0 && col === 0 && row === 0) {
      doc.addPage()
      pageCount++
    }

    const x = marginLeft + col * labelW
    const y = marginTop + row * labelH

    const qrDataUrl = await QRCode.toDataURL(part.qr_data, {
      width: 150, margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })

    doc.addImage(qrDataUrl, 'PNG', x + 1, y + 1, 20, 20)

    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    const lines = doc.splitTextToSize(part.part_number, 40)
    doc.text(lines, x + 23, y + 8)

    if (part.description) {
      doc.setFontSize(5)
      doc.setFont('helvetica', 'normal')
      const descLines = doc.splitTextToSize(part.description, 40)
      doc.text(descLines, x + 23, y + 13)
    }

    col++
    if (col >= cols) {
      col = 0
      row++
      if (row >= rows) {
        row = 0
      }
    }
  }

  return doc.output('blob')
}