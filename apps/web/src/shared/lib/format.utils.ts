// Utilitários de formatação para exibição na UI
export function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%"
  return `${Math.round((value / total) * 100)}%`
}

export function formatDate(isoDate: string, locale = "pt-BR"): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}
