import type { z } from "zod"
import type {
  CriarSessaoSchema,
  MetodoEstudoSchema,
  SessaoSchema,
  StatusSessaoSchema,
} from "./sessao.schema"

export type Sessao = z.infer<typeof SessaoSchema>
export type CriarSessao = z.infer<typeof CriarSessaoSchema>
export type MetodoEstudo = z.infer<typeof MetodoEstudoSchema>
export type StatusSessao = z.infer<typeof StatusSessaoSchema>
