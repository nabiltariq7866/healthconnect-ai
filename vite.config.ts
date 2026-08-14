import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 4173 },
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
    css: true,
    globals: true,
    exclude: ['e2e/**', 'node_modules/**']
  }
} as any)
