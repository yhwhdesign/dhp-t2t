import { createClient } from '@supabase/supabase-js'

// Default branding used before config loads or if no config exists
export const DEFAULT_CONFIG = {
  companyName: 'T2T',
  appName: 'DHP T2T',
  primaryColor: '#1a1a2e',
  accentColor: '#2d6a4f',
  logoUrl: null, // null = use DefaultLogo component
  setupComplete: false,
}

// In-memory config cache
let _config = null

/**
 * Load config.json from Supabase Storage
 * Returns DEFAULT_CONFIG if not found (triggers setup wizard)
 */
export async function loadConfig() {
  if (_config) return _config

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      _config = { ...DEFAULT_CONFIG }
      return _config
    }

    const client = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await client.storage
      .from('transfer-pdfs')
      .download('config/config.json')

    if (error || !data) {
      _config = { ...DEFAULT_CONFIG }
      return _config
    }

    const text = await data.text()
    const parsed = JSON.parse(text)
    _config = { ...DEFAULT_CONFIG, ...parsed, setupComplete: true }
    return _config
  } catch (e) {
    console.error('Config load error:', e)
    _config = { ...DEFAULT_CONFIG }
    return _config
  }
}

/**
 * Save config.json to Supabase Storage
 */
export async function saveConfig(config) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const client = createClient(supabaseUrl, supabaseAnonKey)

  const blob = new Blob([JSON.stringify({ ...config, setupComplete: true })], {
    type: 'application/json',
  })

  const { error } = await client.storage
    .from('transfer-pdfs')
    .upload('config/config.json', blob, {
      contentType: 'application/json',
      upsert: true,
    })

  if (error) throw new Error(`Failed to save config: ${error.message}`)

  // Update in-memory cache
  _config = { ...config, setupComplete: true }
  return _config
}

/**
 * Clear config cache (forces reload on next loadConfig call)
 */
export function clearConfigCache() {
  _config = null
}