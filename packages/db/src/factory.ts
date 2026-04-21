import { OPFSSQLiteAdapter } from "./adapters/opfs.adapter"
import { TauriSQLiteAdapter } from "./adapters/tauri.adapter"
import type { OrbitDB } from "./interfaces/db.interface"

declare global {
  interface Window {
    __TAURI__?: unknown
  }
}

let _instance: OrbitDB | null = null

// Singleton — garante uma única conexão por processo
export async function createDatabase(): Promise<OrbitDB> {
  if (_instance) return _instance

  const adapter = window.__TAURI__ ? new TauriSQLiteAdapter() : new OPFSSQLiteAdapter()

  await (adapter as OPFSSQLiteAdapter | TauriSQLiteAdapter).init()
  _instance = adapter
  return _instance
}

export function getDatabase(): OrbitDB {
  if (!_instance) throw new Error("Banco não inicializado. Chame createDatabase() primeiro.")
  return _instance
}

export type { OrbitDB }
