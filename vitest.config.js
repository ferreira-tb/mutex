import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    globals: false,
    environment: 'node'
  }
});
