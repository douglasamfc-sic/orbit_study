<script lang="ts">
import type { Snippet } from "svelte"
import Spinner from "./Spinner.svelte"

interface Props {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onclick?: () => void
  children: Snippet
}

const {
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  onclick,
  children,
}: Props = $props()

const isDisabled = $derived(disabled || loading)
</script>

<button
  {type}
  disabled={isDisabled}
  onclick={onclick}
  class="btn btn--{variant} btn--{size}"
  class:btn--loading={loading}
>
  {#if loading}
    <Spinner size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
  {/if}
  <span class:visually-hidden={loading}>
    {@render children()}
  </span>
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-family: var(--font-body);
    font-weight: var(--font-medium);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
    white-space: nowrap;
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }

  .btn:active:not(:disabled) {
    transform: scale(0.97);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Tamanhos */
  .btn--sm { padding: var(--space-2) var(--space-3); font-size: var(--text-sm); }
  .btn--md { padding: var(--space-3) var(--space-5); font-size: var(--text-md); }
  .btn--lg { padding: var(--space-4) var(--space-8); font-size: var(--text-lg); }

  /* Variantes */
  .btn--primary {
    background-color: var(--color-primary-500);
    color: white;
    border-color: var(--color-primary-500);
  }
  .btn--primary:hover:not(:disabled) {
    background-color: var(--color-primary-600);
    border-color: var(--color-primary-600);
    box-shadow: var(--shadow-glow);
  }

  .btn--secondary {
    background-color: var(--color-bg-secondary);
    color: var(--color-primary-500);
    border-color: var(--color-border-default);
  }
  .btn--secondary:hover:not(:disabled) {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-border-strong);
  }

  .btn--ghost {
    background-color: transparent;
    color: var(--color-text-secondary);
    border-color: transparent;
  }
  .btn--ghost:hover:not(:disabled) {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  .btn--danger {
    background-color: var(--color-danger);
    color: white;
    border-color: var(--color-danger);
  }
  .btn--danger:hover:not(:disabled) {
    background-color: var(--color-danger-dark);
    border-color: var(--color-danger-dark);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
</style>
