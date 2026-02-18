const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const getConfig = () => {
  const apiKey = process.env.BREVO_API_KEY || ''
  const listId = process.env.BREVO_LIST_ID ? Number(process.env.BREVO_LIST_ID) : null
  const listName = process.env.BREVO_LIST_NAME || ''
  const timeoutMs = Number(process.env.BREVO_TIMEOUT_MS || 10000)
  return { apiKey, listId, listName, timeoutMs }
}

const ensureConfig = () => {
  const { apiKey, listId, listName } = getConfig()
  const missing = []
  if (!apiKey) missing.push('BREVO_API_KEY')
  if (!listId && !listName) missing.push('BREVO_LIST_ID or BREVO_LIST_NAME')
  return missing
}

const callBrevo = async (method, endpoint, body) => {
  const { apiKey, timeoutMs } = getConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://api.brevo.com/v3/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal
    })

    const raw = await response.text()
    const data = raw ? JSON.parse(raw) : null
    if (!response.ok) {
      const message = data?.message || data?.code || 'Brevo request failed.'
      throw new Error(message)
    }
    return data
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Brevo request timed out.')
    }
    if (error instanceof SyntaxError) {
      throw new Error('Brevo returned a non-JSON response.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

const resolveListId = async () => {
  const { listId, listName } = getConfig()
  if (Number.isInteger(listId) && listId > 0) return listId
  if (!listName) throw new Error('Missing Brevo list configuration.')

  let offset = 0
  const limit = 50
  while (true) {
    const data = await callBrevo('GET', `contacts/lists?limit=${limit}&offset=${offset}`)
    const lists = Array.isArray(data?.lists) ? data.lists : []
    const match = lists.find((item) => item?.name === listName)
    if (match?.id) return Number(match.id)
    if (lists.length < limit) break
    offset += limit
  }

  throw new Error(`Brevo list "${listName}" was not found.`)
}

const addEmailToWaitlist = async (email) => {
  const listId = await resolveListId()
  await callBrevo('POST', 'contacts', {
    email,
    listIds: [listId],
    updateEnabled: true
  })
  return { ok: true, alreadyExists: false, email }
}

const getWaitlistEmails = async () => {
  const listId = await resolveListId()
  const data = await callBrevo('GET', `contacts/lists/${listId}/contacts?limit=50&offset=0`)
  const contacts = Array.isArray(data?.contacts) ? data.contacts : []
  return contacts.map((contact) => ({
    email: contact?.email || '',
    createdAt: contact?.createdAt || null
  }))
}

module.exports = {
  isValidEmail,
  ensureConfig,
  addEmailToWaitlist,
  getWaitlistEmails
}
