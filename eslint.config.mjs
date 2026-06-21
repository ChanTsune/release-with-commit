import jestPlugin from "eslint-plugin-jest";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["dist/**", "lib/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        afterAll: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        fit: "readonly",
        it: "readonly",
        jest: "readonly",
        process: "readonly",
        test: "readonly",
        xdescribe: "readonly",
        xit: "readonly",
        xtest: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      jest: jestPlugin,
    },
  },
  prettierRecommended,
];
