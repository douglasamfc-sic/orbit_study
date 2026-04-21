import { z } from "zod"

export const StatusRodadaSchema = z.enum(["em_andamento", "concluida"])

export const RodadaSchema = z.object({
  id: z.number().int().positive(),
  cicloId: z.number().int().positive(),
  numero: z.number().int().positive(),
  status: StatusRodadaSchema.default("em_andamento"),
  iniciadaEm: z.string(),
  concluidaEm: z.string().nullable().default(null),
})

export const CriarRodadaSchema = RodadaSchema.omit({ id: true })
