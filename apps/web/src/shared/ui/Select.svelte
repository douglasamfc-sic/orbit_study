<script lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  value?: string
  options: Option[]
  label?: string
  error?: string
  disabled?: boolean
  placeholder?: string
  id?: string
  onchange?: (value: string) => void
}

const {
  value = $bindable(""),
  options,
  label,
  error,
  disabled = false,
  placeholder = "Selecione...",
  id,
  onchange,
}: Props = $props()

const inputId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`
</script>

<div class="field">
  {#if label}
    <label class="field__label" for={inputId}>{label}</label>
  {/if}
  <select
    {disabled}
    id={inputId}
    bind:value
    class="field__select"
    class:field__select--error={!!error}
    onchange={() => onchange?.(value)}
  >
    <option value="" disabled>{placeholder}</option>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
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

  .field__select {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-body);
    font-size: var(--text-md);
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238885A8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--space-4) center;
    padding-right: var(--space-10);
    transition:
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
  }

  .field__select:focus {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(91, 79, 232, 0.15);
  }

  .field__select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .field__select--error { border-color: var(--color-danger); }
  .field__select--error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }

  .field__error {
    font-size: var(--text-sm);
    color: var(--color-danger);
  }
</style>
