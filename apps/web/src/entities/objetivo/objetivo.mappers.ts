import { ObjetivoSchema } from "./objetivo.schema"
import type { Objetivo } from "./objetivo.types"

export function objetivoFromDb(row: Record<string, unknown>): Objetivo {
  return ObjetivoSchema.parse({
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    status: row.status,
    dataInicio: row.data_inicio,
    dataFim: row.data_fim,
    criadoEm: row.criado_em,
  })
}

export function objetivoToDb(objetivo: Omit<Objetivo, "id" | "criadoEm">): Record<string, unknown> {
  return {
    nome: objetivo.nome,
    descricao: objetivo.descricao,
    status: objetivo.status,
    data_inicio: objetivo.dataInicio,
    data_fim: objetivo.dataFim,
  }
}
