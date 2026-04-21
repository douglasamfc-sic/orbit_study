<script lang="ts">
import { hhmmToMinutes, minutesToHHMM } from "$lib/time.utils"

interface Props {
  minutes?: number
  label?: string
  error?: string
  disabled?: boolean
  id?: string
  onchange?: (minutes: number) => void
}

let { minutes = $bindable(0), label, error, disabled = false, id, onchange }: Props = $props()

const inputId = id ?? `time-input-${Math.random().toString(36).slice(2, 9)}`

let raw = $state(minutesToHHMM(minutes))
let localError = $state<string | undefined>(undefined)

function validate(v: string): boolean {
  return /^\d{1,3}:[0-5]\d$/.test(v)
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  raw = target.value
  localError = undefined
}

function handleBlur() {
  if (!validate(raw)) {
    localError = "Formato inválido. Use HH:MM (ex: 01:30)"
    return
  }
  localError = undefined
  minutes = hhmmToMinutes(raw)
  raw = minutesToHHMM(minutes)
  onchange?.(minutes)
}

const displayError = $derived(error ?? localError)
</script>

<div class="field">
  {#if label}
    <label class="field__label" for={inputId}>{label}</label>
  {/if}
  <div class="time-wrapper">
    <span class="time-icon" aria-hidden="true">⏱</span>
    <input
      type="text"
      {disabled}
      id={inputId}
      value={raw}
      placeholder="00:00"
      class="field__input"
      class:field__input--error={!!displayError}
      oninput={handleInput}
      onblur={handleBlur}
    />
    {#if minutes > 0 && !localError}
      <span class="time-hint">{Math.floor(minutes / 60)}h {minutes % 60}min</span>
    {/if}
  </div>
  {#if displayError}
    <span class="field__error" role="alert">{displayError}</span>
  {/if}
</div>

<style>
  .field { display: flex; flex-direction: column; gap: var(--space-2); }
  .field__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-secondary); }
  .time-wrapper { position: relative; display: flex; align-items: center; }
  .time-icon { position: absolute; left: var(--space-3); font-size: var(--text-md); pointer-events: none; }
  .field__input {
    width: 100%;
    padding: var(--space-3) var(--space-4) var(--space-3) var(--space-10);
    font-family: var(--font-mono); font-size: var(--text-md);
    color: var(--color-text-primary); background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-default); border-radius: var(--radius-md);
    outline: none; letter-spacing: 0.05em;
    transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }
  .field__input:focus { border-color: var(--color-primary-500); box-shadow: 0 0 0 3px rgba(91, 79, 232, 0.15); }
  .field__input--error { border-color: var(--color-danger); }
  .field__input--error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); }
  .time-hint { position: absolute; right: var(--space-3); font-size: var(--text-xs); color: var(--color-text-tertiary); pointer-events: none; }
  .field__error { font-size: var(--text-sm); color: var(--color-danger); }
</style>
