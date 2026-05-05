// Management API helper — bypasses blocked Supabase REST/Functions endpoints
// Works even when Supabase project is quota-blocked (402)

const SUPABASE_REF = process.env.SUPABASE_REF || 'uchmopqiylywnemvjttl'
const MGMT_URL = `https://api.supabase.com/v1/projects/${SUPABASE_REF}/database/query`

export async function dbQuery(sql) {
  const pat = process.env.SUPABASE_MGMT_PAT
  if (!pat) throw new Error('SUPABASE_MGMT_PAT not set')
  const res = await fetch(MGMT_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${pat}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DB failed ${res.status}: ${err.slice(0, 300)}`)
  }
  return res.json()
}

// Safe SQL string escaping
export function sq(val) {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'number') return String(val)
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
  return `'${String(val).replace(/'/g, "''")}'`
}

// Load key/value settings from api_settings
export async function loadSettings(keys) {
  const keyList = keys.map(k => `'${k}'`).join(',')
  const rows = await dbQuery(`SELECT key_name, key_value FROM api_settings WHERE key_name IN (${keyList})`)
  const result = {}
  for (const r of rows) result[r.key_name] = r.key_value
  return result
}
