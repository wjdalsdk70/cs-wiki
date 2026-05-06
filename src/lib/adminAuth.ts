export const ADMIN_SESSION_COOKIE = 'cs_wiki_admin_session'

function getAdminId() {
  return process.env.ADMIN_ID || 'admin'
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'admin'
}

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || `${getAdminId()}:${getAdminPassword()}`
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function createAdminSessionToken() {
  return sha256(`cs-wiki-admin:${getAdminSecret()}`)
}

export async function isValidAdminSession(token?: string) {
  if (!token) return false

  return token === await createAdminSessionToken()
}

export function isValidAdminCredentials(id: string, password: string) {
  return id === getAdminId() && password === getAdminPassword()
}
