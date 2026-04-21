import { z } from "zod"
import type { OrbitDB } from "../interfaces/db.interface"

const SessaoRowSchema = z.object({
  id: z.number(),
  disciplina_id: z.number().nullable().default(null),
  assunto: z.string(),
  metodo: z.enum(["pdf", "video_aula", "livro", "exercicios", "revisao", "outro"]),
  status: z.enum(["PENDENTE", "CONCLUIDA"]).default("CONCLUIDA"),
  data: z.string().nullable().default(null),
  tempo_liquido: z.number().int().default(0),
  ciclo_id: z.number().nullable().default(null),
  objetivo_id: z.number().nullable().default(null),
  rodada_id: z.number().nullable().default(null),
  material: z.string().default(""),
  observacoes: z.string().default(""),
  pagina_final: z.number().nullable().default(null),
  relevancia: z.number().int().min(1).max(5).default(3),
  num_questoes: z.number().nullable().default(null),
  num_acertos: z.number().nullable().default(null),
  is_aproveitada: z.number().int().default(0),
  sessao_raiz_id: z.number().nullable().default(null),
  ordem_pendente: z.number().nullable().default(null),
  deleted_at: z.string().nullable().default(null),
  criado_em: z.string(),
})

export type SessaoRow = z.infer<typeof SessaoRowSchema>

export class SessaoRepository {
  constructor(private readonly db: OrbitDB) {}

  async listarPorPeriodo(inicio: string, fim: string): Promise<SessaoRow[]> {
    const rows = await this.db.query(
      `SELECT * FROM sessoes
       WHERE data BETWEEN ? AND ?
       AND status = 'CONCLUIDA'
       AND deleted_at IS NULL
       ORDER BY data DESC`,
      [inicio, fim],
    )
    return rows.map((r) => SessaoRowSchema.parse(r))
  }

  async listarPorDisciplina(disciplinaId: number): Promise<SessaoRow[]> {
    const rows = await this.db.query(
      `SELECT * FROM sessoes
       WHERE disciplina_id = ?
       AND deleted_at IS NULL
       ORDER BY data DESC, criado_em DESC`,
      [disciplinaId],
    )
    return rows.map((r) => SessaoRowSchema.parse(r))
  }

  async listarPorCiclo(cicloId: number): Promise<SessaoRow[]> {
    const rows = await this.db.query(
      `SELECT * FROM sessoes
       WHERE ciclo_id = ?
       AND deleted_at IS NULL
       ORDER BY data DESC, criado_em DESC`,
      [cicloId],
    )
    return rows.map((r) => SessaoRowSchema.parse(r))
  }

  async listarPendentes(cicloId: number, disciplinaId?: number): Promise<SessaoRow[]> {
    const params: unknown[] = [cicloId]
    let sql = `SELECT * FROM sessoes
       WHERE ciclo_id = ?
       AND status = 'PENDENTE'
       AND deleted_at IS NULL`
    if (disciplinaId !== undefined) {
      sql += " AND disciplina_id = ?"
      params.push(disciplinaId)
    }
    sql += " ORDER BY COALESCE(ordem_pendente, 9999) ASC, criado_em ASC"
    const rows = await this.db.query(sql, params)
    return rows.map((r) => SessaoRowSchema.parse(r))
  }

  async listarPorRodada(rodadaId: number): Promise<SessaoRow[]> {
    const rows = await this.db.query(
      `SELECT * FROM sessoes
       WHERE rodada_id = ?
       AND deleted_at IS NULL
       ORDER BY data ASC`,
      [rodadaId],
    )
    return rows.map((r) => SessaoRowSchema.parse(r))
  }

  async buscarPorId(id: number): Promise<SessaoRow | null> {
    const rows = await this.db.query("SELECT * FROM sessoes WHERE id = ? AND deleted_at IS NULL", [
      id,
    ])
    const row = rows[0]
    return row ? SessaoRowSchema.parse(row) : null
  }

  async inserir(dados: Omit<SessaoRow, "id" | "criado_em" | "deleted_at">): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO sessoes (
         disciplina_id, assunto, metodo, status, data, tempo_liquido,
         ciclo_id, objetivo_id, rodada_id, material, observacoes,
         pagina_final, relevancia, num_questoes, num_acertos,
         is_aproveitada, sessao_raiz_id, ordem_pendente
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.disciplina_id,
        dados.assunto,
        dados.metodo,
        dados.status,
        dados.data,
        dados.tempo_liquido,
        dados.ciclo_id,
        dados.objetivo_id,
        dados.rodada_id,
        dados.material,
        dados.observacoes,
        dados.pagina_final,
        dados.relevancia,
        dados.num_questoes,
        dados.num_acertos,
        dados.is_aproveitada,
        dados.sessao_raiz_id,
        dados.ordem_pendente,
      ],
    )
    return result.lastInsertRowid
  }

  async atualizar(
    id: number,
    dados: Partial<Omit<SessaoRow, "id" | "criado_em" | "deleted_at">>,
  ): Promise<void> {
    const campos = Object.keys(dados)
    if (campos.length === 0) return
    const sets = campos.map((c) => `${c} = ?`).join(", ")
    await this.db.execute(`UPDATE sessoes SET ${sets} WHERE id = ? AND deleted_at IS NULL`, [
      ...Object.values(dados),
      id,
    ])
  }

  async deletar(id: number): Promise<void> {
    await this.db.execute("UPDATE sessoes SET deleted_at = datetime('now') WHERE id = ?", [id])
  }

  async contarPorCiclo(cicloId: number): Promise<number> {
    const rows = await this.db.query<{ total: number }>(
      "SELECT COUNT(*) as total FROM sessoes WHERE ciclo_id = ? AND deleted_at IS NULL",
      [cicloId],
    )
    return rows[0]?.total ?? 0
  }
}
