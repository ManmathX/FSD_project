const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('API Tests', () => {
  afterAll(() => {
    db.close();
  });

  // ───────────────── GET /api/products ─────────────────
  describe('GET /api/products', () => {
    test('returns 200 status code', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
    });

    test('returns an array of products', async () => {
      const res = await request(app).get('/api/products');
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test('each product has required fields', async () => {
      const res = await request(app).get('/api/products');
      for (const product of res.body) {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('image_url');
      }
    });

    test('product price is a positive number', async () => {
      const res = await request(app).get('/api/products');
      for (const product of res.body) {
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThan(0);
      }
    });

    test('returns JSON content type', async () => {
      const res = await request(app).get('/api/products');
      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  // ───────────────── POST /api/checkout ─────────────────
  describe('POST /api/checkout', () => {
    test('returns 200 with valid cart items', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({ items: [{ productId: 1, quantity: 2 }] });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Checkout successful');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('orderId');
    });

    test('calculates total correctly for single item', async () => {
      const productsRes = await request(app).get('/api/products');
      const firstProduct = productsRes.body[0];
      const quantity = 3;

      const res = await request(app)
        .post('/api/checkout')
        .send({ items: [{ productId: firstProduct.id, quantity }] });

      expect(res.statusCode).toBe(200);
      const expectedTotal = firstProduct.price * quantity;
      expect(res.body.total).toBeCloseTo(expectedTotal, 2);
    });

    test('calculates total correctly for multiple items', async () => {
      const productsRes = await request(app).get('/api/products');
      const products = productsRes.body;

      const cartItems = [
        { productId: products[0].id, quantity: 1 },
        { productId: products[1].id, quantity: 2 },
      ];

      const res = await request(app)
        .post('/api/checkout')
        .send({ items: cartItems });

      const expectedTotal =
        products[0].price * 1 + products[1].price * 2;
      expect(res.statusCode).toBe(200);
      expect(res.body.total).toBeCloseTo(expectedTotal, 2);
    });

    test('returns 400 with empty items array', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({ items: [] });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('returns 400 with missing items field', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid cart contents');
    });

    test('returns 400 when items is not an array', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({ items: 'not-an-array' });

      expect(res.statusCode).toBe(400);
    });

    test('returns orderId as a number', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({ items: [{ productId: 1, quantity: 1 }] });

      expect(typeof res.body.orderId).toBe('number');
    });

    test('handles non-existent product id gracefully', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send({ items: [{ productId: 99999, quantity: 1 }] });

      // Should succeed but total should be 0 (product not found)
      expect(res.statusCode).toBe(200);
      expect(res.body.total).toBe(0);
    });
  });

  // ───────────────── Unknown routes ─────────────────
  describe('Unknown routes', () => {
    test('GET /api/unknown returns 404', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.statusCode).toBe(404);
    });
  });
});
