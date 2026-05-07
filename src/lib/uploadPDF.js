import { supabase } from './supabase'

export async function uploadPDF(blob, type, techName, recordId) {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10)
  const timeStr = date.toTimeString().slice(0, 5).replace(':', '-')
  const shortId = recordId.slice(0, 8)
  const safeName = techName.replace(/\s+/g, '')
  const typeLabel = type === 'warehouse_return' ? 'WarehouseReturn' : 'TruckTransfer'
  const filename = `${safeName}_${typeLabel}_${dateStr}_${timeStr}_${shortId}.pdf`
  const folder = type === 'warehouse_return' ? 'warehouse_return' : 'truck_transfer'
  const path = `${folder}/${filename}`

  const { error } = await supabase.storage
    .from('transfer-pdfs')
    .upload(path, blob, { contentType: 'application/pdf', upsert: true })

  if (error) throw new Error(`PDF upload failed: ${error.message}`)
  return path
}