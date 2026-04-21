import type { OrbitDB } from "../interfaces/db.interface"

// Adaptador Web — usa OPFS + SQLite WASM via SharedWorker
// O SharedWorker garante uma única conexão entre múltiplas tabs
export class OPFSSQLiteAdapter implements OrbitDB {
  private worker: SharedWorker | null = null
  private messageId = 0

  private async send<T>(type: string, payload: unknown): Promise<T> {
    if (!this.worker) throw new Error("Worker não inicializado")
    const id = ++this.messageId
    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data.id !== id) return
        this.worker?.port.removeEventListener("message", handler)
        if (e.data.error) reject(new Error(e.data.error))
        else resolve(e.data.result as T)
      }
      this.worker?.port.addEventListener("message", handler)
      this.worker?.port.postMessage({ id, type, payload })
    })
  }

  async init(): Promise<void> {
    this.worker = new SharedWorker(new URL("../workers/sqlite.worker.ts", import.meta.url), {
      type: "module",
      name: "orbit-sqlite",
    })
    this.worker.port.start()
    await this.send("init", {})
  }

  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.send<T[]>("query", { sql, params })
  }

  async execute(
    sql: string,
    params: unknown[] = [],
  ): Promise<{ changes: number; lastInsertRowid: number }> {
    return this.send("execute", { sql, params })
  }

  async transaction<T>(fn: (db: OrbitDB) => Promise<T>): Promise<T> {
    await this.send("begin", {})
    try {
      const result = await fn(this)
      await this.send("commit", {})
      return result
    } catch (e) {
      await this.send("rollback", {})
      throw e
    }
  }

  async close(): Promise<void> {
    await this.send("close", {})
    this.worker = null
  }
}
