import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/telegraf/index.ts',
    'src/core/index.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@titorelli/client', 'telegraf']
})
