import config from '@tb-dev/eslint-config';

export default config({
  vitest: true,
  project: ['./tsconfig.json'],
  overrides: {
    perfectionist: {
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-interfaces': 'off'
    }
  }
});
