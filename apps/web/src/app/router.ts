import type { ComponentType } from "svelte"
import CicloDetalhe from "../pages/ciclos/CicloDetalhe.svelte"
import Ciclos from "../pages/ciclos/Ciclos.svelte"
import Configuracoes from "../pages/configuracoes/Configuracoes.svelte"
import Dashboard from "../pages/dashboard/Dashboard.svelte"
import DevComponents from "../pages/dev/DevComponents.svelte"
import Estatisticas from "../pages/estatisticas/Estatisticas.svelte"
import Plano from "../pages/plano/Plano.svelte"
import NovaSessao from "../pages/sessoes/NovaSessao.svelte"
import Sessoes from "../pages/sessoes/Sessoes.svelte"

export const routes: Record<string, ComponentType> = {
  "/": Dashboard,
  "/dashboard": Dashboard,
  "/sessoes": Sessoes,
  "/sessoes/nova": NovaSessao,
  "/plano": Plano,
  "/ciclos": Ciclos,
  "/ciclos/:id": CicloDetalhe,
  "/estatisticas": Estatisticas,
  "/configuracoes": Configuracoes,
  "/dev": DevComponents,
}
