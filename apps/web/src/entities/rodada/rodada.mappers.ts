import { RodadaSchema } from "./rodada.schema"
import type { Rodada } from "./rodada.types"

export function rodadaFromDb(row: Record<string, unknown>): Rodada {
  return RodadaSchema.parse({
    id: row.id,
    cicloId: row.ciclo_id,
    numero: row.numero,
    status: row.status,
    iniciadaEm: row.iniciada_em,
    concluidaEm: row.concluida_em,
  })
}

export function rodadaToDb(rodada: Omit<Rodada, "id">): Record<string, unknown> {
  return {
    ciclo_id: rodada.cicloId,
    numero: rodada.numero,
    status: rodada.status,
    iniciada_em: rodada.iniciadaEm,
    concluida_em: rodada.concluidaEm,
  }
}
