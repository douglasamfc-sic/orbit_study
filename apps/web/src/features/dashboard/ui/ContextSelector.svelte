<script lang="ts">
import type { CicloRow, ObjetivoRow } from "@orbit/db"
import { contextStore } from "../../../app/providers/context.store.svelte"

interface Props {
  objetivos: ObjetivoRow[]
  ciclos: CicloRow[]
  onchange?: () => void
}

let { objetivos, ciclos, onchange }: Props = $props()

const ciclosFiltrados = $derived(
  contextStore.objetivoId
    ? ciclos.filter((c) => c.objetivo_id === contextStore.objetivoId && c.status === "ativo")
    : [],
)

function handleObjetivoChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  contextStore.setObjetivo(val === "" ? null : Number(val))
  onchange?.()
}

function handleCicloChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  contextStore.setCiclo(val === "" ? null : Number(val))
  onchange?.()
}
</script>

<div class="context-selector">
  <select
    class="context-selector__select"
    value={contextStore.objetivoId ?? ""}
    onchange={handleObjetivoChange}
  >
    <option value="">Visão Geral</option>
    {#each objetivos as obj (obj.id)}
      <option value={obj.id}>{obj.nome}</option>
    {/each}
  </select>

  {#if ciclosFiltrados.length > 0}
    <select
      class="context-selector__select"
      value={contextStore.cicloId ?? ""}
      onchange={handleCicloChange}
    >
      <option value="">Todos os ciclos</option>
      {#each ciclosFiltrados as ciclo (ciclo.id)}
        <option value={ciclo.id}>{ciclo.nome}</option>
      {/each}
    </select>
  {/if}
</div>

<style>
  .context-selector {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .context-selector__select {
    padding: var(--space-2) var(--space-4);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-md);
    cursor: pointer;
    outline: none;
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .context-selector__select:focus {
    border-color: var(--color-primary-500);
  }
</style>
