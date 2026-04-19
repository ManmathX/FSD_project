import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    // This is a basic smoke test
    render(<App />);
  });
});
