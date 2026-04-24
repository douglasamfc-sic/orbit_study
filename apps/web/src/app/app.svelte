<script lang="ts">
import { Tooltip } from "bits-ui"
import { onMount } from "svelte"
import Router from "svelte-spa-router"
import { Sidebar } from "../widgets/sidebar"
import { TopBar } from "../widgets/topbar"
import { initDB } from "./providers/db.provider.svelte"
import { routes } from "./router"

let sidebarOpen = $state(false)
let dbReady = $state(false)
let dbError = $state<string | null>(null)

function toggleSidebar() {
  sidebarOpen = !sidebarOpen
}

onMount(async () => {
  try {
    await initDB()
    dbReady = true
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Erro ao inicializar banco"
  }
})
</script>

<Tooltip.Provider>
  <div class="shell">
    <Sidebar bind:open={sidebarOpen} onclose={() => { sidebarOpen = false }} />
    <div class="shell__main">
      <TopBar
        {sidebarOpen}
        ontogglesidebar={toggleSidebar}
        onnewsessao={() => { /* Fase 4 */ }}
      />
      <main class="shell__content">
        {#if dbReady}
          <Router {routes} />
        {:else if dbError}
          <div class="shell__loading shell__loading--error">{dbError}</div>
        {:else}
          <div class="shell__loading">
            <span>Inicializando banco de dados...</span>
          </div>
        {/if}
      </main>
    </div>
  </div>
</Tooltip.Provider>

<style>
  .shell {
    display: flex;
    height: 100dvh;
    overflow: hidden;
    background-color: var(--color-bg-tertiary);
  }
  .shell__main {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    min-width: 0;
  }
  .shell__content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6);
  }
  .shell__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }
  .shell__loading--error {
    color: var(--color-danger);
  }
</style>
