<script lang="ts">
interface Props {
  value?: string
  onchange?: (color: string) => void
}

let { value = $bindable("#5B4FE8"), onchange }: Props = $props()

const COLORS = [
  "#5B4FE8",
  "#00D4B8",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#0079bf",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
]

function select(color: string) {
  value = color
  onchange?.(color)
}
</script>

<div class="color-picker" role="group" aria-label="Escolha uma cor">
  {#each COLORS as color (color)}
    <button
      type="button"
      class="color-swatch"
      class:color-swatch--selected={value === color}
      style="background-color: {color};"
      aria-label="Cor {color}"
      aria-pressed={value === color}
      onclick={() => select(color)}
    ></button>
  {/each}
</div>

<style>
  .color-picker { display: grid; grid-template-columns: repeat(8, 1fr); gap: var(--space-2); }
  .color-swatch {
    width: 28px; height: 28px;
    border-radius: var(--radius-full);
    border: 2px solid transparent;
    cursor: pointer;
    transition:
      transform var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }
  .color-swatch:hover { transform: scale(1.15); }
  .color-swatch--selected { border-color: var(--color-text-primary); transform: scale(1.15); }
</style>
