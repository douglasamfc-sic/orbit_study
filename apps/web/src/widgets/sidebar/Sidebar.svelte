<script lang="ts">
import {
  BarChart2,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  RefreshCw,
  Settings,
} from "lucide-svelte"

interface Props {
  open?: boolean
  onclose?: () => void
}

const { open = $bindable(false), onclose }: Props = $props()

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessoes", label: "Sessões", icon: BookOpen },
  { href: "/plano", label: "Plano de Estudos", icon: ClipboardList },
  { href: "/ciclos", label: "Ciclos", icon: RefreshCw },
  { href: "/estatisticas", label: "Estatísticas", icon: BarChart2 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
] as const

function isActive(href: string): boolean {
  return window.location.hash === `#${href}`
}

function navigate(href: string) {
  window.location.hash = href
  onclose?.()
}
</script>

<!-- Overlay mobile -->
{#if open}
  <div class="sidebar-overlay" role="presentation" onclick={onclose}></div>
{/if}

<aside
  class="sidebar"
  class:sidebar--open={open}
  aria-label="Navegação principal"
>
  <div class="sidebar__logo">
    <span class="sidebar__logo-icon">🪐</span>
    <span class="sidebar__logo-text">Orbit Study</span>
  </div>

  <nav class="sidebar__nav">
    {#each NAV_ITEMS as item (item.href)}
      {@const Icon = item.icon}
      <button
        type="button"
        class="sidebar__item"
        class:sidebar__item--active={isActive(item.href)}
        onclick={() => navigate(item.href)}
        aria-label={item.label}
        aria-current={isActive(item.href) ? "page" : undefined}
      >
        <span class="sidebar__icon">
          <Icon size={20} />
        </span>
        <span class="sidebar__label">{item.label}</span>
      </button>
    {/each}
  </nav>
</aside>

<style>
  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: var(--color-bg-overlay);
    backdrop-filter: blur(2px);
    z-index: var(--z-overlay);
    display: none;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--color-bg-secondary);
    border-right: 1px solid var(--color-border-subtle);
    overflow: hidden;
    transition: width var(--duration-normal) var(--ease-out);
    width: 64px;
  }

  .sidebar__logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-5) var(--space-4);
    border-bottom: 1px solid var(--color-border-subtle);
    overflow: hidden;
    white-space: nowrap;
  }

  .sidebar__logo-icon {
    font-size: var(--text-xl);
    flex-shrink: 0;
  }

  .sidebar__logo-text {
    font-size: var(--text-md);
    font-weight: var(--font-semibold);
    color: var(--color-primary-500);
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  .sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-4) var(--space-2);
    flex: 1;
  }

  .sidebar__item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    width: 100%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .sidebar__item:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }

  .sidebar__item--active {
    background-color: var(--color-primary-50);
    color: var(--color-primary-500);
    font-weight: var(--font-medium);
  }

  .sidebar__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .sidebar__label {
    font-size: var(--text-sm);
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .sidebar {
      width: 240px;
    }
    .sidebar__logo-text {
      opacity: 1;
    }
    .sidebar__label {
      opacity: 1;
    }
  }

  /* Tablet */
  @media (min-width: 640px) and (max-width: 1023px) {
    .sidebar {
      width: 64px;
    }
  }

  /* Mobile */
  @media (max-width: 639px) {
    .sidebar-overlay {
      display: block;
    }
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100dvh;
      width: 280px;
      z-index: var(--z-modal);
      transform: translateX(-100%);
      transition:
        transform var(--duration-normal) var(--ease-out),
        width var(--duration-normal) var(--ease-out);
    }
    .sidebar--open {
      transform: translateX(0);
    }
    .sidebar--open .sidebar__logo-text {
      opacity: 1;
    }
    .sidebar--open .sidebar__label {
      opacity: 1;
    }
  }
</style>
