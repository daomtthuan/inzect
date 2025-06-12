import Path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./test/**/*.test.ts'],
  },

  resolve: {
    alias: {
      '~test': Path.resolve(import.meta.dirname, './test'),
    },
  },
});
