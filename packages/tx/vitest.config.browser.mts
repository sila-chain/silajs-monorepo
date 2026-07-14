import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [
        ...configDefaults.exclude,
        // default export for minimist
        // wrong sila-tests path reference (../ is stripped)
        'test/transactionRunner.spec.ts',
        'test/sip4844.spec.ts',
        'test/sip7594.spec.ts',
        'test/t9n.spec.ts',
      ],
    },
  }),
)
