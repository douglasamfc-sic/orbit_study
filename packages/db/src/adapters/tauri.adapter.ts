import type { OrbitDB } from "../interfaces/db.interface"

// Adaptador Desktop — usa tauri-plugin-sql (SQLite nativo via Rust)
// As queries rodam em thread separada do Rust — UI nunca bloqueia
export class TauriSQLiteAdapter implements OrbitDB {
  private db: unknown = null

  async init(): Promise<void> {
    const { Database } = await import("@tauri-apps/plugin-sql")
    this.db = await (Database as { load: (path: string) => Promise<unknown> }).load(
      "sqlite:orbit.db",
    )
  }

  private getDb() {
    if (!this.db) throw new Error("Banco não inicializado")
    return this.db as {
      select: <T>(sql: string, params?: unknown[]) => Promise<T[]>
      execute: (
        sql: string,
        params?: unknown[],
      ) => Promise<{ rowsAffected: number; lastInsertId: number }>
    }
  }

  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.getDb().select<T>(sql, params)
  }

  async execute(
    sql: string,
    params: unknown[] = [],
  ): Promise<{ changes: number; lastInsertRowid: number }> {
    const result = await this.getDb().execute(sql, params)
    return { changes: result.rowsAffected, lastInsertRowid: result.lastInsertId }
  }

  async transaction<T>(fn: (db: OrbitDB) => Promise<T>): Promise<T> {
    await this.getDb().execute("BEGIN")
    try {
      const result = await fn(this)
      await this.getDb().execute("COMMIT")
      return result
    } catch (e) {
      await this.getDb().execute("ROLLBACK")
      throw e
    }
  }

  async close(): Promise<void> {
    this.db = null
  }
}
