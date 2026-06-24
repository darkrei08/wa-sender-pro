/**
 * WhatsApp Engine Abstraction Layer
 *
 * Supports two backends:
 *   - PRIMARY:  WuzAPI  (asternic/wuzapi)      → http://wuzapi:3100
 *   - FALLBACK: go-whatsapp-web-multidevice    → http://gowa:3000
 *
 * Both expose compatible REST endpoints (whatsmeow under the hood).
 * Switch via env var: WHATSAPP_ENGINE=wuzapi | gowa
 */

const ENGINE = (process.env.WHATSAPP_ENGINE || 'wuzapi') as 'wuzapi' | 'gowa'

const ENDPOINTS = {
  wuzapi: {
    base: process.env.WUZAPI_URL || 'http://wuzapi:3100',
    token: process.env.WUZAPI_TOKEN || 'secret-token',
    sendText: '/chat/send/text',
    status: '/app/status',
    qr: '/app/qrcode',
    logout: '/user/logout',
  },
  gowa: {
    base: process.env.GOWA_URL || 'http://gowa:3000',
    token: process.env.GOWA_TOKEN || 'secret-token',
    sendText: '/app/send/message',
    status: '/app/status',
    qr: '/app/login',
    logout: '/app/logout',
  },
}

const cfg = ENDPOINTS[ENGINE]

interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

interface EngineStatus {
  connected: boolean
  loggedIn: boolean
  phone?: string
  engine: string
}

async function apiCall(path: string, method = 'GET', body?: unknown) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    token: cfg.token,
  }

  // gowa uses Authorization header
  if (ENGINE === 'gowa') {
    headers['Authorization'] = `Bearer ${cfg.token}`
  }

  const res = await fetch(`${cfg.base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`[${ENGINE}] ${res.status}: ${txt}`)
  }
  return res.json()
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getEngineStatus(): Promise<EngineStatus> {
  try {
    const data = await apiCall(cfg.status)

    if (ENGINE === 'wuzapi') {
      return {
        connected: data.data?.Connected ?? false,
        loggedIn: data.data?.LoggedIn ?? false,
        phone: data.data?.Jid?.split('@')[0],
        engine: 'WuzAPI',
      }
    } else {
      return {
        connected: data.Connected ?? false,
        loggedIn: data.LoggedIn ?? false,
        phone: data.Jid?.split('@')[0],
        engine: 'go-whatsapp-web-multidevice',
      }
    }
  } catch {
    return { connected: false, loggedIn: false, engine: ENGINE }
  }
}

export async function getQRCode(): Promise<string | null> {
  try {
    const data = await apiCall(cfg.qr)
    return data.data?.QRCode ?? data.QRCode ?? null
  } catch {
    return null
  }
}

export async function sendMessage(
  phone: string,
  message: string
): Promise<SendResult> {
  try {
    let body: Record<string, unknown>

    if (ENGINE === 'wuzapi') {
      body = {
        Phone: `${phone}@s.whatsapp.net`,
        Body: message,
      }
    } else {
      // gowa format
      body = {
        Phone: `${phone}@s.whatsapp.net`,
        Message: message,
      }
    }

    const data = await apiCall(cfg.sendText, 'POST', body)
    const msgId = data.data?.Id ?? data.MessageId ?? 'ok'
    return { success: true, messageId: msgId }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function disconnectEngine(): Promise<void> {
  await apiCall(cfg.logout, 'POST')
}

/** Render template: replace {{Variable}} with contact field values */
export function renderTemplate(
  template: string,
  fields: Record<string, string | null | undefined>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return String(fields[key] ?? fields[key.toLowerCase()] ?? `{{${key}}}`)
  })
}

export { ENGINE }
