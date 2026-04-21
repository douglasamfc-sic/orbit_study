import type { z } from "zod"
import type { CicloSchema, CriarCicloSchema, StatusCicloSchema } from "./ciclo.schema"

export type Ciclo = z.infer<typeof CicloSchema>
export type CriarCiclo = z.infer<typeof CriarCicloSchema>
export type StatusCiclo = z.infer<typeof StatusCicloSchema>
