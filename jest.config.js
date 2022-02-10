module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/iac/', '<rootDir>/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/iac/', '<rootDir>/dist/'],
  resetMocks: true,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'test/reports/unit',
  coverageReporters: ['text', 'cobertura', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  coveragePathIgnorePatterns: [],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test/reports/unit',
        outputName: 'hagerty-app-id-middleware-junit-test-results.xml',
      },
    ],
  ],
  setupFiles: [],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}
