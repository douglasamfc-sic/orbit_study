import { z } from "zod"
import type { OrbitDB } from "../interfaces/db.interface"

const DisciplinaRowSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cor_hex: z.string().default("#0079bf"),
  objetivo_id: z.number().nullable().default(null),
  ordem: z.number().int().default(0),
  deleted_at: z.string().nullable().default(null),
  criado_em: z.string(),
})

export type DisciplinaRow = z.infer<typeof DisciplinaRowSchema>

export class DisciplinaRepository {
  constructor(private readonly db: OrbitDB) {}

  async listarTodas(): Promise<DisciplinaRow[]> {
    const rows = await this.db.query(
      "SELECT * FROM disciplinas WHERE deleted_at IS NULL ORDER BY ordem ASC, nome ASC",
    )
    return rows.map((r) => DisciplinaRowSchema.parse(r))
  }

  async listarPorObjetivo(objetivoId: number): Promise<DisciplinaRow[]> {
    const rows = await this.db.query(
      "SELECT * FROM disciplinas WHERE objetivo_id = ? AND deleted_at IS NULL ORDER BY ordem ASC",
      [objetivoId],
    )
    return rows.map((r) => DisciplinaRowSchema.parse(r))
  }

  async buscarPorId(id: number): Promise<DisciplinaRow | null> {
    const rows = await this.db.query(
      "SELECT * FROM disciplinas WHERE id = ? AND deleted_at IS NULL",
      [id],
    )
    const row = rows[0]
    return row ? DisciplinaRowSchema.parse(row) : null
  }

  async inserir(dados: Omit<DisciplinaRow, "id" | "criado_em" | "deleted_at">): Promise<number> {
    const result = await this.db.execute(
      "INSERT INTO disciplinas (nome, cor_hex, objetivo_id, ordem) VALUES (?, ?, ?, ?)",
      [dados.nome, dados.cor_hex, dados.objetivo_id, dados.ordem],
    )
    return result.lastInsertRowid
  }

  async atualizar(
    id: number,
    dados: Partial<Omit<DisciplinaRow, "id" | "criado_em" | "deleted_at">>,
  ): Promise<void> {
    const campos = Object.keys(dados)
    if (campos.length === 0) return
    const sets = campos.map((c) => `${c} = ?`).join(", ")
    await this.db.execute(`UPDATE disciplinas SET ${sets} WHERE id = ? AND deleted_at IS NULL`, [
      ...Object.values(dados),
      id,
    ])
  }

  async deletar(id: number): Promise<void> {
    await this.db.execute("UPDATE disciplinas SET deleted_at = datetime('now') WHERE id = ?", [id])
  }
}
