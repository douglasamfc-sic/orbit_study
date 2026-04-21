import type { OrbitDB } from "../interfaces/db.interface"

interface Migration {
  version: number
  nome: string
  sql: string
}

// Carrega o SQL da migration como string em build time via ?raw
import migration001 from "./001_initial_schema.sql?raw"

const MIGRATIONS: Migration[] = [{ version: 1, nome: "001_initial_schema", sql: migration001 }]

export async function runMigrations(db: OrbitDB): Promise<void> {
  // Garante que a tabela de controle existe antes de qualquer coisa
  await db.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL UNIQUE,
      nome TEXT NOT NULL,
      executada_em TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  const executadas = await db.query<{ version: number }>(
    "SELECT version FROM _migrations ORDER BY version ASC",
  )
  const versoes = new Set(executadas.map((r) => r.version))

  for (const migration of MIGRATIONS) {
    if (versoes.has(migration.version)) continue

    await db.transaction(async (tx) => {
      // Executa cada statement separadamente (SQLite não aceita múltiplos em uma chamada)
      const statements = migration.sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      for (const statement of statements) {
        await tx.execute(statement)
      }

      await tx.execute("INSERT INTO _migrations (version, nome) VALUES (?, ?)", [
        migration.version,
        migration.nome,
      ])
    })
  }
}
