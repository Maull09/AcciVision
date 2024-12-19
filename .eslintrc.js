/* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "next/core-web-vitals", "prettier"],
  rules: {
    "import/order": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "next/core-web-vitals",
        "prettier",
      ],
      rules: {
        // Disable all TypeScript-related ESLint rules
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "react-hooks/exhaustive-deps": "off",
        "react/no-unescaped-entities": "off",
        "@next/next/no-img-element": "off",
      },
    },
  ],
};
