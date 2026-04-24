import type { SessaoRepository, SessaoRow } from "@orbit/db"

export type SessaoFiltros = {
  inicio?: string
  fim?: string
  cicloId?: number
  disciplinaId?: number
}

export function createSessoesStore(repo: SessaoRepository) {
  let sessoes = $state<SessaoRow[]>([])
  let loading = $state(false)
  let error = $state<string | null>(null)

  const concluidas = $derived(sessoes.filter((s) => s.status === "CONCLUIDA"))
  const pendentes = $derived(sessoes.filter((s) => s.status === "PENDENTE"))
  const totalMinutos = $derived(concluidas.reduce((acc, s) => acc + s.tempo_liquido, 0))

  async function carregar(filtros: SessaoFiltros) {
    loading = true
    error = null
    try {
      if (filtros.inicio && filtros.fim) {
        sessoes = await repo.listarPorPeriodo(filtros.inicio, filtros.fim)
      } else if (filtros.cicloId !== undefined) {
        sessoes = await repo.listarPorCiclo(filtros.cicloId)
      } else if (filtros.disciplinaId !== undefined) {
        sessoes = await repo.listarPorDisciplina(filtros.disciplinaId)
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro desconhecido"
    } finally {
      loading = false
    }
  }

  async function criar(dados: Omit<SessaoRow, "id" | "criado_em" | "deleted_at">) {
    error = null
    try {
      const id = await repo.inserir(dados)
      const nova = await repo.buscarPorId(id)
      if (nova) sessoes = [...sessoes, nova]
      return id
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao criar sessão"
      return null
    }
  }

  async function atualizar(
    id: number,
    dados: Partial<Omit<SessaoRow, "id" | "criado_em" | "deleted_at">>,
  ) {
    error = null
    try {
      await repo.atualizar(id, dados)
      sessoes = sessoes.map((s) => (s.id === id ? { ...s, ...dados } : s))
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao atualizar sessão"
    }
  }

  async function deletar(id: number) {
    error = null
    try {
      await repo.deletar(id)
      sessoes = sessoes.filter((s) => s.id !== id)
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao deletar sessão"
    }
  }

  return {
    get sessoes() {
      return sessoes
    },
    get concluidas() {
      return concluidas
    },
    get pendentes() {
      return pendentes
    },
    get totalMinutos() {
      return totalMinutos
    },
    get loading() {
      return loading
    },
    get error() {
      return error
    },
    carregar,
    criar,
    atualizar,
    deletar,
  }
}

export type SessoesStore = ReturnType<typeof createSessoesStore>
