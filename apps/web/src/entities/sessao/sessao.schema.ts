import { z } from "zod"

export const MetodoEstudoSchema = z.enum([
  "pdf",
  "video_aula",
  "livro",
  "exercicios",
  "revisao",
  "outro",
])

export const StatusSessaoSchema = z.enum(["PENDENTE", "CONCLUIDA"])

export const SessaoSchema = z.object({
  id: z.number().int().positive(),
  disciplinaId: z.number().int().positive(),
  assunto: z.string().min(1),
  metodo: MetodoEstudoSchema,
  status: StatusSessaoSchema.default("CONCLUIDA"),
  data: z.string().nullable().default(null),
  tempoLiquido: z.number().int().min(0).default(0),
  cicloId: z.number().int().positive().nullable().default(null),
  objetivoId: z.number().int().positive().nullable().default(null),
  rodadaId: z.number().int().positive().nullable().default(null),
  material: z.string().default(""),
  observacoes: z.string().default(""),
  paginaFinal: z.number().int().positive().nullable().default(null),
  relevancia: z.number().int().min(1).max(5).default(3),
  numQuestoes: z.number().int().positive().nullable().default(null),
  numAcertos: z.number().int().positive().nullable().default(null),
  isAproveitada: z.boolean().default(false),
  sessaoRaizId: z.number().int().positive().nullable().default(null),
  ordemPendente: z.number().int().nullable().default(null),
  criadoEm: z.string(),
})

export const CriarSessaoSchema = SessaoSchema.omit({
  id: true,
  criadoEm: true,
})

export const SessaoConcluida = SessaoSchema.refine(
  (s) => s.status !== "CONCLUIDA" || (s.data !== null && s.tempoLiquido > 0),
  { message: "Sessão concluída requer data e tempo líquido maior que zero" },
)
