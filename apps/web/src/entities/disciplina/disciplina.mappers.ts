import { DisciplinaSchema } from "./disciplina.schema"
import type { Disciplina } from "./disciplina.types"

export function disciplinaFromDb(row: Record<string, unknown>): Disciplina {
  return DisciplinaSchema.parse({
    id: row.id,
    nome: row.nome,
    corHex: row.cor_hex,
    objetivoId: row.objetivo_id,
    ordem: row.ordem,
    criadoEm: row.criado_em,
  })
}

export function disciplinaToDb(
  disciplina: Omit<Disciplina, "id" | "criadoEm">,
): Record<string, unknown> {
  return {
    nome: disciplina.nome,
    cor_hex: disciplina.corHex,
    objetivo_id: disciplina.objetivoId,
    ordem: disciplina.ordem,
  }
}
