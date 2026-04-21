<script lang="ts">
import type { Snippet } from "svelte"

interface Props {
  variant?: "solid" | "glass"
  hoverable?: boolean
  padding?: "sm" | "md" | "lg"
  children: Snippet
}

const { variant = "solid", hoverable = false, padding = "md", children }: Props = $props()
</script>

<div class="card card--{variant} card--pad-{padding}" class:card--hoverable={hoverable}>
  {@render children()}
</div>

<style>
  .card {
    border-radius: var(--radius-lg);
    position: relative;
    overflow: hidden;
    transition:
      transform var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out);
  }

  /* Padding */
  .card--pad-sm { padding: var(--space-3); }
  .card--pad-md { padding: var(--space-6); }
  .card--pad-lg { padding: var(--space-8); }

  /* Variante sólida */
  .card--solid {
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-subtle);
    box-shadow: var(--shadow-sm);
  }

  /* Variante glass */
  .card--glass {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
  }

  /* Brilho no topo do card glass */
  .card--glass::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.00) 60%
    );
    pointer-events: none;
  }

  /* Hover */
  .card--hoverable:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  .card--hoverable { cursor: pointer; }
</style>
