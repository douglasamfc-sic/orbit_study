<script lang="ts">
interface Props {
  size?: number
  color?: string
}
const { size = 24, color = "currentColor" }: Props = $props()
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  aria-label="Carregando"
  role="status"
  class="spinner"
>
  <circle
    cx="12"
    cy="12"
    r="10"
    stroke={color}
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-dasharray="31.4 62.8"
  />
</svg>

<style>
  .spinner {
    animation: spin var(--duration-slow) linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
</style>
