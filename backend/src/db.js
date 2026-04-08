const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.resolve(__dirname, 'database.sqlite');
  
const db = new Database(dbPath);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT
  )
`);

// Seed data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
if (count === 0) {
  const insert = db.prepare('INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)');
  insert.run('Premium Wireless Headphones', 'High quality noise-canceling headphones with 30-hour battery life.', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80');
  insert.run('Mechanic Gaming Keyboard', 'RGB backlit mechanical keyboard with tactile switches.', 129.99, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80');
  insert.run('Ultra-Wide Monitor', '34-inch curved ultra-wide gaming monitor for immersive experience.', 499.99, 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=400&q=80');
  insert.run('Ergonomic Mouse', 'Wireless ergonomic mouse designed to reduce wrist strain.', 59.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80');
}

module.exports = db;
