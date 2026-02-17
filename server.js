const express = require('express')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })
dotenv.config()

const app = express()
const port = Number(process.env.API_PORT || 8788)
const supabaseRequestTimeoutMs = Number(process.env.SUPABASE_TIMEOUT_MS || 10000)

app.use(express.json())

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const supabaseUrl = `${process.env.SUPABASE_URL || ''}`.replace(/\/+$/, '')
const supabaseApiKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY
const supabaseTable = process.env.SUPABASE_TABLE || 'waitlist'
const supabaseTablePath = encodeURIComponent(supabaseTable)
const supabaseEmailColumn = process.env.SUPABASE_EMAIL_COLUMN || 'email'

const requireSupabaseConfig = () => {
  const missing = []
  if (!supabaseUrl) missing.push('SUPABASE_URL')
  if (!supabaseApiKey) missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_PUBLISHABLE_KEY')
  return missing
}

const callSupabase = async (method, endpoint, body, prefer) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), supabaseRequestTimeoutMs)
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseApiKey,
        Authorization: `Bearer ${supabaseApiKey}`,
        ...(prefer ? { Prefer: prefer } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal
    })

    const raw = await response.text()
    const data = raw ? JSON.parse(raw) : null
    if (!response.ok) {
      const message = data?.message || data?.error_description || data?.error || 'Supabase request failed.'
      throw new Error(message)
    }
    return data
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Supabase request timed out.')
    }
    if (error instanceof SyntaxError) {
      throw new Error('Supabase returned a non-JSON response.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

app.post('/api/waitlist', async (req, res) => {
  try {
    const missingConfig = requireSupabaseConfig()
    if (missingConfig.length > 0) {
      return res.status(500).json({ error: `Missing server env: ${missingConfig.join(', ')}` })
    }

    const email = `${req.body?.email || ''}`.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    const payload = [{ [supabaseEmailColumn]: email }]
    const rows = await callSupabase(
      'POST',
      `${supabaseTablePath}?on_conflict=${encodeURIComponent(supabaseEmailColumn)}`,
      payload,
      'resolution=ignore-duplicates,return=representation'
    )
    const alreadyExists = !Array.isArray(rows) || rows.length === 0

    return res.status(200).json({ ok: true, alreadyExists, email })
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to submit email to Supabase.' })
  }
})

app.get('/api/waitlist', async (_req, res) => {
  try {
    const missingConfig = requireSupabaseConfig()
    if (missingConfig.length > 0) {
      return res.status(500).json({ error: `Missing server env: ${missingConfig.join(', ')}` })
    }
    const rows = await callSupabase('GET', `${supabaseTablePath}?select=*`)
    return res.status(200).json({ emails: Array.isArray(rows) ? rows : [] })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to read waitlist.' })
  }
})

app.listen(port, () => {
  console.log(`Waitlist API listening on http://localhost:${port} (Supabase table: ${supabaseTable})`)
})
