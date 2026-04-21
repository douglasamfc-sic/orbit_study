import { CicloSchema } from "./ciclo.schema"
import type { Ciclo } from "./ciclo.types"

export function cicloFromDb(row: Record<string, unknown>): Ciclo {
  return CicloSchema.parse({
    id: row.id,
    objetivoId: row.objetivo_id,
    nome: row.nome,
    observacoes: row.observacoes,
    status: row.status,
    modoPlanejado: Boolean(row.modo_planejado),
    criadoEm: row.criado_em,
  })
}

export function cicloToDb(ciclo: Omit<Ciclo, "id" | "criadoEm">): Record<string, unknown> {
  return {
    objetivo_id: ciclo.objetivoId,
    nome: ciclo.nome,
    observacoes: ciclo.observacoes,
    status: ciclo.status,
    modo_planejado: ciclo.modoPlanejado ? 1 : 0,
  }
}
