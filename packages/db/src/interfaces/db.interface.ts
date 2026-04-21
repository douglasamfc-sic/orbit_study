export interface OrbitDB {
  query<T>(sql: string, params?: unknown[]): Promise<T[]>
  execute(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid: number }>
  transaction<T>(fn: (db: OrbitDB) => Promise<T>): Promise<T>
  close(): Promise<void>
}
