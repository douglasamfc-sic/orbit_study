// Store global de contexto — persiste o objetivo/ciclo selecionado
// Todas as telas respeitam este contexto

let objetivoId = $state<number | null>(null)
let cicloId = $state<number | null>(null)

export const contextStore = {
  get objetivoId() {
    return objetivoId
  },
  get cicloId() {
    return cicloId
  },
  setObjetivo(id: number | null) {
    objetivoId = id
    cicloId = null // reset ciclo ao trocar objetivo
  },
  setCiclo(id: number | null) {
    cicloId = id
  },
}
