module.exports = {
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    // Импорты только через алиасы
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*'],
      },
    ],

    // Импорт по иерархии
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          { target: './src/api', from: './src/ui' },
          { target: './src/ui', from: './src/api' },
          { target: './src/api-infra', from: './src/ui' },
          { target: './src/ui', from: './src/api-infra' },
        ],
      },
    ],

    // Запрет на импорт по индексу
  'no-restricted-imports': [
    'error',
    {
      patterns: ['*/index', '*/index.ts'],
    },
  ],

    // Запрет на .js и автофикс на .ts
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'always',
        js: 'never',
      },
    ],
  },
};
