import { MetaSchema } from "./meta.schema"
import type { Meta } from "./meta.types"

export function metaFromDb(row: Record<string, unknown>): Meta {
  return MetaSchema.parse({
    id: row.id,
    cicloId: row.ciclo_id,
    segunda: row.segunda,
    terca: row.terca,
    quarta: row.quarta,
    quinta: row.quinta,
    sexta: row.sexta,
    sabado: row.sabado,
    domingo: row.domingo,
  })
}

export function metaToDb(meta: Omit<Meta, "id">): Record<string, unknown> {
  return {
    ciclo_id: meta.cicloId,
    segunda: meta.segunda,
    terca: meta.terca,
    quarta: meta.quarta,
    quinta: meta.quinta,
    sexta: meta.sexta,
    sabado: meta.sabado,
    domingo: meta.domingo,
  }
}
