import type { z } from "zod"
import type { CriarObjetivoSchema, ObjetivoSchema, StatusObjetivoSchema } from "./objetivo.schema"

export type Objetivo = z.infer<typeof ObjetivoSchema>
export type CriarObjetivo = z.infer<typeof CriarObjetivoSchema>
export type StatusObjetivo = z.infer<typeof StatusObjetivoSchema>
