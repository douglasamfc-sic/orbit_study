// Mock do plugin Tauri para o ambiente web
// No desktop (Tauri), o módulo real é carregado pelo runtime do Rust
export const Database = {
  load: async (_path: string) => {
    throw new Error("Tauri SQL não disponível no ambiente web")
  },
}
