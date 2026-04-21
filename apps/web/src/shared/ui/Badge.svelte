<script lang="ts">
import type { Snippet } from "svelte"

interface Props {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary"
  children: Snippet
}

const { variant = "default", children }: Props = $props()
</script>

<span class="badge badge--{variant}">
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    white-space: nowrap;
  }

  .badge--default {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
  }
  .badge--primary {
    background-color: var(--color-primary-100);
    color: var(--color-primary-700);
  }
  .badge--success {
    background-color: var(--color-success-light);
    color: var(--color-success-dark);
  }
  .badge--warning {
    background-color: var(--color-warning-light);
    color: var(--color-warning-dark);
  }
  .badge--danger {
    background-color: var(--color-danger-light);
    color: var(--color-danger-dark);
  }
  .badge--info {
    background-color: var(--color-info-light);
    color: var(--color-info-dark);
  }
</style>
