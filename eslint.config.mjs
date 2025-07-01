import next from '@next/eslint-plugin-next';

export default [
  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      // Suas regras personalizadas aqui
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
];