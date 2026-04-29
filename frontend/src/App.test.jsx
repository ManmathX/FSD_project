import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './api';

// Mock the api module
jest.mock('./api');

const mockProducts = [
  {
    id: 1,
    name: 'Test Headphones',
    description: 'Great headphones',
    price: 99.99,
    image_url: 'https://example.com/headphones.png',
  },
  {
    id: 2,
    name: 'Test Keyboard',
    description: 'Nice keyboard',
    price: 49.99,
    image_url: 'https://example.com/keyboard.png',
  },
];

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.fetchProducts.mockResolvedValue(mockProducts);
    api.checkout.mockResolvedValue({
      message: 'Checkout successful',
      total: 99.99,
      orderId: 12345,
    });
  });

  test('renders the app header with brand name', async () => {
    render(<App />);
    expect(screen.getByText('NexusTech')).toBeInTheDocument();
  });

  test('renders the "Recommended For You" heading', async () => {
    render(<App />);
    expect(screen.getByText('Recommended For You')).toBeInTheDocument();
  });

  test('fetches and displays products on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(api.fetchProducts).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Headphones')).toBeInTheDocument();
      expect(screen.getByText('Test Keyboard')).toBeInTheDocument();
    });
  });

  test('displays product prices correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
    });
  });

  test('shows cart button', () => {
    render(<App />);
    const cartButton = screen.getByRole('button', { name: /cart/i });
    expect(cartButton).toBeInTheDocument();
  });
});
