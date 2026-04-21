import { z } from "zod"
import type { OrbitDB } from "../interfaces/db.interface"

const ObjetivoRowSchema = z.object({
  id: z.number(),
  nome: z.string(),
  descricao: z.string().default(""),
  status: z.enum(["ativo", "pausado", "concluido"]).default("ativo"),
  data_inicio: z.string(),
  data_fim: z.string().nullable().default(null),
  deleted_at: z.string().nullable().default(null),
  criado_em: z.string(),
})

export type ObjetivoRow = z.infer<typeof ObjetivoRowSchema>

export class ObjetivoRepository {
  constructor(private readonly db: OrbitDB) {}

  async listarAtivos(): Promise<ObjetivoRow[]> {
    const rows = await this.db.query(
      "SELECT * FROM objetivos WHERE deleted_at IS NULL ORDER BY criado_em DESC",
    )
    return rows.map((r) => ObjetivoRowSchema.parse(r))
  }

  async buscarPorId(id: number): Promise<ObjetivoRow | null> {
    const rows = await this.db.query(
      "SELECT * FROM objetivos WHERE id = ? AND deleted_at IS NULL",
      [id],
    )
    const row = rows[0]
    return row ? ObjetivoRowSchema.parse(row) : null
  }

  async inserir(dados: Omit<ObjetivoRow, "id" | "criado_em" | "deleted_at">): Promise<number> {
    const result = await this.db.execute(
      `INSERT INTO objetivos (nome, descricao, status, data_inicio, data_fim)
       VALUES (?, ?, ?, ?, ?)`,
      [dados.nome, dados.descricao, dados.status, dados.data_inicio, dados.data_fim],
    )
    return result.lastInsertRowid
  }

  async atualizar(
    id: number,
    dados: Partial<Omit<ObjetivoRow, "id" | "criado_em" | "deleted_at">>,
  ): Promise<void> {
    const campos = Object.keys(dados)
    if (campos.length === 0) return
    const sets = campos.map((c) => `${c} = ?`).join(", ")
    await this.db.execute(`UPDATE objetivos SET ${sets} WHERE id = ? AND deleted_at IS NULL`, [
      ...Object.values(dados),
      id,
    ])
  }

  async deletar(id: number): Promise<void> {
    await this.db.execute("UPDATE objetivos SET deleted_at = datetime('now') WHERE id = ?", [id])
  }
}
