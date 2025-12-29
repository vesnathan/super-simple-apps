import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/dist-*/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      reportsDirectory: ".cache/test/coverage",
      include: ["src/handlers/**/*.ts", "resolvers/**/*.ts"],
      exclude: [
        "**/__tests__/**",
        "**/node_modules/**",
        "**/*.d.ts",
        "**/*.test.ts",
      ],
    },
    testTimeout: 30000,
  },
});
