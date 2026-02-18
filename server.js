const express = require('express')
const dotenv = require('dotenv')
const { isValidEmail, ensureConfig, addEmailToWaitlist, getWaitlistEmails } = require('./lib/brevoWaitlist')

dotenv.config({ path: '.env.local' })
dotenv.config()

const app = express()
const port = Number(process.env.API_PORT || 8788)

app.use(express.json())

app.post('/api/waitlist', async (req, res) => {
  try {
    const missingConfig = ensureConfig()
    if (missingConfig.length > 0) {
      return res.status(500).json({ error: `Missing server env: ${missingConfig.join(', ')}` })
    }

    const email = `${req.body?.email || ''}`.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    const result = await addEmailToWaitlist(email)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to submit email to Brevo.' })
  }
})

app.get('/api/waitlist', async (_req, res) => {
  try {
    const missingConfig = ensureConfig()
    if (missingConfig.length > 0) {
      return res.status(500).json({ error: `Missing server env: ${missingConfig.join(', ')}` })
    }
    const emails = await getWaitlistEmails()
    return res.status(200).json({ emails })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to read waitlist.' })
  }
})

app.listen(port, () => {
  console.log(`Waitlist API listening on http://localhost:${port} (Brevo-backed)`)
})
