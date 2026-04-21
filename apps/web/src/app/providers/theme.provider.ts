// Provider de tema — única fonte de verdade para dark/light mode
const STORAGE_KEY = "orbit-theme"
type Theme = "light" | "dark"

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === "light" || stored === "dark") return stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "")
}

// Sem $state — usa objeto simples com getter reativo via closure
let _current: Theme = getInitialTheme()
applyTheme(_current)

export const themeStore = {
  get current(): Theme {
    return _current
  },
  toggle(): void {
    _current = _current === "light" ? "dark" : "light"
    applyTheme(_current)
    localStorage.setItem(STORAGE_KEY, _current)
  },
  setTheme(theme: Theme): void {
    _current = theme
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  },
}
