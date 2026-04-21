import { z } from "zod"
import type { OrbitDB } from "../interfaces/db.interface"

const RodadaRowSchema = z.object({
  id: z.number(),
  ciclo_id: z.number().nullable().default(null),
  numero: z.number().int(),
  status: z.enum(["em_andamento", "concluida"]).default("em_andamento"),
  iniciada_em: z.string(),
  concluida_em: z.string().nullable().default(null),
  deleted_at: z.string().nullable().default(null),
})

export type RodadaRow = z.infer<typeof RodadaRowSchema>

export class RodadaRepository {
  constructor(private readonly db: OrbitDB) {}

  async listarPorCiclo(cicloId: number): Promise<RodadaRow[]> {
    const rows = await this.db.query(
      `SELECT * FROM rodadas
       WHERE ciclo_id = ? AND deleted_at IS NULL
       ORDER BY numero ASC`,
      [cicloId],
    )
    return rows.map((r) => RodadaRowSchema.parse(r))
  }

  async buscarAtiva(cicloId: number): Promise<RodadaRow | null> {
    const rows = await this.db.query(
      `SELECT * FROM rodadas
       WHERE ciclo_id = ? AND status = 'em_andamento' AND deleted_at IS NULL
       ORDER BY numero DESC LIMIT 1`,
      [cicloId],
    )
    const row = rows[0]
    return row ? RodadaRowSchema.parse(row) : null
  }

  async inserir(cicloId: number, numero: number): Promise<number> {
    const result = await this.db.execute(
      "INSERT INTO rodadas (ciclo_id, numero, status) VALUES (?, ?, 'em_andamento')",
      [cicloId, numero],
    )
    return result.lastInsertRowid
  }

  async concluir(id: number): Promise<void> {
    await this.db.execute(
      `UPDATE rodadas SET status = 'concluida', concluida_em = datetime('now')
       WHERE id = ?`,
      [id],
    )
  }
}
