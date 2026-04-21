import { z } from "zod"

export const StatusObjetivoSchema = z.enum(["ativo", "pausado", "concluido"])

export const ObjetivoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1),
  descricao: z.string().default(""),
  status: StatusObjetivoSchema.default("ativo"),
  dataInicio: z.string(),
  dataFim: z.string().nullable().default(null),
  criadoEm: z.string(),
})

export const CriarObjetivoSchema = ObjetivoSchema.omit({
  id: true,
  criadoEm: true,
})
