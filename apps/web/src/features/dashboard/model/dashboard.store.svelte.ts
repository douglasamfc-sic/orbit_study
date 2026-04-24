import { today } from "$lib/date.utils"
import type { SessaoRepository } from "@orbit/db"
import {
  calcularHojesMinutos,
  calcularProgressoCiclo,
  calcularStreak,
  calcularTotalMinutos,
} from "./dashboard.service"

export function createDashboardStore(repo: SessaoRepository) {
  let sessoes = $state<Awaited<ReturnType<typeof repo.listarPorCiclo>>>([])
  let loading = $state(false)
  let error = $state<string | null>(null)

  const hojeMinutos = $derived(calcularHojesMinutos(sessoes, today()))
  const streak = $derived(calcularStreak(sessoes))
  const totalMinutos = $derived(calcularTotalMinutos(sessoes))

  async function carregar(cicloId: number | null) {
    loading = true
    error = null
    try {
      if (cicloId !== null) {
        sessoes = await repo.listarPorCiclo(cicloId)
      } else {
        sessoes = []
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao carregar dashboard"
    } finally {
      loading = false
    }
  }

  return {
    get sessoes() {
      return sessoes
    },
    get loading() {
      return loading
    },
    get error() {
      return error
    },
    get hojeMinutos() {
      return hojeMinutos
    },
    get streak() {
      return streak
    },
    get totalMinutos() {
      return totalMinutos
    },
    carregar,
    calcularProgressoCiclo,
  }
}

export type DashboardStore = ReturnType<typeof createDashboardStore>
