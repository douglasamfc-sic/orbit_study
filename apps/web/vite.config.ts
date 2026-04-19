import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			$lib: resolve("./src/shared/lib"),
			$features: resolve("./src/features"),
			$entities: resolve("./src/entities"),
			$ui: resolve("./src/shared/ui"),
		},
	},
});
