module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  collectCoverageFrom: [
    'form/**/*.(t|j)s',
    'user/**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/index.ts',
  ],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    './src/form/**/*.ts': {
      branches: 50,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/user/**/*.ts': {
      branches: 50,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@repo/api/(.*)$': '<rootDir>/../../../packages/api/src/$1',
    '^@repo/types/(.*)$': '<rootDir>/../../../packages/types/src/$1',
    '^@repo/api$': '<rootDir>/../../../packages/api/src',
    '^@repo/types$': '<rootDir>/../../../packages/types/src',
    '^lib/(.*)$': '<rootDir>/../lib/$1',
  },
};
