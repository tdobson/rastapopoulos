module.exports = {
  extends: ['next', 'plugin:jest/recommended'],
  plugins: ['testing-library', 'jest'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/require-default-props': 'off',
  },
};
