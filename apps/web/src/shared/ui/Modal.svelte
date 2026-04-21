<script lang="ts">
import type { Snippet } from "svelte"

interface Props {
  open?: boolean
  title: string
  description?: string
  onclose?: () => void
  children: Snippet
  footer?: Snippet
}

const { open = $bindable(false), title, description, onclose, children, footer }: Props = $props()
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) onclose?.() }}>
  <Dialog.Portal>
    <Dialog.Overlay class="modal-overlay" />
    <Dialog.Content class="modal-content">
      <Dialog.Title class="modal-title">{title}</Dialog.Title>
      {#if description}
        <Dialog.Description class="modal-description">{description}</Dialog.Description>
      {/if}
      <div class="modal-body">{@render children()}</div>
      {#if footer}
        <div class="modal-footer">{@render footer()}</div>
      {/if}
      <Dialog.Close class="modal-close" aria-label="Fechar">✕</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.modal-overlay) {
    position: fixed; inset: 0;
    background-color: var(--color-bg-overlay);
    backdrop-filter: blur(4px);
    z-index: var(--z-overlay);
    animation: fadeIn var(--duration-normal) var(--ease-out);
  }
  :global(.modal-content) {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    width: min(90vw, 520px);
    max-height: 85vh;
    overflow-y: auto;
    z-index: var(--z-modal);
    box-shadow: var(--shadow-xl);
    animation: modalIn var(--duration-normal) var(--ease-spring);
  }
  :global(.modal-title) { font-size: var(--text-xl); font-weight: var(--font-semibold); color: var(--color-text-primary); margin-bottom: var(--space-2); }
  :global(.modal-description) { font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-6); }
  :global(.modal-body) { margin-bottom: var(--space-6); }
  :global(.modal-footer) { display: flex; justify-content: flex-end; gap: var(--space-3); }
  :global(.modal-close) {
    position: absolute; top: var(--space-4); right: var(--space-4);
    background: none; border: none; cursor: pointer;
    color: var(--color-text-tertiary); font-size: var(--text-lg);
    padding: var(--space-2); border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-out);
  }
  :global(.modal-close:hover) { color: var(--color-text-primary); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modalIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
</style>
