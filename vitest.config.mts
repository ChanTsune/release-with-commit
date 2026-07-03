import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.{test,spec}.ts"],
    typecheck: {
      tsconfig: "./tsconfig.vitest.json",
      include: ["test/**/*.{test,spec}.ts"],
    },
  },
});
