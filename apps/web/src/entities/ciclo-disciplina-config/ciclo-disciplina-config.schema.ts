import { z } from "zod"

export const CicloDisciplinaConfigSchema = z.object({
  id: z.number().int().positive(),
  cicloId: z.number().int().positive(),
  disciplinaId: z.number().int().positive(),
  metaMinutos: z.number().int().min(0).default(120),
  ordem: z.number().int().default(0),
})

export const CriarCicloDisciplinaConfigSchema = CicloDisciplinaConfigSchema.omit({ id: true })
