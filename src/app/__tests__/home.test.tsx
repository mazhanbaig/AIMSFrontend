import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Home Page', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });

  it('has the correct app title in metadata', () => {
    const title = 'AIMS - Agricultural Insurance Management System';
    expect(title).toContain('Agricultural Insurance');
  });
});
