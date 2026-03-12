export type User = { name: string; email: string }

type Account = { name: string; password: string }

function getAccounts(): Record<string, Account> {
  try {
    const raw = localStorage.getItem('taskflow-accounts')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('taskflow-user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function signup(name: string, email: string, password: string): { user: User } | { error: string } {
  const accounts = getAccounts()
  const key = email.trim().toLowerCase()
  if (accounts[key]) return { error: 'An account with that email already exists.' }
  accounts[key] = { name: name.trim(), password }
  localStorage.setItem('taskflow-accounts', JSON.stringify(accounts))
  const user: User = { name: name.trim(), email: key }
  localStorage.setItem('taskflow-user', JSON.stringify(user))
  return { user }
}

export function login(email: string, password: string): { user: User } | { error: string } {
  const accounts = getAccounts()
  const key = email.trim().toLowerCase()
  const account = accounts[key]
  if (!account) return { error: 'No account found with that email.' }
  if (account.password !== password) return { error: 'Incorrect password.' }
  const user: User = { name: account.name, email: key }
  localStorage.setItem('taskflow-user', JSON.stringify(user))
  return { user }
}

export function logout() {
  localStorage.removeItem('taskflow-user')
}

/** Pre-seeds a demo account so you can log in with user / user straight away. */
export function seedDemoAccount() {
  const accounts = getAccounts()
  if (!accounts['user']) {
    accounts['user'] = { name: 'Demo User', password: 'user' }
    localStorage.setItem('taskflow-accounts', JSON.stringify(accounts))
  }
}
