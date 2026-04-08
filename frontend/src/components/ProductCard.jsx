import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, animationDelay }) {
  return (
    <div className="glass-card" style={{ animationDelay: `${animationDelay}s` }}>
      <img src={product.image_url} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-actions">
          <span className="price">${product.price.toFixed(2)}</span>
          <button className="btn" onClick={() => onAddToCart(product)}>
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
