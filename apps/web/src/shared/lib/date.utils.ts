// Utilitários de data — sem dependências externas
export function toISODate(date: Date): string {
  return date.toISOString().split("T")[0] ?? ""
}

export function today(): string {
  return toISODate(new Date())
}

export function daysBetween(from: string, to: string): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((new Date(to).getTime() - new Date(from).getTime()) / msPerDay)
}
