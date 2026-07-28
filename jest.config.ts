import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFiles: ['./src/app/__tests__/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};

export default createJestConfig(config);
