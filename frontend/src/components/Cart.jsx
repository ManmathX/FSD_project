import React from 'react';
import { X, Trash2 } from 'lucide-react';

export default function Cart({ isOpen, onClose, items, onRemove, onCheckout }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <div className={`overlay-bg ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="btn btn-icon" onClick={onClose} style={{ background: 'transparent', color: 'white' }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-state">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-price">${item.price.toFixed(2)} x {item.quantity}</div>
                </div>
                <button className="btn btn-icon" onClick={() => onRemove(item.id)} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-checkout" onClick={onCheckout}>
              Checkout Securely
            </button>
          </div>
        )}
      </div>
    </>
  );
}
