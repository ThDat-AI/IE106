export const AUTH_STORAGE_KEY = 'vw_demo_logged_in'

export function isUserLoggedIn() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function signInDemo() {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
}

export function signOutDemo() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
