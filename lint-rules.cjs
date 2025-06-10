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
