// Funções puras de cálculo do dashboard — sem dependências de UI ou Svelte
import type { SessaoRow } from "@orbit/db"

export function calcularHojesMinutos(sessoes: SessaoRow[], hoje: string): number {
  return sessoes
    .filter((s) => s.data === hoje && s.status === "CONCLUIDA" && !s.deleted_at)
    .reduce((acc, s) => acc + s.tempo_liquido, 0)
}

export function calcularStreak(sessoes: SessaoRow[]): number {
  if (sessoes.length === 0) return 0
  const diasComEstudo = new Set(
    sessoes
      .filter((s) => s.status === "CONCLUIDA" && s.data && !s.deleted_at)
      .map((s) => s.data as string),
  )
  let streak = 0
  const hoje = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(hoje)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split("T")[0] ?? ""
    if (diasComEstudo.has(iso)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export function calcularTotalMinutos(sessoes: SessaoRow[]): number {
  return sessoes
    .filter((s) => s.status === "CONCLUIDA" && !s.deleted_at)
    .reduce((acc, s) => acc + s.tempo_liquido, 0)
}

export function calcularProgressoCiclo(
  sessoesCiclo: SessaoRow[],
  configs: { disciplina_id: number; meta_minutos: number }[],
): number {
  if (configs.length === 0) return 0
  const batidas = configs.filter((cfg) => {
    const minutos = sessoesCiclo
      .filter(
        (s) =>
          s.disciplina_id === cfg.disciplina_id &&
          s.status === "CONCLUIDA" &&
          !s.deleted_at &&
          s.metodo !== "revisao" &&
          s.metodo !== "exercicios",
      )
      .reduce((acc, s) => acc + s.tempo_liquido, 0)
    return minutos >= cfg.meta_minutos
  })
  return Math.round((batidas.length / configs.length) * 100)
}

export function formatarHoras(minutos: number): string {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}
