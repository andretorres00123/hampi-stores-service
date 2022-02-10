module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'import/extensions': [0],
    'import/no-unresolved': [0],
    'import/no-extraneous-dependencies': [0],
    semi: [2, 'never'],
    'import/prefer-default-export': [0],
    '@typescript-eslint/no-var-requires': [0],
    '@typescript-eslint/no-explicit-any': [0],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-namespace': [0],
  },
  settings: {},
  overrides: [
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      rules: {
        'prettier/prettier': [
          2,
          {
            parser: 'graphql',
          },
        ],
      },
    },
  ],
}
