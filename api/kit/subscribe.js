const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const callKit = async (apiKey, endpoint, payload) => {
  const response = await fetch(`https://api.kit.com${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data?.message || data?.error || 'Kit API request failed'
    throw new Error(message)
  }

  return data
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const kitApiKey = process.env.KIT_API_KEY
    const kitFormId = process.env.KIT_FORM_ID || '9100092'

    if (!kitApiKey) {
      return res.status(500).json({ error: 'KIT_API_KEY is missing on the server.' })
    }

    const email = `${req.body?.email || ''}`.trim().toLowerCase()
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }

    await callKit(kitApiKey, '/v4/subscribers', { email_address: email })
    const result = await callKit(kitApiKey, `/v4/forms/${kitFormId}/subscribers`, {
      email_address: email
    })

    return res.status(200).json({
      ok: true,
      subscriber: result?.subscriber || null
    })
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to submit email to Kit.' })
  }
}
