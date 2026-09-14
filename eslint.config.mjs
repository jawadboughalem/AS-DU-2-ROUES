import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /**
       * Autorise l'idiome qui retire un champ d'un objet par déstructuration :
       *
       *   const { societe, ...conservée } = demande;
       *
       * La variable extraite est inutilisée par construction — c'est
       * précisément le but. `ignoreRestSiblings` existe pour ce cas et ne
       * relâche rien d'autre : une variable réellement oubliée reste signalée.
       */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
