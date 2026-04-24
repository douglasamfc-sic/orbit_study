import {
  CicloRepository,
  DisciplinaRepository,
  ObjetivoRepository,
  SessaoRepository,
  createDatabase,
  runMigrations,
} from "@orbit/db"
import { createCiclosStore } from "../../features/ciclos/model/ciclos.store.svelte"
import type { CiclosStore } from "../../features/ciclos/model/ciclos.store.svelte"
import { createDisciplinasStore } from "../../features/disciplinas/model/disciplinas.store.svelte"
import type { DisciplinasStore } from "../../features/disciplinas/model/disciplinas.store.svelte"
import { createObjetivosStore } from "../../features/objetivos/model/objetivos.store.svelte"
import type { ObjetivosStore } from "../../features/objetivos/model/objetivos.store.svelte"
import { createSessoesStore } from "../../features/sessoes/model/sessoes.store.svelte"
import type { SessoesStore } from "../../features/sessoes/model/sessoes.store.svelte"

export type DBContext = {
  objetivos: ObjetivosStore
  ciclos: CiclosStore
  disciplinas: DisciplinasStore
  sessoes: SessoesStore
}

let _ctx: DBContext | null = null

export async function initDB(): Promise<DBContext> {
  if (_ctx) return _ctx
  const db = await createDatabase()
  await runMigrations(db)
  _ctx = {
    objetivos: createObjetivosStore(new ObjetivoRepository(db)),
    ciclos: createCiclosStore(new CicloRepository(db)),
    disciplinas: createDisciplinasStore(new DisciplinaRepository(db)),
    sessoes: createSessoesStore(new SessaoRepository(db)),
  }
  return _ctx
}

export function getDB(): DBContext {
  if (!_ctx) throw new Error("DB não inicializado. Chame initDB() primeiro.")
  return _ctx
}
