<script lang="ts">
interface Props {
  value: number
  max?: number
  variant?: "linear" | "circular"
  size?: number
  showLabel?: boolean
  color?: string
}

const {
  value,
  max = 100,
  variant = "linear",
  size = 48,
  showLabel = false,
  color = "var(--color-primary-500)",
}: Props = $props()

const pct = $derived(Math.min(100, Math.round((value / max) * 100)))
const radius = $derived(size / 2 - 4)
const circumference = $derived(2 * Math.PI * radius)
const offset = $derived(circumference - (pct / 100) * circumference)
</script>

{#if variant === "linear"}
  <div class="progress-linear" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
    <div class="progress-linear__track">
      <div class="progress-linear__fill" style="width: {pct}%; background-color: {color};"></div>
    </div>
    {#if showLabel}
      <span class="progress-linear__label">{pct}%</span>
    {/if}
  </div>
{:else}
  <svg width={size} height={size} viewBox="0 0 {size} {size}" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} class="progress-circular">
    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border-subtle)" stroke-width="3" />
    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} stroke-width="3" stroke-linecap="round" stroke-dasharray={circumference} stroke-dashoffset={offset} transform="rotate(-90 {size / 2} {size / 2})" />
    {#if showLabel}
      <text x={size / 2} y={size / 2} text-anchor="middle" dominant-baseline="central" font-size="10" fill="var(--color-text-primary)">{pct}%</text>
    {/if}
  </svg>
{/if}

<style>
  .progress-linear { display: flex; align-items: center; gap: var(--space-3); width: 100%; }
  .progress-linear__track { flex: 1; height: 6px; background-color: var(--color-bg-tertiary); border-radius: var(--radius-full); overflow: hidden; }
  .progress-linear__fill { height: 100%; border-radius: var(--radius-full); transition: width var(--duration-slow) var(--ease-out); }
  .progress-linear__label { font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--color-text-secondary); min-width: 2.5rem; text-align: right; }
  .progress-circular { transform: rotate(0deg); }
</style>
