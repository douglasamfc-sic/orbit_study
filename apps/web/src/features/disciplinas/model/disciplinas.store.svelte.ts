import type { DisciplinaRepository, DisciplinaRow } from "@orbit/db"

export function createDisciplinasStore(repo: DisciplinaRepository) {
  let disciplinas = $state<DisciplinaRow[]>([])
  let loading = $state(false)
  let error = $state<string | null>(null)

  const porId = $derived(new Map(disciplinas.map((d) => [d.id, d])))

  async function carregar() {
    loading = true
    error = null
    try {
      disciplinas = await repo.listarTodas()
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro desconhecido"
    } finally {
      loading = false
    }
  }

  async function criar(dados: Omit<DisciplinaRow, "id" | "criado_em" | "deleted_at">) {
    error = null
    try {
      const id = await repo.inserir(dados)
      const nova = await repo.buscarPorId(id)
      if (nova) disciplinas = [...disciplinas, nova]
      return id
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao criar disciplina"
      return null
    }
  }

  async function atualizar(
    id: number,
    dados: Partial<Omit<DisciplinaRow, "id" | "criado_em" | "deleted_at">>,
  ) {
    error = null
    try {
      await repo.atualizar(id, dados)
      disciplinas = disciplinas.map((d) => (d.id === id ? { ...d, ...dados } : d))
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao atualizar disciplina"
    }
  }

  async function deletar(id: number) {
    error = null
    try {
      await repo.deletar(id)
      disciplinas = disciplinas.filter((d) => d.id !== id)
    } catch (e) {
      error = e instanceof Error ? e.message : "Erro ao deletar disciplina"
    }
  }

  return {
    get disciplinas() {
      return disciplinas
    },
    get porId() {
      return porId
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

export type DisciplinasStore = ReturnType<typeof createDisciplinasStore>
