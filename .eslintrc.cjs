const lintRules = require('./lint-rules.cjs');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    ...lintRules.plugins,
  ],
  settings: {
    ...lintRules.settings,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  ignorePatterns: ['.eslintrc.ts', '*.js', 'dist/*'],
  rules: {
    ...lintRules.rules,

    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-mutable-exports': 'off',
    'no-useless-constructor': 'off',
    'global-require': 'off',
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    'no-sequences': 'off',
    'no-async-promise-executor': 'off',
    'prefer-const': 'warn',
    'no-unused-expressions': 'off',
    'func-names': 'off',
    'no-restricted-globals': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'linebreak-style': 'off',
    'no-console': [process.env.NODE_ENV === 'development' ? 'off' : 'error'],
    'no-alert': [process.env.NODE_ENV === 'development' ? 'off' : 'error'],
    "no-shadow": "off",

    // typescript
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-namespace': 'off',
    "@typescript-eslint/no-shadow": ["error"],

    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'operator-linebreak': 'off',
    'function-paren-newline': 'off',
    'object-curly-newline': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  overrides: [],
}
