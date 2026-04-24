// SharedWorker — uma única instância compartilhada entre todas as tabs
// Gerencia a conexão SQLite WASM via OPFS
declare const self: SharedWorkerGlobalScope

interface WorkerMessage {
  id: number
  type: "init" | "query" | "execute" | "begin" | "commit" | "rollback" | "close"
  payload: { sql?: string; params?: unknown[] }
}

let db: unknown = null

async function initSQLite(): Promise<void> {
  const sqlite3InitModule = (await import("@sqlite.org/sqlite-wasm")).default
  const sqlite3 = await sqlite3InitModule({ print: console.log, printErr: console.error })
  const oo = sqlite3.oo1
  if (oo.OpfsDb) {
    db = new oo.OpfsDb("orbit.db")
  } else {
    db = new oo.DB("orbit.db", "ct")
  }
  ;(db as { exec: (sql: string) => void }).exec("PRAGMA journal_mode=WAL;")
}

function handleQuery(sql: string, params: unknown[]): unknown[] {
  const rows: unknown[] = []
  ;(
    db as {
      exec: (opts: {
        sql: string
        bind?: unknown[]
        rowMode: string
        resultRows: unknown[][]
      }) => void
    }
  ).exec({
    sql,
    bind: params,
    rowMode: "object",
    resultRows: rows as unknown[][],
  })
  return rows
}

function handleExecute(
  sql: string,
  params: unknown[],
): { changes: number; lastInsertRowid: number } {
  const dbTyped = db as {
    exec: (opts: { sql: string; bind?: unknown[] }) => void
    changes: () => { changes: number }
    lastInsertRowid: number
  }
  dbTyped.exec({ sql, bind: params })
  return {
    changes: dbTyped.changes().changes,
    lastInsertRowid: dbTyped.lastInsertRowid,
  }
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
