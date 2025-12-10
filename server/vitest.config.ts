import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["game/**/__tests__/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],
  },
});

