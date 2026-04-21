import { z } from "zod"

export const DisciplinaSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1),
  corHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  objetivoId: z.number().int().positive().nullable().default(null),
  ordem: z.number().int().default(0),
  criadoEm: z.string(),
})

export const CriarDisciplinaSchema = DisciplinaSchema.omit({
  id: true,
  criadoEm: true,
})
