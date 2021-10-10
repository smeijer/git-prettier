module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    // '@typescript-eslint/no-unnecessary-condition': 'error',
    curly: ['error', 'multi-line', 'consistent'],
  },
};
