import { z } from "zod"
import type { OrbitDB } from "../interfaces/db.interface"

const MetaRowSchema = z.object({
  id: z.number(),
  ciclo_id: z.number(),
  segunda: z.number().default(4),
  terca: z.number().default(4),
  quarta: z.number().default(4),
  quinta: z.number().default(4),
  sexta: z.number().default(4),
  sabado: z.number().default(6),
  domingo: z.number().default(2),
})

export type MetaRow = z.infer<typeof MetaRowSchema>

export class MetaRepository {
  constructor(private readonly db: OrbitDB) {}

  async buscarPorCiclo(cicloId: number): Promise<MetaRow | null> {
    const rows = await this.db.query("SELECT * FROM metas WHERE ciclo_id = ?", [cicloId])
    const row = rows[0]
    return row ? MetaRowSchema.parse(row) : null
  }

  async upsert(dados: Omit<MetaRow, "id">): Promise<void> {
    await this.db.execute(
      `INSERT INTO metas (ciclo_id, segunda, terca, quarta, quinta, sexta, sabado, domingo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(ciclo_id) DO UPDATE SET
         segunda = excluded.segunda,
         terca = excluded.terca,
         quarta = excluded.quarta,
         quinta = excluded.quinta,
         sexta = excluded.sexta,
         sabado = excluded.sabado,
         domingo = excluded.domingo`,
      [
        dados.ciclo_id,
        dados.segunda,
        dados.terca,
        dados.quarta,
        dados.quinta,
        dados.sexta,
        dados.sabado,
        dados.domingo,
      ],
    )
  }
}
