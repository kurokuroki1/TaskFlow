export type User = { name: string; email: string }

type Account = { name: string; password: string }

const ACCOUNTS_KEY = 'taskflow-accounts'
const SESSION_KEY = 'taskflow-user'

function getAccounts(): Record<string, Account> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function signup(name: string, email: string, password: string): { user: User } | { error: string } {
  const accounts = getAccounts()
  const key = email.trim().toLowerCase()
  const trimmedName = name.trim()
  if (accounts[key]) return { error: 'An account with that email already exists.' }
  accounts[key] = { name: trimmedName, password }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  const user: User = { name: trimmedName, email: key }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return { user }
}

export function login(email: string, password: string): { user: User } | { error: string } {
  const accounts = getAccounts()
  const key = email.trim().toLowerCase()
  const account = accounts[key]
  if (!account) return { error: 'No account found with that email.' }
  if (account.password !== password) return { error: 'Incorrect password.' }
  const user: User = { name: account.name, email: key }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return { user }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

/** Pre-seeds a demo account so you can log in with user / user straight away. */
export function seedDemoAccount() {
  const accounts = getAccounts()
  if (!accounts['user']) {
    accounts['user'] = { name: 'Demo User', password: 'user' }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  }
}
