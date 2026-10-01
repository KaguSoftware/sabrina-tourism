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
    // Generated output, also listed in .gitignore
    "coverage/**",
    "test-results/**",
    // Seed script is plain Node, so React/Next rules do not apply
    "scripts/**",
  ]),
  {
    rules: {
      // Supabase v2.105 requires casting the client to `any` for mutation
      // queries because hand-written Row types lack index signatures. This is
      // a known workaround, so it is a warning project-wide.
      "@typescript-eslint/no-explicit-any": "warn",
      // Empty interface props types (`interface FooProps {}`) are common in
      // React component files that accept no props, so it is only a warning.
      "@typescript-eslint/no-empty-object-type": "warn",
      // React Compiler / react-hooks plugin flags `setState` in effects that
      // are initialisation-only, e.g. `setIsTouchDevice(window.matchMedia(...))`.
      // These are intentional and harmless.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
