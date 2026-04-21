<script lang="ts">
let modalOpen = $state(false)
let inputValue = $state("")
let selectValue = $state("")
let textareaValue = $state("")
let pickerColor = $state("#5B4FE8")
let timeMinutes = $state(90)
let progressValue = $state(65)

const selectOptions = [
  { value: "pdf", label: "PDF / Apostila" },
  { value: "video_aula", label: "Videoaula" },
  { value: "exercicios", label: "Exercícios" },
  { value: "revisao", label: "Revisão" },
]
</script>

<div class="dev">
  <h1 class="dev__title">🎨 Design System — Preview</h1>

  <!-- BUTTONS -->
  <section class="dev__section">
    <h2 class="dev__heading">Buttons</h2>
    <div class="dev__row">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" loading>Loading</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
    <div class="dev__row">
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  </section>

  <!-- BADGES -->
  <section class="dev__section">
    <h2 class="dev__heading">Badges</h2>
    <div class="dev__row">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Ativo</Badge>
      <Badge variant="warning">Pausado</Badge>
      <Badge variant="danger">Inativo</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  </section>

  <!-- CARDS -->
  <section class="dev__section">
    <h2 class="dev__heading">Cards</h2>
    <div class="dev__row dev__row--cards">
      <Card variant="solid" hoverable>
        <p class="dev__card-text">Card Sólido com hover</p>
      </Card>
      <Card variant="glass" hoverable>
        <p class="dev__card-text">Card Glass com hover</p>
      </Card>
    </div>
  </section>

  <!-- PROGRESS -->
  <section class="dev__section">
    <h2 class="dev__heading">Progress — {progressValue}%</h2>
    <input type="range" min="0" max="100" value={progressValue} oninput={(e) => { progressValue = Number((e.target as HTMLInputElement).value) }} />
    <div class="dev__row dev__row--progress">
      <Progress value={progressValue} showLabel />
      <Progress value={progressValue} variant="circular" size={64} showLabel />
      <Progress value={progressValue} variant="circular" size={48} color="var(--color-accent-400)" />
    </div>
  </section>

  <!-- SPINNER -->
  <section class="dev__section">
    <h2 class="dev__heading">Spinner</h2>
    <div class="dev__row">
      <Spinner size={16} />
      <Spinner size={24} color="var(--color-primary-500)" />
      <Spinner size={36} color="var(--color-accent-400)" />
    </div>
  </section>

  <!-- INPUTS -->
  <section class="dev__section">
    <h2 class="dev__heading">Inputs</h2>
    <div class="dev__col">
      <Input bind:value={inputValue} label="Campo de texto" placeholder="Digite algo..." />
      <Input value="" label="Com erro" error="Este campo é obrigatório" />
      <Input value="" label="Desabilitado" disabled />
      <Select bind:value={selectValue} options={selectOptions} label="Método de estudo" />
      <Textarea bind:value={textareaValue} label="Observações" placeholder="Escreva aqui..." />
      <TimeInput bind:minutes={timeMinutes} label="Tempo de estudo" />
    </div>
  </section>

  <!-- COLOR PICKER -->
  <section class="dev__section">
    <h2 class="dev__heading">Color Picker — {pickerColor}</h2>
    <ColorPicker bind:value={pickerColor} />
  </section>

  <!-- TOOLTIP -->
  <section class="dev__section">
    <h2 class="dev__heading">Tooltip</h2>
    <div class="dev__row">
      <Tooltip text="Tooltip no topo" side="top">
        <Button variant="secondary">Hover aqui (top)</Button>
      </Tooltip>
      <Tooltip text="Tooltip na direita" side="right">
        <Button variant="secondary">Hover aqui (right)</Button>
      </Tooltip>
    </div>
  </section>

  <!-- MODAL -->
  <section class="dev__section">
    <h2 class="dev__heading">Modal</h2>
    <Button variant="primary" onclick={() => { modalOpen = true }}>Abrir Modal</Button>
    <Modal
      bind:open={modalOpen}
      title="Modal de Exemplo"
      description="Este é um modal de teste do Design System."
    >
      <p style="color: var(--color-text-secondary)">
        Conteúdo do modal aqui. Funciona com animação spring e backdrop blur.
      </p>
      {#snippet footer()}
        <Button variant="ghost" onclick={() => { modalOpen = false }}>Cancelar</Button>
        <Button variant="primary" onclick={() => { modalOpen = false }}>Confirmar</Button>
      {/snippet}
    </Modal>
  </section>
</div>

<style>
  .dev {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    padding-bottom: var(--space-16);
  }

  .dev__title {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--color-text-primary);
  }

  .dev__section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .dev__heading {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-border-subtle);
    padding-bottom: var(--space-2);
  }

  .dev__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
  }

  .dev__row--cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .dev__row--progress {
    align-items: center;
  }

  .dev__col {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 400px;
  }

  .dev__card-text {
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }
</style>
