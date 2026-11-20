import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        global: 80, // Порог покрытия 80%
      },
      exclude: [
        'bin/gendiff.js', // Исключаем точку входа CLI
        'vitest.config.js', // Исключаем конфиг
      ],
    },
  },
});
