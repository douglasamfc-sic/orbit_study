import { CicloDisciplinaConfigSchema } from "./ciclo-disciplina-config.schema"
import type { CicloDisciplinaConfig } from "./ciclo-disciplina-config.types"

export function cicloDisciplinaConfigFromDb(row: Record<string, unknown>): CicloDisciplinaConfig {
  return CicloDisciplinaConfigSchema.parse({
    id: row.id,
    cicloId: row.ciclo_id,
    disciplinaId: row.disciplina_id,
    metaMinutos: row.meta_minutos,
    ordem: row.ordem,
  })
}

export function cicloDisciplinaConfigToDb(
  config: Omit<CicloDisciplinaConfig, "id">,
): Record<string, unknown> {
  return {
    ciclo_id: config.cicloId,
    disciplina_id: config.disciplinaId,
    meta_minutos: config.metaMinutos,
    ordem: config.ordem,
  }
}
