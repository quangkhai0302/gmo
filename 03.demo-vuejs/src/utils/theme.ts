export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'student-management.theme'

const mediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function getStoredThemePreference(): ThemePreference {
  try {
    const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(storedValue) ? storedValue : 'system'
  } catch {
    return 'system'
  }
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== 'system') return preference
  return mediaQuery().matches ? 'dark' : 'light'
}

export function applyThemePreference(preference: ThemePreference) {
  const resolvedTheme = resolveTheme(preference)
  const root = document.documentElement

  root.dataset.theme = resolvedTheme
  root.dataset.themePreference = preference
  root.style.colorScheme = resolvedTheme
}

export function setStoredThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  applyThemePreference(preference)
}

export function initializeTheme() {
  const applyStoredTheme = () => applyThemePreference(getStoredThemePreference())
  applyStoredTheme()
  mediaQuery().addEventListener('change', applyStoredTheme)
}
