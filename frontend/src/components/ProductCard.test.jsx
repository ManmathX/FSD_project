import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';

const mockProduct = {
  id: 1,
  name: 'Premium Headphones',
  description: 'High quality noise-canceling headphones.',
  price: 299.99,
  image_url: 'https://example.com/headphones.png',
};

describe('ProductCard Component', () => {
  test('renders product name', () => {
    render(
      <ProductCard product={mockProduct} onAddToCart={jest.fn()} animationDelay={0} />
    );
    expect(screen.getByText('Premium Headphones')).toBeInTheDocument();
  });

  test('renders product description', () => {
    render(
      <ProductCard product={mockProduct} onAddToCart={jest.fn()} animationDelay={0} />
    );
    expect(
      screen.getByText('High quality noise-canceling headphones.')
    ).toBeInTheDocument();
  });

  test('renders formatted price', () => {
    render(
      <ProductCard product={mockProduct} onAddToCart={jest.fn()} animationDelay={0} />
    );
    expect(screen.getByText('$299.99')).toBeInTheDocument();
  });

  test('renders product image with alt text', () => {
    render(
      <ProductCard product={mockProduct} onAddToCart={jest.fn()} animationDelay={0} />
    );
    const img = screen.getByAltText('Premium Headphones');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProduct.image_url);
  });

  test('renders "Add to Cart" button', () => {
    render(
      <ProductCard product={mockProduct} onAddToCart={jest.fn()} animationDelay={0} />
    );
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  test('calls onAddToCart when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnAdd = jest.fn();

    render(
      <ProductCard product={mockProduct} onAddToCart={mockOnAdd} animationDelay={0} />
    );

    await user.click(screen.getByText('Add to Cart'));
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith(mockProduct);
  });

  test('applies animation delay style', () => {
    const { container } = render(
      <ProductCard product={mockProduct} onAddToCart={jest.fn()} animationDelay={0.3} />
    );
    const card = container.querySelector('.glass-card');
    expect(card).toHaveStyle({ animationDelay: '0.3s' });
  });
});
