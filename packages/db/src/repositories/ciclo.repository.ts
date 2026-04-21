import { z } from "zod"
import type { OrbitDB } from "../interfaces/db.interface"

const CicloRowSchema = z.object({
  id: z.number(),
  objetivo_id: z.number().nullable().default(null),
  nome: z.string(),
  observacoes: z.string().default(""),
  status: z.enum(["ativo", "pausado", "concluido"]).default("ativo"),
  modo_planejado: z.number().int().default(0),
  deleted_at: z.string().nullable().default(null),
  criado_em: z.string(),
})

export type CicloRow = z.infer<typeof CicloRowSchema>

export class CicloRepository {
  constructor(private readonly db: OrbitDB) {}

  async listarPorObjetivo(objetivoId: number): Promise<CicloRow[]> {
    const rows = await this.db.query(
      "SELECT * FROM ciclos WHERE objetivo_id = ? AND deleted_at IS NULL ORDER BY criado_em DESC",
      [objetivoId],
    )
    return rows.map((r) => CicloRowSchema.parse(r))
  }

  async buscarPorId(id: number): Promise<CicloRow | null> {
    const rows = await this.db.query("SELECT * FROM ciclos WHERE id = ? AND deleted_at IS NULL", [
      id,
    ])
    const row = rows[0]
    return row ? CicloRowSchema.parse(row) : null
  }

  async inserir(dados: Omit<CicloRow, "id" | "criado_em" | "deleted_at">): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO ciclos (objetivo_id, nome, observacoes, status, modo_planejado)
       VALUES (?, ?, ?, ?, ?)`,
      [dados.objetivo_id, dados.nome, dados.observacoes, dados.status, dados.modo_planejado],
    )
    return result.lastInsertRowid
  }

  async atualizar(
    id: number,
    dados: Partial<Omit<CicloRow, "id" | "criado_em" | "deleted_at">>,
  ): Promise<void> {
    const campos = Object.keys(dados)
    if (campos.length === 0) return
    const sets = campos.map((c) => `${c} = ?`).join(", ")
    await this.db.execute(`UPDATE ciclos SET ${sets} WHERE id = ? AND deleted_at IS NULL`, [
      ...Object.values(dados),
      id,
    ])
  }

  async deletar(id: number): Promise<void> {
    await this.db.execute("UPDATE ciclos SET deleted_at = datetime('now') WHERE id = ?", [id])
  }
}
