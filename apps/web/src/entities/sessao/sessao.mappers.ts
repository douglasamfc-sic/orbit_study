import { SessaoSchema } from "./sessao.schema"
import type { Sessao } from "./sessao.types"

export function sessaoFromDb(row: Record<string, unknown>): Sessao {
  return SessaoSchema.parse({
    id: row.id,
    disciplinaId: row.disciplina_id,
    assunto: row.assunto,
    metodo: row.metodo,
    status: row.status,
    data: row.data,
    tempoLiquido: row.tempo_liquido,
    cicloId: row.ciclo_id,
    objetivoId: row.objetivo_id,
    rodadaId: row.rodada_id,
    material: row.material,
    observacoes: row.observacoes,
    paginaFinal: row.pagina_final,
    relevancia: row.relevancia,
    numQuestoes: row.num_questoes,
    numAcertos: row.num_acertos,
    isAproveitada: Boolean(row.is_aproveitada),
    sessaoRaizId: row.sessao_raiz_id,
    ordemPendente: row.ordem_pendente,
    criadoEm: row.criado_em,
  })
}

export function sessaoToDb(sessao: Omit<Sessao, "id" | "criadoEm">): Record<string, unknown> {
  return {
    disciplina_id: sessao.disciplinaId,
    assunto: sessao.assunto,
    metodo: sessao.metodo,
    status: sessao.status,
    data: sessao.data,
    tempo_liquido: sessao.tempoLiquido,
    ciclo_id: sessao.cicloId,
    objetivo_id: sessao.objetivoId,
    rodada_id: sessao.rodadaId,
    material: sessao.material,
    observacoes: sessao.observacoes,
    pagina_final: sessao.paginaFinal,
    relevancia: sessao.relevancia,
    num_questoes: sessao.numQuestoes,
    num_acertos: sessao.numAcertos,
    is_aproveitada: sessao.isAproveitada ? 1 : 0,
    sessao_raiz_id: sessao.sessaoRaizId,
    ordem_pendente: sessao.ordemPendente,
  }
}
