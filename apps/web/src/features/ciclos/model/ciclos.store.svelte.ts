import type { CicloRepository, CicloRow } from "@orbit/db"

export function createCiclosStore(repo: CicloRepository) {
  let ciclos = $state<CicloRow[]>([])
  let loading = $state(false)
  let error = $state<string | null>(null)

  const ativos = $derived(ciclos.filter((c) => c.status === "ativo" && !c.deleted_at))

  async function carregarPorObjetivo(objetivoId: number) {
    loading = true
    error = null
    try {
      ciclos = await repo.listarPorObjetivo(objetivoId)
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro desconhecido"
    } finally {
      loading = false
    }
  }

  async function criar(dados: Omit<CicloRow, "id" | "criado_em" | "deleted_at">) {
    error = null
    try {
      const id = await repo.inserir(dados)
      const novo = await repo.buscarPorId(id)
      if (novo) ciclos = [...ciclos, novo]
      return id
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao criar ciclo"
      return null
    }
  }

  async function atualizar(
    id: number,
    dados: Partial<Omit<CicloRow, "id" | "criado_em" | "deleted_at">>,
  ) {
    error = null
    try {
      await repo.atualizar(id, dados)
      ciclos = ciclos.map((c) => (c.id === id ? { ...c, ...dados } : c))
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao atualizar ciclo"
    }
  }

  async function deletar(id: number) {
    error = null
    try {
      await repo.deletar(id)
      ciclos = ciclos.filter((c) => c.id !== id)
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao deletar ciclo"
    }
  }

  return {
    get ciclos() {
      return ciclos
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
    carregarPorObjetivo,
    criar,
    atualizar,
    deletar,
  }
}

export type CiclosStore = ReturnType<typeof createCiclosStore>
