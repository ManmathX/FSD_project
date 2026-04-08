import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { fetchProducts, checkout } from './api';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const handleAddToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      toast.success(`Increased ${product.name} quantity!`);
      setCartItems(cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      toast.success(`${product.name} added to cart!`);
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.error('Item removed from cart', { icon: '🗑️' });
  };

  const handleCheckout = async () => {
    try {
      const items = cartItems.map(item => ({ productId: item.id, quantity: item.quantity }));
      const response = await checkout(items);
      toast.success(response.message || 'Checkout successful! 🎉', { duration: 4000 });
      setCartItems([]);
      setIsCartOpen(false);
    } catch (err) {
      toast.error('Checkout failed. Please try again.');
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px'
        }
      }} />
      
      <header className="app-header">
        <div className="logo">NexusTech</div>
        <button className="btn" onClick={() => setIsCartOpen(true)} style={{ background: 'rgba(255,255,255,0.1)' }}>
          <ShoppingBag size={20} />
          Cart {totalItems > 0 && <span style={{ background: '#3b82f6', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{totalItems}</span>}
        </button>
      </header>

      <main className="main-content">
        <h2>Recommended For You</h2>
        <div className="products-grid">
          {products.map((product, idx) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart} 
              animationDelay={idx * 0.1}
            />
          ))}
        </div>
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </>
  );
}
