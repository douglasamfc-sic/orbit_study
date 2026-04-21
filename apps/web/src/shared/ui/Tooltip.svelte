<script lang="ts">
import { Tooltip } from "bits-ui"
import type { Snippet } from "svelte"

interface Props {
  text: string
  side?: "top" | "bottom" | "left" | "right"
  children: Snippet
}

let { text, side = "top", children }: Props = $props()
</script>

<Tooltip.Root openDelay={300}>
  <Tooltip.Trigger>
    {@render children()}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content {side} sideOffset={6} class="tooltip-content">
      {text}
      <Tooltip.Arrow class="tooltip-arrow" />
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>

<style>
  :global(.tooltip-content) {
    background-color: var(--color-primary-900);
    color: white;
    font-size: var(--text-xs);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    max-width: 200px;
    animation: -global-tooltipIn var(--duration-fast) var(--ease-out);
    z-index: var(--z-toast);
  }
  :global(.tooltip-arrow) {
    fill: var(--color-primary-900);
  }
  @keyframes -global-tooltipIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
