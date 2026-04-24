import type { ObjetivoRepository, ObjetivoRow } from "@orbit/db"

export type ObjetivoFiltros = {
  status?: "ativo" | "pausado" | "concluido"
}

export function createObjetivosStore(repo: ObjetivoRepository) {
  let objetivos = $state<ObjetivoRow[]>([])
  let loading = $state(false)
  let error = $state<string | null>(null)

  const ativos = $derived(objetivos.filter((o) => o.status === "ativo" && !o.deleted_at))

  async function carregar() {
    loading = true
    error = null
    try {
      objetivos = await repo.listarAtivos()
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro desconhecido"
    } finally {
      loading = false
    }
  }

  async function criar(dados: Omit<ObjetivoRow, "id" | "criado_em" | "deleted_at">) {
    error = null
    try {
      const id = await repo.inserir(dados)
      const novo = await repo.buscarPorId(id)
      if (novo) objetivos = [...objetivos, novo]
      return id
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao criar objetivo"
      return null
    }
  }

  async function atualizar(
    id: number,
    dados: Partial<Omit<ObjetivoRow, "id" | "criado_em" | "deleted_at">>,
  ) {
    error = null
    try {
      await repo.atualizar(id, dados)
      objetivos = objetivos.map((o) => (o.id === id ? { ...o, ...dados } : o))
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao atualizar objetivo"
    }
  }

  async function deletar(id: number) {
    error = null
    try {
      await repo.deletar(id)
      objetivos = objetivos.filter((o) => o.id !== id)
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao deletar objetivo"
    }
  }

  return {
    get objetivos() {
      return objetivos
    },
    get ativos() {
      return ativos
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

export type ObjetivosStore = ReturnType<typeof createObjetivosStore>
