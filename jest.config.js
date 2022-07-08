module.exports = {
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.(ts|tsx|js|jsx)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      '@swc/jest',
      {
        module: {
          type: 'commonjs',
        },
        sourceMaps: true,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/*.{js,jsx,ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  verbose: true,
}
