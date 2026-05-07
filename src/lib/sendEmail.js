export async function sendApprovalEmail({ recipients, pdfBlob, transferType, techName, date, managerNotes }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const arrayBuffer = await pdfBlob.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  let binary = ''
  uint8Array.forEach(byte => binary += String.fromCharCode(byte))
  const base64PDF = btoa(binary)

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const transferLabel = transferType === 'warehouse_return' ? 'Warehouse Return' : 'Truck Transfer'

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #1a1a2e; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">DHP T2T</h1>
        <p style="color: #a0aec0; margin: 4px 0 0; font-size: 13px;">Parts Transfer System</p>
      </div>
      <div style="background: #f8f9fb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e8eaed;">
        <p style="font-size: 15px; margin-top: 0;">
          Please find attached the <strong>${transferLabel}</strong> submitted by
          <strong>${techName}</strong> on <strong>${formattedDate}</strong>.
        </p>
        ${managerNotes ? `
        <div style="background: #fff; border-left: 4px solid #1a1a2e; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #666; margin-bottom: 4px;">MANAGER NOTES</p>
          <p style="margin: 0; font-size: 14px; color: #333;">${managerNotes}</p>
        </div>` : ''}
        <p style="font-size: 13px; color: #888; margin-bottom: 0;">
          This is an automated message from the DHP T2T Parts Transfer System.
        </p>
      </div>
    </div>
  `

  const filename = `DHP_T2T_${transferLabel.replace(' ', '_')}_${techName.replace(' ', '_')}_${new Date(date).toISOString().slice(0, 10)}.pdf`

  const response = await fetch(`${supabaseUrl}/functions/v1/send-approval-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      recipients,
      pdfBase64: base64PDF,
      filename,
      subject: `DHP T2T — ${transferLabel} · ${techName} · ${formattedDate}`,
      htmlBody,
    }),
  })

  const result = await response.json()
  if (!result.success) throw new Error(result.error || 'Email failed to send.')
  return true
}