import type { z } from "zod"
import type { CriarDisciplinaSchema, DisciplinaSchema } from "./disciplina.schema"

export type Disciplina = z.infer<typeof DisciplinaSchema>
export type CriarDisciplina = z.infer<typeof CriarDisciplinaSchema>
