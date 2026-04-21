// SharedWorker — uma única instância compartilhada entre todas as tabs
// Gerencia a conexão SQLite WASM via OPFS
declare const self: SharedWorkerGlobalScope

interface WorkerMessage {
  id: number
  type: "init" | "query" | "execute" | "begin" | "commit" | "rollback" | "close"
  payload: { sql?: string; params?: unknown[] }
}

let sqlite: unknown = null
let db: unknown = null

async function initSQLite(): Promise<void> {
  const { default: initSqlite } = await import("@sqlite.org/sqlite-wasm")
  sqlite = await initSqlite({ print: console.log, printErr: console.error })
  // OPFS — Origin Private File System (persistente, sem quota)
  db = (sqlite as { open: (path: string) => unknown }).open("file:orbit.db?vfs=opfs")
  ;(db as { exec: (sql: string) => void }).exec("PRAGMA journal_mode=WAL;")
}

function handleQuery(sql: string, params: unknown[]): unknown[] {
  const stmt = (db as { prepare: (sql: string) => unknown }).prepare(sql)
  const rows: unknown[] = []
  ;(stmt as { bind: (p: unknown[]) => void }).bind(params)
  while ((stmt as { step: () => boolean }).step()) {
    rows.push((stmt as { getAsObject: () => unknown }).getAsObject())
  }
  ;(stmt as { free: () => void }).free()
  return rows
}

function handleExecute(
  sql: string,
  params: unknown[],
): { changes: number; lastInsertRowid: number } {
  const dbTyped = db as {
    prepare: (sql: string) => {
      bind: (p: unknown[]) => void
      step: () => boolean
      free: () => void
    }
    changes: () => number
    lastInsertRowid: () => number
  }
  const stmt = dbTyped.prepare(sql)
  stmt.bind(params)
  stmt.step()
  stmt.free()
  return { changes: dbTyped.changes(), lastInsertRowid: dbTyped.lastInsertRowid() }
}

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0]
  port.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { id, type, payload } = e.data
    try {
      let result: unknown = null
      if (type === "init") await initSQLite()
      else if (type === "query") result = handleQuery(payload.sql ?? "", payload.params ?? [])
      else if (type === "execute") result = handleExecute(payload.sql ?? "", payload.params ?? [])
      else if (type === "begin") (db as { exec: (s: string) => void }).exec("BEGIN")
      else if (type === "commit") (db as { exec: (s: string) => void }).exec("COMMIT")
      else if (type === "rollback") (db as { exec: (s: string) => void }).exec("ROLLBACK")
      else if (type === "close") db = null
      port.postMessage({ id, result })
    } catch (err) {
      port.postMessage({ id, error: err instanceof Error ? err.message : String(err) })
    }
  }
  port.start()
}
