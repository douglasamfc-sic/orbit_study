<script lang="ts">
import { Tooltip } from "bits-ui"
import Router from "svelte-spa-router"
import { Sidebar } from "../widgets/sidebar"
import { TopBar } from "../widgets/topbar"
import { routes } from "./router"

let sidebarOpen = $state(false)

function toggleSidebar() {
  sidebarOpen = !sidebarOpen
}
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
        <Router {routes} />
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
</style>
