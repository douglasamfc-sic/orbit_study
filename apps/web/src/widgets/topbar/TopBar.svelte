<script lang="ts">
import Button from "$ui/Button.svelte"
import { Cloud, CloudOff, Menu, Moon, Plus, Sun } from "lucide-svelte"
import { themeStore } from "../../app/providers/theme.provider"

interface Props {
  sidebarOpen?: boolean
  ontogglesidebar?: () => void
  onnewsessao?: () => void
}

const { sidebarOpen = false, ontogglesidebar, onnewsessao }: Props = $props()

type SyncStatus = "synced" | "syncing" | "offline"

const syncStatus = $state<SyncStatus>("synced")

const syncLabel: Record<SyncStatus, string> = {
  synced: "Sincronizado",
  syncing: "Sincronizando...",
  offline: "Sem conexão",
}
</script>

<header class="topbar">
  <button
    type="button"
    class="topbar__hamburger"
    onclick={ontogglesidebar}
    aria-label="Abrir menu"
    aria-expanded={sidebarOpen}
  >
    <Menu size={20} />
  </button>

  <span class="topbar__logo-mobile">🪐 Orbit</span>

  <div class="topbar__actions">
    <button
      type="button"
      class="topbar__icon-btn topbar__sync topbar__sync--{syncStatus}"
      aria-label={syncLabel[syncStatus]}
      title={syncLabel[syncStatus]}
    >
      {#if syncStatus === "offline"}
        <CloudOff size={18} />
      {:else}
        <Cloud size={18} />
      {/if}
    </button>

    <button
      type="button"
      class="topbar__icon-btn"
      onclick={() => themeStore.toggle()}
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      {#if themeStore.current === "light"}
        <Moon size={18} />
      {:else}
        <Sun size={18} />
      {/if}
    </button>

    <Button variant="primary" size="sm" onclick={onnewsessao}>
      <Plus size={16} />
      <span class="topbar__new-label">Nova Sessão</span>
    </Button>
  </div>
</header>

<style>
  .topbar {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 0 var(--space-6);
    height: 56px;
    background-color: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-border-subtle);
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
  }

  .topbar__hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-out);
  }
  .topbar__hamburger:hover {
    color: var(--color-text-primary);
  }

  .topbar__logo-mobile {
    display: none;
    font-weight: var(--font-semibold);
    color: var(--color-primary-500);
    font-size: var(--text-md);
  }

  .topbar__actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-left: auto;
  }

  .topbar__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-out);
  }
  .topbar__icon-btn:hover {
    color: var(--color-text-primary);
  }

  .topbar__sync--synced {
    color: var(--color-success);
  }
  .topbar__sync--syncing {
    color: var(--color-warning);
  }
  .topbar__sync--offline {
    color: var(--color-danger);
  }

  @media (max-width: 639px) {
    .topbar__hamburger {
      display: flex;
    }
    .topbar__logo-mobile {
      display: block;
    }
    .topbar__new-label {
      display: none;
    }
  }
</style>
