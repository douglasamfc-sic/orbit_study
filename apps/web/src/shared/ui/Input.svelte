<script lang="ts">
interface Props {
  value?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  type?: "text" | "email" | "password" | "number" | "search" | "url"
  id?: string
  onchange?: (value: string) => void
  oninput?: (value: string) => void
}

const {
  value = $bindable(""),
  placeholder = "",
  label,
  error,
  disabled = false,
  type = "text",
  id,
  onchange,
  oninput,
}: Props = $props()

const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`
</script>

<div class="field">
  {#if label}
    <label class="field__label" for={inputId}>{label}</label>
  {/if}
  <input
    {type}
    {placeholder}
    {disabled}
    id={inputId}
    bind:value
    class="field__input"
    class:field__input--error={!!error}
    onchange={() => onchange?.(value)}
    oninput={() => oninput?.(value)}
  />
  {#if error}
    <span class="field__error" role="alert">{error}</span>
  {/if}
</div>

<style>
  .field { display: flex; flex-direction: column; gap: var(--space-2); }

  .field__label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-secondary);
  }

  .field__input {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-body);
    font-size: var(--text-md);
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    outline: none;
    transition:
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
  }

  .field__input:focus {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(91, 79, 232, 0.15);
  }

  .field__input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-bg-secondary);
  }

  .field__input--error {
    border-color: var(--color-danger);
  }
  .field__input--error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }

  .field__error {
    font-size: var(--text-sm);
    color: var(--color-danger);
  }
</style>
