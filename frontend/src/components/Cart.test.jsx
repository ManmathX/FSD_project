import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from './Cart';

const mockItems = [
  {
    id: 1,
    name: 'Test Headphones',
    price: 99.99,
    quantity: 2,
    image_url: 'https://example.com/headphones.png',
  },
  {
    id: 2,
    name: 'Test Keyboard',
    price: 49.99,
    quantity: 1,
    image_url: 'https://example.com/keyboard.png',
  },
];

describe('Cart Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    items: mockItems,
    onRemove: jest.fn(),
    onCheckout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders "Your Cart" heading when open', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });

  test('displays cart items with names', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
    expect(screen.getByText('Test Keyboard')).toBeInTheDocument();
  });

  test('shows item prices and quantities', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByText('$99.99 x 2')).toBeInTheDocument();
    expect(screen.getByText('$49.99 x 1')).toBeInTheDocument();
  });

  test('calculates and displays correct total', () => {
    render(<Cart {...defaultProps} />);
    // Total = 99.99 * 2 + 49.99 * 1 = 249.97
    expect(screen.getByText('$249.97')).toBeInTheDocument();
  });

  test('shows empty state message when no items', () => {
    render(<Cart {...defaultProps} items={[]} />);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  test('does not show checkout button when cart is empty', () => {
    render(<Cart {...defaultProps} items={[]} />);
    expect(screen.queryByText('Checkout Securely')).not.toBeInTheDocument();
  });

  test('shows checkout button when cart has items', () => {
    render(<Cart {...defaultProps} />);
    expect(screen.getByText('Checkout Securely')).toBeInTheDocument();
  });

  test('calls onCheckout when checkout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Cart {...defaultProps} />);

    await user.click(screen.getByText('Checkout Securely'));
    expect(defaultProps.onCheckout).toHaveBeenCalledTimes(1);
  });

  test('renders item images with alt text', () => {
    render(<Cart {...defaultProps} />);
    const headphonesImg = screen.getByAltText('Test Headphones');
    const keyboardImg = screen.getByAltText('Test Keyboard');

    expect(headphonesImg).toBeInTheDocument();
    expect(keyboardImg).toBeInTheDocument();
  });
});
