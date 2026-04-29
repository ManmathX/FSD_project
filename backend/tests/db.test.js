const Database = require('better-sqlite3');

describe('Database Module', () => {
  let db;

  beforeAll(() => {
    // Use in-memory database for tests
    process.env.NODE_ENV = 'test';
    // Clear the module cache so db.js creates a fresh in-memory DB
    delete require.cache[require.resolve('../src/db')];
    db = require('../src/db');
  });

  afterAll(() => {
    db.close();
  });

  test('database connection is established', () => {
    expect(db).toBeDefined();
    expect(db.open).toBe(true);
  });

  test('products table exists', () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
      .all();
    expect(tables).toHaveLength(1);
    expect(tables[0].name).toBe('products');
  });

  test('products table has correct schema', () => {
    const columns = db.prepare('PRAGMA table_info(products)').all();
    const columnNames = columns.map((c) => c.name);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('name');
    expect(columnNames).toContain('description');
    expect(columnNames).toContain('price');
    expect(columnNames).toContain('image_url');
  });

  test('products table is seeded with data', () => {
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    expect(count).toBeGreaterThan(0);
  });

  test('seeded products have valid data', () => {
    const products = db.prepare('SELECT * FROM products').all();
    for (const product of products) {
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.image_url).toBeTruthy();
    }
  });

  test('can insert and retrieve a product', () => {
    const insertStmt = db.prepare(
      'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)'
    );
    const result = insertStmt.run(
      'Test Product',
      'A test product',
      9.99,
      'https://example.com/test.png'
    );

    expect(result.changes).toBe(1);
    const newId = result.lastInsertRowid;

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(newId);
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(9.99);

    // Cleanup
    db.prepare('DELETE FROM products WHERE id = ?').run(newId);
  });
});
