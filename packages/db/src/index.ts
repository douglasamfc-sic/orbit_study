// @orbit/db — Camada de persistência
export { createDatabase, getDatabase } from "./factory"
export { runMigrations } from "./migrations"
export * from "./repositories"
export type { OrbitDB } from "./interfaces/db.interface"
