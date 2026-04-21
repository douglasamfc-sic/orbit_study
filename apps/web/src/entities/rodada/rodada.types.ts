import type { z } from "zod"
import type { CriarRodadaSchema, RodadaSchema, StatusRodadaSchema } from "./rodada.schema"

export type Rodada = z.infer<typeof RodadaSchema>
export type CriarRodada = z.infer<typeof CriarRodadaSchema>
export type StatusRodada = z.infer<typeof StatusRodadaSchema>
