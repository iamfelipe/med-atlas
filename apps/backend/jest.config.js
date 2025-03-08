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
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@repo/api/(.*)$': '<rootDir>/../../../packages/api/src/$1',
    '^@repo/types/(.*)$': '<rootDir>/../../../packages/types/src/$1',
    '^@repo/api$': '<rootDir>/../../../packages/api/src',
    '^@repo/types$': '<rootDir>/../../../packages/types/src',
    '^lib/(.*)$': '<rootDir>/../lib/$1',
  },
};
