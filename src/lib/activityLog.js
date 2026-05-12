import { supabase } from './supabase'

export async function logActivity({ action, entity, entityId, details, performedBy }) {
  try {
    await supabase.from('activity_log').insert({
      action,
      entity,
      entity_id: entityId,
      details,
      performed_by: performedBy,
      notified: false,
    })
  } catch (e) {
    console.error('Failed to log activity:', e.message)
  }
}