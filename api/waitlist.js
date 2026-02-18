const { isValidEmail, ensureConfig, addEmailToWaitlist, getWaitlistEmails } = require('../lib/brevoWaitlist')

const getBody = (req) => {
  if (req?.body && typeof req.body === 'object') return req.body
  if (typeof req?.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return {}
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const missingConfig = ensureConfig()
    if (missingConfig.length > 0) {
      return res.status(500).json({ error: `Missing server env: ${missingConfig.join(', ')}` })
    }

    if (req.method === 'GET') {
      const emails = await getWaitlistEmails()
      return res.status(200).json({ emails })
    }

    const body = getBody(req)
    const email = `${body?.email || ''}`.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    const result = await addEmailToWaitlist(email)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to submit email to Brevo.' })
  }
}
