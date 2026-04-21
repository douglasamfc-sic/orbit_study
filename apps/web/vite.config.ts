import { resolve } from "node:path"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [svelte()],
  assetsInclude: ["**/*.sql"],
  resolve: {
    alias: {
      $lib: resolve("./src/shared/lib"),
      $features: resolve("./src/features"),
      $entities: resolve("./src/entities"),
      $ui: resolve("./src/shared/ui"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id): string | undefined => {
          if (id.includes("node_modules/zod")) return "vendor-zod"
          if (id.includes("node_modules/svelte")) return "vendor-svelte"
          return undefined
        },
      },
    },
  },
})
