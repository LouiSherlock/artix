import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored runtime assets (MathJax bundle) are not source code.
    "public/libs/**",
    // Local agent tooling, ignored by git as well.
    ".opencode/**",
    ".agents/**",
    ".impeccable/**",
    ".codex/**",
  ]),
]);

export default eslintConfig;
