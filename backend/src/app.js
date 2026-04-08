const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/checkout', (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid cart contents' });
  }

  // Very simplified checkout simulation
  let total = 0;
  try {
    const getProduct = db.prepare('SELECT price FROM products WHERE id = ?');
    for (const item of items) {
      const product = getProduct.get(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    
    // Simulate order success
    res.json({ message: 'Checkout successful', total, orderId: Date.now() });
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = app;
