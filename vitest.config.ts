import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts", "components/**/*.test.ts"],
    exclude: ["**/node_modules/**", ".next/**", ".claude/**"],
  },
});
