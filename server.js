const express = require('express')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

dotenv.config({ path: '.env.local' })
dotenv.config()

const app = express()
const port = Number(process.env.API_PORT || 8788)
const kitApiBase = 'https://api.kit.com'
const kitRequestTimeoutMs = Number(process.env.KIT_TIMEOUT_MS || 10000)

app.use(express.json())

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const dbPath = path.join(__dirname, 'data', 'waitlist.json')
const kitApiKey = process.env.KIT_API_KEY
const kitFormId = process.env.KIT_FORM_ID || '9100092'

const callKit = async (endpoint, payload) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), kitRequestTimeoutMs)
  try {
    const response = await fetch(`${kitApiBase}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': kitApiKey
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = data?.message || data?.error || 'Kit API request failed.'
      throw new Error(message)
    }
    return data
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Kit request timed out.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

const ensureDb = async () => {
  await fs.promises.mkdir(path.dirname(dbPath), { recursive: true })
  if (!fs.existsSync(dbPath)) {
    await fs.promises.writeFile(dbPath, JSON.stringify({ emails: [] }, null, 2))
  }
}

const readDb = async () => {
  await ensureDb()
  const raw = await fs.promises.readFile(dbPath, 'utf8')
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.emails)) return { emails: [] }
    return parsed
  } catch {
    return { emails: [] }
  }
}

const writeDb = async (data) => {
  await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2))
}

app.post('/api/waitlist', async (req, res) => {
  try {
    if (!kitApiKey) {
      return res.status(500).json({ error: 'KIT_API_KEY is missing on the server.' })
    }

    const email = `${req.body?.email || ''}`.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    const db = await readDb()
    const existing = db.emails.find((entry) => entry.email === email)
    if (existing) {
      return res.status(200).json({ ok: true, alreadyExists: true, email })
    }

    await callKit('/v4/subscribers', { email_address: email })
    await callKit(`/v4/forms/${kitFormId}/subscribers`, { email_address: email })

    db.emails.push({
      email,
      createdAt: new Date().toISOString(),
      source: 'kit'
    })
    await writeDb(db)

    return res.status(200).json({ ok: true, alreadyExists: false, email })
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to submit email to Kit.' })
  }
})

app.get('/api/waitlist', async (_req, res) => {
  try {
    const db = await readDb()
    return res.status(200).json(db)
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to read waitlist.' })
  }
})

app.listen(port, () => {
  console.log(`Waitlist API listening on http://localhost:${port} (Kit form: ${kitFormId})`)
})
