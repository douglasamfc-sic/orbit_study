import { z } from "zod"

const HorasDiaSchema = z.number().min(0).max(24)

export const MetaSchema = z.object({
  id: z.number().int().positive(),
  cicloId: z.number().int().positive(),
  segunda: HorasDiaSchema.default(4),
  terca: HorasDiaSchema.default(4),
  quarta: HorasDiaSchema.default(4),
  quinta: HorasDiaSchema.default(4),
  sexta: HorasDiaSchema.default(4),
  sabado: HorasDiaSchema.default(6),
  domingo: HorasDiaSchema.default(2),
})

export const CriarMetaSchema = MetaSchema.omit({ id: true })

export const DIAS_SEMANA = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
] as const
export type DiaSemana = (typeof DIAS_SEMANA)[number]
