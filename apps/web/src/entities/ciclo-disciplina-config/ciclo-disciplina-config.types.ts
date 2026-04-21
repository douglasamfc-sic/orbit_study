import type { z } from "zod"
import type {
  CicloDisciplinaConfigSchema,
  CriarCicloDisciplinaConfigSchema,
} from "./ciclo-disciplina-config.schema"

export type CicloDisciplinaConfig = z.infer<typeof CicloDisciplinaConfigSchema>
export type CriarCicloDisciplinaConfig = z.infer<typeof CriarCicloDisciplinaConfigSchema>
