import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
	build: {
		rollupOptions: isSsrBuild
			? {
					input: "./server/app.ts",
				}
			: undefined,
		target: "es2022",
	},
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
}));
