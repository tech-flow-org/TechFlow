import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './tests/setup.ts',
    environment: 'jsdom',
    globals: true,
    alias: {
      '@': './src',
    },
    coverage: {
      reporter: ['text', 'json', 'lcov', 'text-summary'],
      provider: 'c8',
    },
  },
});
