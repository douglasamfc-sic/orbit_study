import type { z } from "zod"
import type { CriarMetaSchema, DiaSemana, MetaSchema } from "./meta.schema"

export type Meta = z.infer<typeof MetaSchema>
export type CriarMeta = z.infer<typeof CriarMetaSchema>
export type { DiaSemana }
