<script lang="ts">
import type { Snippet } from "svelte"

interface Props {
  title: string
  value: string
  subtitle?: string
  accent?: boolean
  children?: Snippet
}

let { title, value, subtitle, accent = false, children }: Props = $props()
</script>

<div class="metric-card" class:metric-card--accent={accent}>
  <span class="metric-card__title">{title}</span>
  <div class="metric-card__body">
    {#if children}
      {@render children()}
    {/if}
    <div class="metric-card__values">
      <span class="metric-card__value">{value}</span>
      {#if subtitle}
        <span class="metric-card__subtitle">{subtitle}</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .metric-card {
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--duration-normal) var(--ease-out);
  }

  .metric-card:hover {
    box-shadow: var(--shadow-md);
  }

  .metric-card--accent {
    border-color: var(--color-primary-200);
    background: linear-gradient(
      135deg,
      var(--color-bg-primary) 0%,
      var(--color-primary-50) 100%
    );
  }

  .metric-card__title {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .metric-card__body {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .metric-card__values {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .metric-card__value {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    line-height: 1;
  }

  .metric-card__subtitle {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
  }
</style>
