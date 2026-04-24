<script lang="ts">
import { today } from "$lib/date.utils"
import { minutesToHHMM } from "$lib/time.utils"
import Progress from "$ui/Progress.svelte"
import { onMount } from "svelte"
import { contextStore } from "../../app/providers/context.store.svelte"
import { getDB } from "../../app/providers/db.provider.svelte"
import { formatarHoras } from "../../features/dashboard/model/dashboard.service"
import {
  calcularHojesMinutos,
  calcularStreak,
  calcularTotalMinutos,
} from "../../features/dashboard/model/dashboard.service"
import ContextSelector from "../../features/dashboard/ui/ContextSelector.svelte"
import MetricCard from "../../features/dashboard/ui/MetricCard.svelte"

const db = getDB()

// Estado local do dashboard derivado dos stores globais
let loading = $state(false)
let error = $state<string | null>(null)

const sessoes = $derived(db.sessoes.sessoes)
const hojeMinutos = $derived(calcularHojesMinutos(sessoes, today()))
const streak = $derived(calcularStreak(sessoes))
const totalMinutos = $derived(calcularTotalMinutos(sessoes))

const metaDia = 240 // 4h em minutos — padrão até carregar meta real
const progressoHoje = $derived(Math.min(100, Math.round((hojeMinutos / metaDia) * 100)))

const objetivos = $derived(db.objetivos.objetivos)
const ciclos = $derived(db.ciclos.ciclos)

onMount(async () => {
  loading = true
  error = null
  try {
    await db.objetivos.carregar()
    if (contextStore.objetivoId) {
      await db.ciclos.carregarPorObjetivo(contextStore.objetivoId)
    }
    if (contextStore.cicloId !== null) {
      await db.sessoes.carregar({ cicloId: contextStore.cicloId })
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Erro ao carregar dashboard"
  } finally {
    loading = false
  }
})

async function handleContextChange() {
  loading = true
  error = null
  try {
    if (contextStore.objetivoId) {
      await db.ciclos.carregarPorObjetivo(contextStore.objetivoId)
    }
    if (contextStore.cicloId !== null) {
      await db.sessoes.carregar({ cicloId: contextStore.cicloId })
    } else {
      await db.sessoes.carregar({})
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Erro ao atualizar contexto"
  } finally {
    loading = false
  }
}
</script>

<div class="dashboard">
  <div class="dashboard__header">
    <h1 class="dashboard__title">Dashboard</h1>
    <ContextSelector
      {objetivos}
      {ciclos}
      onchange={handleContextChange}
    />
  </div>

  <div class="dashboard__metrics">
    <MetricCard
      title="Horas Hoje"
      value={minutesToHHMM(hojeMinutos)}
      subtitle="Meta: {minutesToHHMM(metaDia)}"
      accent={progressoHoje >= 100}
    >
      <Progress
        value={hojeMinutos}
        max={metaDia}
        variant="circular"
        size={52}
        color={progressoHoje >= 100 ? "var(--color-success)" : "var(--color-primary-500)"}
        showLabel={false}
      />
    </MetricCard>

    <MetricCard
      title="Streak"
      value="{streak} dias"
      subtitle={streak > 0 ? "🔥 Continue assim!" : "Estude hoje para começar"}
    >
      <span class="dashboard__streak-icon" class:dashboard__streak-icon--active={streak > 0}>
        🔥
      </span>
    </MetricCard>

    <MetricCard
      title="Horas Totais"
      value={formatarHoras(totalMinutos)}
      subtitle={contextStore.cicloId ? "No ciclo" : contextStore.objetivoId ? "No objetivo" : "Geral"}
    />

    <MetricCard
      title="Progresso do Ciclo"
      value={contextStore.cicloId ? "—" : "—"}
      subtitle="Selecione um ciclo"
    >
      <Progress
        value={0}
        max={100}
        variant="circular"
        size={52}
        showLabel={true}
      />
    </MetricCard>
  </div>

  {#if loading}
    <div class="dashboard__loading">Carregando dados...</div>
  {/if}

  {#if error}
    <div class="dashboard__error">{error}</div>
  {/if}
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    max-width: 1200px;
  }

  .dashboard__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .dashboard__title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
  }

  .dashboard__metrics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--space-4);
  }

  .dashboard__streak-icon {
    font-size: var(--text-3xl);
    filter: grayscale(1);
    transition: filter var(--duration-normal) var(--ease-out);
  }

  .dashboard__streak-icon--active {
    filter: grayscale(0);
    animation: wave 0.6s var(--ease-spring);
  }

  .dashboard__loading {
    color: var(--color-text-tertiary);
    font-size: var(--text-sm);
  }

  .dashboard__error {
    color: var(--color-danger);
    font-size: var(--text-sm);
  }

  @keyframes wave {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.3) rotate(-10deg); }
    60%  { transform: scale(1.1) rotate(10deg); }
    100% { transform: scale(1); }
  }
</style>
