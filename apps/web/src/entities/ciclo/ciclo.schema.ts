import { z } from "zod"

export const StatusCicloSchema = z.enum(["ativo", "pausado", "concluido"])

export const CicloSchema = z.object({
  id: z.number().int().positive(),
  objetivoId: z.number().int().positive(),
  nome: z.string().min(1),
  observacoes: z.string().default(""),
  status: StatusCicloSchema.default("ativo"),
  modoPlanejado: z.boolean().default(false),
  criadoEm: z.string(),
})

export const CriarCicloSchema = CicloSchema.omit({
  id: true,
  criadoEm: true,
})
