// vitest.config.js
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // If you're testing code that interacts with the DOM
  },
});